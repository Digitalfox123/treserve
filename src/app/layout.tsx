import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://treserve.com"),
  title: {
    default: "Treserve — Verifiable Temporary Flight Reservation for Visa & Onward Travel",
    template: "%s | Treserve",
  },
  description:
    "Get genuine, verifiable temporary flight reservations with live PNR code for Schengen, US, UK, Canada & worldwide embassy visa applications or proof of onward travel. Instant delivery without paying full airfare — zero registration required.",
  keywords: [
    "flight reservation for visa",
    "temporary flight reservation",
    "verifiable flight reservation",
    "flight reservation with pnr",
    "flight ticket for visa application",
    "dummy ticket for visa",
    "schengen visa flight reservation",
    "proof of onward travel",
    "embassy flight reservation",
    "flight booking for visa",
    "onward ticket reservation",
    "verifiable flight ticket hold",
  ],
  authors: [{ name: "Treserve Flight Reservation Services", url: "https://treserve.com" }],
  creator: "Treserve",
  publisher: "Treserve Travel Technologies",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-placeholder",
    other: {
      "msvalidate.01": "bing-site-verification-placeholder",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/app-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Treserve — Verifiable Temporary Flight Reservation for Visa & Onward Travel",
    description:
      "Get genuine, verifiable temporary flight reservations with live PNR code for Schengen, US, UK, Canada & worldwide embassy visa applications or proof of onward travel.",
    url: "https://treserve.com",
    siteName: "Treserve",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-wing.jpg",
        width: 1200,
        height: 630,
        alt: "Treserve Verifiable Flight Reservation for Visa Applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Treserve — Verifiable Temporary Flight Reservation for Visa",
    description:
      "Instant verifiable temporary flight reservations with live PNR code for embassy visa applications & proof of onward travel.",
    images: ["/images/hero-wing.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F33",
  width: "device-width",
  initialScale: 1,
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Treserve",
  url: "https://treserve.com",
  logo: "https://treserve.com/images/app-icon.png",
  description:
    "Official provider of verifiable temporary flight reservations and PNR bookings for international visa applications and proof of onward travel.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Treserve",
  url: "https://treserve.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://treserve.com/create?from={from}&to={to}",
    "query-input": "required name=from",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Temporary Flight Reservation for Visa Application",
  serviceType: "Flight Reservation",
  description:
    "Genuine temporary flight reservations with verifiable PNR codes for Schengen, US, UK, Canada & worldwide embassy visa applications and proof of onward travel.",
  provider: {
    "@type": "Organization",
    name: "Treserve",
    url: "https://treserve.com",
  },
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    price: "35.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://treserve.com/create",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a temporary flight reservation for visa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A temporary flight reservation is a genuine flight booking held through authorized airline reservation systems with a verifiable 6-character PNR code. It satisfies embassy requirements for proof of onward travel without requiring purchase of expensive non-refundable flight tickets.",
      },
    },
    {
      "@type": "Question",
      name: "Are Treserve flight reservations accepted by embassies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our reservations are formatted specifically to meet consular standards for Schengen, US, UK, Canada, Australia, and worldwide embassies. They contain official airline flight numbers, dates, routes, and verified passenger details.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to sign up or create an account to book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account registration or sign up is required. You can search flights, enter passenger details, pay, and instantly download your A4 PDF reservation. You can retrieve it anytime using your booking reference.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#0B1F33] selection:bg-[#E8F2FF] selection:text-[#1769E0]">
        {children}
      </body>
    </html>
  );
}
