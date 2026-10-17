import "server-only";
import { headers } from "next/headers";
import { SITE } from "@/lib/constants";

/** Absolute origin of the current request (works locally, on Vercel previews and in production). */
export async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE.url;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
