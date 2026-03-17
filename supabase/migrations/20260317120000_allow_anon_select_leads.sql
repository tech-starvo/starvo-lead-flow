-- Allow anonymous read for leads (admin list view; auth will be added later)
create policy "Allow anonymous select"
  on public.leads
  for select
  to anon
  using (true);
