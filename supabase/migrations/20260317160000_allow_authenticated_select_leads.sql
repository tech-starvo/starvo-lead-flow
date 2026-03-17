-- Allow signed-in users (Supabase Auth, e.g. Google) to read leads. Admin list/detail use this.
create policy "Allow authenticated select"
  on public.leads
  for select
  to authenticated
  using (true);
