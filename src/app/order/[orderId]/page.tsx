"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { Order } from "@/lib/types";
import {
  Lock,
  Unlock,
  Download,
  CreditCard,
  FileText,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Plane,
} from "lucide-react";

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      let clientCachedOrder: Order | null = null;
      if (typeof window !== "undefined") {
        try {
          const cached =
            localStorage.getItem(`treserve_order_${orderId}`) ||
            sessionStorage.getItem(`treserve_order_${orderId}`) ||
            localStorage.getItem("treserve_last_order");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && (parsed.id === orderId || parsed.internal_reference === orderId)) {
              clientCachedOrder = parsed;
              setOrder(parsed);
              setLoading(false);
            }
          }
        } catch {
          // ignore cache read error
        }
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setError(null);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`treserve_order_${data.order.id}`, JSON.stringify(data.order));
            } catch {
              // ignore
            }
          }
        } else if (!clientCachedOrder) {
          throw new Error(data.error || "Order not found");
        } else {
          // Sync client order to serverless instance
          fetch("/api/orders/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: clientCachedOrder }),
          }).catch(() => {});
        }
      } catch (err: unknown) {
        if (!clientCachedOrder) {
          setError(err instanceof Error ? err.message : "Failed to load order");
        }
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#1769E0] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Retrieving order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-[#0B1F33]">Order Record Not Found</h2>
            <p className="text-xs text-slate-500">{error || "The requested order does not exist."}</p>
            <Link
              href="/create"
              className="inline-block px-5 py-2.5 bg-[#1769E0] text-white text-xs font-bold rounded-xl"
            >
              Start New Order
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPaid =
    order.order_status === "TEST_PAID" ||
    order.order_status === "DOCUMENT_AVAILABLE";

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-[#E8F2FF] text-[#1769E0] px-2.5 py-1 rounded-md">
                Ref: {order.internal_reference}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.order_status.replace(/_/g, " ")}
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0B1F33] mt-2">
              Visa Application Flight Reservation Document
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Created on {order.created_at ? order.created_at.slice(0, 10) : "2026-10-26"} · Delivery to {order.guest_email}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isPaid ? (
              <a
                href={`/api/documents/${order.id}/download`}
                className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Vector A4 PDF</span>
              </a>
            ) : (
              <Link
                href={`/checkout/${order.id}`}
                className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Complete Test Payment</span>
              </Link>
            )}
          </div>
        </div>

        {/* Document Preview & Protection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Document Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Document Preview
              </span>
              <span className="text-[11px] text-slate-500 font-medium">A4 Portrait (210 × 297 mm)</span>
            </div>

            {/* Document Mockup Frame */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-6 sm:p-8 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0B1F33]">Treserve</h3>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                    PLAN TODAY · TRAVEL TOMORROW
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-500">
                  <div>Ref: {order.internal_reference}</div>
                  <div>Issued: {order.created_at ? order.created_at.slice(0, 10) : "2026-10-26"}</div>
                </div>
              </div>

              {/* Document Body Sample */}
              <div className="space-y-4 my-6 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Journey Overview</div>
                  <div className="font-bold text-[#0B1F33] text-sm">
                    {order.origin} → {order.destination}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Departure: {order.departure_date} {order.return_date && `| Return: ${order.return_date}`} | Class: {order.cabin_class}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Traveler Details</div>
                  <div className="space-y-1">
                    {order.passengers?.map((p, i) => (
                      <div key={i} className="font-semibold text-slate-800">
                        {i + 1}. {p.title} {p.first_name} {p.last_name} ({p.passenger_type})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary Flight Segments */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Flight Routing</div>
                  <div className="border border-slate-200 rounded-lg p-2.5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between font-bold text-[#1769E0]">
                      <span>{order.segments?.[0]?.flight_number || "TR-842"} ({order.segments?.[0]?.airline_name || "International Airways"})</span>
                      <span>{order.segments?.[0]?.duration || "3h 45m"}</span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
                      <span>Depart: {order.origin} ({order.segments?.[0]?.departure_time || "09:30"})</span>
                      <span>Arrive: {order.destination} ({order.segments?.[0]?.arrival_time || "13:15"})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Disclaimer Preview */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 leading-normal font-medium">
                <strong>Notice:</strong> Our service provides temporary reservations for visa documentation only.
                We do not guarantee visa approval. These are NOT actual flight tickets and are NOT valid for boarding.
              </div>

              {/* LOCKED OVERLAY (If not paid) */}
              {!isPaid && (
                <div className="absolute inset-0 bg-[#0B1F33]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-black tracking-widest uppercase text-amber-400 mb-1">
                    Access Restricted
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white max-w-md">
                    PAYMENT REQUIRED · PDF DOWNLOAD LOCKED
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mt-2 leading-relaxed">
                    This document is currently locked. Complete the simulated test payment to verify authorization
                    and immediately unlock the final print-ready A4 PDF.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      disabled
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-700/80 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Download PDF (Locked)</span>
                    </button>
                    <Link
                      href={`/checkout/${order.id}`}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Complete Test Payment</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Information & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-400">
                {isPaid ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                <span>Document Protection Status</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Document Type:</span>
                  <strong className="text-[#0B1F33]">
                    {order.service_type === "temporary_reservation" ? "Temporary Reservation" : "Flight Itinerary"}
                  </strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Document Status:</span>
                  <span className={`font-bold ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
                    {isPaid ? "READY · UNLOCKED" : "LOCKED · AWAITING PAYMENT"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-mono font-bold text-slate-700">{order.payment_mode}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Fee:</span>
                  <strong className="text-[#0B1F33]">${order.total_amount}.00 USD</strong>
                </div>
              </div>

              {isPaid ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Test payment confirmed. Your vector A4 PDF is verified and unlocked for download.</span>
                  </div>
                  <a
                    href={`/api/documents/${order.id}/download`}
                    className="w-full py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official A4 PDF</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Final PDF documents are protected by server-side verification. An unpaid order cannot
                    download its document. Complete test checkout simulation to unlock.
                  </p>
                  <Link
                    href={`/checkout/${order.id}`}
                    className="w-full py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 text-center"
                  >
                    <span>Proceed to Test Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-400 block">Actions & Support</span>
              <div className="space-y-2 text-xs">
                <Link
                  href="/dashboard"
                  className="w-full py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[#0B1F33] font-semibold"
                >
                  <span>Go to Customer Dashboard</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/contact"
                  className="w-full py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[#0B1F33] font-semibold"
                >
                  <span>Need Help with this Order?</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <MandatoryDisclaimer variant="card" className="mt-12" />
      </main>

      <Footer />
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
          <Loader2 className="w-8 h-8 text-[#1769E0] animate-spin" />
        </div>
      }
    >
      <OrderDetailsContent />
    </React.Suspense>
  );
}
