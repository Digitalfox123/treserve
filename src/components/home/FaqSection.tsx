"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, HelpCircle } from "lucide-react";
import { LogoMark } from "../brand/Logo";

export const FAQS_LIST = [
  {
    q: "What is a temporary flight reservation?",
    a: "A temporary flight reservation is a genuine flight booking held through authorized airline Global Distribution Systems (GDS) with a valid 6-character PNR code. It proves your planned travel dates and route to embassies and consulates without requiring you to purchase expensive non-refundable airline tickets before your visa is granted.",
  },
  {
    q: "Is this flight reservation accepted by embassies for visa applications?",
    a: "Yes! Embassies and consulates worldwide (including Schengen countries, US, UK, Canada, Australia, Japan, and more) explicitly recommend in their visa guidelines that applicants should NOT buy actual airline tickets until their visa is approved. They require a valid flight reservation with confirmed airline flight numbers and passenger names.",
  },
  {
    q: "Do I need to create an account or sign up to book?",
    a: "No! There is zero sign-up or login required. You can search live flights, enter your passenger passport details, complete payment, and instantly download your print-ready A4 PDF reservation. You can retrieve it anytime using our 'Find Booking' tool with your reference number.",
  },
  {
    q: "Can the embassy or airline verify this reservation?",
    a: "Yes. Every reservation includes a valid PNR (Passenger Name Record) reference code and ticket hold indicator that aligns with live airline schedules.",
  },
  {
    q: "Is a temporary flight reservation an actual flight ticket for boarding?",
    a: "No. A temporary flight reservation is strictly issued for visa application and proof of onward travel documentation. It is NOT a ticket and does NOT grant boarding passes. Once your visa is approved, you should purchase confirmed airline tickets for your actual travel.",
  },
  {
    q: "How long does the flight reservation stay valid?",
    a: "Our flight reservations remain active and valid for 48 hours to 14 days depending on the selected package (Standard, Priority, or Multi-City), providing ample time for embassy appointments and consular review.",
  },
  {
    q: "How do I download my reservation PDF?",
    a: "Immediately upon completing payment, your official A4 PDF document is generated and unlocked for instant download. You will also receive the reference number to re-download anytime via the 'Find Booking' page.",
  },
  {
    q: "Does Treserve guarantee visa approval?",
    a: "No company can guarantee visa approval, as visa decisions are made entirely by consular officers based on your full application profile. However, our flight reservations strictly adhere to the exact format requested by embassies worldwide.",
  },
  {
    q: "Can I book for multiple passengers or multi-city routes?",
    a: "Yes! You can add multiple passengers (adults, children, infants) and book one-way, return, or complex multi-city routes across international airlines.",
  },
  {
    q: "How can I contact customer support if I have questions?",
    a: "Our customer support team is available 24/7. You can reach out through our Contact page or email us anytime for immediate assistance with your booking.",
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
