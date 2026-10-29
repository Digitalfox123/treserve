import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treserve.com";

  const publicRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/create", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/temporary-reservation", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/manage-booking", changeFrequency: "daily" as const, priority: 0.85 },
    { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/how-it-works", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/faqs", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/refund-policy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/disclaimer", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
