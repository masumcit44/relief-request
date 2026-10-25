# ReliefRequest — Member 4 (Presenter & Researcher) Submission Guide

> **Your Role:** Member 4 — Presenter & Researcher (Storyteller)  
> **Mission:** Win the judges: verified evidence, a crisp 5-slide story, a rehearsed 3-click demo, honest Q&A, and backup media.  
> **Target Repository:** `https://github.com/masumcit44/relief-request.git`  
> **Your Dedicated Branch:** `feature/member4-pitch-presentation`  
> **Live Production URL:** `https://relief-request.vercel.app`

---

## 1. The Golden Rule (Zero Merge Conflicts)

You write **NO application code** (`src/` is untouched).  
You ONLY edit the presentation, documentation, and research files in `pitch/` and `README.md`.  
Because your files are completely disjoint from the code files owned by Members 1, 2, and 3, your branch will merge into `main` with **0 merge conflicts**.

---

## 2. Files You Own & Deliver

| Directory / File | Description | Core Requirement |
|---|---|---|
| `pitch/evidence.md` | August 2024 Feni/Noakhali/Cumilla flood research | 5–8 verified facts with exact dates and URLs (UN OCHA, ReliefWeb, UNICEF, Disaster Ministry, Daily Star). If a number is not verifiable, mark `UNVERIFIED - do not use`. |
| `pitch/slides.md` | 5-Slide Presentation Deck Outline | 5 slides: Hook, The Gap, Solution, Architecture, Roadmap. **Max 15 words per slide**, includes visual layout suggestion and 20–30s speaker notes. |
| `pitch/demo_script.md` | 60-Second Rehearsed Demo Script | Sentence-by-sentence table `[time \| speaker line \| who clicks \| what audience sees]`. Includes a contingency switch to backup video if live network fails. |
| `pitch/qa_sheet.md` | Red-Team Defense & Q&A | 10 tough judge questions with honest, structured answers. Clearly separates **"Built Today"** vs **"Roadmap"**. |
| `pitch/backup/` | Fail-safe Media | Screenshots (`01_form.png` to `05_rescued.png`) and backup demo video (`demo.mp4`). |
| `README.md` | Project Homepage Documentation | 1-paragraph pitch, live Vercel link (`https://relief-request.vercel.app`), tech stack, how to run, and team credits. |

---

## 3. Step-by-Step Execution Workflow

### Step 1: Clone or Open Your Workspace
If you are working on the shared machine via worktree:
```bash
cd D:/Desktop/hackathon-agent-os/day-1/relief-request-member4
```

If you are cloning independently onto your own laptop:
```bash
git clone https://github.com/masumcit44/relief-request.git
cd relief-request
git checkout feature/member4-pitch-presentation
```

### Step 2: Fulfill Your Documentation Deliverables

1. **`pitch/evidence.md`:**
   - Cite verified numbers from the August 2024 eastern Bangladesh flash floods (Feni, Noakhali, Cumilla).
   - Document the critical failure of Facebook posts during connectivity blackouts (lack of GPS, stranded posts with no coordination).

2. **`pitch/slides.md` (5 Slides):**
   - **Slide 1 (Hook & Problem):** Photo + 1 verified headline number (e.g., 5.8M people affected, 71 deaths).
   - **Slide 2 (The Gap):** Why Facebook help groups fail (lost in algorithm, no coordinates, duplicate efforts).
   - **Slide 3 (The Solution):** ReliefRequest — 1 single link, 2 taps, instant rescue coordination map.
   - **Slide 4 (Architecture):** Next.js 14 + Supabase Realtime + Leaflet map. Works under weak 2G/3G mobile networks.
   - **Slide 5 (Roadmap):** SMS/USSD fallback, offline PWA queue, duplicate request clustering, NGO/Army command dashboards.

3. **`pitch/demo_script.md` (60 Seconds):**
   - Timing:
     - 00:00–00:15: Member 1 opens `https://relief-request.vercel.app` on mobile, taps "Send GPS Location", taps "Send SOS".
     - 00:15–00:35: Audience sees red circle pin pulse onto Member 3's map dashboard in real time.
     - 00:35–00:50: Rescuer clicks pin, opens Google Maps directions, taps "Mark Rescued" ➔ pin turns green.
     - 00:50–01:00: Summary of live response latency (<3s).

4. **`pitch/qa_sheet.md` (Top 10 Tough Questions):**
   - *No internet during floods?* (Roadmap: USSD/SMS gateway fallback).
   - *Fake or spam requests?* (Built today: Bangladesh geo-bounding box & people limit; Roadmap: phone OTP & clustering).
   - *Why not just 999 or Facebook?* (999 lines get clogged; Facebook posts lack GPS coordinates and structured triage).
   - *Scalability & Cost?* (Serverless edge Next.js on Vercel + Postgres row-level security handles sudden spikes).

---

## 4. How to Commit and Push to GitHub

Once your documents and backup media are ready:

```bash
# Check status (confirm only pitch/ and README.md are modified)
git status

# Stage your pitch deliverables
git add pitch/ README.md

# Commit with a clean semantic commit message
git commit -m "docs(pitch): add 5-slide deck, 60s demo script, evidence log, and QA defense sheet"

# Pull latest main changes (with rebase to keep history clean)
git pull origin main --rebase

# Push your branch to GitHub
git push -u origin feature/member4-pitch-presentation
```

---

## 5. Submitting Your Pull Request (PR) on GitHub

1. Open your browser and navigate to:  
   👉 **`https://github.com/masumcit44/relief-request`**
2. Click **"Compare & pull request"** on the `feature/member4-pitch-presentation` banner.
3. Configure the branch targets:
   - **Base branch:** `main`
   - **Compare branch:** `feature/member4-pitch-presentation`
4. PR Title:
   ```text
   docs(pitch): presentation deck, evidence sheet, 60s demo script, and QA guide
   ```
5. Description checklist (copy and paste):
   ```markdown
   ### Pitch & Presentation Deliverables
   - [x] Verified August 2024 flood evidence citations with URLs (`pitch/evidence.md`)
   - [x] 5-slide pitch outline with visual suggestions & speaker notes (`pitch/slides.md`)
   - [x] 60-second synchronized live demo script (`pitch/demo_script.md`)
   - [x] Red-team QA sheet answering 10 difficult judge questions (`pitch/qa_sheet.md`)
   - [x] README updated with live Vercel link and project overview (`README.md`)
   - [x] Backup screenshot folder initialized (`pitch/backup/`)
   ```
6. Click **"Create pull request"**.
