import { PricingConfig } from "./types";

export const DEFAULT_PRICING: Record<"itinerary" | "temporary_reservation", PricingConfig> = {
  itinerary: {
    id: "itinerary",
    name: "Flight Itinerary Document",
    price_usd: 25,
    badge: "Most Popular",
    accent_color: "blue",
    description:
      "A professionally formatted itinerary document containing your journey details, dates, route, and passenger information. Ideal for visa applications and travel planning.",
    delivery_time: "1–24 hours",
    features: [
      "Professional A4 PDF document",
      "Clear itinerary & flight details",
      "Route, dates and passenger details",
      "Unlocked download after payment",
      "Easy access through your dashboard",
      "Dedicated 24/7 support assistance",
    ],
  },
  temporary_reservation: {
    id: "temporary_reservation",
    name: "Temporary Flight Reservation",
    price_usd: 50,
    badge: "Partner Required",
    accent_color: "green",
    description:
      "Request a temporary flight reservation for visa documentation where supported by the service's actual reservation process with authorized partners.",
    delivery_time: "1–48 hours",
    features: [
      "Route and passenger details",
      "Reservation status clearly identified",
      "A4 PDF with mandatory disclaimer",
      "Document access after payment",
      "Transparent service terms",
      "Dedicated 24/7 support assistance",
    ],
  },
};

// Global pricing store in memory, updated by admin
let currentPricing = { ...DEFAULT_PRICING };

export function getPricingConfig() {
  return currentPricing;
}

export function updatePricingConfig(
  service: "itinerary" | "temporary_reservation",
  updates: Partial<PricingConfig>
) {
  currentPricing = {
    ...currentPricing,
    [service]: {
      ...currentPricing[service],
      ...updates,
    },
  };
  return currentPricing[service];
}
