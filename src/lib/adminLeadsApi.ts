/**
 * Admin leads API: calls the Supabase Edge Function with either a static admin token
 * (VITE_ADMIN_TOKEN) or the Firebase ID token. No Blaze plan or custom claims required
 * when using the static token; set ADMIN_TOKEN in the Edge Function secrets to match.
 */

import { auth } from "@/lib/firebase";

const ADMIN_LEADS_URL =
  (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "") + "/functions/v1/admin-leads";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export interface Lead {
  id: string;
  ref_number: string;
  full_name: string;
  company: string | null;
  whatsapp: string;
  email: string | null;
  city: string | null;
  interest: string;
  has_location: string | null;
  location_type: string | null;
  budget: string | null;
  units: string | null;
  charger_type: string | null;
  address: string | null;
  land_area: string | null;
  map_lat: number | null;
  map_lng: number | null;
  timeline: string | null;
  notes: string | null;
  created_at: string;
}

async function request<T>(options: { adminToken: string | null; firebaseToken: string | null }, path = ""): Promise<T> {
  const url = path ? `${ADMIN_LEADS_URL}?id=${encodeURIComponent(path)}` : ADMIN_LEADS_URL;
  // Supabase gateway requires Authorization: Bearer <anon_key> to accept the request
  const headers: Record<string, string> = {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
  if (options.adminToken) {
    headers["x-admin-token"] = options.adminToken;
  } else if (options.firebaseToken) {
    headers["x-firebase-token"] = options.firebaseToken;
  }
  const res = await fetch(url, { method: "GET", headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : "Request failed";
    throw new Error(message);
  }
  return data as T;
}

/**
 * Resolve tokens for admin API: static VITE_ADMIN_TOKEN (x-admin-token) if set,
 * otherwise Firebase ID token (x-firebase-token). Supabase gateway gets anon key in Authorization.
 */
export async function getAdminApiTokens(): Promise<{ adminToken: string | null; firebaseToken: string | null }> {
  const staticToken = import.meta.env.VITE_ADMIN_TOKEN;
  if (staticToken && typeof staticToken === "string" && staticToken.trim() !== "") {
    return { adminToken: staticToken.trim(), firebaseToken: null };
  }
  const user = auth?.currentUser ?? null;
  if (!user) return { adminToken: null, firebaseToken: null };
  const firebaseToken = (await user.getIdToken()) ?? null;
  return { adminToken: null, firebaseToken: firebaseToken };
}

/** Fetch all leads (admin only). */
export async function fetchAdminLeads(tokenOverrides?: { adminToken?: string; firebaseToken?: string }): Promise<Lead[]> {
  const tokens = tokenOverrides ?? (await getAdminApiTokens());
  if (!tokens.adminToken && !tokens.firebaseToken) throw new Error("Not authenticated");
  return request<Lead[]>(tokens);
}

/** Fetch a single lead by id (admin only). */
export async function fetchAdminLeadById(
  id: string,
  tokenOverrides?: { adminToken?: string; firebaseToken?: string }
): Promise<Lead | null> {
  const tokens = tokenOverrides ?? (await getAdminApiTokens());
  if (!tokens.adminToken && !tokens.firebaseToken) throw new Error("Not authenticated");
  return request<Lead | null>(tokens, id);
}
