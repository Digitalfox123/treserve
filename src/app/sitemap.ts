import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treserve.com";

  const publicRoutes = [
    "",
    "/services",
    "/itinerary",
    "/temporary-reservation",
    "/how-it-works",
    "/pricing",
    "/faqs",
    "/contact",
    "/sign-in",
    "/register",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/disclaimer",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/services") ? 0.9 : 0.7,
  }));
}
