-- Supabase schema for booking without login
-- Tables: customers, booked_slots, upcoming_appointments
-- Overlap protection via exclusion constraint

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- Customers captured at booking time
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  unique (email)
);

-- Time slots that are taken (held/confirmed). Delete row to free slot.
create table if not exists public.booked_slots (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  ori_code text,
  location text not null default 'Tampa',
  status text not null default 'confirmed', -- 'held' | 'confirmed'
  created_at timestamptz not null default now(),
  constraint start_before_end check (end_at > start_at)
);

-- Prevent overlapping bookings for any active slot
do $$ begin
  -- Recreate exclusion constraint to be per-location
  begin
    alter table public.booked_slots drop constraint if exists booked_slots_no_overlap;
  exception when others then null; end;
  alter table public.booked_slots
    add constraint booked_slots_no_overlap
    exclude using gist (
      location with =,
      tstzrange(start_at, end_at, '[)') with &&
    );
exception when duplicate_object then null; end $$;

create index if not exists booked_slots_start_end_idx
  on public.booked_slots (start_at, end_at);

-- Appointments linked to a slot and a customer
create table if not exists public.upcoming_appointments (
  id uuid primary key default gen_random_uuid(),
  booked_slot_id uuid not null references public.booked_slots(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  service_name text,
  ori_code text,
  location text not null default 'Tampa',
  payment_done boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.customers enable row level security;
alter table public.booked_slots enable row level security;
alter table public.upcoming_appointments enable row level security;

-- Allow anonymous clients to read taken slots for availability UI
do $$ begin
  create policy "anon can read booked slots" on public.booked_slots
    for select to anon using (true);
exception when duplicate_object then null; end $$;

-- No anon policies for customers/upcoming_appointments (server uses service role key)


