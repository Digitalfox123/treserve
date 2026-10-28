import { NextRequest, NextResponse } from "next/server";
import { createOrder, listAllOrders } from "@/lib/db";
import { getPricingConfig } from "@/lib/pricing";
import { z } from "zod";

const createOrderSchema = z.object({
  service_type: z.enum(["itinerary", "temporary_reservation"]),
  trip_type: z.enum(["one-way", "return", "multi-city"]).default("return"),
  origin: z.string().min(2, "Origin airport/city is required"),
  destination: z.string().min(2, "Destination airport/city is required"),
  departure_date: z.string().min(4, "Departure date is required"),
  return_date: z.string().optional().nullable(),
  passenger_count: z.number().min(1).max(9).default(1),
  cabin_class: z.enum(["economy", "premium_economy", "business", "first"]).default("economy"),
  guest_email: z.string().email("Valid email is required"),
  guest_name: z.string().min(2, "Lead passenger name is required"),
  passengers: z
    .array(
      z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        title: z.enum(["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"]).optional(),
        passenger_type: z.enum(["adult", "child", "infant"]).default("adult"),
      })
    )
    .min(1, "At least one passenger is required"),
  flight_option: z
    .object({
      flight_number: z.string(),
      airline_name: z.string(),
      airline_code: z.string(),
      departure_time: z.string(),
      arrival_time: z.string(),
      duration: z.string(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const pricing = getPricingConfig();
    const servicePrice = pricing[data.service_type].price_usd;
    const passengerCount = data.passengers.length;

    // Subtotal and total calculation
    const subtotal = servicePrice * passengerCount;
    const fee = 0;
    const total = subtotal + fee;

    // Form itinerary segments
    const segments = [
      {
        id: `seg_${Date.now()}_1`,
        segment_sequence: 1,
        flight_number: data.flight_option?.flight_number || "TR-842",
        airline_name: data.flight_option?.airline_name || "International Airways",
        airline_code: data.flight_option?.airline_code || "IA",
        departure_airport: data.origin,
        departure_city: data.origin.split(" ")[0] || "Origin",
        arrival_airport: data.destination,
        arrival_city: data.destination.split(" ")[0] || "Destination",
        departure_time: `${data.departure_date} ${data.flight_option?.departure_time || "09:30"}`,
        arrival_time: `${data.departure_date} ${data.flight_option?.arrival_time || "13:15"}`,
        duration: data.flight_option?.duration || "3h 45m",
        cabin_class: data.cabin_class,
      },
    ];

    if (data.trip_type === "return" && data.return_date) {
      segments.push({
        id: `seg_${Date.now()}_2`,
        segment_sequence: 2,
        flight_number: "TR-843",
        airline_name: data.flight_option?.airline_name || "International Airways",
        airline_code: data.flight_option?.airline_code || "IA",
        departure_airport: data.destination,
        departure_city: data.destination.split(" ")[0] || "Destination",
        arrival_airport: data.origin,
        arrival_city: data.origin.split(" ")[0] || "Origin",
        departure_time: `${data.return_date} 14:45`,
        arrival_time: `${data.return_date} 18:30`,
        duration: data.flight_option?.duration || "3h 45m",
        cabin_class: data.cabin_class,
      });
    }

    const newOrder = await createOrder({
      guest_email: data.guest_email,
      guest_name: data.guest_name,
      service_type: data.service_type,
      trip_type: data.trip_type,
      origin: data.origin,
      destination: data.destination,
      departure_date: data.departure_date,
      return_date: data.return_date,
      passenger_count: passengerCount,
      cabin_class: data.cabin_class,
      currency: "USD",
      subtotal_amount: subtotal,
      fee_amount: fee,
      total_amount: total,
      order_status: "AWAITING_PAYMENT",
      payment_mode: "TEST",
      passengers: data.passengers.map((p, idx) => ({
        id: `pax_${Date.now()}_${idx}`,
        ...p,
      })),
      segments,
      reservation_record:
        data.service_type === "temporary_reservation"
          ? {
              id: `res_${Date.now()}`,
              order_id: "",
              supplier_name: "Authorized Travel Consortia",
              supplier_reference: `SUP-${Date.now().toString().slice(-6)}`,
              actual_supplier_status: "AWAITING_TEST_PAYMENT_CONFIRMATION",
              validity_information: "Validity duration 48 hours from issuance for visa submission.",
            }
          : null,
    });

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        checkout_url: `/checkout/${newOrder.id}`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await listAllOrders();
    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
