import { NextRequest, NextResponse } from "next/server";
import { upsertOrder, getOrderById } from "@/lib/db";
import { Order } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = body?.order as Order;

    if (!order || !order.id || !order.internal_reference) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const saved = await upsertOrder(order);
    return NextResponse.json({ success: true, order: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
