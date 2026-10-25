// src/hooks/useSosFeed.ts [M3]
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SosRequest } from '@/lib/types';
import { listSos, markRescued as apiMarkRescued, subscribeSos } from '@/lib/sosApi';
import fallbackMock from '@/lib/mock/sos.mock.json';

export function useSosFeed() {
  const [itemsMap, setItemsMap] = useState<Map<string, SosRequest>>(new Map());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const freshTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Mark an ID as fresh for 5 seconds for visual pulse
  const triggerFreshPulse = useCallback((id: string) => {
    setFreshIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    if (freshTimersRef.current.has(id)) {
      clearTimeout(freshTimersRef.current.get(id));
    }

    const timer = setTimeout(() => {
      setFreshIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      freshTimersRef.current.delete(id);
    }, 5000);

    freshTimersRef.current.set(id, timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const rows = await listSos();
        if (isMounted) {
          const newMap = new Map<string, SosRequest>();
          rows.forEach(r => newMap.set(r.id, r));
          setItemsMap(newMap);
        }
      } catch (err: unknown) {
        console.error('Failed to load SOS feed, falling back to mock JSON:', err);
        if (isMounted) {
          const newMap = new Map<string, SosRequest>();
          (fallbackMock as SosRequest[]).forEach(r => newMap.set(r.id, r));
          setItemsMap(newMap);
          setError(err instanceof Error ? err.message : 'Error loading live feed; using mock data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    // Subscribe to realtime updates
    const unsubscribe = subscribeSos((newRow: SosRequest) => {
      if (!isMounted) return;
      setItemsMap(prev => {
        const next = new Map(prev);
        next.set(newRow.id, newRow);
        return next;
      });
      triggerFreshPulse(newRow.id);
    });

    const activeTimers = freshTimersRef.current;

    return () => {
      isMounted = false;
      unsubscribe();
      activeTimers.forEach(timer => clearTimeout(timer));
    };
  }, [triggerFreshPulse]);

  // Optimistic mark rescued action
  const markRescued = useCallback(async (id: string) => {
    const previous = itemsMap.get(id);
    if (!previous) return;

    // 1. Optimistic update
    const optimisticRow: SosRequest = {
      ...previous,
      status: 'rescued',
    };

    setItemsMap(prev => {
      const next = new Map(prev);
      next.set(id, optimisticRow);
      return next;
    });
    triggerFreshPulse(id);

    // 2. Call backend
    try {
      const serverRow = await apiMarkRescued(id);
      setItemsMap(prev => {
        const next = new Map(prev);
        next.set(serverRow.id, serverRow);
        return next;
      });
    } catch (err: unknown) {
      console.error('Failed to mark rescued, reverting optimistic update:', err);
      // Revert on error
      setItemsMap(prev => {
        const next = new Map(prev);
        next.set(id, previous);
        return next;
      });
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      throw new Error(message);
    }
  }, [itemsMap, triggerFreshPulse]);

  const rows = Array.from(itemsMap.values());

  return {
    rows,
    freshIds,
    loading,
    error,
    markRescued,
  };
}

