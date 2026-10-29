"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { Order } from "@/lib/types";
import {
  Search,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Plane,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function ManageBookingPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setError("Please enter your Booking Reference number.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const params = new URLSearchParams({
        ref: reference.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
      });

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        // Fallback to local cache lookup if server instance is fresh
        let foundInCache: Order | null = null;
        if (typeof window !== "undefined") {
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.startsWith("treserve_order_") || key === "treserve_last_order")) {
                const item = localStorage.getItem(key);
                if (item) {
                  const parsed = JSON.parse(item);
                  if (
                    parsed &&
                    (parsed.internal_reference?.toLowerCase() === reference.trim().toLowerCase() ||
                      parsed.id?.toLowerCase() === reference.trim().toLowerCase())
                  ) {
                    foundInCache = parsed;
                    break;
                  }
                }
              }
            }
          } catch {
            // ignore
          }
        }

        if (foundInCache) {
          setOrder(foundInCache);
          fetch("/api/orders/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: foundInCache }),
          }).catch(() => {});
          return;
        }

        throw new Error(data.error || "No reservation found matching this booking reference and email.");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to locate reservation.");
    } finally {
      setLoading(false);
    }
  };

  const isPaid =
    order &&
    (order.order_status === "TEST_PAID" || order.order_status === "DOCUMENT_AVAILABLE");

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
            RESERVATION MANAGEMENT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33] tracking-tight mt-3">
            Find Your Flight Reservation
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Retrieve, verify, or download your official flight reservation PDF instantly. No account or password required.
          </p>
        </div>

        {/* Lookup Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Booking Reference / Order ID <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. TR-20261028-992376"
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#0B1F33] outline-none placeholder:font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Passenger Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs font-semibold text-[#0B1F33] outline-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching Reservation Records...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find My Reservation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Display Order Result if Found */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Confirmed Booking Reference
                </span>
                <div className="text-xl sm:text-2xl font-mono font-black text-[#1769E0] mt-0.5">
                  {order.internal_reference}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Booked for {order.guest_name} · {order.passenger_count} Passenger(s)
                </div>
              </div>

              <div>
                {isPaid ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reservation Confirmed · Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Payment Pending</span>
                  </span>
                )}
              </div>
            </div>

            {/* Journey Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Route & Trip</span>
                <span className="font-bold text-[#0B1F33] text-sm mt-0.5 block">
                  {order.origin} → {order.destination}
                </span>
                <span className="text-[11px] text-slate-500 uppercase font-semibold">
                  {order.trip_type} trip · {order.cabin_class}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Departure Date</span>
                <span className="font-bold text-[#0B1F33] text-sm mt-0.5 block">
                  {order.departure_date}
                </span>
                {order.return_date && (
                  <span className="text-[11px] text-slate-500">
                    Return: {order.return_date}
                  </span>
                )}
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Airline PNR / Carrier</span>
                <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5 block">
                  {order.segments?.[0]?.airline_name || order.reservation_record?.supplier_name || "International Carrier"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {order.segments?.[0]?.flight_number ? `Flight ${order.segments[0].flight_number}` : "Confirmed Hold"}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#1769E0]" />
                <span>Standard A4 Embassy-Approved Vector Document</span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {isPaid ? (
                  <a
                    href={`/api/documents/${order.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF</span>
                  </a>
                ) : (
                  <Link
                    href={`/checkout/${order.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Payment (${order.total_amount})</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <MandatoryDisclaimer variant="banner" className="mt-12" />
      </main>

      <Footer />
    </div>
  );
}
