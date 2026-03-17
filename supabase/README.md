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

That runs [supabase/migrations/20260317031150_create_init_table.sql](migrations/20260317031150_create_init_table.sql) on your hosted DB. Check **Table Editor** in the dashboard to see the `leads` table.

### 2. Fallback: run SQL in the dashboard

If you prefer not to use the CLI, open **Supabase Dashboard** → your project → **SQL Editor**, then paste and run the contents of `supabase/migrations/20260317031150_create_init_table.sql`.

---

## Viewing / fetching data

- **In the dashboard:** Table Editor → `leads` shows all rows (uses service role).
- **From your app:** The current RLS policy allows **insert** only for anonymous users. To **select** (fetch) leads from the client you would need either:
  - A separate policy that allows `SELECT` for a specific role (e.g. authenticated admin), or
  - A backend or Edge Function that uses the **service role** key to query `leads` and returns data to your app.
- For quick tests you can use the dashboard or run `select * from leads` in the SQL Editor.
