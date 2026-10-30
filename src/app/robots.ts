import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

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
          "/register",
          "/sign-in",
          "/checkout/",
          "/order/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
