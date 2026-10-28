import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { FileText, CalendarCheck, Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Our Documentation Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-1.5">
              Choose the Service for Your Visa Needs
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
              Treserve provides two distinct travel documentation products formatted specifically for visa
              submission and travel planning.
            </p>
          </div>

          {/* Service 1: Flight Itinerary Document */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8F2FF] text-[#1769E0] text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Service 01 · Planning & Documentation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33]">
                Flight Itinerary Document
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                A professionally formatted travel schedule featuring verified flight timings, carrier codes,
                departure and arrival schedules, and passenger details. This document is suitable for visa
                lodgment where consulates request proof of proposed travel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Complete route and flight number details",
                  "Departure, arrival and duration timestamps",
                  "Passenger names & cabin class specification",
                  "Instant vector A4 PDF unlocked after test payment",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Demonstration Fee</span>
                <div className="text-4xl font-black text-[#0B1F33] mt-1">$25</div>
                <span className="text-xs text-slate-500">Per traveler (USD)</span>
              </div>
              <Link
                href="/create?service=itinerary"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Create Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Service 2: Temporary Flight Reservation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <CalendarCheck className="w-4 h-4" />
                <span>Service 02 · Visa Reservation Proof</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33]">
                Temporary Flight Reservation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                A held reservation arranged via authorized travel consortiums, displaying authentic
                supplier-derived reservation status specifically prepared for visa application files without
                requiring a non-refundable ticket purchase upfront.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Supplier-derived reservation reference",
                  "Clear reservation status identified",
                  "Official vector A4 PDF with prominent legal notice",
                  "Permanent document access in Customer Dashboard",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/80 text-center space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Demonstration Fee</span>
                <div className="text-4xl font-black text-[#0B1F33] mt-1">$50</div>
                <span className="text-xs text-slate-500">Per traveler (USD)</span>
              </div>
              <Link
                href="/create?service=temporary_reservation"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Create Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <MandatoryDisclaimer variant="card" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
