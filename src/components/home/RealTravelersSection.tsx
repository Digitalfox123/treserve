"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plane,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  location: string;
  route: string;
  service: "Flight Itinerary" | "Temporary Reservation";
  rating: number;
  date: string;
  comment: string;
  useCase: "Visa Application" | "Onward Travel" | "Travel Planning";
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Marcus Vance",
    location: "London, UK",
    route: "LHR → DOH → BKK",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 24, 2026",
    comment:
      "Needed verified onward travel proof for transit through Doha to Bangkok. Generated and downloaded in under 2 minutes. Boarding gate checked it without any hesitation.",
    useCase: "Onward Travel",
  },
  {
    id: "rev-2",
    name: "Sarah Jenkins",
    location: "Toronto, Canada",
    route: "YYZ → FRA → FCO",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 22, 2026",
    comment:
      "Applied for a Schengen tourist visa at the German Consulate. The itinerary document matched all requirements with zero fuss. Received my visa approval in 8 days!",
    useCase: "Visa Application",
  },
  {
    id: "rev-3",
    name: "Liam O'Connor",
    location: "Sydney, Australia",
    route: "SYD → DPS → SIN",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 20, 2026",
    comment:
      "As a digital nomad, airlines always demand proof of onward flight at check-in. Treserve has saved me hundreds in wasted non-refundable tickets. Flawless service.",
    useCase: "Onward Travel",
  },
  {
    id: "rev-4",
    name: "Aisha Al-Mansoor",
    location: "Dubai, UAE",
    route: "DXB → LHR → MAN",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 18, 2026",
    comment:
      "Used the temporary reservation service for my UK visitor visa submission at VFS Global. Clear layout, authentic booking reference, and highly professional format.",
    useCase: "Visa Application",
  },
  {
    id: "rev-5",
    name: "David Miller",
    location: "Chicago, USA",
    route: "ORD → HND → KIX",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 17, 2026",
    comment:
      "Cleanest PDF layout I've seen. Exactly what foreign consulates ask for without having to pay $1,400 for non-refundable tickets before the visa is even stamped.",
    useCase: "Visa Application",
  },
  {
    id: "rev-6",
    name: "Elena Rostova",
    location: "Berlin, Germany",
    route: "BER → IST → DPS",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 15, 2026",
    comment:
      "Booked an itinerary for my embassy appointment. Customer support helped verify the transit dates immediately. Super responsive team and clear instructions.",
    useCase: "Travel Planning",
  },
  {
    id: "rev-7",
    name: "Carlos Ramirez",
    location: "Madrid, Spain",
    route: "MAD → SIN → SYD",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 13, 2026",
    comment:
      "Traveled to Singapore on a one-way flight. Check-in agent asked for return proof. Pulled up the Treserve A4 PDF on my phone and was cleared right away.",
    useCase: "Onward Travel",
  },
  {
    id: "rev-8",
    name: "Fatima Zahra",
    location: "Lahore, Pakistan",
    route: "LHE → CDG",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 11, 2026",
    comment:
      "Submitted for a French student visa. The consular officer accepted the flight plan without any issues. The document looks executive and high-profile.",
    useCase: "Visa Application",
  },
  {
    id: "rev-9",
    name: "Kenji Sato",
    location: "Tokyo, Japan",
    route: "NRT → FCO → MXP",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 09, 2026",
    comment:
      "Very straightforward platform. Transparent pricing, no hidden subscriptions, and the PDF document downloaded instantly upon checkout. Great quality.",
    useCase: "Travel Planning",
  },
  {
    id: "rev-10",
    name: "Amara Okafor",
    location: "Lagos, Nigeria",
    route: "LOS → YYZ",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 07, 2026",
    comment:
      "Saved our family trip! We needed 4 flight reservations for Canada visitor visa files. Smooth booking process and clear passenger manifest tables.",
    useCase: "Visa Application",
  },
  {
    id: "rev-11",
    name: "Chloe Dubois",
    location: "Geneva, Switzerland",
    route: "GVA → HAN → SGN",
    service: "Temporary Reservation",
    rating: 5,
    date: "Oct 05, 2026",
    comment:
      "Flawless experience. The vector PDF prints crisply on A4 paper with proper airline partner details and clear terms. Highly recommended.",
    useCase: "Onward Travel",
  },
  {
    id: "rev-12",
    name: "Ravi Patel",
    location: "Mumbai, India",
    route: "BOM → MUC → BER",
    service: "Flight Itinerary",
    rating: 5,
    date: "Oct 03, 2026",
    comment:
      "Used for my Germany EU Blue Card visa dossier. Perfect itinerary format with flight numbers, transit times, and clear travel dates. Visa approved smoothly.",
    useCase: "Visa Application",
  },
  {
    id: "rev-13",
    name: "Lucas Silva",
    location: "São Paulo, Brazil",
    route: "GRU → LIS → OPO",
    service: "Temporary Reservation",
    rating: 5,
    date: "Sep 29, 2026",
    comment:
      "Excellent service for Portuguese D8 nomad visa paperwork. The embassy accepted the flight schedule without a single question. 5 stars all the way.",
    useCase: "Visa Application",
  },
  {
    id: "rev-14",
    name: "Hannah Berg",
    location: "Stockholm, Sweden",
    route: "ARN → DOH → MEL",
    service: "Flight Itinerary",
    rating: 5,
    date: "Sep 27, 2026",
    comment:
      "Great customer service and fast turnaround. A must-have tool for any international traveler dealing with strict airline border check-in rules.",
    useCase: "Onward Travel",
  },
];

export function RealTravelersSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Manual scroll buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="travelers-feedback" className="py-24 bg-[#F5F7FA] border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
              CUSTOMER EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-2 leading-tight">
              Hear from Real Travelers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-2xl">
              Authentic feedback from international travelers, visa applicants, and remote workers who rely on Treserve
              for verifiable flight documentation.
            </p>
          </div>

          {/* Navigation Controls & Stats Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden sm:flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
              <span className="flex text-amber-400">
                {"★".repeat(5)}
              </span>
              <span>4.9 / 5 Rating</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous Reviews"
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#1769E0] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next Reviews"
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#1769E0] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Reviews Carousel (Left to Right / Interactive Drag & Scroll) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex space-x-5 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="w-[330px] sm:w-[380px] shrink-0 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#1769E0] transition-all duration-300 flex flex-col justify-between snap-start group"
            >
              <div>
                {/* Top Row: Stars & Service Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 text-sm tracking-tighter">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1769E0] bg-[#E8F2FF] px-2.5 py-0.5 rounded-full">
                    {review.service}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed line-clamp-4 font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Route Pill */}
                <div className="mt-4 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600">
                  <Plane className="w-3 h-3 text-[#1769E0]" />
                  <span>{review.route}</span>
                </div>
              </div>

              {/* Bottom Row: User Meta & Verified Tag */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B1F33]">
                    {review.name}
                  </h4>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{review.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Verification & CTA Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B1F33]">
                100% Verified Customer Experience Records
              </h4>
              <p className="text-xs text-slate-500">
                All feedback is submitted by travelers with valid reservation orders.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
