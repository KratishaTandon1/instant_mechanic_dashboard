'use client';

import React, { useEffect, useRef } from 'react';
import { MechanicType } from '@/lib/types';
import { getMechanicStatusBadge } from '@/lib/utils';
import { Navigation } from 'lucide-react';

interface LiveMapProps {
  mechanics: MechanicType[];
}

export const LiveMap: React.FC<LiveMapProps> = ({ mechanics }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically import Leaflet to avoid SSR window error
    import('leaflet').then((L) => {
      const container = mapContainerRef.current;
      if (!container) return;

      // Fix leaflet default icon path
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        // Initialize Map centered on Delhi NCR
        const map = L.map(container).setView([28.6139, 77.2090], 11);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add mechanic markers
      mechanics.forEach((m) => {
        const statusBadge = getMechanicStatusBadge(m.status);
        const markerIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping"></div>
              <div class="w-7 h-7 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center shadow-lg text-[10px] font-bold text-white">
                🔧
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; color: #020617;">
            <strong style="font-size: 13px; color: #0f172a;">${m.name}</strong><br/>
            <span style="font-size: 11px; color: #475569;">${m.specialization}</span><br/>
            <div style="margin-top: 4px; font-size: 11px; font-weight: bold; color: #2563eb;">
              Status: ${statusBadge.label} (★ ${m.rating})
            </div>
          </div>
        `;

        L.marker([m.currentLat, m.currentLng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });
    });
  }, [mechanics]);

  return (
    <div className="relative bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-cyan-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">Live GPS Fleet Radar</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time geolocation tracking of active mechanic dispatch units</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{mechanics.length} Active Fleet Markers</span>
        </div>
      </div>

      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapContainerRef} className="h-96 w-full rounded-xl overflow-hidden border border-slate-800 z-0" />
    </div>
  );
};
