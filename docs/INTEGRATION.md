# ReliefRequest — Integration & Deployment Guide

**Owner**: Member 2 (Backend & Database Specialist)  
**Target**: Supabase Postgres + Next.js App Router on Vercel

---

## 1. Quick Switch: Mock Mode vs Live Supabase Mode

The application uses an environment variable switch to decouple frontend/map work from database provisioning:

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=false
```

| Mode | `NEXT_PUBLIC_USE_MOCK` | Behavior |
| :--- | :--- | :--- |
| **Mock Mode** | `true` | Reads initial state from `src/lib/mock/sos.mock.json`. All mutations (`createSos`, `markRescued`) operate on an in-memory array with 300ms simulated network delay. Updates trigger local subscribers. Resets on browser reload. Zero external setup required. |
| **Live Mode** | `false` | Connects directly to Supabase Postgres over HTTPS and WebSocket Realtime. Persists data permanently in `sos_requests`. |

---

## 2. Supabase Setup Instructions (Step-by-Step)

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project**.
3. Choose project name: `relief-request`.
4. Region: Select **Singapore (ap-southeast-1)** (recommended for lowest latency in South Asia / Bangladesh).
5. Pricing plan: **Free tier**.

### Step 2: Obtain API Keys
1. In the Supabase Dashboard, go to **Project Settings** → **API**.
2. Copy the following two values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon public API Key** (`eyJhbGciOi...`)
3. **DO NOT copy the `service_role` key into frontend code or `.env.local`**. The application strictly uses Row Level Security (RLS) and the public `anon` key.

### Step 3: Run SQL Scripts in Order
Open the **SQL Editor** in the Supabase Dashboard (`/project/_/sql`) and run the SQL scripts in this exact sequence:

1. **`supabase/schema.sql`**:
   - Enables `pgcrypto`.
   - Creates the `sos_requests` table with checks (people count 1–50, Bangladesh coordinate boundaries).
   - Creates query indexes (`status`, `timestamp`).
   - Enables Row Level Security (RLS).
   - Adds `sos_requests` to the `supabase_realtime` publication.

2. **`supabase/policies.sql`**:
   - Creates the public INSERT policy (enforcing `status = 'pending'`).
   - Creates the public SELECT policy (enabling map and feed visibility).
   - Leaves direct UPDATE / DELETE disabled for public anon access.
   - Creates the security-definer RPC function `mark_rescued(p_id uuid)` and grants EXECUTE to anon.

3. **`supabase/seed.sql`**:
   - Seeds the 4 fictional demo records across Feni, Noakhali, and Cumilla.
   - Idempotent via `ON CONFLICT (id) DO UPDATE`.

---

## 3. Realtime Verification in Supabase Dashboard

To ensure markers update on rescuer maps automatically:
1. In Supabase Dashboard, navigate to **Database** → **Replication**.
2. Locate the `supabase_realtime` publication.
3. Ensure the toggle switch for table `sos_requests` is **ON** (enabled).
   *(Running `schema.sql` automatically registers this, but verify visually in the UI).*

---

## 4. Local Environment Configuration

Copy the example file:
```bash
cp .env.local.example .env.local
```

For **Mock Mode**:
```env
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For **Live Production Mode**:
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-real-anon-key>
```
