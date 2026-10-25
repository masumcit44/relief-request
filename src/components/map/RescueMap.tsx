// src/components/map/RescueMap.tsx [M3]
'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { SosRequest } from '@/lib/types';
import { SosMarker } from './SosMarker';
import { Legend } from './Legend';

interface RescueMapProps {
  rows: SosRequest[];
  freshIds: Set<string>;
  selectedId?: string | null;
  onMarkRescued: (id: string) => Promise<void>;
  centerTarget?: { lat: number; lng: number } | null;
}

// Map helper to auto-fit bounds when pending requests change
function BoundsController({ rows }: { rows: SosRequest[] }) {
  const map = useMap();
  const prevCountRef = useRef<number>(-1);

  useEffect(() => {
    const pendingWithCoords = rows.filter(
      r => r.status === 'pending' && typeof r.lat === 'number' && typeof r.lng === 'number'
    );

    if (pendingWithCoords.length === 0) return;

    // Only auto-fit when the count changes or initial load
    if (prevCountRef.current !== pendingWithCoords.length) {
      prevCountRef.current = pendingWithCoords.length;

      const bounds = L.latLngBounds(
        pendingWithCoords.map(r => [r.lat, r.lng] as [number, number])
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 13,
        });
      }
    }
  }, [rows, map]);

  return null;
}

// Controller to fly to a clicked card from the triage list
function FlyToController({ target }: { target?: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (target && typeof target.lat === 'number' && typeof target.lng === 'number') {
      map.flyTo([target.lat, target.lng], 13, {
        duration: 1.2,
      });
    }
  }, [target, map]);

  return null;
}

export default function RescueMap({
  rows,
  freshIds,
  selectedId,
  onMarkRescued,
  centerTarget,
}: RescueMapProps) {
  // Center of Feni, Bangladesh
  const defaultCenter: [number, number] = [23.01, 91.40];

  return (
    <div className="relative w-full h-[calc(100vh-120px)] rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsController rows={rows} />
        <FlyToController target={centerTarget} />

        {rows.map(req => (
          <SosMarker
            key={req.id}
            request={req}
            isFresh={freshIds.has(req.id)}
            isSelected={selectedId === req.id}
            onMarkRescued={onMarkRescued}
          />
        ))}
      </MapContainer>

      {/* Floating Legend on Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-[999]">
        <Legend />
      </div>
    </div>
  );
}

