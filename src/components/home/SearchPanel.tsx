"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AIRPORTS, searchAirports, Airport, formatAirportDisplay } from "@/lib/airports";
import { TripType, CabinClass } from "@/lib/types";
import {
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronDown,
  MapPin,
  Check,
  PlaneTakeoff,
  PlaneLanding,
  Armchair,
} from "lucide-react";

export function SearchPanel() {
  const router = useRouter();

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const paxRef = useRef<HTMLDivElement>(null);

  // Search Form State
  const [tripType, setTripType] = useState<TripType>("return");
  const [fromAirport, setFromAirport] = useState<Airport>(
    AIRPORTS.find((a) => a.code === "LHE") || AIRPORTS[0]
  );
  const [toAirport, setToAirport] = useState<Airport>(
    AIRPORTS.find((a) => a.code === "DXB") || AIRPORTS[1]
  );

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Click outside listener for closing dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
      if (paxRef.current && !paxRef.current.contains(event.target as Node)) {
        setShowPaxDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dates
  const [departureDate, setDepartureDate] = useState("2026-11-24");
  const [returnDate, setReturnDate] = useState("2026-12-05");

  // Passengers & Cabin
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  // Validation error
  const [error, setError] = useState<string | null>(null);

  // Swap action
  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fromAirport.code === toAirport.code) {
      setError("Origin and destination airports cannot be the same.");
      return;
    }

    if (!departureDate) {
      setError("Please select a valid departure date.");
      return;
    }

    if (tripType === "return" && returnDate && returnDate < departureDate) {
      setError("Return date cannot be earlier than departure date.");
      return;
    }

    const params = new URLSearchParams({
      tripType,
      from: fromAirport.code,
      fromCity: fromAirport.city,
      to: toAirport.code,
      toCity: toAirport.city,
      departureDate,
      returnDate: tripType === "return" ? returnDate : "",
      adults: String(adultCount),
      children: String(childCount),
      cabin: cabinClass,
    });

    router.push(`/search?${params.toString()}`);
  };

  const filteredFromAirports = searchAirports(fromQuery);
  const filteredToAirports = searchAirports(toQuery);

  const totalPassengers = adultCount + childCount;
  const cabinLabels: Record<CabinClass, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First Class",
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-30">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 sm:p-7 md:p-8 backdrop-blur-md">
        {/* Top Control Bar: Trip Type & Passenger/Cabin Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          {/* Trip Type Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl">
            {(["one-way", "return", "multi-city"] as TripType[]).map((type) => {
              const isSelected = tripType === type;
              const labels = {
                "one-way": "One-way",
                return: "Return",
                "multi-city": "Multi-city",
              };
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-white text-[#1769E0] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          {/* Passengers & Cabin Quick Selectors */}
          <div ref={paxRef} className="flex items-center space-x-2 relative">
            {/* Passenger Count & Cabin Button */}
            <button
              type="button"
              onClick={() => setShowPaxDropdown(!showPaxDropdown)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 text-xs font-bold text-[#0B1F33] hover:bg-slate-100 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#1769E0]" />
              <span>
                {totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-600">{cabinLabels[cabinClass]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Passenger & Cabin Dropdown Menu */}
            {showPaxDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#0B1F33]">Adults</div>
                    <div className="text-[11px] text-slate-400">Age 12+ years</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={adultCount <= 1}
                      onClick={() => setAdultCount(adultCount - 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{adultCount}</span>
                    <button
                      type="button"
                      disabled={adultCount >= 9}
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-[#0B1F33]">Children</div>
                    <div className="text-[11px] text-slate-400">Age 2–11 years</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={childCount <= 0}
                      onClick={() => setChildCount(childCount - 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{childCount}</span>
                    <button
                      type="button"
                      disabled={childCount >= 8}
                      onClick={() => setChildCount(childCount + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Cabin Class Preference
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#1769E0]"
                  >
                    <option value="economy">Economy Class</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaxDropdown(false)}
                  className="w-full py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Main Search Panel Form */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Origin & Destination Block (5 cols on lg) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
              {/* FROM Card (5 cols on sm) */}
              <div ref={fromRef} className="sm:col-span-5 relative">
                <div
                  onClick={() => setShowFromDropdown(true)}
                  className="border border-slate-200 hover:border-[#1769E0] rounded-2xl p-3.5 bg-slate-50/50 hover:bg-white transition-all cursor-pointer h-full"
                >
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase text-slate-400">
                    <PlaneTakeoff className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span>FROM</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B1F33] truncate mt-1">
                    {fromAirport.city} ({fromAirport.code})
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {fromAirport.name}
                  </div>
                </div>

                {/* From Autocomplete Dropdown */}
                {showFromDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-[60] max-h-72 overflow-y-auto">
                    <div className="px-2 py-1.5 mb-2 border-b border-slate-100 flex items-center space-x-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        autoFocus
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        placeholder="Type city or airport code..."
                        className="w-full text-xs font-semibold outline-none bg-transparent"
                      />
                    </div>
                    {filteredFromAirports.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => {
                          setFromAirport(airport);
                          setShowFromDropdown(false);
                          setFromQuery("");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#E8F2FF] flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-bold text-[#0B1F33]">
                            {airport.city} ({airport.code})
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[210px]">
                            {airport.name} · {airport.country}
                          </div>
                        </div>
                        {fromAirport.code === airport.code && (
                          <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Central Swap Button (1 col on sm) */}
              <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  title="Swap Origin and Destination"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#1769E0] hover:bg-[#E8F2FF] shadow-xs hover:rotate-180 transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-[#1769E0]"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* TO Card (5 cols on sm) */}
              <div ref={toRef} className="sm:col-span-5 relative">
                <div
                  onClick={() => setShowToDropdown(true)}
                  className="border border-slate-200 hover:border-[#1769E0] rounded-2xl p-3.5 bg-slate-50/50 hover:bg-white transition-all cursor-pointer h-full"
                >
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase text-slate-400">
                    <PlaneLanding className="w-3.5 h-3.5 text-[#08A6F6]" />
                    <span>TO</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B1F33] truncate mt-1">
                    {toAirport.city} ({toAirport.code})
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {toAirport.name}
                  </div>
                </div>

                {/* To Autocomplete Dropdown */}
                {showToDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-[60] max-h-72 overflow-y-auto">
                    <div className="px-2 py-1.5 mb-2 border-b border-slate-100 flex items-center space-x-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        autoFocus
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        placeholder="Type city or airport code..."
                        className="w-full text-xs font-semibold outline-none bg-transparent"
                      />
                    </div>
                    {filteredToAirports.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => {
                          setToAirport(airport);
                          setShowToDropdown(false);
                          setToQuery("");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#E8F2FF] flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-bold text-[#0B1F33]">
                            {airport.city} ({airport.code})
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[210px]">
                            {airport.name} · {airport.country}
                          </div>
                        </div>
                        {toAirport.code === airport.code && (
                          <Check className="w-4 h-4 text-[#1769E0] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Travel Dates Card (4 cols on lg) */}
            <div className="lg:col-span-4 border border-slate-200 rounded-2xl p-3 bg-slate-50/50 flex items-center space-x-2">
              {/* Departure Date */}
              <div className="flex-1">
                <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  DEPARTURE
                </span>
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#1769E0] shrink-0" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Return Date (if return trip) */}
              {tripType === "return" && (
                <div className="flex-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    RETURN
                  </span>
                  <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#08A6F6] shrink-0" />
                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0B1F33] outline-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated High-Profile Search Flights Button (3 cols on lg) */}
            <div className="lg:col-span-3 flex items-stretch">
              <button
                type="submit"
                className="w-full min-h-[54px] bg-[#1769E0] hover:bg-[#1255B8] active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg transition-all"
              >
                <Search className="w-5 h-5 shrink-0" />
                <span className="tracking-wide whitespace-nowrap">Search Flights</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
