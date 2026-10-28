"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import { AIRPORTS, formatAirportDisplay, searchAirports } from "@/lib/airports";
import { ServiceType, TripType, CabinClass } from "@/lib/types";
import { getPricingConfig } from "@/lib/pricing";
import {
  FileText,
  CalendarCheck,
  Plane,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface PassengerInput {
  title: "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Prof";
  first_name: string;
  last_name: string;
  passenger_type: "adult" | "child" | "infant";
}

function CreateFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pricing = getPricingConfig();

  // Initial values from query parameters if coming from search page or service cards
  const initialService =
    (searchParams.get("service") as ServiceType) || "itinerary";
  const initialFrom = searchParams.get("from") || "Lahore (LHE)";
  const initialTo = searchParams.get("to") || "Dubai (DXB)";
  const initialDeparture = searchParams.get("departureDate") || "2026-11-24";
  const initialReturn = searchParams.get("returnDate") || "2026-12-05";
  const initialTripType = (searchParams.get("tripType") as TripType) || "return";
  const initialCabin = (searchParams.get("cabin") as CabinClass) || "economy";

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [tripType, setTripType] = useState<TripType>(initialTripType);
  const [origin, setOrigin] = useState(initialFrom);
  const [destination, setDestination] = useState(initialTo);
  const [departureDate, setDepartureDate] = useState(initialDeparture);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialCabin);

  // Lead Customer Contact Info
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Passenger List
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    {
      title: "Mr",
      first_name: "",
      last_name: "",
      passenger_type: "adult",
    },
  ]);

  // Terms acceptance
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);

  // Flight option details passed from search (if available)
  const flightNumber = searchParams.get("flightNumber");
  const airlineName = searchParams.get("airlineName");
  const airlineCode = searchParams.get("airlineCode");
  const departureTime = searchParams.get("departureTime");
  const arrivalTime = searchParams.get("arrivalTime");
  const duration = searchParams.get("duration");

  const currentPricePerPax = pricing[serviceType].price_usd;
  const totalPrice = currentPricePerPax * passengers.length;

  const handleAddPassenger = () => {
    if (passengers.length >= 9) return;
    setPassengers([
      ...passengers,
      {
        title: "Mr",
        first_name: "",
        last_name: "",
        passenger_type: "adult",
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: keyof PassengerInput, val: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: val };
    setPassengers(updated);
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);
    if (currentStep === 1) {
      return true;
    }
    if (currentStep === 2) {
      if (!origin || !destination) {
        setErrorMessage("Please specify both origin and destination.");
        return false;
      }
      if (origin === destination) {
        setErrorMessage("Origin and destination cannot be identical.");
        return false;
      }
      if (!departureDate) {
        setErrorMessage("Please select a departure date.");
        return false;
      }
      if (tripType === "return" && returnDate && returnDate < departureDate) {
        setErrorMessage("Return date cannot precede departure date.");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!guestEmail || !guestEmail.includes("@")) {
        setErrorMessage("Please enter a valid email address for document delivery.");
        return false;
      }
      for (let i = 0; i < passengers.length; i++) {
        if (!passengers[i].first_name.trim() || !passengers[i].last_name.trim()) {
          setErrorMessage(`Please provide first and last name for Passenger ${i + 1}.`);
          return false;
        }
      }
      return true;
    }
    if (currentStep === 4) {
      if (!disclaimerAcknowledged) {
        setErrorMessage("You must acknowledge the visa documentation disclaimer to proceed.");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setStep(step - 1);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCreateOrder = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        service_type: serviceType,
        trip_type: tripType,
        origin,
        destination,
        departure_date: departureDate,
        return_date: tripType === "return" ? returnDate : null,
        passenger_count: passengers.length,
        cabin_class: cabinClass,
        guest_email: guestEmail,
        guest_name: `${passengers[0].first_name} ${passengers[0].last_name}`,
        passengers,
        flight_option: flightNumber
          ? {
              flight_number: flightNumber,
              airline_name: airlineName || "International Carrier",
              airline_code: airlineCode || "IA",
              departure_time: departureTime || "09:30",
              arrival_time: arrivalTime || "13:15",
              duration: duration || "3h 45m",
            }
          : undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order record");
      }

      // Navigate directly to checkout
      router.push(`/checkout/${data.order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Multi-step Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0 -translate-y-1/2" />
          {[
            { num: 1, label: "Service" },
            { num: 2, label: "Journey" },
            { num: 3, label: "Passengers" },
            { num: 4, label: "Review" },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center bg-[#F5F7FA] px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-[#15803D] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#1769E0] text-white ring-4 ring-[#E8F2FF]"
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold uppercase tracking-wider ${
                    isCurrent ? "text-[#1769E0]" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: SELECT SERVICE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">Step 1 of 4</span>
            <h2 className="text-2xl font-black text-[#0B1F33] mt-1">Select Your Service</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Choose the travel documentation format that meets your visa submission requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Service 1: Flight Itinerary Document */}
            <div
              onClick={() => setServiceType("itinerary")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                serviceType === "itinerary"
                  ? "border-[#1769E0] bg-[#E8F2FF]/30 shadow-md ring-2 ring-[#1769E0]/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] text-[#1769E0] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F2FF] text-[#1769E0]">
                  $25 USD / Person
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0B1F33]">Flight Itinerary Document</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Professionally formatted travel schedule with flight numbers, departure and arrival
                timings, airline carrier details, and passenger information.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#1769E0] flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Instant unlocked PDF download after test checkout</span>
              </div>
            </div>

            {/* Service 2: Temporary Flight Reservation */}
            <div
              onClick={() => setServiceType("temporary_reservation")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                serviceType === "temporary_reservation"
                  ? "border-emerald-600 bg-emerald-50/30 shadow-md ring-2 ring-emerald-600/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  $50 USD / Person
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0B1F33]">Temporary Flight Reservation</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Request a held reservation request through our supplier network with transparent reservation
                status specifically formatted for visa documentation.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Includes supplier-derived reservation proof</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all"
            >
              <span>Continue to Journey Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: JOURNEY DETAILS */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">Step 2 of 4</span>
            <h2 className="text-2xl font-black text-[#0B1F33] mt-1">Enter Journey Details</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Specify your travel route, flight dates, and cabin class preference.
            </p>
          </div>

          {/* Trip Type Selector */}
          <div className="flex items-center space-x-3">
            {(["return", "one-way"] as TripType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTripType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  tripType === t
                    ? "bg-[#1769E0] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t} Trip
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Origin City / Airport
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0]">
                <MapPin className="w-4 h-4 text-[#1769E0] shrink-0 mr-2" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Lahore (LHE)"
                  className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Destination City / Airport
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0]">
                <MapPin className="w-4 h-4 text-[#08A6F6] shrink-0 mr-2" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Dubai (DXB)"
                  className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Departure Date
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0]">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                />
              </div>
            </div>

            {/* Return Date */}
            {tripType === "return" && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Return Date
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0]">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Cabin Class */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Cabin Class
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
              >
                <option value="economy">Economy Class</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business Class</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PASSENGER INFORMATION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">Step 3 of 4</span>
            <h2 className="text-2xl font-black text-[#0B1F33] mt-1">Passenger Information</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Add the traveler names exactly as they appear on their passports.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start space-x-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-[#1769E0] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Privacy Protection:</strong> We collect only necessary passenger names required
              to format your itinerary document. We do not ask for passport numbers or sensitive IDs
              for standard itinerary issuance.
            </p>
          </div>

          {/* Lead Contact Email */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-600">
              Delivery Email Address (for document notifications)
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="e.g. traveler@example.com"
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-[#1769E0]"
              required
            />
          </div>

          {/* Passengers List */}
          <div className="space-y-4 pt-2">
            {passengers.map((p, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1F33] uppercase">
                    Passenger #{idx + 1}
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(idx)}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Title</label>
                    <select
                      value={p.title}
                      onChange={(e) => updatePassenger(idx, "title", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">First Name</label>
                    <input
                      type="text"
                      value={p.first_name}
                      onChange={(e) => updatePassenger(idx, "first_name", e.target.value)}
                      placeholder="First Name (e.g. John)"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-[#1769E0]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Last Name</label>
                    <input
                      type="text"
                      value={p.last_name}
                      onChange={(e) => updatePassenger(idx, "last_name", e.target.value)}
                      placeholder="Last Name (e.g. Smith)"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-[#1769E0]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 9 && (
              <button
                type="button"
                onClick={handleAddPassenger}
                className="w-full py-2.5 border-2 border-dashed border-[#1769E0]/40 text-[#1769E0] text-xs font-bold rounded-xl hover:bg-[#E8F2FF]/40 transition-colors"
              >
                + Add Another Passenger
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all"
            >
              <span>Review Order Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CREATE ORDER */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">Step 4 of 4</span>
            <h2 className="text-2xl font-black text-[#0B1F33] mt-1">Review Your Order</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Please verify all details before submitting and continuing to the test checkout.
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Selected Service</span>
                <div className="text-base font-bold text-[#0B1F33]">
                  {serviceType === "temporary_reservation"
                    ? "Temporary Flight Reservation"
                    : "Flight Itinerary Document"}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Unit Price</span>
                <div className="text-sm font-bold text-[#1769E0]">${currentPricePerPax} USD</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Route</span>
                <strong className="text-[#0B1F33]">{origin} → {destination}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Trip Type</span>
                <strong className="text-[#0B1F33] uppercase">{tripType}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Departure</span>
                <strong className="text-[#0B1F33]">{departureDate}</strong>
              </div>
              {tripType === "return" && (
                <div>
                  <span className="text-slate-400 text-[11px] block">Return</span>
                  <strong className="text-[#0B1F33]">{returnDate}</strong>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-slate-400 text-[11px] block mb-1">Passengers ({passengers.length})</span>
              <div className="text-xs font-semibold text-[#0B1F33] space-y-1">
                {passengers.map((p, i) => (
                  <div key={i}>
                    {i + 1}. {p.title} {p.first_name} {p.last_name} ({p.passenger_type})
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Delivery Email</span>
                <strong className="text-[#0B1F33] text-xs">{guestEmail}</strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-semibold">Total (Test Mode)</span>
                <span className="text-2xl font-black text-[#0B1F33]">${totalPrice}.00 USD</span>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimer Acknowledgement Checkbox */}
          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={disclaimerAcknowledged}
                onChange={(e) => setDisclaimerAcknowledged(e.target.checked)}
                className="mt-0.5 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
              <span className="text-xs font-medium text-amber-950 leading-relaxed">
                <strong>Mandatory Acknowledgment:</strong> I understand that{" "}
                <em>
                  our service provides temporary reservations for visa documentation only. We do not
                  guarantee visa approval. These are NOT actual flight tickets and are NOT valid for
                  boarding.
                </em>
              </span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={submitting}
              onClick={prevStep}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={submitting || !disclaimerAcknowledged}
              onClick={handleCreateOrder}
              className="px-7 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Test Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-500">
              Loading travel document builder...
            </div>
          }
        >
          <CreateFlowContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
