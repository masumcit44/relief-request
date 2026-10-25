# Shared API Contract (ReliefRequest)

This document is the **FROZEN** API contract across all member feature branches (`feature/member1-sos-form`, `feature/member2-backend-database`, `feature/member3-rescue-map`). Field names, types, and allowed values must **NOT** be renamed or changed independently.

## Model: `SosRequest`

| Field | Type | Expected Values / Constraints | Description |
|---|---|---|---|
| `id` | `string` | UUID format (e.g., `gen_random_uuid()` or mock ID) | Unique identifier |
| `name` | `string` | Free text; defaults to `'Unknown'` if empty | Contact or victim name |
| `people_count` | `number` | Integer between `1` and `50` | Total individuals needing evacuation |
| `urgency` | `string` | `'High'` \| `'Medium'` | Triage priority level |
| `lat` | `number` | Double precision between `20.5` and `26.7` | GPS Latitude (Bangladesh bounding box) |
| `lng` | `number` | Double precision between `88.0` and `92.7` | GPS Longitude (Bangladesh bounding box) |
| `status` | `string` | `'pending'` \| `'rescued'` | Rescue lifecycle state (default: `'pending'`) |
| `timestamp` | `string` | ISO 8601 string (e.g., `2024-08-23T09:12:00Z`) | Submission timestamp |

## TypeScript Definition (`src/lib/types.ts`)

```typescript
export type Urgency = 'High' | 'Medium';
export type SosStatus = 'pending' | 'rescued';

export interface SosRequest {
  id: string; // uuid
  name: string;
  people_count: number; // >= 1
  urgency: Urgency;
  lat: number;
  lng: number;
  status: SosStatus; // default 'pending'
  timestamp: string; // ISO 8601
}

export type NewSos = Pick<SosRequest, 'name' | 'people_count' | 'urgency' | 'lat' | 'lng'>;
```

## Function Signatures (`src/lib/sosApi.ts`)

```typescript
// Insert new SOS request (victim flow)
export function createSos(input: NewSos): Promise<SosRequest>;

// List all requests ordered newest first (rescuer feed)
export function listSos(): Promise<SosRequest[]>;

// Mark request as rescued (rescuer action)
export function markRescued(id: string): Promise<SosRequest>;

// Subscribe to real-time updates (both new requests & status changes)
export function subscribeSos(cb: (row: SosRequest) => void): () => void;
```
