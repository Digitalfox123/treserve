"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TRAVEL_GUIDES } from "@/lib/guides";
import { ArrowRight, Clock, Calendar, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

export function TravelGuidesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="travel-guides" className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
              TRAVEL KNOWLEDGE &amp; BLOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight mt-2 leading-tight">
              Dummy Ticket &amp; Visa Travel Guides
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-2xl">
              Practical guides about flight itineraries, temporary reservations, onward travel rules, and embassy documentation practices.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/guides"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#1769E0] hover:text-[#1255B8] mr-2 transition-colors"
            >
              <span>View All Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Left and Right Scroll Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll Guides Left"
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#E8F2FF] border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#1769E0] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll Guides Right"
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#E8F2FF] border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#1769E0] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Rounded Cards Carousel (Left to Right) */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TRAVEL_GUIDES.map((guide) => (
            <div
              key={guide.slug}
              className="w-[320px] sm:w-[380px] shrink-0 bg-[#F8FAFC] hover:bg-white rounded-3xl border border-slate-200/90 hover:border-[#1769E0] overflow-hidden transition-all duration-300 hover:shadow-xl shadow-xs flex flex-col justify-between snap-start group"
            >
              <div>
                {/* 16:9 Image with Rounded Top & Category Badge */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1769E0] bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
                      {guide.category}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
                      <span>{guide.readTime}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{guide.publishedDate}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors leading-snug line-clamp-2">
                    {guide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                    {guide.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1769E0] group-hover:text-[#1255B8]"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Visa Prep
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
