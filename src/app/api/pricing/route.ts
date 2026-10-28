import { NextRequest, NextResponse } from "next/server";
import { getPricingConfig, updatePricingConfig } from "@/lib/pricing";

export async function GET() {
  const pricing = getPricingConfig();
  return NextResponse.json({ pricing });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, price_usd, badge, description, delivery_time } = body;

    if (service !== "itinerary" && service !== "temporary_reservation") {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }

    const updated = updatePricingConfig(service, {
      ...(price_usd !== undefined ? { price_usd: Number(price_usd) } : {}),
      ...(badge !== undefined ? { badge } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(delivery_time !== undefined ? { delivery_time } : {}),
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update pricing";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
