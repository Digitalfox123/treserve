"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { Logo } from "@/components/brand/Logo";
import { Order } from "@/lib/types";
import {
  ShieldAlert,
  CreditCard,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  FileText,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Checkout Simulator State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    ref?: string;
  } | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<
    "SIMULATE_SUCCESS" | "SIMULATE_FAILURE"
  >("SIMULATE_SUCCESS");
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      // 1. Immediately check local cache so the page renders with zero delay
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

      // 2. Fetch authoritative data from server / Supabase
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setFetchError(null);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`treserve_order_${data.order.id}`, JSON.stringify(data.order));
              localStorage.setItem("treserve_last_order", JSON.stringify(data.order));
            } catch {
              // ignore
            }
          }
        } else if (!clientCachedOrder) {
          throw new Error(data.error || "Order not found");
        } else {
          // Serverless instance didn't have the order in memory/disk; re-sync from client cache
          fetch("/api/orders/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: clientCachedOrder }),
          }).catch(() => {});
        }
      } catch (err: unknown) {
        if (!clientCachedOrder) {
          setFetchError(err instanceof Error ? err.message : "Failed to load order");
        }
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleSimulatePayment = async () => {
    if (!order) return;
    if (!termsAccepted) {
      alert("Please agree to the service conditions and visa disclaimer.");
      return;
    }

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const res = await fetch("/api/test-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          scenario: selectedScenario,
          terms_accepted: termsAccepted,
          order_backup: order,
        }),
      });

      const data = await res.json();

      // Artificial small delay for realistic processing feel
      await new Promise((r) => setTimeout(r, 900));

      if (res.ok && data.success) {
        setPaymentResult({
          success: true,
          message: data.message,
          ref: data.provider_reference,
        });
        // Refresh local order state
        setOrder(data.order);
        if (typeof window !== "undefined" && data.order) {
          try {
            localStorage.setItem(`treserve_order_${data.order.id}`, JSON.stringify(data.order));
            localStorage.setItem("treserve_last_order", JSON.stringify(data.order));
          } catch {
            // ignore
          }
        }
      } else {
        setPaymentResult({
          success: false,
          message: data.error || "Payment simulation declined.",
          ref: data.provider_reference,
        });
      }
    } catch {
      setPaymentResult({
        success: false,
        message: "Network or server error during payment simulation.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#1769E0] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading checkout session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-[#0B1F33]">Order Not Found</h2>
            <p className="text-xs text-slate-500">{fetchError || "Invalid order reference"}</p>
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

  const isAlreadyPaid =
    order.order_status === "TEST_PAID" ||
    order.order_status === "DOCUMENT_AVAILABLE";

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* MANDATORY TEST MODE NOTICE BANNER */}
        <div className="mb-8 rounded-2xl bg-[#0B1F33] text-white p-4 sm:p-5 shadow-md border-l-4 border-[#08A6F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#08A6F6] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#08A6F6] block">
                Development Environment
              </span>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                TEST MODE · NO REAL MONEY WILL BE CHARGED
              </h2>
            </div>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 px-3 py-1 rounded-full font-mono font-semibold self-start sm:self-auto">
            Simulator Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" showTagline={false} />
                <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {order.internal_reference}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Product</span>
                <div className="text-base font-bold text-[#0B1F33] flex items-center space-x-2 mt-0.5">
                  {order.service_type === "temporary_reservation" ? (
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#1769E0]" />
                  )}
                  <span>Visa Application Flight Reservation</span>
                </div>
              </div>

              {/* Route & Dates */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <strong className="text-[#0B1F33] font-bold">
                    {order.origin} → {order.destination}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure:</span>
                  <span className="font-semibold text-slate-700">{order.departure_date}</span>
                </div>
                {order.return_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Return:</span>
                    <span className="font-semibold text-slate-700">{order.return_date}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Travelers:</span>
                  <span className="font-semibold text-slate-700">
                    {order.passenger_count} ({order.cabin_class})
                  </span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Service Unit Fee</span>
                  <span>${order.subtotal_amount / order.passenger_count}.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Passengers ({order.passenger_count})</span>
                  <span>${order.subtotal_amount}.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Processing & Issuance Fee</span>
                  <span className="text-emerald-600 font-bold">$0.00 (Free in Test)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-[#0B1F33]">Total Amount</span>
                  <span className="text-2xl font-black text-[#0B1F33]">
                    ${order.total_amount}.00 <span className="text-xs font-semibold text-slate-400">USD</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#0B1F33]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected Document Gateway</span>
              </div>
              <p className="leading-relaxed">
                The final official vector A4 PDF remains encrypted and locked until server-side payment
                verification completes.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Test Payment Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Order is already paid */}
            {isAlreadyPaid ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Payment Status: Confirmed
                  </span>
                  <h2 className="text-2xl font-black text-[#0B1F33] mt-1">
                    Test Payment Successful
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    This was a simulation; no real money was charged. Your travel documentation has been
                    generated and unlocked!
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-600 inline-block">
                  Status: <strong>{order.order_status}</strong> · Mode: <strong>TEST</strong>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`/api/documents/${order.id}/download`}
                    className="w-full sm:w-auto px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Download Official A4 PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/order/${order.id}`}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0B1F33] text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    View Document Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">
                    Simulated Payment Terminal
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-1">
                    Complete Test Checkout
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Select a scenario below to test both success and failure behaviors.
                  </p>
                </div>

                {/* Scenario Selection Pills */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    Select Test Scenario:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedScenario("SIMULATE_SUCCESS")}
                      className={`p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                        selectedScenario === "SIMULATE_SUCCESS"
                          ? "border-[#1769E0] bg-[#E8F2FF]/60 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          selectedScenario === "SIMULATE_SUCCESS"
                            ? "text-[#1769E0]"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0B1F33]">Simulate Success</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Unlocks document download
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedScenario("SIMULATE_FAILURE")}
                      className={`p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                        selectedScenario === "SIMULATE_FAILURE"
                          ? "border-rose-500 bg-rose-50/60 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <XCircle
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          selectedScenario === "SIMULATE_FAILURE"
                            ? "text-rose-500"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0B1F33]">Simulate Failure</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Tests decline & retry workflow
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Simulated Payment Card Box (Pure visual dummy card for test mode) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Test Card Information (Simulated)</span>
                    </span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">
                      Pre-filled Demo
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-700">
                    4242 •••• •••• 4242 &nbsp;|&nbsp; Exp: 12/28 &nbsp;|&nbsp; CVC: 123
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#1769E0]"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to the Terms of Service and understand that{" "}
                      <strong>
                        this is a temporary reservation for visa documentation only, not a valid flight ticket for boarding.
                      </strong>
                    </span>
                  </label>
                </div>

                {/* Simulated Feedback Banner if any */}
                {paymentResult && (
                  <div
                    className={`p-4 rounded-xl text-xs flex items-start space-x-3 ${
                      paymentResult.success
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border border-rose-200 text-rose-900"
                    }`}
                  >
                    {paymentResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block font-bold">
                        {paymentResult.success
                          ? "Test Payment Successful"
                          : "Test Payment Declined (Simulated)"}
                      </strong>
                      <p className="mt-0.5">{paymentResult.message}</p>
                      {paymentResult.ref && (
                        <p className="text-[10px] font-mono mt-1 opacity-75">
                          Ref: {paymentResult.ref}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing || !termsAccepted}
                    onClick={handleSimulatePayment}
                    className="w-full py-3.5 bg-[#1769E0] hover:bg-[#1255B8] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Test Simulation...</span>
                      </>
                    ) : paymentResult && !paymentResult.success ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry Test Payment (${order.total_amount}.00 USD)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay in Test Mode (${order.total_amount}.00 USD)</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    🔒 256-bit Encrypted Test Gateway Simulation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <MandatoryDisclaimer variant="card" className="mt-12" />
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
          <Loader2 className="w-8 h-8 text-[#1769E0] animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
