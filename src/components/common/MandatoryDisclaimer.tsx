import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface MandatoryDisclaimerProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export function MandatoryDisclaimer({
  variant = "card",
  className = "",
}: MandatoryDisclaimerProps) {
  const disclaimerText =
    "Our service provides temporary reservations for visa documentation only. We do not guarantee visa approval. These are NOT actual flight tickets and are NOT valid for boarding.";

  if (variant === "inline") {
    return (
      <div
        className={`p-3.5 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5 ${className}`}
        role="alert"
      >
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold block text-amber-950 uppercase tracking-wide text-[11px]">
            Official Travel Document Disclaimer
          </strong>
          <p className="leading-relaxed font-medium">{disclaimerText}</p>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <aside
        className={`w-full bg-[#FFFBEB] border-y border-amber-200/80 py-4 px-4 sm:px-6 lg:px-8 ${className}`}
        aria-label="Official Service Disclaimer"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3 text-center">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 hidden sm:inline-block" />
          <p className="text-xs sm:text-sm font-semibold text-amber-950 max-w-4xl leading-normal">
            <span className="font-bold underline decoration-amber-500 mr-1.5 uppercase tracking-wider text-[11px] sm:text-xs">
              Notice:
            </span>
            {disclaimerText}
          </p>
        </div>
      </aside>
    );
  }

  // Default "card" variant for Homepage section and checkout panels
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 ${className}`}>
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center space-x-2">
              <span>Mandatory Service & Visa Documentation Notice</span>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Official Policy
              </span>
            </h4>
            <p className="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed max-w-4xl">
              {disclaimerText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
