import { MetadataRoute } from "next";
import { getAllGuides } from "@/lib/guides";
import { getBaseUrl } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModifiedDate = new Date("2026-10-30T00:00:00.000Z");

  const coreRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/create", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/temporary-reservation", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/itinerary", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/how-it-works", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/faqs", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/manage-booking", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/guides", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/refund-policy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/disclaimer", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const guideRoutes = getAllGuides().map((guide) => ({
    path: `/guides/${guide.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const allRoutes = [...coreRoutes, ...guideRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: lastModifiedDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
