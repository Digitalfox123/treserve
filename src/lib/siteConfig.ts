/**
 * Site configuration and canonical URL resolver for Treserve.
 * Ensures consistent canonical URLs across sitemap.xml, robots.txt, metadata, and JSON-LD schemas.
 */

export const SITE_URL = "https://treserve.vercel.app";
export const SITE_NAME = "Treserve";

export function getBaseUrl(): string {
  // If NEXT_PUBLIC_APP_URL is set to a valid public HTTPS URL (and not localhost)
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost") &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("127.0.0.1")
  ) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  // Vercel auto-provided system environment variable for production deployments
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }

  // Canonical production fallback
  return SITE_URL;
}
