import fs from "fs";
import path from "path";
import os from "os";
import { Order, OrderStatus, PaymentEvent, SupportTicket, AuditLog, DocumentRecord } from "./types";
import { supabaseAdmin } from "./supabase/admin";

interface LocalStore {
  orders: Order[];
  support_tickets: SupportTicket[];
  audit_logs: AuditLog[];
}

const BUCKET_NAME = "treserve-store";

// Global in-memory cache to maintain state across function executions in warm instances
declare global {
  // eslint-disable-next-line no-var
  var __treserveGlobalStore: LocalStore | undefined;
}

function getStoreFilePath(): string {
  // In serverless environments (e.g. Vercel), process.cwd() is read-only.
  // We check if process.cwd()/data is writable; if not, we use os.tmpdir().
  try {
    const cwdDataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(cwdDataDir)) {
      fs.mkdirSync(cwdDataDir, { recursive: true });
    }
    const testFile = path.join(cwdDataDir, ".test-write");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return path.join(cwdDataDir, "store.json");
  } catch {
    const tmpDataDir = path.join(os.tmpdir(), "treserve-data");
    try {
      if (!fs.existsSync(tmpDataDir)) {
        fs.mkdirSync(tmpDataDir, { recursive: true });
      }
    } catch {
      // ignore
    }
    return path.join(tmpDataDir, "store.json");
  }
}

function ensureStore(): LocalStore {
  if (globalThis.__treserveGlobalStore) {
    return globalThis.__treserveGlobalStore;
  }

  const storeFile = getStoreFilePath();
  try {
    if (fs.existsSync(storeFile)) {
      const content = fs.readFileSync(storeFile, "utf8");
      const parsed = JSON.parse(content);
      globalThis.__treserveGlobalStore = {
        orders: parsed.orders || [],
        support_tickets: parsed.support_tickets || [],
        audit_logs: parsed.audit_logs || [],
      };
      return globalThis.__treserveGlobalStore;
    }
  } catch (err) {
    console.warn("Could not read local store file:", err);
  }

  const initial: LocalStore = { orders: [], support_tickets: [], audit_logs: [] };
  globalThis.__treserveGlobalStore = initial;
  try {
    fs.writeFileSync(storeFile, JSON.stringify(initial, null, 2), "utf8");
  } catch {
    // ignore
  }
  return initial;
}

function writeStore(store: LocalStore) {
  globalThis.__treserveGlobalStore = store;
  try {
    const storeFile = getStoreFilePath();
    const dir = path.dirname(storeFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storeFile, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write local store file:", err);
  }
}

async function saveOrderToSupabaseStorage(order: Order): Promise<void> {
  try {
    const orderData = JSON.stringify(order, null, 2);
    await Promise.allSettled([
      supabaseAdmin.storage.from(BUCKET_NAME).upload(`orders/${order.id}.json`, orderData, {
        upsert: true,
        contentType: "application/json",
      }),
      supabaseAdmin.storage.from(BUCKET_NAME).upload(`orders/${order.internal_reference}.json`, orderData, {
        upsert: true,
        contentType: "application/json",
      }),
    ]);
  } catch (err) {
    console.warn("Supabase Storage save error (non-fatal):", err);
  }
}

async function fetchOrderFromSupabaseStorage(orderId: string): Promise<Order | null> {
  try {
    const filename = `orders/${orderId}.json`;
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).download(filename);
    if (!error && data) {
      const text = await data.text();
      return JSON.parse(text) as Order;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function upsertOrder(order: Order): Promise<Order> {
  const store = ensureStore();
  const index = store.orders.findIndex(
    (o) => o.id === order.id || o.internal_reference.toLowerCase() === order.internal_reference.toLowerCase()
  );

  if (index >= 0) {
    store.orders[index] = { ...store.orders[index], ...order, updated_at: new Date().toISOString() };
  } else {
    store.orders.unshift(order);
  }
  writeStore(store);

  // Sync to Supabase Storage
  await saveOrderToSupabaseStorage(order);
  return order;
}

export async function createOrder(
  order: Omit<Order, "id" | "internal_reference" | "created_at" | "updated_at">
): Promise<Order> {
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

  // 1. Keep local store in sync
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

  // 2. Persist to Supabase Storage (cross-serverless global store)
  await saveOrderToSupabaseStorage(fullOrder);

  // 3. Try writing to Supabase SQL table (if table exists)
  try {
    await supabaseAdmin.from("orders").insert({
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
  } catch (e) {
    // Non-fatal if SQL table hasn't been migrated
    console.warn("Supabase SQL insert skipped:", e);
  }

  return fullOrder;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!orderId) return null;
  const cleanId = orderId.trim();

  // 1. Check local/memory store
  const store = ensureStore();
  const localOrder = store.orders.find(
    (o) => o.id === cleanId || o.internal_reference.toLowerCase() === cleanId.toLowerCase()
  );
  if (localOrder) return localOrder;

  // 2. Check Supabase Storage (shared across all serverless containers)
  const storageOrder = await fetchOrderFromSupabaseStorage(cleanId);
  if (storageOrder) {
    store.orders.unshift(storageOrder);
    writeStore(store);
    return storageOrder;
  }

  // 3. Check Supabase SQL table
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, passengers(*), itinerary_segments(*), documents(*), payment_events(*)")
      .or(`id.eq.${cleanId},internal_reference.eq.${cleanId}`)
      .single();

    if (!error && data) {
      store.orders.unshift(data as Order);
      writeStore(store);
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
  const order = await getOrderById(orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  order.order_status = newStatus;
  order.payment_mode = paymentMode;
  order.updated_at = now;

  // If status is paid, unlock the document
  if (newStatus === "TEST_PAID" || newStatus === "DOCUMENT_AVAILABLE") {
    if (order.documents && order.documents.length > 0) {
      order.documents[0].generation_status = "READY";
    }
  }

  const store = ensureStore();
  const orderIndex = store.orders.findIndex(
    (o) => o.id === order.id || o.internal_reference.toLowerCase() === order.internal_reference.toLowerCase()
  );
  if (orderIndex >= 0) {
    store.orders[orderIndex] = order;
  } else {
    store.orders.unshift(order);
  }
  writeStore(store);

  // Persist updated order in Supabase Storage
  await saveOrderToSupabaseStorage(order);

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

export async function recordPaymentEvent(
  event: Omit<PaymentEvent, "id" | "created_at">
): Promise<PaymentEvent> {
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
    await saveOrderToSupabaseStorage(order);
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

export async function createSupportTicket(
  ticket: Omit<SupportTicket, "id" | "created_at" | "status">
): Promise<SupportTicket> {
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
