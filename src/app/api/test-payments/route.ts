import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, recordPaymentEvent } from "@/lib/db";
import { z } from "zod";

const testPaymentSchema = z.object({
  order_id: z.string().min(1, "Order ID is required"),
  scenario: z.enum(["SIMULATE_SUCCESS", "SIMULATE_FAILURE"]),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Terms and visa disclaimer must be accepted before proceeding.",
  }),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verify environment test-mode eligibility
    const isTestModeAllowed =
      process.env.NEXT_PUBLIC_TEST_MODE === "true" ||
      process.env.NODE_ENV !== "production";

    if (!isTestModeAllowed) {
      return NextResponse.json(
        { error: "Test payments are strictly disabled in production live mode." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = testPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { order_id, scenario } = parsed.data;

    // 2. Fetch order from server-side store/database (never trust client amounts)
    const order = await getOrderById(order_id);
    if (!order) {
      return NextResponse.json({ error: "Order record not found" }, { status: 404 });
    }

    // 3. Confirm order is in eligible state
    if (order.order_status === "TEST_PAID" || order.order_status === "DOCUMENT_AVAILABLE") {
      return NextResponse.json(
        {
          error: "Order is already paid.",
          order_status: order.order_status,
          internal_reference: order.internal_reference,
        },
        { status: 400 }
      );
    }

    const testRef = `SIM-TEST-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Handle Simulated Failure Scenario
    if (scenario === "SIMULATE_FAILURE") {
      await recordPaymentEvent({
        order_id: order.id,
        payment_mode: "TEST",
        event_type: "SIMULATED_FAILURE",
        amount: order.total_amount,
        currency: order.currency,
        test_mode_indicator: true,
        provider_reference: testRef,
        error_message: "Simulated card authorization decline for testing error handling.",
      });

      await updateOrderStatus(order.id, "PAYMENT_FAILED", "TEST");

      return NextResponse.json(
        {
          success: false,
          scenario: "SIMULATE_FAILURE",
          status: "PAYMENT_FAILED",
          error: "Simulated card authorization declined. This was a test simulation.",
          provider_reference: testRef,
          order_id: order.id,
          internal_reference: order.internal_reference,
        },
        { status: 402 }
      );
    }

    // 5. Handle Simulated Success Scenario
    await recordPaymentEvent({
      order_id: order.id,
      payment_mode: "TEST",
      event_type: "SIMULATED_SUCCESS",
      amount: order.total_amount,
      currency: order.currency,
      test_mode_indicator: true,
      provider_reference: testRef,
    });

    const updatedOrder = await updateOrderStatus(order.id, "TEST_PAID", "TEST");

    return NextResponse.json({
      success: true,
      scenario: "SIMULATE_SUCCESS",
      status: "TEST_PAID",
      message: "Test payment successful. This was a simulation; no real money was charged.",
      provider_reference: testRef,
      order: updatedOrder,
      download_url: `/api/documents/${order.id}/download`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment simulation error";
    console.error("Test payment error:", err);
    return NextResponse.json(
      { error: "Internal test payment processing failure", details: message },
      { status: 500 }
    );
  }
}
