# Supabase setup

## Apply the `leads` table

### 1. Run the migrations (recommended)

From the project root:

```bash
# One-time: link to your hosted project (use project ref from dashboard URL)
npx supabase link --project-ref <your-project-ref>

# Apply all migrations in supabase/migrations/ to the linked project
npx supabase db push
```

That runs all migrations. Check **Table Editor** in the dashboard to see the `leads` table.

### 2. Fallback: run SQL in the dashboard

If you prefer not to use the CLI, open **Supabase Dashboard** → your project → **SQL Editor**, then run the migration files in order.

---

## Admin access to leads

- **Form submit:** Anonymous users can **insert** into `leads` (public form).
- **Admin list/detail:** Leads are loaded via the **admin-leads** Edge Function (service role), so RLS and Supabase JWT role are not used for admin reads.

### Option A – Static admin token (no Blaze / no custom claims)

1. **Set Edge Function secret:** Supabase Dashboard → **Project Settings** → **Edge Functions** → add secret `ADMIN_TOKEN` with a long random string (e.g. `openssl rand -hex 32`).
2. **Set frontend env:** In `.env`, set `VITE_ADMIN_TOKEN` to the **same** value as `ADMIN_TOKEN`. The admin app will send this in the `Authorization` header when fetching leads.
3. **Optional:** Set `ADMIN_EMAILS` in Edge Function secrets (comma-separated) if you also use Firebase token auth; leave unset to allow any verified Firebase user when not using the static token.

**Note:** `VITE_*` vars are embedded in the client bundle, so anyone who can open your app can see the token. Use this for internal/small-team tools; for public apps prefer Option B (Firebase token only) and set `role: 'authenticated'` via a backend or script.

### Option B – Firebase token (Third-Party Auth + custom claim)

### 1. Add Firebase in Supabase (Third-Party Auth)

- **Supabase Dashboard** → **Authentication** → **Third-party auth** (or [Auth settings](https://supabase.com/dashboard/project/_/auth/third-party)).
- Add a new integration and choose **Firebase**.
- Enter your **Firebase Project ID** (from [Firebase Console](https://console.firebase.google.com) → Project settings → General).

### 2. Set the `role: 'authenticated'` claim in Firebase

Supabase uses the JWT’s `role` claim to grant the `authenticated` Postgres role. Firebase JWTs don’t include it by default, so you must add it.

**Option A – Blocking functions (Firebase with Identity Platform)**  
Use a [beforeUserCreated](https://firebase.google.com/docs/auth/extend-with-blocking-functions) (and optionally beforeUserSignedIn) blocking function that sets `customClaims` or `sessionClaims` to `{ role: 'authenticated' }`.

**Option B – Cloud Function (any Firebase project)**  
Use an [onCreate](https://firebase.google.com/docs/auth/extend-with-functions) Cloud Function that calls the Admin SDK to set custom claims:

```js
const admin = require('firebase-admin');
admin.initializeApp();

exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  await admin.auth().setCustomUserClaims(user.uid, { role: 'authenticated' });
});
```

Then **force-refresh the ID token** right after sign-up in the app (e.g. `user.getIdToken(true)`) so the first request sends a token that includes the new claim. For existing users, run a one-time script with the Admin SDK to set `role: 'authenticated'` on all users (see [Supabase Firebase Auth docs](https://supabase.com/docs/guides/auth/third-party/firebase-auth)).

### 3. Migrations (Option B only)

Ensure the **Allow authenticated select** policy exists on `leads` (migration `20260317160000_allow_authenticated_select_leads.sql`). Run `npx supabase db push` if needed. With Option A, admin reads go through the Edge Function (service role), so this policy is not used for the admin UI.

---

## Viewing data in the dashboard

- **Table Editor** → `leads` shows all rows (uses service role).
- **SQL Editor:** `select * from leads` for ad-hoc queries.
