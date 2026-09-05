'use client';

import React from 'react';
import { MechanicType } from '@/lib/types';
import { getMechanicStatusBadge } from '@/lib/utils';
import { Star, CheckCircle2, Phone, Mail, Wrench, MapPin } from 'lucide-react';

interface MechanicCardProps {
  mechanic: MechanicType;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({ mechanic }) => {
  const statusBadge = getMechanicStatusBadge(mechanic.status);

  return (
    <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all duration-300 shadow-lg space-y-4 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-md">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white text-base">
              {mechanic.name?.[0] || 'M'}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm tracking-tight">{mechanic.name}</h4>
            <div className="text-xs text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
              <Wrench className="h-3 w-3" />
              <span>{mechanic.specialization}</span>
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge.colorClass}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Rating</span>
          <div className="flex items-center space-x-1 font-bold text-amber-400 mt-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{mechanic.rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Jobs Serviced</span>
          <div className="flex items-center space-x-1 font-bold text-emerald-400 mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{mechanic.jobsCompleted} Completed</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-slate-400 pt-1">
        <div className="flex items-center space-x-2">
          <Phone className="h-3.5 w-3.5 text-slate-500" />
          <span>{mechanic.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="h-3.5 w-3.5 text-slate-500" />
          <span className="truncate">{mechanic.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-rose-400" />
          <span>Lat: {mechanic.currentLat.toFixed(4)}, Lng: {mechanic.currentLng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
