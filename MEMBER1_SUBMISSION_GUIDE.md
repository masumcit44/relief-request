# ReliefRequest — Member 1 (Frontend Developer) Submission Guide

> **Your Role:** Member 1 — Frontend Developer (UI & UX Owner)  
> **Mission:** Enable a flood victim on a weak 2G/3G phone to send an SOS in 2 taps.  
> **Target Repository:** `https://github.com/masumcit44/relief-request.git`  
> **Your Dedicated Branch:** `feature/member1-sos-form`  
> **Local Dev Port:** `3001` (`npm run dev -- --port 3001`)

---

## 1. The 3 Golden Rules (Zero Merge Conflict Guarantee)

To guarantee that your code merges with Member 3 (Map) and Member 2 (Backend) with **0 merge conflicts**:

1. **Strict File Ownership:** You ONLY edit the files you own (listed below). **Never** touch `src/components/map/*`, `src/hooks/useSosFeed.ts`, `src/lib/markerColor.ts`, or `src/app/rescuer/page.tsx` (owned by Member 3).
2. **Use the Single Data Door:** When submitting a form, import and call `createSos(input)` from `@/lib/sosApi`. Do not make raw fetch calls or edit backend files.
3. **Never Change Contract Field Names:** The SOS fields are frozen: `name`, `people_count`, `urgency` (`'High' | 'Medium'`), `lat`, `lng`.

---

## 2. Files You Own & Work In

| Directory / File | Description |
|---|---|
| `src/app/page.tsx` | Victim landing page (`ReliefRequest — বন্যা SOS`), offline banner |
| `src/app/sos/success/page.tsx` | "Help is on the way!" confirmation screen + safety tips |
| `src/components/sos/SosForm.tsx` | Form: name (optional), people count (+/- stepper), urgency toggle, GPS trigger, submit button |
| `src/components/sos/GpsButton.tsx` | Giant high-contrast "Send GPS Location" / "লোকেশন পাঠান" button |
| `src/components/sos/UrgencyToggle.tsx` | Segmented toggle for High / Medium urgency |
| `src/components/ui/Button.tsx` | Large touch targets (min height 56px) |
| `src/components/ui/Card.tsx` | Container cards |
| `src/components/ui/Spinner.tsx` | Loading spinner |
| `src/lib/geolocation.ts` | HTML5 Geolocation wrapper with Bengali + English error fallback |
| `src/app/layout.tsx` | Noto Sans Bengali font + mobile viewport |
| `src/app/globals.css` | High-contrast, clean emergency UI styling |

---

## 3. Step-by-Step Execution Workflow

### Step 1: Clone or Open Your Workspace
If you are working on the team machine via worktree:
```bash
cd D:/Desktop/hackathon-agent-os/day-1/relief-request-member1
```
If you are cloning independently onto your own laptop:
```bash
git clone https://github.com/masumcit44/relief-request.git
cd relief-request
git checkout feature/member1-sos-form
npm install
```

### Step 2: Start Local Development Server
Always run on port `3001` so you do not clash with Member 2 (3002) or Member 3 (3003):
```bash
npm run dev -- --port 3001
```
Open in browser: `http://localhost:3001`

### Step 3: Implement Your Features
1. **`src/lib/geolocation.ts`:**
   - Wraps `navigator.geolocation.getCurrentPosition`.
   - Timeout: 10,000ms, `enableHighAccuracy: true`.
   - Provides clear bilingual error messages if permission is denied, timed out, or unavailable.
2. **`src/components/sos/GpsButton.tsx`:**
   - States: `idle` ➔ `locating` (shows spinner) ➔ `ok` (shows coordinates + accuracy) ➔ `error` (retry button).
3. **`src/components/sos/SosForm.tsx`:**
   - People stepper (1 to 50, default 1).
   - High / Medium urgency segmented button.
   - Disabled Submit button until GPS coordinates are captured.
   - On submit: calls `createSos()` from `@/lib/sosApi`, redirects to `/sos/success?id=...`.

### Step 4: Validate Before Committing
Run both checks in your terminal. **Both must pass without errors:**
```bash
# 1. Run ESLint
npm run lint

# 2. Run Next.js production build
npm run build
```

---

## 4. How to Commit and Push to GitHub

Once your code builds with 0 errors:

```bash
# Check modified files (ensure only your owned files are modified)
git status

# Stage your files
git add src/app/page.tsx src/app/sos/success/page.tsx src/components/sos/ src/components/ui/ src/lib/geolocation.ts

# Commit with a standardized semantic message
git commit -m "feat(sos): add victim SOS form and geolocation flow"

# Pull latest main changes to ensure branch is synchronized
git pull origin main --rebase

# Push your branch to GitHub
git push -u origin feature/member1-sos-form
```

---

## 5. Submitting Your Pull Request (PR) on GitHub

1. Go to: `https://github.com/masumcit44/relief-request`
2. You will see a banner: **`feature/member1-sos-form had recent pushes`**. Click **"Compare & pull request"**.
3. Set:
   - **Base branch:** `main`
   - **Compare branch:** `feature/member1-sos-form`
4. PR Title:
   ```text
   feat(sos): victim SOS form, GPS capture, and confirmation flow
   ```
5. Description checklist (copy and paste):
   ```markdown
   ### Completed Tasks
   - [x] Victim SOS form renders on mobile (tested at 360px width)
   - [x] Geolocation button captures GPS with high accuracy & bilingual errors
   - [x] People stepper (1-50) and Urgency toggle (High/Medium)
   - [x] Successful submit calls createSos() and redirects to /sos/success
   - [x] Offline indicator banner
   - [x] npm run lint passes (0 errors)
   - [x] npm run build passes (0 errors)
   ```
6. Click **"Create pull request"**.

---

## 6. Testing Integration with Member 3 (Rescuer Map)

Once your PR is submitted or merged:
1. Open Member 3's map: `http://localhost:3003/rescuer` (or deployed Vercel link).
2. Open your victim form on your phone: `http://localhost:3001` (or phone browser).
3. Tap **"Send GPS Location"**, then tap **"Send SOS"**.
4. **Verification:** Watch Member 3's screen — your submitted request must appear as a pulsing red circle on the map in real time!
