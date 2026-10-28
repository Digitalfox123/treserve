import React from "react";
import Link from "next/link";
import { FileText, Plane, CreditCard, Download, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Choose Your Service",
      description: "Select a flight itinerary document or temporary reservation based on your visa needs.",
      icon: FileText,
    },
    {
      number: "2",
      title: "Enter Journey Details",
      description: "Add origin, destination, travel dates, passenger information, and cabin preference.",
      icon: Plane,
    },
    {
      number: "3",
      title: "Complete Test Checkout",
      description: "Review order details and simulate payment in test mode. No real money will be charged.",
      icon: CreditCard,
    },
    {
      number: "4",
      title: "Download Your Document",
      description: "Instantly unlock and download your print-ready A4 PDF document directly from your dashboard.",
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
              Get your travel document in 4 simple steps
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              A transparent, streamlined workflow designed for peace of mind.
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
