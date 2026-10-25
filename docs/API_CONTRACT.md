# ReliefRequest — Frozen API Contract & Specification

**Owner**: Member 2 (Backend, Database & Integration Specialist)  
**Status**: FROZEN (All field names, constraints, and method signatures are locked)

---

## 1. Overview & Architectural Role

`src/lib/sosApi.ts` is the **single data door** for the entire ReliefRequest application.  
- **Member 1 (Frontend / UI)** imports `createSos` to submit requests from the victim flow.
- **Member 3 (Map / Dashboard)** imports `listSos`, `markRescued`, and `subscribeSos` to populate the map, update stats, and display real-time rescue pins.
- Neither Member 1 nor Member 3 touches Supabase SDK or direct database queries directly; all communication passes through `sosApi.ts`.

---

## 2. Data Models (`src/lib/types.ts`)

### `Urgency`
```typescript
export type Urgency = 'High' | 'Medium';
```
- `'High'`: Life-threatening condition, rising floodwaters over rooftop level, elderly, infants, or injured persons. Displayed as **Red** on map.
- `'Medium'`: Stranded without immediate danger to life, need evacuation and food supplies. Displayed as **Amber** on map.

### `SosStatus`
```typescript
export type SosStatus = 'pending' | 'rescued';
```
- `'pending'`: Needs rescue. Displayed as Red/Amber pin.
- `'rescued'`: Rescued by emergency team. Displayed as **Green** pin.

### `SosRequest`
The primary entity returned by all read and mutation operations.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID) | Auto-generated UUID |
| `name` | `string` | Victim / contact person name | Non-empty text, default `'Unknown'` |
| `people_count` | `number` | Count of stranded people needing rescue | Integer, `1` to `50` |
| `urgency` | `Urgency` | Priority assessment | `'High'` \| `'Medium'` |
| `lat` | `number` | Latitude (WGS84 decimal) | `20.5` to `26.7` (Bangladesh bounds) |
| `lng` | `number` | Longitude (WGS84 decimal) | `88.0` to `92.7` (Bangladesh bounds) |
| `status` | `SosStatus` | Rescue lifecycle status | `'pending'` \| `'rescued'`, default `'pending'` |
| `timestamp` | `string` | Submission time (ISO 8601 string) | e.g. `'2024-08-23T09:12:00.000Z'` |

### `NewSos`
Payload passed to `createSos()`:

```typescript
export type NewSos = Pick<
  SosRequest,
  'name' | 'people_count' | 'urgency' | 'lat' | 'lng'
>;
```

---

## 3. Shared API Signatures (`src/lib/sosApi.ts`)

### `createSos(input: NewSos): Promise<SosRequest>`
- **Description**: Validates and submits a new flood SOS emergency call.
- **Parameters**: `input: NewSos`
- **Returns**: `Promise<SosRequest>` (with assigned `id`, `status: 'pending'`, and ISO `timestamp`).
- **Validation Errors Thrown**:
  - Empty or invalid payload.
  - `people_count` not an integer between 1 and 50.
  - `urgency` not `'High'` or `'Medium'`.
  - `lat` / `lng` outside Bangladesh bounding box (20.5–26.7 lat, 88.0–92.7 lng).
- **Latency / Behavior**:
  - *Mock Mode*: Appends to in-memory array, triggers active subscribers, simulates 300ms latency.
  - *Live Mode*: Executes Postgres `INSERT` via Supabase anon key.

### `listSos(): Promise<SosRequest[]>`
- **Description**: Retrieves all existing SOS requests ordered newest first.
- **Parameters**: None.
- **Returns**: `Promise<SosRequest[]>` (ordered by `timestamp desc`, limited to 500).
- **Latency / Behavior**:
  - *Mock Mode*: Returns in-memory sorted copy with 300ms simulated latency.
  - *Live Mode*: Queries `sos_requests` with `order('timestamp', { ascending: false }).limit(500)`.

### `markRescued(id: string): Promise<SosRequest>`
- **Description**: Flips an SOS request's status from `'pending'` to `'rescued'`.
- **Parameters**: `id: string` (UUID).
- **Returns**: `Promise<SosRequest>` (updated row).
- **Validation Errors Thrown**: Missing, blank, or non-existent ID.
- **Latency / Behavior**:
  - *Mock Mode*: Updates in-memory record, triggers active subscribers, simulates 300ms latency.
  - *Live Mode*: Calls Postgres RPC `mark_rescued(p_id)` via Supabase client.

### `subscribeSos(callback: (row: SosRequest, allRows?: SosRequest[]) => void): () => void`
- **Description**: Subscribes to realtime updates whenever requests are created or statuses change.
- **Parameters**: `callback: (row: SosRequest, allRows?: SosRequest[]) => void`
- **Returns**: `() => void` (Unsubscribe cleanup function).
- **Behavior**:
  - *Mock Mode*: Registers callback in an internal `Set`. Whenever `createSos` or `markRescued` is called, all callbacks receive the updated row and full list.
  - *Live Mode*: Connects to Supabase Realtime channel listening to `postgres_changes` on `sos_requests`. On any mutation (`*`), it emits the row and fresh list. Calling cleanup unsubscribes and removes the channel.
