import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treserve.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal-admin-secure-8820",
          "/portal-admin-secure-8820/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/api/admin/",
          "/api/documents/",
          "/api/test-payments",
          "/checkout/",
          "/order/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
