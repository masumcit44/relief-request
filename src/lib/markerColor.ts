// src/lib/markerColor.ts [M3]
import { SosRequest } from './types';

/**
 * Returns hex color according to triage status & urgency:
 * - Rescued: Emerald (#16a34a)
 * - Pending High: Red (#dc2626)
 * - Pending Medium: Amber (#f59e0b)
 */
export function markerColor(r: SosRequest): string {
  if (r.status === 'rescued') {
    return '#16a34a';
  }
  if (r.urgency === 'High') {
    return '#dc2626';
  }
  return '#f59e0b';
}

/**
 * Computes marker radius: clamp(10 + people*1.5, 12, 34)
 */
export function markerRadius(people: number): number {
  const p = Math.max(1, people || 1);
  return Math.min(34, Math.max(12, Math.round(10 + p * 1.5)));
}

/**
 * Sorts SOS records for triage priority:
 * 1. Pending before rescued
 * 2. High urgency before Medium urgency
 * 3. Oldest timestamp first (waiting longest)
 */
export function sortForTriage(rows: SosRequest[]): SosRequest[] {
  return [...rows].sort((a, b) => {
    // 1. Pending first
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }

    // 2. High before Medium
    if (a.urgency !== b.urgency) {
      return a.urgency === 'High' ? -1 : 1;
    }

    // 3. Oldest first
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeA - timeB;
  });
}

