import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { DummyTicketUseCasesSection } from "@/components/home/DummyTicketUseCasesSection";
import { SampleFlightItinerarySection } from "@/components/home/SampleFlightItinerarySection";
import { VisaRequirementGuideSection } from "@/components/home/VisaRequirementGuideSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { RealTravelersSection } from "@/components/home/RealTravelersSection";
import { PricingComparisonSection } from "@/components/home/PricingComparisonSection";
import { TravelGuidesSection } from "@/components/home/TravelGuidesSection";
import { FaqSection } from "@/components/home/FaqSection";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* 1. Existing header */}
      <Header />

      <main className="flex-1">
        {/* 2. Existing hero and flight-search interface */}
        <HeroSection />

        {/* 3. Existing services section */}
        <ServicesSection />

        {/* 4. Existing How It Works section */}
        <HowItWorksSection />

        {/* 5. NEW SECTION 1: Dummy Ticket Use Cases */}
        <DummyTicketUseCasesSection />

        {/* 6. NEW SECTION 2: Sample Flight Itinerary with Interactive Modal Preview */}
        <SampleFlightItinerarySection />

        {/* 7. NEW SECTION 3: Do You Need to Buy a Flight Ticket Before Visa Approval? */}
        <VisaRequirementGuideSection />

        {/* 8. Existing Why Choose Treserve? section */}
        <WhyChooseUsSection />

        {/* 9. NEW SECTION 4: Hear from Real Travelers (Authentic Feedback & Community Pledge) */}
        <RealTravelersSection />

        {/* 10. Existing Service Comparison & Pricing */}
        <PricingComparisonSection />

        {/* 11. NEW SECTION 5: Dummy Ticket & Visa Travel Guides */}
        <TravelGuidesSection />

        {/* 12. Existing FAQs */}
        <FaqSection />

        {/* 13. Existing Prominent Mandatory Disclaimer Banner */}
        <MandatoryDisclaimer variant="card" />
      </main>

      {/* 14. Existing Footer */}
      <Footer />
    </div>
  );
}
