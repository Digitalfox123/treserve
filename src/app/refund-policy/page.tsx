import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Treserve",
  description:
    "Review our transparent refund and cancellation guidelines for temporary flight reservations.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-[#0B1F33]">Refund & Cancellation Policy</h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h2 className="text-base font-bold text-[#0B1F33]">1. Document Preparation Service</h2>
              <p>
                Our service delivers digital itinerary documents and temporary reservations. Once an unlocked document
                is prepared and downloaded, the digital service has been fulfilled.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">2. Test Mode Simulations</h2>
              <p>
                In test mode, all payments are simulated and no real financial currency has been transferred. Therefore,
                no actual credit card reversals or monetary refunds apply to simulation orders.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">3. Document Corrections</h2>
              <p>
                If an error occurs in passenger name spelling or travel date formatting due to a platform typographical fault,
                our support desk will gladly reissue the corrected document free of charge upon request.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
