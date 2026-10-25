// src/lib/sosApi.ts [M2]
import { SosRequest, NewSos } from './types';
import mockData from './mock/sos.mock.json';
import { supabase } from './supabase';

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// In-memory store for mock mode
const mockStore: SosRequest[] = (mockData as SosRequest[]).map((item) => ({ ...item }));
type Listener = (row: SosRequest, allRows?: SosRequest[]) => void;
const mockListeners = new Set<Listener>();

function notifyMockListeners(row: SosRequest) {
  mockListeners.forEach((listener) => {
    try {
      listener(row, [...mockStore]);
    } catch (e) {
      console.error('Error in mock subscriber listener:', e);
    }
  });
}

function validateSosInput(input: NewSos): {
  name: string;
  people_count: number;
  urgency: 'High' | 'Medium';
  lat: number;
  lng: number;
} {
  if (!input) {
    throw new Error('SOS request payload is required.');
  }

  const name =
    typeof input.name === 'string' && input.name.trim().length > 0
      ? input.name.trim()
      : 'Unknown';

  const count = Number(input.people_count);
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error('Invalid people count: must be an integer between 1 and 50.');
  }

  if (input.urgency !== 'High' && input.urgency !== 'Medium') {
    throw new Error("Invalid urgency: must be either 'High' or 'Medium'.");
  }

  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (isNaN(lat) || lat < 20.5 || lat > 26.7) {
    throw new Error('Invalid latitude: must be between 20.5 and 26.7 (Bangladesh region).');
  }
  if (isNaN(lng) || lng < 88.0 || lng > 92.7) {
    throw new Error('Invalid longitude: must be between 88.0 and 92.7 (Bangladesh region).');
  }

  return { name, people_count: count, urgency: input.urgency, lat, lng };
}

export async function createSos(input: NewSos): Promise<SosRequest> {
  const validated = validateSosInput(input);

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const newRecord: SosRequest = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `mock-${Date.now()}`,
      name: validated.name,
      people_count: validated.people_count,
      urgency: validated.urgency,
      lat: validated.lat,
      lng: validated.lng,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    mockStore.unshift(newRecord);
    notifyMockListeners(newRecord);
    return newRecord;
  }

  const { data, error } = await supabase
    .from('sos_requests')
    .insert([
      {
        name: validated.name,
        people_count: validated.people_count,
        urgency: validated.urgency,
        lat: validated.lat,
        lng: validated.lng,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit SOS request');
  }

  return data as SosRequest;
}

export async function listSos(): Promise<SosRequest[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return [...mockStore].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  const { data, error } = await supabase
    .from('sos_requests')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(500);

  if (error || !data) {
    throw new Error(error?.message || 'Failed to fetch SOS requests');
  }

  return data as SosRequest[];
}

export async function markRescued(id: string): Promise<SosRequest> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Valid SOS request ID is required.');
  }
  const cleanId = id.trim();

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const foundIndex = mockStore.findIndex((item) => item.id === cleanId);
    if (foundIndex === -1) {
      throw new Error(`Record with id ${cleanId} not found`);
    }
    const updated: SosRequest = {
      ...mockStore[foundIndex],
      status: 'rescued',
    };
    mockStore[foundIndex] = updated;
    notifyMockListeners(updated);
    return updated;
  }

  const { data, error } = await supabase.rpc('mark_rescued', { p_id: cleanId });

  if (error || !data) {
    throw new Error(error?.message || 'Failed to mark request as rescued');
  }

  const result = Array.isArray(data) ? data[0] : data;
  return result as SosRequest;
}

export function subscribeSos(
  cb: (row: SosRequest, allRows?: SosRequest[]) => void
): () => void {
  if (USE_MOCK) {
    mockListeners.add(cb);
    return () => {
      mockListeners.delete(cb);
    };
  }

  const channel = supabase
    .channel('sos')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sos_requests' },
      async (payload) => {
        if (payload.new && (payload.new as SosRequest).id) {
          const freshRow = payload.new as SosRequest;
          try {
            const allRows = await listSos();
            cb(freshRow, allRows);
          } catch {
            cb(freshRow);
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
