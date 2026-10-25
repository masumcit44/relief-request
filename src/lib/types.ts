// src/lib/types.ts [M2] FROZEN API CONTRACT
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

