"use client";

import React from "react";
import Link from "next/link";
import { getPricingConfig } from "@/lib/pricing";
import { Check, Minus, ArrowRight } from "lucide-react";

export function PricingComparisonSection() {
  const pricing = getPricingConfig();
  const itineraryPrice = pricing.itinerary.price_usd;
  const reservationPrice = pricing.temporary_reservation.price_usd;

  const comparisonRows = [
    {
      feature: "Flight Route & Schedule Details",
      itinerary: true,
      reservation: true,
      note: "Full origin, destination, timings & flight numbers",
    },
    {
      feature: "Passenger & Cabin Specification",
      itinerary: true,
      reservation: true,
      note: "Standardized traveler identification",
    },
    {
      feature: "High-Resolution A4 PDF Document",
      itinerary: true,
      reservation: true,
      note: "Print-ready vector typography and format",
    },
    {
      feature: "Supplier-Derived Reservation Record",
      itinerary: false,
      reservation: true,
      note: "Includes supplier reference where supported",
    },
    {
      feature: "Actual Flight Ticket / Boarding Pass",
      itinerary: false,
      reservation: false,
      note: "Neither product is a ticket or valid for boarding",
    },
    {
      feature: "Immediate Download Upon Payment",
      itinerary: true,
      reservation: true,
      note: "Permanent access in customer dashboard",
    },
    {
      feature: "Official Visa Documentation Disclaimer",
      itinerary: true,
      reservation: true,
      note: "Included prominently on document",
    },
    {
      feature: "24/7 Dedicated Support Assistance",
      itinerary: true,
      reservation: true,
      note: "Assistance with document access and questions",
    },
    {
      feature: "Document Delivery Time",
      itinerary: "1–24 hours",
      reservation: "1–48 hours",
      isCustomText: true,
    },
  ];

  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Service Comparison & Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight mt-1">
              Find the right option for your travel needs
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Transparent, upfront demonstration rates with zero hidden fees.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769E0] hover:text-[#1255B8] mt-4 sm:mt-0 transition-colors"
          >
            <span>View Full Pricing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/70 p-6 text-center items-center">
            <div className="col-span-12 sm:col-span-4 text-left font-bold text-xs uppercase tracking-wider text-slate-400">
              Features & Specifications
            </div>
            {/* Column 1: Flight Itinerary */}
            <div className="col-span-6 sm:col-span-4 pt-4 sm:pt-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0]">
                Itinerary Document
              </span>
              <div className="text-2xl font-black text-[#0B1F33] mt-0.5">
                ${itineraryPrice}
              </div>
              <p className="text-[11px] text-slate-400">Plan Your Journey</p>
            </div>
            {/* Column 2: Temporary Reservation */}
            <div className="col-span-6 sm:col-span-4 pt-4 sm:pt-0 border-l border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Temporary Reservation
              </span>
              <div className="text-2xl font-black text-[#0B1F33] mt-0.5">
                ${reservationPrice}
              </div>
              <p className="text-[11px] text-slate-400">Visa Documentation</p>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-12 p-4 sm:px-6 items-center hover:bg-slate-50/50 transition-colors text-xs"
              >
                <div className="col-span-12 sm:col-span-4 text-left py-1 sm:py-0">
                  <div className="font-bold text-[#0B1F33]">{row.feature}</div>
                  {row.note && (
                    <div className="text-[11px] text-slate-400">{row.note}</div>
                  )}
                </div>

                {/* Itinerary Col */}
                <div className="col-span-6 sm:col-span-4 text-center flex justify-center py-1 sm:py-0">
                  {row.isCustomText ? (
                    <span className="font-semibold text-slate-700">{row.itinerary}</span>
                  ) : row.itinerary ? (
                    <div className="w-5 h-5 rounded-full bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 text-slate-300 flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Reservation Col */}
                <div className="col-span-6 sm:col-span-4 text-center flex justify-center py-1 sm:py-0 sm:border-l sm:border-slate-100">
                  {row.isCustomText ? (
                    <span className="font-semibold text-slate-700">{row.reservation}</span>
                  ) : row.reservation ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 text-slate-300 flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-12 p-6 bg-slate-50/60 border-t border-slate-200 items-center">
            <div className="hidden sm:block sm:col-span-4 text-xs font-semibold text-slate-500">
              * Test mode pricing for development simulation
            </div>
            <div className="col-span-6 sm:col-span-4 text-center px-2">
              <Link
                href="/create?service=itinerary"
                className="w-full inline-block py-2.5 px-4 bg-white hover:bg-slate-100 text-[#1769E0] border border-[#1769E0] font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="col-span-6 sm:col-span-4 text-center px-2 sm:border-l sm:border-slate-200">
              <Link
                href="/create?service=temporary_reservation"
                className="w-full inline-block py-2.5 px-4 bg-[#1769E0] hover:bg-[#1255B8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
