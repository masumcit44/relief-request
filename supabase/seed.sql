-- ==============================================================================
-- ReliefRequest Demo Seed Data
-- Owned by Member 2 (Backend & Database Specialist)
-- Target: Supabase Postgres
-- ==============================================================================
-- DISCLAIMER: All names and records below are strictly fictional demo data
-- created for demonstration and testing of the Flood Help Request Board.
-- They do NOT represent real individuals or live emergency calls.
-- ==============================================================================

insert into sos_requests (id, name, people_count, urgency, lat, lng, status, timestamp)
values
  ('a0000000-0000-0000-0000-000000000001', 'Rahima Begum', 6, 'High', 23.0159, 91.3976, 'pending', '2024-08-23T09:12:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'Karim Mia', 3, 'Medium', 22.9800, 91.4200, 'pending', '2024-08-23T09:30:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'Shapla Akter', 9, 'High', 22.8696, 91.0995, 'pending', '2024-08-23T10:02:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'Jamal Uddin', 2, 'Medium', 23.4607, 91.1809, 'rescued', '2024-08-23T08:45:00Z')
on conflict (id) do update set
  name = excluded.name,
  people_count = excluded.people_count,
  urgency = excluded.urgency,
  lat = excluded.lat,
  lng = excluded.lng,
  status = excluded.status,
  timestamp = excluded.timestamp;
