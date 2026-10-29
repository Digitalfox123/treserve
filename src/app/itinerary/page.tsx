import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { FileText, Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function ItineraryServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8F2FF] text-[#1769E0] text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Service Details</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33]">
                Flight Itinerary Document
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                A professionally formatted travel itinerary document designed for visa applications,
                travel route submissions, and personal schedule planning.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wide">
                What Is Included in this Document:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Full flight route with IATA airport codes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Airline carrier and flight numbers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Scheduled departure and arrival times</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Traveler details and cabin preference</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Exact A4 print-ready vector PDF</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span>Direct unlocked access after test payment</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-[#E8F2FF]/60 rounded-2xl border border-[#1769E0]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Fixed Rate</span>
                <div className="text-3xl font-black text-[#0B1F33]">$10.00 USD</div>
                <p className="text-xs text-slate-500">Per traveler · Instant PDF download upon booking</p>
              </div>
              <Link
                href="/create?service=itinerary"
                className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <span>Create Itinerary Document</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <MandatoryDisclaimer variant="inline" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
