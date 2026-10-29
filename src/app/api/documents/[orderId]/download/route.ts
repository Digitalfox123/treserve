import { NextRequest, NextResponse } from "next/server";
import { getOrderById, upsertOrder } from "@/lib/db";
import { generateOrderPdf } from "@/lib/pdf/generator";
import { Order } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    let order = await getOrderById(orderId);

    // If order not found in current instance, try checking query or header backup
    if (!order) {
      const url = new URL(request.url);
      const backupParam = url.searchParams.get("backup");
      if (backupParam) {
        try {
          const parsed = JSON.parse(Buffer.from(backupParam, "base64").toString("utf-8")) as Order;
          if (parsed && (parsed.id === orderId || parsed.internal_reference === orderId)) {
            order = await upsertOrder(parsed);
          }
        } catch {
          // ignore
        }
      }
    }

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

    const filename = `Visa-Flight-Reservation-${order.internal_reference}.pdf`;

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    let order = (body?.order as Order) || (await getOrderById(orderId));

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Save to store if provided
    if (body?.order) {
      await upsertOrder(order);
    }

    const isPaid =
      order.order_status === "TEST_PAID" ||
      order.order_status === "DOCUMENT_AVAILABLE";

    if (!isPaid) {
      return NextResponse.json(
        {
          error: "PAYMENT REQUIRED · PDF DOWNLOAD LOCKED",
          message: "Payment must be completed before downloading.",
          order_status: order.order_status,
        },
        { status: 403 }
      );
    }

    const pdfBytes = await generateOrderPdf(order);
    const filename = `Visa-Flight-Reservation-${order.internal_reference}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
