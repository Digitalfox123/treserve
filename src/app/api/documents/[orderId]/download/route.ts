import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";
import { generateOrderPdf } from "@/lib/pdf/generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // CRITICAL SECURITY REQUIREMENT:
    // Verify that the order is actually paid or test-paid
    const isPaid =
      order.order_status === "TEST_PAID" ||
      order.order_status === "DOCUMENT_AVAILABLE";

    if (!isPaid) {
      return NextResponse.json(
        {
          error: "PAYMENT REQUIRED · PDF DOWNLOAD LOCKED",
          message:
            "This document is locked. Payment must be completed before the final official PDF can be downloaded.",
          order_status: order.order_status,
          order_reference: order.internal_reference,
        },
        { status: 403 }
      );
    }

    // Generate high quality vector A4 PDF
    const pdfBytes = await generateOrderPdf(order);

    const filename = `${order.service_type === "temporary_reservation" ? "Temporary-Reservation" : "Flight-Itinerary"}-${order.internal_reference}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("PDF download error:", err);
    return NextResponse.json(
      { error: "Internal server error during PDF generation", details: message },
      { status: 500 }
    );
  }
}
