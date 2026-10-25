// src/components/map/SosMarker.tsx [M3]
'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { SosRequest } from '@/lib/types';
import { markerColor, markerRadius } from '@/lib/markerColor';
import { MarkerPopup } from './MarkerPopup';

interface SosMarkerProps {
  request: SosRequest;
  isFresh: boolean;
  isSelected?: boolean;
  onMarkRescued: (id: string) => Promise<void>;
}

export const SosMarker: React.FC<SosMarkerProps> = ({
  request,
  isFresh,
  isSelected,
  onMarkRescued,
}) => {
  const markerRef = useRef<L.Marker | null>(null);

  const radius = markerRadius(request.people_count);
  const color = markerColor(request);
  const size = radius * 2;

  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-sos-div-icon',
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
          ${
            isFresh
              ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
              : ''
          }
          <div style="
            position: relative;
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 9999px;
            border: 2.5px solid white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: ${Math.max(10, Math.round(size * 0.42))}px;
            user-select: none;
            transition: transform 0.2s;
            ${isSelected ? 'transform: scale(1.25); outline: 3px solid #3b82f6;' : ''}
          ">
            ${request.people_count}
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }, [color, size, isFresh, isSelected, request.people_count]);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      position={[request.lat, request.lng]}
      icon={customIcon}
      ref={markerRef}
    >
      <MarkerPopup request={request} onMarkRescued={onMarkRescued} />
    </Marker>
  );
};

