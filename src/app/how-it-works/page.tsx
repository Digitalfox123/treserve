import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { FileText, Plane, CreditCard, Download, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works — Fast, Verifiable Flight Reservations | Treserve",
  description:
    "Learn how Treserve creates verified flight reservations and PNR codes for embassy visa applications in 3 simple steps.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  const detailedSteps = [
    {
      num: "01",
      title: "Select Flight Route & Dates",
      icon: Plane,
      description:
        "We provide a dedicated Visa Application Flight Reservation service for a single flat rate of $10 USD. Enter your departure city, destination airport, and travel dates.",
      details: [
        "Single transparent $10 USD flat rate with no recurring fees",
        "Official held flight reservation formatted strictly for visa submissions",
        "Direct live schedule lookup with major international airlines",
      ],
    },
    {
      num: "02",
      title: "Enter Journey & Traveler Information",
      icon: Plane,
      description:
        "Add your departure airport, arrival destination, travel dates, trip type (one-way or return), cabin class, and traveler legal names.",
      details: [
        "International airport lookup with IATA codes",
        "Support for individual travelers or group families up to 9 passengers",
        "Strict privacy: no unnecessary passport numbers collected",
      ],
    },
    {
      num: "03",
      title: "Complete Test Checkout Simulation",
      icon: CreditCard,
      description:
        "Review your order summary and use our built-in test payment simulator. No real money or actual card numbers will ever be charged.",
      details: [
        "Clear TEST MODE banner throughout checkout",
        "Simulate both successful transactions and decline scenarios",
        "Server-side verification preventing duplicate or invalid orders",
      ],
    },
    {
      num: "04",
      title: "Download Unlocked Print-Ready PDF",
      icon: Download,
      description:
        "Once payment simulation completes, your high-resolution A4 vector PDF is automatically generated and unlocked for instant download.",
      details: [
        "Exact A4 portrait dimensions (210 × 297 mm) with print margins",
        "Selectable vector typography and official Treserve branding",
        "Permanent access anytime inside your Customer Dashboard",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Step-by-Step Guide
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33] tracking-tight mt-1.5">
              How Treserve Works
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
              From choosing your route to receiving your unlocked A4 travel document in under 5 minutes.
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {detailedSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center shrink-0 font-black text-xl">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#1769E0] bg-[#E8F2FF] px-2 py-0.5 rounded">
                        STEP {step.num}
                      </span>
                      <h3 className="text-xl font-bold text-[#0B1F33]">{step.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {step.details.map((d) => (
                        <li key={d} className="text-xs text-slate-500 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0B1F33] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-bold">Ready to plan your journey?</h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Create a professional itinerary document in just a few clicks.
              </p>
            </div>
            <Link
              href="/create"
              className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <MandatoryDisclaimer variant="card" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
