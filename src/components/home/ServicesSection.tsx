import React from "react";
import Link from "next/link";
import { FileText, CalendarCheck, ArrowRight, Check } from "lucide-react";

export function ServicesSection() {
  return (
    <section className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight mt-1">
            Choose what works best for you
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Choose the option that suits your travel documentation and visa requirements.
          </p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769E0] hover:text-[#1255B8] mt-4 sm:mt-0 transition-colors"
        >
          <span>Compare All Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Exactly TWO Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Flight Itinerary Document */}
        <div className="treserve-card treserve-card-hover p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1769E0] to-[#08A6F6]" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F2FF] text-[#1769E0] border border-[#1769E0]/20">
                Most Popular
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0B1F33]">
              Flight Itinerary Document
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              A professionally formatted itinerary document containing your journey details, dates,
              route, and passenger information. Ideal for visa applications and travel planning.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Professional A4 PDF document",
                "Clear itinerary & flight details",
                "Instant download after test payment",
                "Permanent access through your dashboard",
              ].map((feat) => (
                <li key={feat} className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">From</span>
              <div className="text-2xl font-black text-[#0B1F33]">$25</div>
            </div>
            <Link
              href="/create?service=itinerary"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Create Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: Temporary Flight Reservation */}
        <div className="treserve-card treserve-card-hover p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                Partner Required
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0B1F33]">
              Temporary Flight Reservation
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Request a temporary flight reservation for visa documentation where supported by our
              reservation process. Complete with transparent service conditions.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Route and passenger details included",
                "Reservation status clearly identified",
                "Official A4 PDF with mandatory disclaimer",
                "Document access unlocked after checkout",
              ].map((feat) => (
                <li key={feat} className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">From</span>
              <div className="text-2xl font-black text-[#0B1F33]">$50</div>
            </div>
            <Link
              href="/create?service=temporary_reservation"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Create Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
