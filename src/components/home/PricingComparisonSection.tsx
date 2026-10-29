"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap, Globe2, FileText, Clock, Sparkles } from "lucide-react";

export function PricingComparisonSection() {
  const planFeatures = [
    "Verifiable Airline Flight Number & Live Flight Schedule",
    "Legitimate PNR Booking Reference Code for Embassy Verification",
    "Embassy & Consulate Compliant A4 Vector PDF Document",
    "Accepted for Schengen, US, UK, Canada & Global Visa Filings",
    "Instant PDF Download Right After Booking — No Account Needed",
    "14–21 Days Active Reservation Hold Guarantee",
    "Valid for One-Way, Return, and Connecting Flight Routes",
    "Zero Financial Risk — Avoid Paying Hundreds for Risky Tickets",
    "Mandatory Official Visa Documentation Disclaimer Included",
    "24/7 Priority Traveler Assistance & Document Verification",
  ];

  return (
    <section id="pricing" className="py-20 bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
            TRANSPARENT RESERVATION PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0B1F33] tracking-tight mt-3">
            One Flat Price. Instant Delivery.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            No recurring subscriptions, no hidden airline cancellation penalties. Get your verifiable visa application flight reservation for a single flat fee.
          </p>
        </div>

        {/* Single Premium Pricing Card */}
        <div className="bg-white rounded-3xl border-2 border-[#1769E0] shadow-xl p-8 sm:p-12 relative overflow-hidden transition-all">
          {/* Top Recommended Ribbon */}
          <div className="absolute top-0 right-0">
            <div className="bg-[#1769E0] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-6 py-1.5 rounded-bl-2xl shadow-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RECOMMENDED · OFFICIAL VISA PROOF</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Plan Details & Price (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
                  Instant Flight Reservation
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0B1F33] mt-3">
                  Visa Application Flight Reservation
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  Complete embassy-compliant flight reservation hold formatted specifically for visa interviews, consular appointments, and proof of onward travel.
                </p>
              </div>

              {/* Price display */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-baseline">
                  <span className="text-5xl sm:text-6xl font-black text-[#0B1F33]">$10</span>
                  <span className="text-slate-500 text-xs sm:text-sm font-semibold ml-2">
                    USD flat fee · per person
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mt-2">
                  <Zap className="w-4 h-4 text-[#1769E0]" />
                  <span>Instant Delivery · 100% Verifiable Hold</span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href="/create"
                  className="w-full py-4 bg-[#1769E0] hover:bg-[#1255B8] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Book Flight Reservation ($10)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                  Instant A4 PDF download upon completion · No account required
                </p>
              </div>
            </div>

            {/* Right Col: Complete Checklist (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Everything Included in Your $10 Reservation:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {planFeatures.map((feat) => (
                  <div key={feat} className="flex items-start space-x-2 text-xs font-medium text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-semibold">
                <div>✓ 100% Risk-Free</div>
                <div>✓ Embassy Accepted</div>
                <div>✓ Instant PDF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
