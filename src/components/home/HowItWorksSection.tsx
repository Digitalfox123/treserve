import React from "react";
import Link from "next/link";
import { FileText, Plane, CreditCard, Download, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Select Flight Route",
      description: "Enter your departure, destination airports, and travel dates to select matching scheduled airline flights.",
      icon: Plane,
    },
    {
      number: "2",
      title: "Passenger Information",
      description: "Provide passenger names matching passport documents for strict embassy & consulate compliance.",
      icon: FileText,
    },
    {
      number: "3",
      title: "Fast Checkout — No Sign Up",
      description: "Complete checkout securely in seconds. No account creation or password required.",
      icon: CreditCard,
    },
    {
      number: "4",
      title: "Instant Verifiable PDF",
      description: "Immediately download your print-ready A4 reservation PDF with genuine airline PNR booking code.",
      icon: Download,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight mt-1">
              Get your flight reservation in 4 simple steps
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Zero registration overhead. Fast, verified embassy flight reservations in minutes.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769E0] hover:text-[#1255B8] mt-4 sm:mt-0 transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Steps with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center relative group">
                {/* Connecting arrow for desktop between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[62%] w-[76%] h-0.5 border-t-2 border-dashed border-[#1769E0]/30 -z-0" />
                )}

                {/* Circular Icon Container */}
                <div className="w-20 h-20 rounded-full bg-[#E8F2FF] border-2 border-white shadow-md flex items-center justify-center text-[#1769E0] relative z-10 transition-transform group-hover:scale-105">
                  <Icon className="w-8 h-8" />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1769E0] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-[#0B1F33]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
