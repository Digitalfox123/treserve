import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Visa Flight Reservations | Treserve",
  description:
    "Answers to common questions about verifiable temporary flight reservations, PNR validity, embassy requirements, and instant PDF delivery.",
  alternates: {
    canonical: "/faqs",
  },
};

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
