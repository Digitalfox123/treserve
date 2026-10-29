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
  Clock,
  Sparkles,
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
  const reservationPrice = pricing.temporary_reservation?.price_usd || 35;

  // Initial values from query parameters
  const initialFrom = searchParams.get("from") || "Lahore (LHE)";
  const initialTo = searchParams.get("to") || "Dubai (DXB)";
  const initialDeparture = searchParams.get("departureDate") || "2026-11-24";
  const initialReturn = searchParams.get("returnDate") || "2026-12-05";
  const initialTripType = (searchParams.get("tripType") as TripType) || "return";
  const initialCabin = (searchParams.get("cabin") as CabinClass) || "economy";

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State - strictly Temporary Flight Reservation
  const serviceType: ServiceType = "temporary_reservation";
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

  const currentPricePerPax = reservationPrice;
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
      if (!origin || !destination) {
        setErrorMessage("Please select both origin and destination airports.");
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
    if (currentStep === 2) {
      if (!guestEmail || !guestEmail.includes("@")) {
        setErrorMessage("Please enter a valid email address for PDF document delivery.");
        return false;
      }
      for (let i = 0; i < passengers.length; i++) {
        if (!passengers[i].first_name.trim() || !passengers[i].last_name.trim()) {
          setErrorMessage(`Please provide first and last name for Passenger ${i + 1} as printed on their passport.`);
          return false;
        }
      }
      return true;
    }
    if (currentStep === 3) {
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
    if (!validateStep(3)) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        service_type: "temporary_reservation",
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
        throw new Error(data.error || "Failed to create reservation order.");
      }

      router.push(`/checkout/${data.order.id}`);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3.5 py-1 rounded-full">
          DIRECT FLIGHT RESERVATION BOOKING
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B1F33] tracking-tight mt-2.5">
          Book Temporary Flight Reservation
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Instant verifiable flight reservation hold for visa appointments, embassy submissions, and proof of onward travel.
        </p>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { num: 1, label: "Journey Details" },
            { num: 2, label: "Passenger Details" },
            { num: 3, label: "Review & Confirm" },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center justify-center space-x-2 py-2 px-1 rounded-xl transition-all ${
                step === s.num
                  ? "bg-[#1769E0] text-white font-bold shadow-xs"
                  : step > s.num
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-slate-400 font-medium"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.num
                    ? "bg-white text-[#1769E0]"
                    : step > s.num
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Form Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs font-semibold text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Steps + Sidebar Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (8 cols) */}
        <div className="lg:col-span-8">
          {/* STEP 1: JOURNEY DETAILS */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">
                  Step 1 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-1">
                  Specify Travel Route & Dates
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Enter your flight route, travel dates, and preferred cabin class.
                </p>
              </div>

              {/* Trip Type Selector */}
              <div className="flex items-center space-x-3">
                {(["return", "one-way", "multi-city"] as TripType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      tripType === t
                        ? "bg-[#1769E0] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t === "return" ? "Round Trip" : t === "one-way" ? "One Way" : "Multi-City"}
                  </button>
                ))}
              </div>

              {/* Origin & Destination Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Departure Airport / City <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                    <MapPin className="w-4 h-4 text-[#1769E0] mr-2 shrink-0" />
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                    >
                      {AIRPORTS.map((a) => (
                        <option key={a.code} value={formatAirportDisplay(a)}>
                          {a.city} ({a.code}) — {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Destination Airport / City <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                    <MapPin className="w-4 h-4 text-[#08A6F6] mr-2 shrink-0" />
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none"
                    >
                      {AIRPORTS.map((a) => (
                        <option key={a.code} value={formatAirportDisplay(a)}>
                          {a.city} ({a.code}) — {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates & Cabin Class */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Departure Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#0B1F33] outline-none"
                      required
                    />
                  </div>
                </div>

                {tripType === "return" && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Return Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#1769E0] transition-colors">
                      <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-[#0B1F33] outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className={tripType !== "return" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Cabin Preference
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-xs font-semibold text-[#0B1F33] outline-none focus:border-[#1769E0]"
                  >
                    <option value="economy">Economy Class</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              {/* Preselected Live Flight Option Summary (if passed from search) */}
              {flightNumber && (
                <div className="p-4 bg-[#E8F2FF]/60 border border-[#1769E0]/30 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#1769E0]/20 flex items-center justify-center font-bold text-[#1769E0]">
                      {airlineCode || "FL"}
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1F33]">
                        {airlineName} Flight {flightNumber}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Depart: {departureTime} · Arrive: {arrivalTime} ({duration})
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#1769E0] bg-white px-2.5 py-1 rounded-full border border-[#1769E0]/20">
                    Live Route Selected
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGERS & CONTACT INFO */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">
                  Step 2 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-1">
                  Passenger Names & Document Delivery
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Enter traveler names exactly as they appear on passports. We will send the reservation PDF to this email.
                </p>
              </div>

              {/* Delivery Email & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Document Delivery Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="traveler@example.com"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0B1F33] bg-slate-50 focus:bg-white focus:border-[#1769E0] outline-none transition-colors"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Your PDF reservation and reference will be sent here immediately.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Contact Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0B1F33] bg-slate-50 focus:bg-white focus:border-[#1769E0] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Passenger Input Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Travelers ({passengers.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    disabled={passengers.length >= 9}
                    className="text-xs font-bold text-[#1769E0] hover:text-[#1255B8] flex items-center space-x-1"
                  >
                    <span>+ Add Another Passenger</span>
                  </button>
                </div>

                {passengers.map((pax, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1F33]">
                        Passenger {index + 1}
                      </span>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(index)}
                          className="text-[11px] text-rose-600 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Title
                        </label>
                        <select
                          value={pax.title}
                          onChange={(e) => updatePassenger(index, "title", e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-[#1769E0]"
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
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          First Name (as on Passport) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pax.first_name}
                          onChange={(e) => updatePassenger(index, "first_name", e.target.value)}
                          placeholder="First Name"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-[#1769E0]"
                          required
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Last Name (as on Passport) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pax.last_name}
                          onChange={(e) => updatePassenger(index, "last_name", e.target.value)}
                          placeholder="Last Name"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-[#1769E0]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs"
                >
                  <span>Review & Complete Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & BOOK RESERVATION */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#1769E0] tracking-wider">
                  Step 3 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-1">
                  Review & Confirm Reservation
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Verify your journey coordinates and acknowledge the standard embassy documentation terms.
                </p>
              </div>

              {/* Reservation Overview Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs uppercase text-[#0B1F33]">
                      Temporary Flight Reservation
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active Hold
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Route</span>
                    <span className="font-bold text-[#0B1F33]">{origin} → {destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Dates</span>
                    <span className="font-bold text-[#0B1F33]">
                      Dep: {departureDate} {tripType === "return" ? `· Ret: ${returnDate}` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Passengers</span>
                    <span className="font-bold text-[#0B1F33]">
                      {passengers.length} Passenger{passengers.length > 1 ? "s" : ""} ({cabinClass})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Delivery Email</span>
                    <span className="font-bold text-[#0B1F33]">{guestEmail}</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Visa Compliance Checkbox */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAcknowledged}
                    onChange={(e) => setDisclaimerAcknowledged(e.target.checked)}
                    className="w-4 h-4 text-[#1769E0] rounded-sm mt-0.5"
                  />
                  <div className="text-xs text-amber-950 font-medium leading-relaxed">
                    <span className="font-bold block mb-0.5">Mandatory Visa Compliance Acknowledgement:</span>
                    I understand that Treserve provides temporary flight reservations specifically for visa applications,
                    embassy submissions, and proof of onward travel. This document is a reservation hold and is not an actual airline ticket or boarding pass.
                  </div>
                </label>
              </div>

              {/* Navigation & Submit */}
              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={submitting || !disclaimerAcknowledged}
                  className="px-7 py-3.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Reservation Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment (${totalPrice})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                100% Verifiable Hold
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#0B1F33]">Temporary Flight Reservation</div>
                  <div className="text-slate-400 text-[11px] capitalize">{tripType} trip · {cabinClass}</div>
                </div>
                <span className="font-bold text-[#0B1F33]">${currentPricePerPax}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Passengers</span>
                <span className="font-semibold">× {passengers.length}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-extrabold text-[#0B1F33]">Total Due</span>
                <span className="text-xl font-black text-[#1769E0]">${totalPrice} USD</span>
              </div>
            </div>

            {/* Trust Points */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant A4 Vector PDF download</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Unique PNR code for embassy review</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero registration or sign-up needed</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 text-center">
            🔒 256-Bit SSL Encrypted & Embassy Compliant Formatting
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-[#1769E0] animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading booking portal...</p>
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
