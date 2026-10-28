import fs from "fs";
import path from "path";
import { Order, OrderStatus, PaymentEvent, SupportTicket, AuditLog, DocumentRecord } from "./types";
import { supabaseAdmin } from "./supabase/admin";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

interface LocalStore {
  orders: Order[];
  support_tickets: SupportTicket[];
  audit_logs: AuditLog[];
}

function ensureStore(): LocalStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    const initial: LocalStore = {
      orders: [],
      support_tickets: [],
      audit_logs: [],
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const content = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading store.json, reinitializing", err);
    return { orders: [], support_tickets: [], audit_logs: [] };
  }
}

function writeStore(store: LocalStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing store.json", err);
  }
}

export async function createOrder(order: Omit<Order, "id" | "internal_reference" | "created_at" | "updated_at">): Promise<Order> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const internalRef = `TR-${dateStr}-${randomSuffix}`;
  const now = new Date().toISOString();
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const docType =
    order.service_type === "temporary_reservation"
      ? "TEMPORARY_FLIGHT_RESERVATION"
      : "FLIGHT_ITINERARY_DOCUMENT";

  const initialDocument: DocumentRecord = {
    id: `doc_${Date.now()}`,
    order_id: orderId,
    document_type: docType,
    document_version: 1,
    generation_status: "LOCKED",
    created_at: now,
  };

  const fullOrder: Order = {
    ...order,
    id: orderId,
    internal_reference: internalRef,
    order_status: "AWAITING_PAYMENT",
    documents: [initialDocument],
    payment_events: [],
    created_at: now,
    updated_at: now,
  };

  // Try writing to Supabase
  try {
    const { error } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      internal_reference: internalRef,
      user_id: order.user_id || null,
      guest_email: order.guest_email || null,
      guest_name: order.guest_name || null,
      service_type: order.service_type,
      trip_type: order.trip_type,
      origin: order.origin,
      destination: order.destination,
      departure_date: order.departure_date,
      return_date: order.return_date || null,
      passenger_count: order.passenger_count,
      cabin_class: order.cabin_class,
      currency: order.currency,
      subtotal_amount: order.subtotal_amount,
      fee_amount: order.fee_amount,
      total_amount: order.total_amount,
      order_status: "AWAITING_PAYMENT",
      payment_mode: order.payment_mode,
    });
    if (error) {
      // Fallback to local store
      console.warn("Supabase insert order error, saving to local store:", error.message);
    }
  } catch (e) {
    console.warn("Supabase unavailable for orders, using local store:", e);
  }

  // Always keep local store in sync for fast dev
  const store = ensureStore();
  store.orders.unshift(fullOrder);
  store.audit_logs.unshift({
    id: `log_${Date.now()}`,
    actor_id: order.user_id || "guest",
    action: "ORDER_CREATED",
    record_type: "ORDER",
    record_identifier: internalRef,
    details: { service_type: order.service_type, total_amount: order.total_amount },
    created_at: now,
  });
  writeStore(store);

  return fullOrder;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const store = ensureStore();
  const localOrder = store.orders.find((o) => o.id === orderId || o.internal_reference === orderId);
  if (localOrder) return localOrder;

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, passengers(*), itinerary_segments(*), documents(*), payment_events(*)")
      .or(`id.eq.${orderId},internal_reference.eq.${orderId}`)
      .single();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // ignore
  }

  return null;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  paymentMode: "TEST" | "LIVE" = "TEST"
): Promise<Order | null> {
  const store = ensureStore();
  const orderIndex = store.orders.findIndex((o) => o.id === orderId || o.internal_reference === orderId);

  if (orderIndex === -1) return null;

  const order = store.orders[orderIndex];
  order.order_status = newStatus;
  order.payment_mode = paymentMode;
  order.updated_at = new Date().toISOString();

  // If status is paid, unlock the document
  if (newStatus === "TEST_PAID" || newStatus === "DOCUMENT_AVAILABLE") {
    if (order.documents && order.documents.length > 0) {
      order.documents[0].generation_status = "READY";
    }
  }

  writeStore(store);

  try {
    await supabaseAdmin
      .from("orders")
      .update({
        order_status: newStatus,
        payment_mode: paymentMode,
        updated_at: order.updated_at,
      })
      .eq("id", order.id);

    if (newStatus === "TEST_PAID" || newStatus === "DOCUMENT_AVAILABLE") {
      await supabaseAdmin
        .from("documents")
        .update({ generation_status: "READY" })
        .eq("order_id", order.id);
    }
  } catch {
    // fallback
  }

  return order;
}

export async function recordPaymentEvent(event: Omit<PaymentEvent, "id" | "created_at">): Promise<PaymentEvent> {
  const fullEvent: PaymentEvent = {
    ...event,
    id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  const store = ensureStore();
  const order = store.orders.find((o) => o.id === event.order_id);
  if (order) {
    if (!order.payment_events) order.payment_events = [];
    order.payment_events.push(fullEvent);
    writeStore(store);
  }

  try {
    await supabaseAdmin.from("payment_events").insert(fullEvent);
  } catch {
    // ignore
  }

  return fullEvent;
}

export async function listAllOrders(): Promise<Order[]> {
  const store = ensureStore();
  return store.orders;
}

export async function createSupportTicket(ticket: Omit<SupportTicket, "id" | "created_at" | "status">): Promise<SupportTicket> {
  const fullTicket: SupportTicket = {
    ...ticket,
    id: `tkt_${Date.now()}`,
    status: "OPEN",
    created_at: new Date().toISOString(),
  };

  const store = ensureStore();
  store.support_tickets.unshift(fullTicket);
  store.audit_logs.unshift({
    id: `log_${Date.now()}`,
    actor_id: ticket.user_id || "visitor",
    action: "SUPPORT_TICKET_SUBMITTED",
    record_type: "SUPPORT_TICKET",
    record_identifier: fullTicket.id,
    details: { subject: ticket.subject, email: ticket.email },
    created_at: new Date().toISOString(),
  });
  writeStore(store);

  try {
    await supabaseAdmin.from("support_tickets").insert(fullTicket);
  } catch {
    // ignore
  }

  return fullTicket;
}

export async function listSupportTickets(): Promise<SupportTicket[]> {
  const store = ensureStore();
  return store.support_tickets;
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  const store = ensureStore();
  return store.audit_logs;
}
