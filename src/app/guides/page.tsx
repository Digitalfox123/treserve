import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllGuides } from "@/lib/guides";
import { Clock, Calendar, ArrowRight, BookOpen, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Travel & Visa Documentation Guides | Treserve",
  description:
    "Comprehensive, practical guides about flight itineraries, temporary reservations, onward travel regulations, and embassy documentation practices.",
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1">
        {/* Header Hero Banner */}
        <section className="bg-white border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full mb-3">
                KNOWLEDGE BASE & GUIDES
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-[#0B1F33] tracking-tight leading-tight">
                Travel Documentation & Visa Guides
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
                Objective, well-researched guides to help you navigate flight itinerary requirements,
                temporary reservations, onward-travel protocols, and embassy documentation rules.
              </p>
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <article
                key={guide.slug}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#1769E0] transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1769E0] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
                      {guide.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
                        <span>{guide.readTime}</span>
                      </span>
                      <span>·</span>
                      <span>{guide.publishedDate}</span>
                    </div>

                    <h2 className="text-lg font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors leading-snug">
                      <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {guide.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769E0] group-hover:text-[#1255B8]"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Consular Disclaimer Box */}
          <div className="mt-16 p-6 sm:p-8 bg-[#E8F2FF]/60 border border-[#1769E0]/20 rounded-2xl flex items-start space-x-4">
            <ShieldAlert className="w-6 h-6 text-[#1769E0] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0B1F33]">
                Important Regulatory Notice
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Treserve editorial guides are provided for educational and informational planning purposes only.
                Visa policies and onward travel mandates are subject to change at the sole discretion of the
                respective embassies, immigration departments, and airlines. Always check official consular guidelines
                for your specific nationality and destination prior to lodging an application.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
