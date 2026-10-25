-- ==============================================================================
-- ReliefRequest Database Schema
-- Owned by Member 2 (Backend & Database Specialist)
-- Target: Supabase Postgres
-- ==============================================================================

create extension if not exists pgcrypto;

create table if not exists sos_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Unknown',
  people_count int not null check (people_count between 1 and 50),
  urgency text not null check (urgency in ('High', 'Medium')),
  lat double precision not null check (lat between 20.5 and 26.7),
  lng double precision not null check (lng between 88.0 and 92.7),
  status text not null default 'pending' check (status in ('pending', 'rescued')),
  timestamp timestamptz not null default now()
);

create index if not exists idx_sos_status_timestamp on sos_requests (status, timestamp desc);

-- CRITICAL: Add table to realtime publication so rescuer map receives live updates
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and tablename = 'sos_requests'
  ) then
    alter publication supabase_realtime add table sos_requests;
  end if;
end $$;
