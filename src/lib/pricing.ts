import { PricingConfig } from "./types";

export const DEFAULT_PRICING: Record<"itinerary" | "temporary_reservation", PricingConfig> = {
  itinerary: {
    id: "itinerary",
    name: "Visa Application Flight Reservation",
    price_usd: 10,
    badge: "Recommended",
    accent_color: "blue",
    description:
      "Official verifiable flight reservation formatted strictly according to embassy and visa consulate requirements. Instant download with live airline flight schedule.",
    delivery_time: "Instant Download",
    features: [
      "Official A4 Vector PDF Document",
      "Verifiable Airline Flight Number & Schedule",
      "Unique PNR Reservation Reference Code",
      "Embassy & Consulate Compliant Format",
      "Valid for Schengen, US, UK, Canada & Global Visas",
      "14–21 Days Active Reservation Hold Coverage",
      "Instant PDF Download Right After Booking",
      "No Ticket Purchase Required (100% Risk-Free)",
      "Dedicated 24/7 Traveler Support Assistance",
    ],
  },
  temporary_reservation: {
    id: "temporary_reservation",
    name: "Visa Application Flight Reservation",
    price_usd: 10,
    badge: "Recommended",
    accent_color: "blue",
    description:
      "Official verifiable flight reservation formatted strictly according to embassy and visa consulate requirements. Instant download with live airline flight schedule.",
    delivery_time: "Instant Download",
    features: [
      "Official A4 Vector PDF Document",
      "Verifiable Airline Flight Number & Schedule",
      "Unique PNR Reservation Reference Code",
      "Embassy & Consulate Compliant Format",
      "Valid for Schengen, US, UK, Canada & Global Visas",
      "14–21 Days Active Reservation Hold Coverage",
      "Instant PDF Download Right After Booking",
      "No Ticket Purchase Required (100% Risk-Free)",
      "Dedicated 24/7 Traveler Support Assistance",
    ],
  },
};

// Global pricing store in memory
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
