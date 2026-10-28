import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket, listSupportTickets } from "@/lib/db";
import { z } from "zod";

const supportTicketSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  order_id: z.string().optional().nullable(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = supportTicketSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid form data", details: result.error.format() }, { status: 400 });
    }

    const ticket = await createSupportTicket(result.data);
    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Support ticket submission error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tickets = await listSupportTickets();
    return NextResponse.json({ tickets });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
