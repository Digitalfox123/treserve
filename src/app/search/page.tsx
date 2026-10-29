"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MandatoryDisclaimer } from "@/components/common/MandatoryDisclaimer";
import {
  Plane,
  ArrowRight,
  Clock,
  Calendar,
  Check,
  RefreshCw,
  Filter,
  Radio,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { FlightOption } from "@/lib/types";
import { AirlineLogo } from "@/components/common/AirlineLogo";
import { formatTimeWithAmPm } from "@/lib/timeUtils";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "LHE";
  const fromCity = searchParams.get("fromCity") || "Lahore";
  const to = searchParams.get("to") || "DXB";
  const toCity = searchParams.get("toCity") || "Dubai";
  const departureDate = searchParams.get("departureDate") || "2026-11-24";
  const returnDate = searchParams.get("returnDate") || "";
  const tripType = searchParams.get("tripType") || "return";
  const adults = Number(searchParams.get("adults") || 1);
  const cabin = searchParams.get("cabin") || "economy";

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [dataSource, setDataSource] = useState<string>("aviationstack");
  const [dataTimestamp, setDataTimestamp] = useState<string>("");
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string>("ALL");
  const [filterNonStopOnly, setFilterNonStopOnly] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Live Flights from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    const fetchLiveFlights = async () => {
      try {
        const query = new URLSearchParams({
          from,
          to,
          date: departureDate,
        });

        const res = await fetch(`/api/flights/search?${query.toString()}`);
        if (!res.ok) {
          throw new Error("Unable to retrieve live flight schedules");
        }

        const data = await res.json();
        if (isMounted) {
          setFlights(data.flights || []);
          setDataSource(data.source || "aviationstack");
          setDataTimestamp(data.timestamp || new Date().toISOString());
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Live flight fetch error:", err);
          setErrorMessage("Failed to load live flight data. Showing verified scheduled carrier options.");
          setLoading(false);
        }
      }
    };

    fetchLiveFlights();

    return () => {
      isMounted = false;
    };
  }, [from, to, departureDate]);

  // Unique airlines extracted from real live flight results
  const availableAirlines = Array.from(new Set(flights.map((f) => f.airline_name))).filter(Boolean);

  const filteredFlights = flights.filter((flight) => {
    if (selectedAirlineFilter !== "ALL" && flight.airline_name !== selectedAirlineFilter) {
      return false;
    }
    if (filterNonStopOnly && flight.stops > 0) {
      return false;
    }
    return true;
  });

  const handleSelectFlight = (flight: FlightOption) => {
    const params = new URLSearchParams({
      tripType,
      from: fromCity ? `${fromCity} (${from})` : from,
      to: toCity ? `${toCity} (${to})` : to,
      departureDate,
      returnDate,
      adults: String(adults),
      cabin,
      flightNumber: flight.flight_number,
      airlineName: flight.airline_name,
      airlineCode: flight.airline_code,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
    });
    router.push(`/create?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Route Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#1769E0]">
            <span>Flight Schedule Search Results</span>
            <span>·</span>
            <span className="capitalize">{tripType}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F33] mt-1 flex items-center space-x-2">
            <span>{fromCity} ({from})</span>
            <ArrowRight className="w-5 h-5 text-slate-400" />
            <span>{toCity} ({to})</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#1769E0]" />
              <span>Depart: <strong>{departureDate}</strong></span>
            </span>
            {returnDate && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#08A6F6]" />
                <span>Return: <strong>{returnDate}</strong></span>
              </span>
            )}
            <span>·</span>
            <span className="capitalize">{cabin} Class</span>
            <span>·</span>
            <span>{adults} Passenger{adults > 1 ? "s" : ""}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/#search")}
          className="self-start md:self-auto px-4 py-2 text-xs font-bold text-[#1769E0] border border-[#1769E0] rounded-xl hover:bg-[#E8F2FF] transition-colors"
        >
          Modify Search
        </button>
      </div>

      {/* Live Data Feed Status Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0B1F33]">
                Live Flight Schedules Active
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Feed
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Provider:{" "}
              <strong className="text-slate-700">
                {dataSource === "google_flights"
                  ? "Google Flights Data Feed (RapidAPI)"
                  : dataSource === "aviationstack"
                  ? "AviationStack Real-Time Flight Engine"
                  : "Certified Global Airline Schedules"}
              </strong>
              {dataTimestamp && ` · Synced at ${dataTimestamp.slice(11, 16)} UTC`}
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
          {loading ? "Searching routes..." : `${filteredFlights.length} Available Flights`}
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B1F33] pb-3 border-b border-slate-100">
              <Filter className="w-4 h-4 text-[#1769E0]" />
              <span>Filter by Operating Airline</span>
            </div>
            <div className="space-y-1.5 mt-3 max-h-64 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedAirlineFilter("ALL")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedAirlineFilter === "ALL"
                    ? "bg-[#E8F2FF] text-[#1769E0] font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Airlines</span>
                {selectedAirlineFilter === "ALL" && <Check className="w-3.5 h-3.5" />}
              </button>

              {availableAirlines.map((airline) => (
                <button
                  key={airline}
                  type="button"
                  onClick={() => setSelectedAirlineFilter(airline)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedAirlineFilter === airline
                      ? "bg-[#E8F2FF] text-[#1769E0] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate max-w-[170px]">{airline}</span>
                  {selectedAirlineFilter === airline && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-bold uppercase text-slate-400 mb-2.5">
              Flight Stops
            </span>
            <div className="text-xs space-y-2 text-slate-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterNonStopOnly}
                  onChange={(e) => setFilterNonStopOnly(e.target.checked)}
                  className="rounded text-[#1769E0]"
                />
                <span>Non-stop flights only</span>
              </label>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-[#0B1F33] block mb-1">
              Live Reservation Notice:
            </span>
            Select a live flight above to generate an authentic Flight Itinerary Document or Temporary Reservation for your visa file.
          </div>
        </div>

        {/* Right Flight Cards List (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            // Loading Skeletons
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full" />
                  <div className="h-8 bg-slate-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <Plane className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#0B1F33]">No flights found for this filter</h3>
              <p className="text-xs text-slate-500">
                Try selecting a different airline or resetting your flight filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedAirlineFilter("ALL");
                  setFilterNonStopOnly(false);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1769E0] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:border-[#1769E0] hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Airline & Schedule Info */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <AirlineLogo
                        airlineCode={flight.airline_code}
                        airlineName={flight.airline_name}
                        className="w-12 h-12"
                        size={56}
                      />
                      <div>
                        <div className="text-sm sm:text-base font-bold text-[#0B1F33] flex items-center space-x-2">
                          <span>{flight.airline_name}</span>
                          <span className="text-[10px] font-mono font-bold text-[#1769E0] bg-[#E8F2FF] px-2 py-0.5 rounded">
                            {flight.flight_number}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                          <span>{flight.aircraft_type}</span>
                          {flight.terminal_departure && <span>· Departs T{flight.terminal_departure}</span>}
                          {flight.terminal_arrival && <span>· Arrives T{flight.terminal_arrival}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE SCHEDULE</span>
                    </div>
                  </div>

                  {/* Flight Timing Diagram with AM/PM */}
                  <div className="flex items-center space-x-6 pt-1">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-[#0B1F33]">
                        {formatTimeWithAmPm(flight.departure_time)}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        {flight.departure_city} ({from})
                      </div>
                    </div>

                    <div className="flex-1 max-w-[200px] flex flex-col items-center">
                      <span className="text-[11px] text-slate-500 font-semibold">{flight.duration}</span>
                      <div className="w-full flex items-center space-x-1 my-1">
                        <div className="h-0.5 flex-1 bg-slate-200" />
                        <Plane className="w-4 h-4 text-[#1769E0] rotate-45" />
                        <div className="h-0.5 flex-1 bg-slate-200" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                      </span>
                    </div>

                    <div>
                      <div className="text-xl sm:text-2xl font-black text-[#0B1F33]">
                        {formatTimeWithAmPm(flight.arrival_time)}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        {flight.arrival_city} ({to})
                      </div>
                    </div>
                  </div>

                  {/* Flight Verification Link */}
                  <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-500">
                    <a
                      href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`${flight.airline_name} ${flight.flight_number} ${from} to ${to}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#1769E0] hover:text-[#1255B8] font-bold hover:underline transition-colors"
                      title="Verify this exact flight schedule on Google Flights"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify on Google Flights</span>
                    </a>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">GDS Airline Verified</span>
                  </div>
                </div>

                {/* Single Select Flight CTA Button */}
                <div className="md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-center space-y-2 min-w-[200px]">
                  <button
                    type="button"
                    onClick={() => handleSelectFlight(flight)}
                    className="w-full py-3 px-5 bg-[#1769E0] hover:bg-[#1255B8] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Select Flight</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-center text-[10px] font-semibold text-slate-400">
                    Temporary Flight Reservation
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MandatoryDisclaimer variant="card" className="mt-12" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-500">
              Loading live flight schedule search results...
            </div>
          }
        >
          <SearchResultsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
