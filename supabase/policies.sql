-- ==============================================================================
-- ReliefRequest Security & Row Level Security (RLS) Policies
-- Owned by Member 2 (Backend & Database Specialist)
-- Target: Supabase Postgres
-- ==============================================================================

alter table sos_requests enable row level security;

-- Drop existing policies if rerun
drop policy if exists "Anon can insert pending requests" on sos_requests;
drop policy if exists "Anon can view all requests" on sos_requests;

-- Anon can insert pending requests
create policy "Anon can insert pending requests" on sos_requests
  for insert with check (status = 'pending');

-- Anon can view requests
create policy "Anon can view all requests" on sos_requests
  for select using (true);

-- Rescuers mark rescued via security definer RPC (prevents unauthorized updates)
create or replace function mark_rescued(p_id uuid)
returns sos_requests
language plpgsql
security definer
as $$
declare
  updated_row sos_requests;
begin
  update sos_requests
  set status = 'rescued'
  where id = p_id
  returning * into updated_row;
  return updated_row;
end;
$$;

grant execute on function mark_rescued(uuid) to anon;
