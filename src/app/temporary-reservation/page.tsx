import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { CalendarCheck, Check, ArrowRight, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Temporary Flight Reservation for Visa | Treserve",
  description:
    "Verifiable temporary flight reservation with live airline PNR code for Schengen, US, UK, Canada & worldwide embassy visa applications.",
  alternates: {
    canonical: "/temporary-reservation",
  },
};

export default function TemporaryReservationServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <CalendarCheck className="w-4 h-4" />
                <span>Service Details · Visa Documentation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33]">
                Temporary Flight Reservation
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                A verified temporary held reservation document requested through authorized travel supplier
                networks. Specifically prepared to fulfill embassy and consulate visa requirements.
              </p>
            </div>

            {/* MANDATORY DISCLAIMER AT THE TOP */}
            <MandatoryDisclaimer variant="inline" />

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wide">
                Key Features & Terms:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Legitimate supplier-derived reservation status</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contains authorized supplier reference where available</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clear reservation validity window noted</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full passenger and flight schedule specifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard A4 vector PDF format</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download unlocked upon test checkout completion</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Fixed Rate</span>
                <div className="text-3xl font-black text-[#0B1F33]">$10.00 USD</div>
                <p className="text-xs text-slate-500">Per traveler · Instant PDF download upon booking</p>
              </div>
              <Link
                href="/create?service=temporary_reservation"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <span>Create Temporary Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
