import React from "react";
import Image from "next/image";
import { SearchPanel } from "./SearchPanel";
import { ShieldCheck, CheckCircle2, Headphones } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative w-full pt-12 pb-24 md:pb-28 lg:pb-32 bg-slate-900">
      {/* Background Hero Airplane Wing Photo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-wing.jpg"
          alt="Commercial airplane wing soaring gracefully above morning clouds"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center opacity-85"
        />
        {/* Soft gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F33]/90 via-[#0B1F33]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-transparent opacity-80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 md:pt-8 pb-16 md:pb-20">
          {/* Left Column: Heading, Copy, Trust Badges (7 cols) */}
          <div className="lg:col-span-8 space-y-5 text-white">
            {/* Eyebrow */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#08A6F6] text-[11px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08A6F6] animate-pulse" />
              <span>FLIGHT ITINERARIES · TEMPORARY RESERVATIONS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Your Journey, <br className="hidden sm:inline" />
              <span className="text-white">Clearly Planned.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
              Create professional flight itinerary documents and explore temporary reservation options
              through one simple, transparent process. Choose your route, enter your travel details,
              and receive a downloadable document once your order is complete.
            </p>

            {/* 3 Compact Trust Features */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-100">
              <div className="flex items-center space-x-2 bg-[#0B1F33]/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#08A6F6]" />
                <span>100% Secure Processing</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#0B1F33]/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#08A6F6]" />
                <span>Clear Reservation Status</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#0B1F33]/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                <Headphones className="w-4 h-4 text-[#08A6F6]" />
                <span>24/7 Dedicated Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating script tagline (4 cols) */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <div className="text-right pr-6">
              <div className="font-serif italic text-white/90 text-2xl lg:text-3xl drop-shadow-md">
                More than a ticket, <br />
                <span className="font-sans font-light tracking-wide text-white/95">a journey.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Main Itinerary Search Card */}
      <div className="-mb-32 md:-mb-36">
        <SearchPanel />
      </div>
    </div>
  );
}
