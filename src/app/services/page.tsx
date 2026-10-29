import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { Plane, ShieldCheck, Globe2, Check, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      badge: "Service 01 · Visa Appointment Proof",
      title: "Visa Application Flight Reservation",
      description:
        "Official held flight reservation formatted strictly according to embassy and consulate guidelines. Complete with airline schedule, verified flight numbers, passenger names, and unique PNR booking reference. Accepted worldwide for Schengen, US, UK, Canada, Australia, and Asian visa applications.",
      features: [
        "Verifiable airline reservation schedule and PNR code",
        "Official A4 vector PDF format ready for embassy submission",
        "Accepted for visa interview appointments and VFS/TLS filings",
        "14–21 day active reservation hold coverage",
        "Instant delivery upon booking confirmation",
      ],
      price: "$35",
      cta: "Find Flights & Book",
      href: "/search?service=visa&from=LHE&to=DXB&departureDate=2026-11-24",
    },
    {
      badge: "Service 02 · Airport Check-in & Border Control",
      title: "Onward Travel & Return Flight Reservation",
      description:
        "Instant proof of return or onward travel required by international airlines, immigration officers, and digital nomad destinations before boarding. Perfect for visa-free entry, visa-on-arrival countries, and onward travel compliance without buying expensive open-ended airline tickets.",
      features: [
        "Instant PDF delivery for immediate airport presentation",
        "Satisfies strict airline counter check-in requirements",
        "Live international carrier flight routing and timings",
        "Covers one-way and return onward flight journeys",
        "Full passenger details matching your travel passport",
      ],
      price: "$35",
      cta: "Find Flights & Book",
      href: "/search?service=onward&from=LHE&to=DXB&departureDate=2026-11-24",
    },
    {
      badge: "Service 03 · Complex & Multi-Destination Itineraries",
      title: "Multi-City & Complex Route Reservation",
      description:
        "Structured flight reservation holds for travelers visiting multiple countries, managing multi-leg layovers, or presenting round-the-world travel documentation. Up to 4 connected flight segments with coordinated arrival and departure dates.",
      features: [
        "Up to 4 connected international flight legs",
        "Unified single PDF document layout for clear embassy review",
        "Compatible with multiple international airline carriers",
        "Priority expedited processing and verification",
        "Ideal for Schengen multi-state travel visas",
      ],
      price: "$50",
      cta: "Find Flights & Book",
      href: "/search?service=multicity&from=LHE&to=DXB&departureDate=2026-11-24&tripType=multi-city",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
              VERIFIED FLIGHT RESERVATIONS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B1F33] tracking-tight mt-3">
              Legitimate Flight Reservation Services
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Treserve specializes exclusively in verified temporary flight reservations for visa applications,
              embassy appointments, and proof of onward travel worldwide.
            </p>
          </div>

          {/* Service Cards */}
          <div className="space-y-10">
            {services.map((srv, idx) => (
              <div
                key={srv.title}
                className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8F2FF] text-[#1769E0] text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{srv.badge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33]">
                    {srv.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                    {srv.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {srv.features.map((item) => (
                      <div key={item} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Fixed Reservation Fee
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#0B1F33] mt-0.5">
                      {srv.price}
                      <span className="text-xs font-semibold text-slate-400"> / person</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      No hidden charges · Instant A4 PDF
                    </div>
                  </div>

                  <Link
                    href={srv.href}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <MandatoryDisclaimer variant="card" className="mt-14" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
