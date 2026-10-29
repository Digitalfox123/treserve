"use client";

import React from "react";
import Link from "next/link";
import { Plane, ShieldCheck, Check, ArrowRight, Zap, Globe2, FileCheck2, Award } from "lucide-react";

export function ServicesSection() {
  const serviceChecklist = [
    "Verifiable Airline Flight Number & Live Schedule",
    "Legitimate PNR Booking Reference Code for Embassy Verification",
    "Official A4 Vector PDF Format Ready for Consular Submission",
    "Accepted by Schengen, US, UK, Canada, Australia & Global Visas",
    "14–21 Days Active Reservation Hold Coverage",
    "Instant PDF Download Right After Booking — No Account Needed",
    "Zero Financial Risk — Never Buy Costly Tickets Before Visa Approval",
    "Complies with Strict Embassy & VFS / TLScontact Guidelines",
    "Valid for One-Way, Return & Connecting Multi-Leg Itineraries",
    "Dedicated 24/7 Traveler Verification Support Assistance",
  ];

  return (
    <section id="services" className="pt-36 md:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
          OUR CORE SPECIALIZATION
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#0B1F33] tracking-tight mt-3">
          Visa Application Flight Reservation
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Treserve specializes exclusively in legitimate, verifiable flight reservations designed specifically for visa interview appointments, embassy submissions, and proof of onward travel worldwide.
        </p>
      </div>

      {/* Single Large Executive Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-8 sm:p-12 relative overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1769E0] via-[#08A6F6] to-[#1769E0]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Service Narrative & Pricing (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Embassy & Consular Compliant</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B1F33] leading-snug">
                Official Flight Reservation Hold for Visa Applicants
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Never risk buying an expensive, non-refundable flight ticket before your visa is approved. We provide legitimate flight reservations with live airline schedules, real flight numbers, and verifiable PNR codes accepted by embassies and visa processing centers worldwide.
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-4xl sm:text-5xl font-black text-[#0B1F33]">$10</span>
                  <span className="text-slate-500 text-xs font-semibold ml-2">USD Flat Fee</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8F2FF] text-[#1769E0]">
                  Instant Delivery
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                One-time flat rate per person · No subscription · Download your PDF instantly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/create"
                className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Book Flight Reservation ($10)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#sample-itinerary"
                className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-[#0B1F33] text-xs font-bold rounded-xl transition-colors text-center"
              >
                View Sample PDF
              </a>
            </div>
          </div>

          {/* Right Column: Full Feature Checklist (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-[#1769E0]" />
                <span>What Is Included in Your Flight Reservation Report:</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                Guaranteed Hold
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {serviceChecklist.map((item) => (
                <div key={item} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Consular Acceptance Badges */}
            <div className="mt-6 pt-5 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Compliant With Visa Authorities Worldwide:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Schengen Visas (29 Countries)",
                  "US B1/B2 Visitor",
                  "UK Standard Visitor",
                  "Canada TRV",
                  "Australia Visitor 600",
                  "Japan & Korea",
                  "Onward Travel Proof",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="text-[11px] font-semibold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-700 shadow-2xs"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
