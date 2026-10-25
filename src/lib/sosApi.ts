// src/lib/sosApi.ts [M2]
import { SosRequest, NewSos } from './types';
import mockData from './mock/sos.mock.json';
import { supabase } from './supabase';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// In-memory store for mock mode
const mockStore: SosRequest[] = [...(mockData as SosRequest[])];
type Listener = (row: SosRequest) => void;
const mockListeners = new Set<Listener>();

function notifyMockListeners(row: SosRequest) {
  mockListeners.forEach(listener => {
    try {
      listener(row);
    } catch (e) {
      console.error('Error in mock subscriber listener:', e);
    }
  });
}

export async function createSos(input: NewSos): Promise<SosRequest> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    const newRecord: SosRequest = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}`,
      name: input.name || 'Unknown',
      people_count: input.people_count,
      urgency: input.urgency,
      lat: input.lat,
      lng: input.lng,
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
        name: input.name || 'Unknown',
        people_count: input.people_count,
        urgency: input.urgency,
        lat: input.lat,
        lng: input.lng,
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
    await new Promise(r => setTimeout(r, 300));
    return [...mockStore];
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
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    const foundIndex = mockStore.findIndex(item => item.id === id);
    if (foundIndex === -1) {
      throw new Error(`Record with id ${id} not found`);
    }
    const updated = {
      ...mockStore[foundIndex],
      status: 'rescued' as const,
    };
    mockStore[foundIndex] = updated;
    notifyMockListeners(updated);
    return updated;
  }

  const { data, error } = await supabase.rpc('mark_rescued', { p_id: id });

  if (error || !data) {
    throw new Error(error?.message || 'Failed to mark request as rescued');
  }

  return data as SosRequest;
}

export function subscribeSos(cb: (row: SosRequest) => void): () => void {
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
      payload => {
        if (payload.new && (payload.new as SosRequest).id) {
          cb(payload.new as SosRequest);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

