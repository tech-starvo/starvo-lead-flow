-- Leads table: form submissions from starvo-lead-flow
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  ref_number text not null,
  full_name text not null,
  company text,
  whatsapp text not null,
  email text,
  city text,
  interest text not null,
  has_location text,
  location_type text,
  budget text,
  units text,
  charger_type text,
  address text,
  land_area text,
  map_lat numeric,
  map_lng numeric,
  timeline text,
  notes text,
  created_at timestamptz not null default now()
);

-- Only allow anonymous insert; no public read (view via Studio or service role)
alter table public.leads enable row level security;

create policy "Allow anonymous insert"
  on public.leads
  for insert
  to anon
  with check (true);
