alter table public.leads
  add column if not exists current_power_capacity text,
  add column if not exists parking_slots text,
  add column if not exists estimated_vehicles text;
