# ReliefRequest — Member 2 (Backend Developer) Submission Guide

> **Your Role:** Member 2 — Backend & Database Specialist (Speed Coder)  
> **Mission:** Own the database, Supabase configuration, and the single data door (`sosApi.ts`) with a seamless mock/live switch.  
> **Target Repository:** `https://github.com/masumcit44/relief-request.git`  
> **Your Dedicated Branch:** `feature/member2-backend-database`  
> **Local Dev Port:** `3002` (`npm run dev -- --port 3002`)

---

## 1. The 3 Golden Rules (Zero Merge Conflict Guarantee)

To guarantee that your database and backend code merges with Member 1 (Form) and Member 3 (Map) with **0 merge conflicts**:

1. **Strict File Ownership:** You ONLY edit backend, database, and contract files (listed below). **Never** edit frontend UI components (`src/components/*` or `src/app/rescuer/page.tsx`).
2. **Preserve the Function Signatures in `sosApi.ts`:** Both Member 1 and Member 3 import strictly from `@/lib/sosApi`. The signatures for `createSos()`, `listSos()`, `markRescued()`, and `subscribeSos()` are **frozen**. Do not rename or change their parameter shapes.
3. **Keep Secrets Out of Git:** Never commit `.env` or `.env.local`. Only commit generic placeholders in `.env.local.example`.

---

## 2. Files You Own & Work In

| Directory / File | Description |
|---|---|
| `supabase/schema.sql` | `sos_requests` table, check constraints, realtime publication |
| `supabase/policies.sql` | Row Level Security (RLS) policies + `mark_rescued()` RPC |
| `supabase/seed.sql` | Demo seed rows for Feni, Noakhali, and Cumilla |
| `src/lib/types.ts` | Frozen TypeScript types: `SosRequest`, `NewSos`, `Urgency`, `SosStatus` |
| `src/lib/supabase.ts` | Supabase browser client initialization (`createClient`) |
| `src/lib/sosApi.ts` | Single data door supporting both mock (`USE_MOCK=true`) and live Supabase |
| `src/lib/mock/sos.mock.json` | 4 realistic fallback records (Feni, Maijdee, Cumilla) |
| `docs/API_CONTRACT.md` | Formal API contract documentation |
| `docs/INTEGRATION.md` | Step-by-step instructions on switching from mock to live data |
| `.env.local.example` | Template for environment variables |

---

## 3. Database Specification (`supabase/*.sql`)

### 1. `supabase/schema.sql`
```sql
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
alter publication supabase_realtime add table sos_requests;
```

### 2. `supabase/policies.sql`
```sql
alter table sos_requests enable row level security;

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
```

---

## 4. Step-by-Step Execution Workflow

### Step 1: Clone or Open Your Workspace
If you are working on the team machine via worktree:
```bash
cd D:/Desktop/hackathon-agent-os/day-1/relief-request-member2
```
If you are cloning independently onto your own machine:
```bash
git clone https://github.com/masumcit44/relief-request.git
cd relief-request
git checkout feature/member2-backend-database
npm install
```

### Step 2: Set Up Local Environment Variables
Create a local `.env.local` file (this is in `.gitignore`, never committed):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_USE_MOCK=false
```

### Step 3: Run Database Migrations in Supabase
1. Open your Supabase Dashboard: **SQL Editor**.
2. Run `supabase/schema.sql`.
3. Run `supabase/policies.sql`.
4. Run `supabase/seed.sql`.
5. Under **Database ➔ Replication**, verify that `sos_requests` is toggled ON under `supabase_realtime`.

### Step 4: Test Local Development Server
Always run on port `3002` so you do not clash with Member 1 (3001) or Member 3 (3003):
```bash
npm run dev -- --port 3002
```

### Step 5: Validate Before Committing
Run both checks in your terminal. **Both must pass without errors:**
```bash
# 1. Run ESLint
npm run lint

# 2. Run Next.js production build
npm run build
```

---

## 5. How to Commit and Push to GitHub

Once your code builds with 0 errors:

```bash
# Check modified files (ensure no .env or secret files are staged!)
git status

# Stage only your owned files
git add supabase/ src/lib/sosApi.ts src/lib/supabase.ts src/lib/types.ts src/lib/mock/ docs/ .env.local.example

# Commit with a standardized semantic message
git commit -m "feat(backend): configure Supabase schema, RLS policies, and live sosApi integration"

# Pull latest main changes to ensure branch is synchronized
git pull origin main --rebase

# Push your branch to GitHub
git push -u origin feature/member2-backend-database
```

---

## 6. Submitting Your Pull Request (PR) on GitHub

1. Go to: `https://github.com/masumcit44/relief-request`
2. Click **"Compare & pull request"** for `feature/member2-backend-database`.
3. Set:
   - **Base branch:** `main`
   - **Compare branch:** `feature/member2-backend-database`
4. PR Title:
   ```text
   feat(backend): Supabase schema, realtime publication, RLS policies, and live data door
   ```
5. Description checklist (copy and paste):
   ```markdown
   ### Completed Tasks
   - [x] Schema created with validation constraints (people_count 1-50, Bangladesh coordinates bbox)
   - [x] Added sos_requests to supabase_realtime publication
   - [x] Row Level Security (RLS) configured (anon insert/select, mark_rescued RPC)
   - [x] Seed data applied for Feni, Maijdee, and Cumilla
   - [x] sosApi.ts tested with NEXT_PUBLIC_USE_MOCK=false against live Supabase
   - [x] Zero secrets committed (.env.local excluded in .gitignore)
   - [x] npm run lint & npm run build pass with 0 errors
   ```
6. Click **"Create pull request"**.

---

## 7. Handover to Member 1 & Member 3 for Live Demo

Share the following with Member 1 & Member 3 privately (e.g. team chat, do not post in public PR):
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Instruct them to set `NEXT_PUBLIC_USE_MOCK=false` in their local `.env.local` to enable live end-to-end synchronization!
