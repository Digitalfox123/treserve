import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Verifiable Flight Reservation for Visa | Treserve",
  description:
    "Book a genuine temporary flight reservation with live airline PNR code for embassy visa applications or proof of onward travel.",
  alternates: {
    canonical: "/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
