-- Remove anonymous read; only service role (Edge Function) can read leads now.
drop policy if exists "Allow anonymous select" on public.leads;
