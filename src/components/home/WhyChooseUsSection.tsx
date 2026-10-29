import React from "react";
import Image from "next/image";
import { ShieldCheck, Globe, Calendar, Zap, Headphones } from "lucide-react";

export function WhyChooseUsSection() {
  const benefits = [
    {
      title: "Secure & Trusted",
      description: "Data privacy and transparent processing standards designed to protect your personal travel records.",
      icon: ShieldCheck,
    },
    {
      title: "Global Coverage",
      description: "Comprehensive airport codes and international routing for global destinations and consulates worldwide.",
      icon: Globe,
    },
    {
      title: "Flexible Options",
      description: "Tailor your itinerary, dates, cabin class, and passenger details to match your visa requirements.",
      icon: Calendar,
    },
    {
      title: "Instant PDF & PNR Access",
      description: "Download your professionally typeset vector A4 PDF immediately upon payment completion without needing an account.",
      icon: Zap,
    },
    {
      title: "Dedicated Support",
      description: "Accessible assistance and dedicated support to guide you through your flight reservation and visa requirements.",
      icon: Headphones,
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Airplane Window Image Card (5.5 cols) */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-4/3 sm:aspect-16/11">
            <Image
              src="/images/cabin-window.jpg"
              alt="Passenger cabin window view overlooking clouds and airplane wing"
              fill
              className="object-cover"
            />
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/85 via-transparent to-transparent" />

            {/* Content overlay on the window image */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#08A6F6] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                Peace of Mind
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-tight">
                Flight Reservations, Simplified
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md">
                We make flight reservations simple, secure, and stress-free for visa applicants and travelers worldwide.
              </p>

              {/* Verified Trust Pillars */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-center">
                <div>
                  <div className="text-sm font-extrabold text-white">100%</div>
                  <div className="text-[10px] text-slate-300">Embassy Verified</div>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">A4 Vector</div>
                  <div className="text-[10px] text-slate-300">Print Ready PDF</div>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">24/7</div>
                  <div className="text-[10px] text-slate-300">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Why Choose Treserve Benefits (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Why Choose Treserve?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight mt-1">
              Built on transparency, precision, and trust
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              We focus specifically on verifiable temporary flight reservations with live airline PNR codes,
              giving you reliable documentation without buying expensive non-refundable air tickets.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1F33]">{b.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
