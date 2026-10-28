import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-[#0B1F33]">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>

            <MandatoryDisclaimer variant="inline" />

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h2 className="text-base font-bold text-[#0B1F33]">1. Nature of the Service</h2>
              <p>
                Treserve (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;platform&rdquo;) provides flight itinerary documents
                and temporary flight reservation records intended exclusively for visa applications, travel route
                clarification, and pre-booking planning.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">2. No Actual Flight Ticket Issuance</h2>
              <p>
                Treserve is NOT an airline ticketing carrier. Our services do not issue official airline e-tickets,
                confirmed airline passenger tickets, or boarding passes. Documents obtained from Treserve cannot be used
                to check in at any airport or board any flight.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">3. No Visa Guarantee</h2>
              <p>
                The issuance of a flight itinerary or temporary reservation document does not guarantee visa approval.
                Decisions regarding immigration permits or entry visas are determined solely by government embassies and
                consular officials.
              </p>

              <h2 className="text-base font-bold text-[#0B1F33]">4. Development & Testing Simulation</h2>
              <p>
                In the current development release, all payment interactions occur in a simulated test environment.
                No real financial card charges are processed.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
