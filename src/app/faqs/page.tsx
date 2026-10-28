"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FAQS_LIST } from "@/components/home/FaqSection";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { Search, Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";

export default function FaqsPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS_LIST.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Help & Information
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33] tracking-tight mt-1.5">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Find detailed explanations regarding itinerary documents, temporary reservations, and test mode.
            </p>

            {/* Search Input */}
            <div className="mt-6 relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g. visa, payment, ticket)..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold shadow-xs outline-none focus:border-[#1769E0]"
              />
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm divide-y divide-slate-200 mb-12">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching questions found for &ldquo;{search}&rdquo;.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between group focus:outline-none"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors pr-4">
                        {faq.q}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#E8F2FF] flex items-center justify-center text-slate-600 group-hover:text-[#1769E0] shrink-0 transition-colors">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pr-6">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Need More Assistance Card */}
          <div className="bg-[#E8F2FF] rounded-2xl p-6 border border-[#1769E0]/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#1769E0] flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B1F33]">Still have questions?</h4>
                <p className="text-xs text-slate-600">Our customer support specialists are available 24/7.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Contact Support
            </Link>
          </div>

          <MandatoryDisclaimer variant="card" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
