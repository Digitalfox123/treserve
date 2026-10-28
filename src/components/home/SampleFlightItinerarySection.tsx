"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Calendar,
  Download,
  ArrowRight,
  Eye,
  X,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

export function SampleFlightItinerarySection() {
  const [modalOpen, setModalOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  const featurePoints = [
    {
      title: "Professional A4 PDF Layout",
      description: "Clean vector typography, standardized margins, and executive header styling suitable for embassy presentations.",
      icon: FileText,
    },
    {
      title: "Clear Route, Date and Passenger Details",
      description: "Structured journey routing, departure and arrival coordinates, carrier flight numbers, and verified traveler name formatting.",
      icon: Calendar,
    },
    {
      title: "Convenient Digital Document Access",
      description: "Immediate download upon simulated order completion, stored securely in your dashboard for ongoing visa reference.",
      icon: Download,
    },
  ];

  return (
    <section id="sample-itinerary" className="py-24 bg-[#F5F7FA] border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Feature Points, and CTAs (5.5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
                DOCUMENT PREVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-2 leading-tight">
                Sample Flight Itinerary
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
                Explore the professional layout of a Treserve itinerary document, designed to present journey
                dates, routes, and passenger information clearly.
              </p>
            </div>

            {/* Three Concise Feature Points with Blue Outlined Icons */}
            <div className="space-y-4 pt-2">
              {featurePoints.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#1769E0]/30 text-[#1769E0] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0B1F33]">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs: Primary & Secondary */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all"
              >
                <span>Create Your Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#0B1F33] hover:text-[#1769E0] text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-colors"
              >
                <Eye className="w-4 h-4 text-[#1769E0]" />
                <span>Preview Sample</span>
              </button>
            </div>
          </div>

          {/* Right Column: Realistic A4 Document Preview Card (6.5 cols on lg) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              onClick={() => setModalOpen(true)}
              className="group relative w-full max-w-xl bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200/90 p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              {/* Click to Enlarge Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-[#0B1F33]/85 text-white px-2.5 py-1 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3 h-3" />
                <span>Click to Enlarge</span>
              </div>

              {/* Document Header Accent */}
              <div className="w-full h-1.5 bg-[#1769E0] rounded-t-sm -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 mb-6 sm:mb-8" />

              {/* Top Row: Brand & Sample Watermark Notice */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src="/images/app-icon.png"
                      alt="Treserve Icon"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#0B1F33] tracking-tight">
                      Treserve
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Plan Today · Travel Tomorrow
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-[#0B1F33] tracking-wider uppercase">
                    Flight Itinerary Document
                  </div>
                  <div className="inline-block mt-1 bg-amber-50 border border-amber-300 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded tracking-wider">
                    SAMPLE DOCUMENT — NOT A TICKET
                  </div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 bg-[#F8FAFC] rounded-lg px-3 mt-4 text-[11px] border border-slate-100">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">REFERENCE</span>
                  <span className="font-mono font-bold text-[#1769E0]">TR-SAMPLE-001</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">DATE OF ISSUE</span>
                  <span className="font-semibold text-slate-700">2026-10-27</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">TRIP TYPE</span>
                  <span className="font-semibold text-slate-700">RETURN TRIP</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">CABIN CLASS</span>
                  <span className="font-semibold text-slate-700">ECONOMY</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="mt-4 p-3.5 bg-[#E8F2FF]/40 rounded-xl border border-[#1769E0]/20 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase text-[#1769E0]">ILLUSTRATIVE FLIGHT ROUTING</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B1F33]">
                    London (LHR) <span className="text-[#1769E0]">→</span> Dubai (DXB)
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#1769E0]/30 text-[#1769E0] flex items-center justify-center shadow-2xs">
                  <Plane className="w-4 h-4 rotate-45" />
                </div>
              </div>

              {/* Sample Passenger Table */}
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  PASSENGER MANIFEST
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                  <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-600 flex justify-between">
                    <span>NAME</span>
                    <span>TYPE</span>
                    <span>STATUS</span>
                  </div>
                  <div className="px-3 py-2 flex justify-between items-center bg-white font-medium text-slate-800">
                    <span className="font-bold">MR. ALEXANDER MORGAN</span>
                    <span className="text-slate-500">ADULT</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      CONFIRMED ON RECORD
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Flight Segments Table */}
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  SCHEDULED FLIGHT SEGMENTS
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px] divide-y divide-slate-100">
                  <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-600 grid grid-cols-12 gap-1 text-[10px]">
                    <span className="col-span-3">FLIGHT</span>
                    <span className="col-span-4">DEPARTURE</span>
                    <span className="col-span-3">ARRIVAL</span>
                    <span className="col-span-2 text-right">DURATION</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 gap-1 bg-white items-center">
                    <div className="col-span-3">
                      <div className="font-bold text-[#1769E0]">TR-602</div>
                      <div className="text-[9px] text-slate-400">Emirates (Codeshare)</div>
                    </div>
                    <div className="col-span-4 text-slate-700">
                      <div className="font-semibold">LHR 14:20</div>
                      <div className="text-[9px] text-slate-400">London Heathrow</div>
                    </div>
                    <div className="col-span-3 text-slate-700">
                      <div className="font-semibold">DXB 00:30 +1</div>
                      <div className="text-[9px] text-slate-400">Dubai Intl T3</div>
                    </div>
                    <div className="col-span-2 text-right text-slate-600 text-[10px]">
                      7h 10m
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Document Footer Notice */}
              <div className="mt-5 pt-3 border-t border-slate-200 text-[9.5px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-700">Official Purpose: </span>
                Issued strictly for visa application support and travel planning. This sample document is not an actual
                airline ticket and does not grant boarding rights on any aircraft.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Full-Size Document Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B1F33]/70 backdrop-blur-xs transition-opacity"
        >
          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#1769E0]" />
                <h3 className="text-sm font-bold text-[#0B1F33]">
                  Treserve Illustrative Document Preview (A4 Vector Layout)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close Preview"
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#F8FAFC]">
              {/* Watermark Notice Banner */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>
                  SAMPLE WATERMARK: This preview represents standard layout typesetting. Final issued documents contain
                  your real passenger names, selected dates, and unique booking reference.
                </span>
              </div>

              {/* Exact A4 Ratio Simulation */}
              <div className="bg-white rounded-xl shadow-md border border-slate-300 p-6 sm:p-10 space-y-6 text-slate-800 relative">
                {/* Diagonal subtle watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg]">
                  <span className="text-6xl sm:text-8xl font-black text-slate-900 tracking-widest">
                    SAMPLE DOCUMENT
                  </span>
                </div>

                {/* Top Accent */}
                <div className="w-full h-2 bg-[#1769E0] rounded-t-xs -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 mb-6" />

                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs">
                      <Image
                        src="/images/app-icon.png"
                        alt="Treserve App Icon"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#0B1F33]">Treserve</div>
                      <div className="text-xs text-slate-400">Plan Today · Travel Tomorrow</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#0B1F33]">FLIGHT ITINERARY DOCUMENT</div>
                    <div className="text-xs font-mono font-bold text-[#1769E0]">Ref: TR-SAMPLE-2026-X01</div>
                    <div className="text-[10px] text-slate-400">Date of Issue: 2026-10-27</div>
                  </div>
                </div>

                {/* Journey Overview Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">FLIGHT ROUTING</div>
                      <div className="text-base font-extrabold text-[#0B1F33]">
                        London Heathrow (LHR) → Dubai International (DXB)
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1769E0] bg-[#E8F2FF] px-2.5 py-1 rounded">
                      CABIN: ECONOMY
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400">TRIP TYPE</span>
                      <span className="font-bold text-slate-700">RETURN TRIP</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400">DEPARTURE</span>
                      <span className="font-bold text-slate-700">2026-11-24</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400">RETURN</span>
                      <span className="font-bold text-slate-700">2026-12-05</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400">PASSENGERS</span>
                      <span className="font-bold text-slate-700">1 ADULT</span>
                    </div>
                  </div>
                </div>

                {/* Manifest */}
                <div>
                  <div className="text-xs font-bold text-[#0B1F33] mb-2 uppercase tracking-wide">
                    Passenger Manifest
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="bg-[#E8F2FF] px-3 py-2 font-bold text-[#0B1F33] flex justify-between">
                      <span># PASSENGER NAME</span>
                      <span>TRAVELER TYPE</span>
                      <span>STATUS</span>
                    </div>
                    <div className="px-3 py-2.5 flex justify-between items-center bg-white border-t border-slate-100">
                      <span className="font-bold text-slate-800">1. MR. ALEXANDER MORGAN</span>
                      <span className="text-slate-500 font-medium">ADULT (12+ YRS)</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        CONFIRMED ON RECORD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Segments */}
                <div>
                  <div className="text-xs font-bold text-[#0B1F33] mb-2 uppercase tracking-wide">
                    Flight Segments
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="bg-[#E8F2FF] px-3 py-2 font-bold text-[#0B1F33] grid grid-cols-12 gap-2">
                      <span className="col-span-3">FLIGHT</span>
                      <span className="col-span-3">DEPARTURE</span>
                      <span className="col-span-3">ARRIVAL</span>
                      <span className="col-span-3 text-right">DURATION / CABIN</span>
                    </div>
                    <div className="px-3 py-3 grid grid-cols-12 gap-2 bg-white items-center border-t border-slate-100">
                      <div className="col-span-3">
                        <div className="font-bold text-[#1769E0]">TR-602</div>
                        <div className="text-[10px] text-slate-400">Emirates Partner</div>
                      </div>
                      <div className="col-span-3">
                        <div className="font-bold text-slate-800">14:20 Nov 24</div>
                        <div className="text-[10px] text-slate-400">LHR Terminal 3</div>
                      </div>
                      <div className="col-span-3">
                        <div className="font-bold text-slate-800">00:30 Nov 25</div>
                        <div className="text-[10px] text-slate-400">DXB Terminal 3</div>
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="font-medium text-slate-700">7h 10m</div>
                        <div className="text-[10px] font-bold text-[#1769E0]">Economy Class</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Terms Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 space-y-1">
                  <div className="font-bold text-[#0B1F33] uppercase">
                    Important Travel Documentation Terms & Notice
                  </div>
                  <p className="text-rose-700 font-bold">
                    1. Mandatory Policy: Our service provides temporary reservations for visa documentation only. We
                    do not guarantee visa approval. These are NOT actual flight tickets and are NOT valid for boarding.
                  </p>
                  <p>
                    2. Electronic Authentication: Verified via Treserve Platform. Issued as verified proof of intended
                    travel for consular review.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
              <span className="text-xs text-slate-500">
                A4 Vector Format · 595.28 × 841.89 points
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
                <Link
                  href="/create"
                  className="px-5 py-2 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Create Document
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
