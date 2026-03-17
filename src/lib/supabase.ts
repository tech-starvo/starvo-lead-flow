import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/firebase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client. When Firebase Auth is configured and the user is signed in,
 * the Firebase ID token is sent so Supabase can verify it via Third-Party Auth (Firebase).
 * Otherwise requests run as anon.
 */
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  accessToken: async () => {
    const user = auth?.currentUser ?? null;
    if (!user) return null;
    return (await user.getIdToken(/* forceRefresh */ false)) ?? null;
  },
});
