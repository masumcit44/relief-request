# Member 3 Task: Map API and Logic Integrator

## Role
Map API and Logic Integrator

## Core Task
- Rescue dashboard map (`src/components/map/RescueMap.tsx`)
- SOS markers (`src/components/map/SosMarker.tsx`)
- Urgency color logic (`src/lib/markerColor.ts`)
- Marker popup details (`src/components/map/MarkerPopup.tsx`)
- Mark-as-rescued interaction (`src/hooks/useSosFeed.ts` & `src/lib/sosApi.ts`)
- Demo seed data (`src/lib/mock/sos.mock.json`)
- Rescuer dashboard page (`src/app/rescuer/page.tsx`)

## Branch
`feature/member3-rescue-map`

## Local Development
Run on port 3003:
```bash
npm run dev -- --port 3003
```
Dashboard available at: `http://localhost:3003/rescuer`
