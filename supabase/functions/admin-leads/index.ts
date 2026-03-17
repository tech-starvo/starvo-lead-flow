// Admin-only leads API: verifies Firebase ID token and returns leads via service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token, x-firebase-token",
};

interface FirebaseLookupResponse {
  users?: Array<{ email?: string }>;
  error?: { message: string };
}

async function verifyFirebaseToken(idToken: string): Promise<{ email: string } | null> {
  const apiKey = Deno.env.get("FIREBASE_API_KEY");
  if (!apiKey) {
    console.error("FIREBASE_API_KEY is not set");
    return null;
  }
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  const data: FirebaseLookupResponse = await res.json();
  if (!res.ok || data.error || !data.users?.length) {
    return null;
  }
  const email = data.users[0].email;
  return email ? { email } : null;
}

const ALLOWED_EMAIL_DOMAINS = ["starvo.co.id", "moizasia.com", "electrifyindonesia.id"];

function isAllowedEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false;
}

function isAdmin(email: string): boolean {
  if (!isAllowedEmailDomain(email)) return false;
  const list = Deno.env.get("ADMIN_EMAILS");
  if (!list) return true; // If not set, allow any verified user from allowed domains
  const emails = list.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Static admin token (no Blaze/custom claims): check x-admin-token header first
  const adminTokenHeader = req.headers.get("x-admin-token")?.trim();
  const adminTokenSecret = Deno.env.get("ADMIN_TOKEN")?.trim();
  if (
    adminTokenSecret &&
    adminTokenHeader &&
    adminTokenHeader.length > 0 &&
    adminTokenSecret === adminTokenHeader
  ) {
    // Static token matches; proceed to serve leads
  } else {
    // Firebase ID token in x-firebase-token (Supabase gateway expects anon key in Authorization)
    const token = req.headers.get("x-firebase-token")?.trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing x-admin-token or x-firebase-token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const user = await verifyFirebaseToken(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!isAdmin(user.email)) {
      return new Response(
        JSON.stringify({ error: "Forbidden: not an admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }


  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const url = new URL(req.url);
  const leadId = url.searchParams.get("id");

  if (leadId) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.code === "PGRST116" ? 404 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify(data ?? []), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
