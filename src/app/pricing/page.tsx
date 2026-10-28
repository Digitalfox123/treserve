import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingComparisonSection } from "@/components/home/PricingComparisonSection";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0]">
              Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B1F33] tracking-tight mt-1.5">
              Simple, Predictable Rates
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
              No hidden subscriptions, no airline ticket markups. Pay only for the travel documentation you need.
            </p>
          </div>
        </div>

        <PricingComparisonSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MandatoryDisclaimer variant="card" className="mt-12" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
