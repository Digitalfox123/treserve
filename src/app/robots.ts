import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treserve.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/checkout/",
          "/order/",
          "/api/documents/",
          "/api/test-payments",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
