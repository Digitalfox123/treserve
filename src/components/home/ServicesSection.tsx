import React from "react";
import Link from "next/link";
import { Plane, Compass, Globe2, ArrowRight, Check, ShieldCheck } from "lucide-react";

export function ServicesSection() {
  const reservationServices = [
    {
      title: "Visa Application Flight Reservation",
      tag: "Embassy Compliant",
      tagColor: "bg-[#E8F2FF] text-[#1769E0] border-[#1769E0]/20",
      icon: ShieldCheck,
      iconBg: "bg-[#E8F2FF] text-[#1769E0]",
      description:
        "Official temporary flight reservation formatted strictly according to embassy and visa consulate requirements. Ideal for Schengen, US B1/B2, UK Standard Visitor, Canadian, and global visa appointments.",
      features: [
        "Verifiable airline flight schedule & timing",
        "Official A4 vector PDF document",
        "Unique internal booking reference & PNR hold",
        "Accepted for visa appointment interviews",
      ],
      price: "$35",
      ctaText: "Book Visa Reservation",
      href: "/create?type=visa",
    },
    {
      title: "Onward Travel & Return Reservation",
      tag: "Border & Check-in Proof",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
      icon: Plane,
      iconBg: "bg-emerald-50 text-emerald-600",
      description:
        "Instant onward travel reservation required by airlines and border control authorities before boarding visa-free or visa-on-arrival destinations across Southeast Asia, Europe, and the Americas.",
      features: [
        "Instant confirmation & document delivery",
        "Satisfies airline departure verification",
        "Direct airline carrier flight schedule",
        "Valid proof of onward travel / return journey",
      ],
      price: "$35",
      ctaText: "Book Onward Flight",
      href: "/create?type=onward",
    },
    {
      title: "Multi-City & Complex Route Reservation",
      tag: "Multi-Leg Journeys",
      tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: Globe2,
      iconBg: "bg-indigo-50 text-indigo-600",
      description:
        "Comprehensive flight reservation covering multiple stops, extended layovers, and complex itineraries across multiple international carriers for long-term travel and multi-country visa filings.",
      features: [
        "Up to 4 connected flight legs & stopovers",
        "Unified single PDF document layout",
        "Multiple international airline carriers supported",
        "Priority expedited document generation",
      ],
      price: "$50",
      ctaText: "Book Multi-City",
      href: "/create?tripType=multi-city",
    },
  ];

  return (
    <section id="services" className="pt-36 md:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
            RESERVATION SERVICES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-3">
            Verifiable Flight Reservations for Every Journey
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2 max-w-2xl leading-relaxed">
            Choose the temporary flight reservation package tailored to your visa application or onward travel compliance needs.
          </p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#1769E0] hover:text-[#1255B8] mt-4 sm:mt-0 transition-colors"
        >
          <span>View Pricing Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Flight Reservation Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reservationServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="treserve-card treserve-card-hover p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1769E0] to-[#08A6F6]" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${service.tagColor}`}>
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0B1F33]">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mt-2.5">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {service.features.map((feat) => (
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
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fixed Rate</span>
                  <div className="text-2xl font-black text-[#0B1F33]">{service.price}</div>
                </div>
                <Link
                  href={service.href}
                  className="inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
