"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0B1F33]">404 — Page Not Found</h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              The requested administrative endpoint is not publicly accessible or does not exist on this server.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
