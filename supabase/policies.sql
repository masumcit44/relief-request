-- [M2] policies.sql: RLS on; anon insert/select, update status only via RPC
alter table sos_requests enable row level security;

create policy "Anon can insert pending requests" on sos_requests
  for insert with check (status = 'pending');

create policy "Anon can view all requests" on sos_requests
  for select using (true);

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

