"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Order } from "@/lib/types";
import {
  FileText,
  CalendarCheck,
  Download,
  Lock,
  CreditCard,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Shield,
  Search,
  ExternalLink,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "ITINERARIES" | "RESERVATIONS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "ITINERARIES" && o.service_type !== "itinerary") return false;
    if (activeTab === "RESERVATIONS" && o.service_type !== "temporary_reservation") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.internal_reference.toLowerCase().includes(q) ||
        o.origin.toLowerCase().includes(q) ||
        o.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalOrders = orders.length;
  const readyDocuments = orders.filter(
    (o) => o.order_status === "TEST_PAID" || o.order_status === "DOCUMENT_AVAILABLE"
  ).length;
  const pendingOrders = orders.filter((o) => o.order_status === "AWAITING_PAYMENT").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F33] mt-0.5">
              My Orders & Travel Documents
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage your generated flight itineraries, temporary reservations, and downloads.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/create"
              className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Document</span>
            </Link>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
              <FileText className="w-5 h-5 text-[#1769E0]" />
            </div>
            <div className="text-2xl font-black text-[#0B1F33] mt-2">{totalOrders}</div>
            <div className="text-[11px] text-slate-500 mt-1">Recorded in your profile</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Unlocked Documents</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#0B1F33] mt-2">{readyDocuments}</div>
            <div className="text-[11px] text-slate-500 mt-1">Available for instant PDF download</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Awaiting Payment</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-[#0B1F33] mt-2">{pendingOrders}</div>
            <div className="text-[11px] text-slate-500 mt-1">Pending test checkout simulation</div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {(["ALL", "ITINERARIES", "RESERVATIONS"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[#1769E0] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab === "ALL" ? "All Orders" : tab === "ITINERARIES" ? "Flight Itineraries" : "Reservations"}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or route..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-[#1769E0]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs font-semibold text-slate-400">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-[#0B1F33]">No orders found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven&apos;t created any travel documentation orders yet.
                </p>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1769E0] text-white text-xs font-bold rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Itinerary</span>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPaid =
                order.order_status === "TEST_PAID" ||
                order.order_status === "DOCUMENT_AVAILABLE";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1769E0] bg-[#E8F2FF] px-2.5 py-0.5 rounded-md">
                        {order.internal_reference}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.order_status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {order.created_at ? order.created_at.slice(0, 10) : "2026-10-26"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {order.service_type === "temporary_reservation" ? (
                        <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#1769E0]" />
                      )}
                      <h3 className="text-sm sm:text-base font-bold text-[#0B1F33]">
                        {order.service_type === "temporary_reservation"
                          ? "Temporary Flight Reservation"
                          : "Flight Itinerary Document"}
                      </h3>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        <strong>Route:</strong> {order.origin} → {order.destination}
                      </span>
                      <span>
                        <strong>Depart:</strong> {order.departure_date}
                      </span>
                      {order.return_date && (
                        <span>
                          <strong>Return:</strong> {order.return_date}
                        </span>
                      )}
                      <span>
                        <strong>Travelers:</strong> {order.passenger_count}
                      </span>
                      <span>
                        <strong>Amount:</strong> ${order.total_amount}.00 USD ({order.payment_mode})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={`/order/${order.id}`}
                      className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Details & Preview
                    </Link>

                    {isPaid ? (
                      <a
                        href={`/api/documents/${order.id}/download`}
                        className="px-4 py-2 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <Link
                        href={`/checkout/${order.id}`}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Test Checkout</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
