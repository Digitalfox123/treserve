"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user ?? null);
      } catch {
        // Fallback
      }
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Fallback
    }
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
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
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-[#1769E0] font-semibold bg-[#E8F2FF]/60"
                    : "text-[#0B1F33] hover:text-[#1769E0] hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Sign In / Get Started or Dashboard when logged in) */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            /* Logged-in State: Show Dashboard & User Profile */
            <>
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-[#0B1F33] hover:text-[#1769E0] bg-slate-50 hover:bg-[#E8F2FF]/60 border border-slate-200 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-[#1769E0]" />
                <span>Dashboard</span>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-[#0B1F33] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1769E0] text-white text-[10px] font-bold flex items-center justify-center">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[120px] truncate text-[11px] font-semibold text-slate-700">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Account"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-[11px] font-bold text-[#0B1F33] truncate">
                        {user.user_metadata?.full_name || "Traveler"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:text-[#1769E0] hover:bg-slate-50"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Reservations</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged-out State: ONLY Sign In & Get Started */
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-xs font-semibold text-[#1769E0] border border-[#1769E0] rounded-lg hover:bg-[#E8F2FF]/60 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1769E0] hover:bg-[#1255B8] rounded-lg shadow-sm hover:shadow transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center space-x-2">
          {user ? (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-bold text-[#1769E0] bg-[#E8F2FF] rounded-md"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1769E0] rounded-md"
            >
              Get Started
            </Link>
          )}
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
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
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
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-[#1769E0] bg-[#E8F2FF]/60 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.email})</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold text-[#1769E0] border border-[#1769E0] rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold text-white bg-[#1769E0] rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
