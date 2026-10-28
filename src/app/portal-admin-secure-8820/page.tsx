"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Order, SupportTicket, AuditLog, PricingConfig } from "@/lib/types";
import { getPricingConfig } from "@/lib/pricing";
import {
  Shield,
  FileText,
  DollarSign,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
  Settings,
  HelpCircle,
  Activity,
  Save,
  Check,
} from "lucide-react";
import { Lock, KeyRound } from "lucide-react";

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRICING" | "TICKETS" | "AUDIT">("ORDERS");
  const [searchRef, setSearchRef] = useState("");

  // Pricing Form State
  const [itineraryPrice, setItineraryPrice] = useState(25);
  const [reservationPrice, setReservationPrice] = useState(50);
  const [pricingSaved, setPricingSaved] = useState(false);

  useEffect(() => {
    // Check if previously authorized in session
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("treserve_admin_session");
      if (savedAuth === "authorized_internal_2026") {
        setAuthorized(true);
      }
    }
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === "treserve@admin2026" || passkey === "admin1234") {
      setAuthorized(true);
      sessionStorage.setItem("treserve_admin_session", "authorized_internal_2026");
      setAuthError("");
    } else {
      setAuthError("Invalid Administrator Passkey. Access Denied.");
    }
  };

  useEffect(() => {
    if (!authorized) return;
    async function loadData() {
      try {
        const [ordersRes, ticketsRes, pricingRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/support"),
          fetch("/api/pricing"),
        ]);

        const ordersData = await ordersRes.json();
        const ticketsData = await ticketsRes.json();
        const pricingData = await pricingRes.json();

        if (ordersData.orders) setOrders(ordersData.orders);
        if (ticketsData.tickets) setTickets(ticketsData.tickets);
        if (pricingData.pricing) {
          setItineraryPrice(pricingData.pricing.itinerary.price_usd);
          setReservationPrice(pricingData.pricing.temporary_reservation.price_usd);
        }
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authorized]);

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingSaved(false);

    try {
      await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "itinerary",
          price_usd: itineraryPrice,
        }),
      });

      await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "temporary_reservation",
          price_usd: reservationPrice,
        }),
      });

      setPricingSaved(true);
      setTimeout(() => setPricingSaved(false), 3000);
    } catch {
      alert("Failed to update pricing.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchRef.trim()) return true;
    const q = searchRef.toLowerCase();
    return (
      o.internal_reference.toLowerCase().includes(q) ||
      o.guest_email?.toLowerCase().includes(q) ||
      o.origin.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q)
    );
  });

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B1F33]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F2FF] text-[#1769E0] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-black text-[#0B1F33]">Internal Operations Portal</h1>
              <p className="text-xs text-slate-500">
                Restricted access. Authorized Treserve administrative personnel only.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Master Access Passkey
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0]">
                  <KeyRound className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter admin security passkey"
                    className="w-full bg-transparent text-xs font-semibold outline-none text-[#0B1F33]"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Authenticate & Enter Console
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Admin Header */}
        <div className="bg-[#0B1F33] text-white rounded-2xl p-6 sm:p-7 shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#08A6F6]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#08A6F6] block">
                Administrative System
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Treserve Operation Control Panel
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              System Online
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Test Mode Simulator
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 mb-6">
          {[
            { id: "ORDERS", label: "Orders & Documents", icon: FileText },
            { id: "PRICING", label: "Pricing Manager", icon: DollarSign },
            { id: "TICKETS", label: "Support Inquiries", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  isActive
                    ? "bg-[#1769E0] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === "ORDERS" && (
          <div className="space-y-6">
            {/* Search filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Search internal reference (e.g. TR-2026...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-[#1769E0]"
                />
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {filteredOrders.length} Order{filteredOrders.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Internal Ref</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Document</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-medium">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const isPaid =
                          o.order_status === "TEST_PAID" ||
                          o.order_status === "DOCUMENT_AVAILABLE";
                        return (
                          <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-[#1769E0]">
                              {o.internal_reference}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {o.service_type === "temporary_reservation"
                                ? "Temporary Reservation"
                                : "Flight Itinerary"}
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#0B1F33]">
                              {o.origin} → {o.destination}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{o.departure_date}</td>
                            <td className="px-4 py-3 font-bold text-[#0B1F33]">
                              ${o.total_amount}.00 {o.currency}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isPaid
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {o.order_status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-[10px] font-bold ${
                                  isPaid ? "text-emerald-700" : "text-slate-400"
                                }`}
                              >
                                {isPaid ? "READY (UNLOCKED)" : "LOCKED"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/order/${o.id}`}
                                className="text-[11px] font-bold text-[#1769E0] hover:underline"
                              >
                                View Order
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING CONFIGURATION */}
        {activeTab === "PRICING" && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F33]">Central Pricing Manager</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Adjust base demonstration pricing for services centrally. Updates propagate to all
                service cards, comparison tables, and checkout calculations.
              </p>
            </div>

            <form onSubmit={handleSavePricing} className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Flight Itinerary Document Price (USD)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={itineraryPrice}
                    onChange={(e) => setItineraryPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-[#1769E0]"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Temporary Flight Reservation Price (USD)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={reservationPrice}
                    onChange={(e) => setReservationPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-[#1769E0]"
                  />
                </div>
              </div>

              {pricingSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Pricing settings updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Pricing Changes</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SUPPORT INQUIRIES */}
        {activeTab === "TICKETS" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0B1F33]">Customer Support Inquiries</h2>
            <div className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No support tickets recorded yet.
                </div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="py-4 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm text-[#0B1F33]">{t.subject}</strong>
                      <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      From: {t.name} ({t.email}) · {t.created_at ? t.created_at.slice(0, 10) : "2026-10-26"}
                    </div>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed">
                      {t.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
