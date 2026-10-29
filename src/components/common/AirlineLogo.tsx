"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plane } from "lucide-react";

interface AirlineLogoProps {
  airlineCode?: string;
  airlineName?: string;
  className?: string;
  size?: number;
}

export function AirlineLogo({
  airlineCode = "FL",
  airlineName = "Airline",
  className = "w-11 h-11",
  size = 48,
}: AirlineLogoProps) {
  const code = (airlineCode || "FL").trim().toUpperCase();
  const [imgError, setImgError] = useState(false);
  const [useBackup, setUseBackup] = useState(false);

  // Primary CDN: Kiwi Airlines CDN (verified 200 OK for global carriers)
  // Backup CDN: Avs.io
  const primaryUrl = `https://images.kiwi.com/airlines/64x64/${code}.png`;
  const backupUrl = `https://pics.avs.io/64/64/${code}.png`;

  const logoUrl = useBackup ? backupUrl : primaryUrl;

  const handleImageError = () => {
    if (!useBackup) {
      setUseBackup(true);
    } else {
      setImgError(true);
    }
  };

  if (imgError || !code || code === "FL" || code === "TR") {
    return (
      <div
        className={`${className} rounded-2xl bg-gradient-to-br from-[#E8F2FF] to-[#D0E4FF] border border-[#1769E0]/20 flex items-center justify-center shrink-0 shadow-2xs`}
        title={airlineName}
      >
        <span className="font-black text-xs sm:text-sm text-[#1769E0] tracking-wider">
          {code.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden relative group`}
      title={airlineName}
    >
      <img
        src={logoUrl}
        alt={`${airlineName} logo`}
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-200 group-hover:scale-105"
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
}
