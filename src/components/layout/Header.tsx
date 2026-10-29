"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Menu, X, Plane, SearchCheck } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Track Booking", href: "/manage-booking" },
    { name: "Guides", href: "/guides" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        isScrolled ? "shadow-sm border-b border-[#E2E8F0]" : "border-b border-[#E2E8F0]/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Treserve Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Logo variant="light" size="md" showTagline={true} />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                  isActive
                    ? "text-[#1769E0] font-bold bg-[#E8F2FF]/60"
                    : "text-[#0B1F33] hover:text-[#1769E0] hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Direct Booking Actions (Zero login / signup required) */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            href="/manage-booking"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#1769E0] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <SearchCheck className="w-4 h-4 text-[#1769E0]" />
            <span>Find Booking</span>
          </Link>

          <Link
            href="/create"
            className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-[#1769E0] hover:bg-[#1255B8] active:scale-[0.98] rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </Link>
        </div>

        {/* Mobile Action & Menu Toggle Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <Link
            href="/create"
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1769E0] rounded-lg shadow-xs"
          >
            Book Now
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0B1F33] hover:text-[#1769E0] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Tablet menu toggle */}
        <div className="hidden sm:flex lg:hidden items-center ml-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0B1F33] hover:text-[#1769E0] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  pathname === link.href
                    ? "text-[#1769E0] font-bold bg-[#E8F2FF]/60"
                    : "text-[#0B1F33] hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/manage-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl"
            >
              <SearchCheck className="w-4 h-4 text-[#1769E0]" />
              <span>Find My Reservation</span>
            </Link>
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 text-xs font-bold text-white bg-[#1769E0] hover:bg-[#1255B8] rounded-xl shadow-xs"
            >
              <Plane className="w-4 h-4" />
              <span>Book Flight Reservation</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
