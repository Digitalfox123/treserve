import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/flightService";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("from") || searchParams.get("origin") || "LHE";
    const destination = searchParams.get("to") || searchParams.get("destination") || "DXB";
    const date = searchParams.get("date") || searchParams.get("departureDate") || undefined;

    const result = await searchFlights(origin, destination, date);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("Flight search API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch live flight schedules",
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
