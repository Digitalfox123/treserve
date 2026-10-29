"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react";

export function PricingComparisonSection() {
  const plans = [
    {
      name: "Standard Reservation",
      tag: "Best for Routine Visas",
      tagColor: "bg-[#E8F2FF] text-[#1769E0]",
      price: "$35",
      period: "per person",
      description: "Standard embassy-compliant flight reservation hold for visa appointments scheduled within 2 to 3 weeks.",
      delivery: "Within 6–12 Hours",
      holdDuration: "14–21 Days Hold",
      highlight: false,
      cta: "Book Standard Hold",
      href: "/create?plan=standard",
    },
    {
      name: "Express Priority Reservation",
      tag: "Most Popular · Urgent",
      tagColor: "bg-emerald-500 text-white",
      price: "$49",
      period: "per person",
      description: "Immediate expedited flight reservation for urgent visa appointments, next-day embassy interviews, or last-minute airport boarding.",
      delivery: "Instant / Under 60 Mins",
      holdDuration: "Up to 21 Days Hold",
      highlight: true,
      cta: "Book Express Hold",
      href: "/create?plan=express",
    },
    {
      name: "Multi-City & Return Package",
      tag: "Complex Itineraries",
      tagColor: "bg-indigo-50 text-indigo-700",
      price: "$65",
      period: "per person",
      description: "Multi-leg reservation covering up to 4 interconnected flights for digital nomads, round-the-world trips, and Schengen multi-state visas.",
      delivery: "Priority Expedited",
      holdDuration: "Up to 30 Days Hold",
      highlight: false,
      cta: "Book Multi-City Hold",
      href: "/create?plan=multi-city",
    },
  ];

  const features = [
    { name: "Verifiable Airline Flight Number & Schedule", std: true, exp: true, mc: true },
    { name: "Unique PNR Reservation Reference Code", std: true, exp: true, mc: true },
    { name: "Embassy & Consulate Compliant A4 PDF", std: true, exp: true, mc: true },
    { name: "Mandatory Visa Compliance Disclaimer", std: true, exp: true, mc: true },
    { name: "Instant Download Without Registration", std: true, exp: true, mc: true },
    { name: "Priority Queue Processing", std: false, exp: true, mc: true },
    { name: "Up to 4 Connected Flight Legs", std: false, exp: false, mc: true },
    { name: "Free Route Revision / Rebooking Assistance", std: false, exp: true, mc: true },
    { name: "24/7 Dedicated Traveler Support", std: true, exp: true, mc: true },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
            TRANSPARENT RESERVATION PRICING
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-3">
            Simple, Fixed Rates for Verifiable Flight Holds
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2 leading-relaxed">
            Zero surprise airline cancellation penalties. Pay a single fixed fee for legitimate flight reservation documentation.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                p.highlight
                  ? "bg-white border-2 border-[#1769E0] shadow-xl relative scale-[1.02]"
                  : "bg-white border border-slate-200/90 shadow-sm hover:shadow-md"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1769E0] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-xs">
                  RECOMMENDED
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.tagColor}`}>
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B1F33]">{p.name}</h3>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">{p.description}</p>

                <div className="mt-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-[#0B1F33]">{p.price}</span>
                    <span className="text-xs font-semibold text-slate-400 ml-1.5">{p.period}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600 mt-2">
                    <span className="flex items-center space-x-1 text-[#1769E0]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{p.delivery}</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700">{p.holdDuration}</span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included with this plan:
                  </div>
                  <ul className="space-y-2.5">
                    {features.slice(0, 5).map((f) => (
                      <li key={f.name} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#1769E0] shrink-0" />
                        <span>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={p.href}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                    p.highlight
                      ? "bg-[#1769E0] hover:bg-[#1255B8] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-[#0B1F33]"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#0B1F33]">Detailed Plan Feature Comparison</h3>
            <p className="text-xs text-slate-500 mt-1">
              Compare specifications and document parameters across all flight reservation packages.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-bold">Feature / Specification</th>
                  <th className="py-4 px-6 text-center font-bold">Standard ($35)</th>
                  <th className="py-4 px-6 text-center font-bold text-[#1769E0]">Express ($49)</th>
                  <th className="py-4 px-6 text-center font-bold">Multi-City ($65)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{row.name}</td>
                    <td className="py-3.5 px-6 text-center">
                      {row.std ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-blue-50/20">
                      {row.exp ? (
                        <Check className="w-4 h-4 text-[#1769E0] mx-auto font-bold" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {row.mc ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
