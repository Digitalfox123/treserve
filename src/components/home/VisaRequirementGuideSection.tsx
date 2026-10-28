"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HelpCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Plane,
} from "lucide-react";

export function VisaRequirementGuideSection() {
  const infoPoints = [
    {
      title: "Check Official Requirements",
      description:
        "Review the instructions published by the relevant embassy, consulate, or immigration authority for your specific visa category.",
      icon: Info,
    },
    {
      title: "Understand Your Document",
      description:
        "A proposed itinerary, a genuine reservation, and an issued airline ticket are different things. Check which one your application requires.",
      icon: HelpCircle,
    },
    {
      title: "Avoid Unnecessary Commitments",
      description:
        "Review the relevant booking conditions before paying for a non-refundable flight to prevent avoidable financial loss.",
      icon: AlertCircle,
    },
  ];

  return (
    <section id="visa-guidance" className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Educational Content & Information Hierarchy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
                CONSULAR GUIDANCE &amp; ADVISORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-2 leading-tight">
                Do You Need to Buy a Flight Ticket Before Visa Approval?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 font-normal">
                Not always. Requirements depend on the destination, visa category, and the relevant authority. Some
                applications may request an itinerary or reservation, while others have different documentation
                requirements. Always encourage customers to verify the official requirements for their specific application.
              </p>
            </div>

            {/* Highlighted Information Panel */}
            <div className="p-4 sm:p-5 bg-[#E8F2FF]/50 border border-[#1769E0]/20 rounded-2xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-[#0B1F33]">Consulate Practice Note: </span>
                  Major foreign missions—including European Schengen consulates and the UK Visas &amp; Immigration
                  (UKVI)—explicitly advise travelers against purchasing fully paid, non-refundable airline tickets
                  until their visa has been officially approved and issued.
                </div>
              </div>
            </div>

            {/* Three Structured Information Points */}
            <div className="space-y-3 pt-1">
              {infoPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F33]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Links & CTA Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/services"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>View Service Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold text-[#1769E0] hover:text-[#1255B8] hover:bg-[#E8F2FF]/60 rounded-xl transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Travel Documentation Guides</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Polished, Compact 3D Minimalist Visual Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm bg-[#F8FAFC] rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-lg group hover:shadow-xl transition-all duration-300">
              {/* Compact 3D Visual Rendering */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-100">
                <Image
                  src="/images/passport-visa-card-3d.jpg"
                  alt="Minimalist 3D render of navy passport with gold insignia and flight itinerary card"
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-200/80 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1769E0]" />
                  <span className="text-[10px] font-bold text-[#0B1F33]">
                    Visa Dossier Proof
                  </span>
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-xs border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span className="text-[10px] font-bold text-slate-700">
                      Synchronized Itinerary
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Compliant</span>
                  </div>
                </div>
              </div>

              {/* Concise Bottom Caption */}
              <div className="mt-3.5 text-center px-2">
                <div className="text-[11px] font-bold text-[#0B1F33]">
                  Legitimate Proof of Intent
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Satisfies embassy flight schedule proof without ticketing fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
