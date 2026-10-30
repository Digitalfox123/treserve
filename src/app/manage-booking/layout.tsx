import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage & Download Flight Reservation | Treserve",
  description:
    "Retrieve and download your verifiable flight reservation PDF using your booking reference code.",
  alternates: {
    canonical: "/manage-booking",
  },
};

export default function ManageBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
