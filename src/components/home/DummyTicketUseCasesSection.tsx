"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileCheck2,
  Plane,
  Compass,
  Calendar,
  Globe,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function DummyTicketUseCasesSection() {
  const useCases = [
    {
      id: "visa-documentation",
      title: "Visa Documentation",
      badge: "Embassy Dossier",
      description:
        "Prepare a clearly presented flight itinerary or applicable reservation documentation for your visa application, according to the requirements of the relevant authority.",
      icon: FileCheck2,
      visualType: "document",
      highlight: "Recommended by consulates over non-refundable tickets",
    },
    {
      id: "onward-travel",
      title: "Onward Travel Requirements",
      badge: "Transit & Border",
      description:
        "Understand the flight documentation you may need when demonstrating onward travel. Always verify the applicable rules with your airline and destination authority.",
      icon: Plane,
      visualType: "route",
      highlight: "Satisfies airline carrier check-in verification",
    },
    {
      id: "travel-planning",
      title: "Corporate and Personal Travel Planning",
      badge: "Itinerary Coordination",
      description:
        "Organize route options, travel dates, and passenger information in a clear document before finalizing your travel arrangements.",
      icon: Compass,
      visualType: "planning",
      highlight: "Structure dates and transit schedules with precision",
    },
  ];

  return (
    <section id="use-cases" className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-Column Editorial Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-slate-100">
          {/* Left Column: Heading, description, and supporting narrative */}
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
              TRAVEL DOCUMENTATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight leading-tight">
              Dummy Ticket Use Cases
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Explore how flight itineraries and genuine temporary reservations may support visa documentation,
              onward-travel requirements, and travel planning. Requirements vary by destination and authority.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl pt-1">
              Whether you are submitting an official visa file to a consulate, presenting onward travel arrangements
              at airport transit check-in, or coordinating multi-city flight schedules with colleagues, structured
              documentation provides clarity, transparency, and confidence without financial exposure to
              non-refundable airline tickets.
            </p>
          </div>

          {/* Right Column: Polished 3D Minimalist Flight Globe Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm bg-[#F8FAFC] rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-lg group hover:shadow-xl transition-all duration-300">
              {/* Compact 3D Visual Rendering */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-100">
                <Image
                  src="/images/globe-flight-route-3d.jpg"
                  alt="Minimalist 3D render of sapphire blue globe with glowing flight trajectory and passenger airplane"
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-200/80 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="text-[10px] font-bold text-[#0B1F33]">
                    Global IATA Routes
                  </span>
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-xs border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span className="text-[10px] font-bold text-slate-700">
                      Verified Route Geometry
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1769E0] bg-[#E8F2FF] px-2 py-0.5 rounded">
                    40,000+ City Pairs
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3.5 text-center px-2">
                <div className="text-[11px] font-bold text-[#0B1F33]">
                  Precision Flight Trajectories
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Realistic transit routes formatted to airline industry specifications
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Visually Distinct Editorial Use-Case Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {useCases.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-7 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#1769E0] transition-all duration-200 hover:-translate-y-0.5 shadow-2xs hover:shadow-md"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-[#E8F2FF] border border-slate-200 group-hover:border-[#1769E0]/40 flex items-center justify-center text-[#1769E0] transition-colors shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  {/* Heading & Copy */}
                  <h3 className="text-lg font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Visual Graphic Representation */}
                  <div className="mt-5 p-3.5 bg-white rounded-xl border border-slate-200/70 text-xs">
                    {item.visualType === "document" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center space-x-1.5">
                            <Globe className="w-3.5 h-3.5 text-[#1769E0]" />
                            <span>Schengen &amp; UK Visa File</span>
                          </span>
                          <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                            Standard
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1 border-t border-slate-100">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Strict Date Matching · Clear Carrier</span>
                        </div>
                      </div>
                    )}

                    {item.visualType === "route" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#08A6F6]" />
                            <span>Outbound &amp; Return Transit</span>
                          </span>
                          <span className="text-[#1769E0] font-extrabold text-[10px] bg-[#E8F2FF] px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1 border-t border-slate-100">
                          <Plane className="w-3 h-3 text-slate-400" />
                          <span>Timatic Compliant · Airport Departure</span>
                        </div>
                      </div>
                    )}

                    {item.visualType === "planning" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-600" />
                            <span>Flexible Date Staging</span>
                          </span>
                          <span className="text-slate-600 font-extrabold text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                            Pre-Booking
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1 border-t border-slate-100">
                          <Compass className="w-3 h-3 text-slate-400" />
                          <span>Passenger Identification · Cabin Selection</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="truncate pr-2">{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Action Footer: Compact CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between p-6 bg-[#F5F7FA] rounded-2xl border border-slate-200/90 gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#0B1F33]">
              Need travel documentation for an upcoming embassy submission?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose between an instant Flight Itinerary Document or a Temporary Flight Reservation.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
