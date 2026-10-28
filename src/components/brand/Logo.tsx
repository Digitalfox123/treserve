import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark" | "monochrome";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function LogoIcon({
  className = "w-9 h-9",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`relative inline-block shrink-0 rounded-xl overflow-hidden shadow-xs ${className}`}>
      <Image
        src="/images/app-icon.png"
        alt="Treserve App Icon"
        width={size}
        height={size}
        priority
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function Logo({
  variant = "light",
  size = "md",
  iconOnly = false,
  className = "",
}: LogoProps) {
  if (iconOnly) {
    const iconDimensions = {
      sm: "w-7 h-7",
      md: "w-9 h-9",
      lg: "w-11 h-11",
      xl: "w-14 h-14",
    }[size];
    return <LogoIcon className={`${iconDimensions} ${className}`} />;
  }

  // Size styling for the complete horizontal wordmark
  // Original user-provided PNG aspect ratio: 1024 x 384 ≈ 2.67
  const dimensions = {
    sm: { width: 120, height: 45, className: "h-7 sm:h-8 w-auto" },
    md: { width: 160, height: 60, className: "h-8 sm:h-10 w-auto" },
    lg: { width: 200, height: 75, className: "h-10 sm:h-12 w-auto" },
    xl: { width: 240, height: 90, className: "h-12 sm:h-14 w-auto" },
  }[size];

  if (variant === "dark") {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <Image
          src="/images/treserve-official-logo-white.png"
          alt="Treserve — Plan Today · Travel Tomorrow"
          width={dimensions.width}
          height={dimensions.height}
          priority
          unoptimized
          className={`${dimensions.className} object-contain`}
        />
      </div>
    );
  }

  // Light variant (for Header, Sign In, Checkout, etc.)
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/images/treserve-official-logo.png"
        alt="Treserve — Plan Today · Travel Tomorrow"
        width={dimensions.width}
        height={dimensions.height}
        priority
        unoptimized
        className={`${dimensions.className} object-contain`}
      />
    </div>
  );
}

// Backward compatibility alias for any existing imports
export const LogoMark = LogoIcon;
