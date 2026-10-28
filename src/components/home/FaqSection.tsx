"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, HelpCircle } from "lucide-react";
import { LogoMark } from "../brand/Logo";

export const FAQS_LIST = [
  {
    q: "What is a flight itinerary document?",
    a: "A flight itinerary document is a professionally formatted travel plan containing verified route details, departure and arrival times, flight numbers, airline carrier names, and passenger information. It is commonly used for visa applications, travel leave approval, and personal itinerary planning.",
  },
  {
    q: "What is a temporary flight reservation?",
    a: "A temporary flight reservation is a held reservation request arranged through authorized travel supplier networks. It provides travel route documentation reflecting the actual supplier-derived status for visa evaluation purposes without committing to a full non-refundable ticket purchase.",
  },
  {
    q: "Is a temporary reservation an actual flight ticket?",
    a: "No. A temporary reservation is NOT an actual airline ticket and does NOT issue an airline boarding pass or e-ticket receipt. It serves as proof of intended travel for visa processing and itinerary planning only.",
  },
  {
    q: "Is the reservation valid for boarding an aircraft?",
    a: "No, absolutely not. Neither a flight itinerary document nor a temporary reservation is valid for airport check-in or boarding. You cannot board any flight without purchasing an official, confirmed airline ticket directly from airlines or authorized ticketing agents.",
  },
  {
    q: "Does Treserve guarantee visa approval?",
    a: "No platform can guarantee visa approval. Visa decisions are made solely by the respective embassy, consulate, or immigration authority based on your complete application profile, financial standing, and documentation.",
  },
  {
    q: "How do I download my PDF document?",
    a: "Once you create your order and complete the test checkout simulation, your print-ready A4 PDF is immediately unlocked. You can download it directly from your order confirmation screen or access it anytime in your Customer Dashboard.",
  },
  {
    q: "How does the test payment process work?",
    a: "In this development and testing release, all payments run through our controlled test payment simulator. No real money or actual credit cards are ever charged. You can simulate both successful transactions and test declines to experience the complete platform workflow safely.",
  },
  {
    q: "Can I view my previous orders and documents?",
    a: "Yes. All created orders and unlocked PDF documents are safely preserved and accessible through your Customer Dashboard. You can look up orders by your internal Treserve reference number anytime.",
  },
  {
    q: "What happens if my simulated test payment fails?",
    a: "If a test payment simulation fails or is declined, your order details and itinerary remain completely intact. The document remains locked, and you can retry the simulated payment at any time with a single click.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can submit a support ticket directly through our Contact page or your Customer Dashboard. Our support team is available 24/7 to answer questions regarding your orders, itinerary details, or documentation requirements.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight mt-1">
              Quick answers to common questions
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Clear, transparent information about our documentation services and testing mode.
            </p>
          </div>
          <Link
            href="/faqs"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769E0] hover:text-[#1255B8] mt-4 sm:mt-0 transition-colors"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: 10 FAQs Accordion (8 cols) */}
          <div className="lg:col-span-8 divide-y divide-slate-200 border-y border-slate-200">
            {FAQS_LIST.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex items-center justify-between py-1 group focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors pr-4">
                      {faq.q}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#E8F2FF] flex items-center justify-center text-slate-600 group-hover:text-[#1769E0] shrink-0 transition-colors">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-2.5 pr-8 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Support Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-[#E8F2FF]/60 border border-[#1769E0]/20 rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center">
                <LogoMark className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1F33]">
                Need More Help?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our support team is available 24/7 to assist you with order status, itinerary questions,
                or embassy documentation requirements.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
