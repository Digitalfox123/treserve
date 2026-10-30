import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy & Data Policy | Treserve",
  description:
    "Learn how Treserve protects your booking details and personal data under international data protection laws.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-[#0B1F33]">Privacy & Data Policy</h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h2 className="text-base font-bold text-[#0B1F33]">1. Information We Collect</h2>
              <p>
                We collect only the essential personal details required to accurately prepare your travel document:
                passenger first and last names, delivery email address, and itinerary route specifications. We deliberately
                do NOT ask for passport numbers or national ID numbers for standard itinerary issuance.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">2. How We Protect Your Documents</h2>
              <p>
                Generated documents are stored with private access control. Final PDF downloads require verified server-side
                authorization and payment confirmation. Download URLs are never made publicly guessable or indexable by search
                engines.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">3. Payment Data Security</h2>
              <p>
                In the development test mode, no real payment card data is ever collected or processed. During live operations,
                all card transactions are tokenized via PCI-DSS compliant payment gateways.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
