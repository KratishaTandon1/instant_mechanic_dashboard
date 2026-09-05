'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  ShieldCheck,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Navigation,
} from 'lucide-react';
import { BookingType, BookingStatus, MechanicType } from '@/lib/types';
import { formatCurrency, formatDate, getStatusBadgeInfo } from '@/lib/utils';

interface BookingDetailDrawerProps {
  booking: BookingType | null;
  isOpen: boolean;
  onClose: () => void;
  mechanics: MechanicType[];
  onUpdateBooking: (id: string, updates: { status?: BookingStatus; mechanicId?: string; notes?: string }) => Promise<void>;
}

const STEPPER_STAGES: { status: BookingStatus; label: string }[] = [
  { status: 'PENDING', label: 'Booked' },
  { status: 'ASSIGNED', label: 'Mechanic Assigned' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'IN_PROGRESS', label: 'Service In Progress' },
  { status: 'COMPLETED', label: 'Completed' },
];

export const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({
  booking,
  isOpen,
  onClose,
  mechanics,
  onUpdateBooking,
}) => {
  const [selectedMechanic, setSelectedMechanic] = useState<string>(booking?.mechanicId || '');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const currentStepIndex = STEPPER_STAGES.findIndex((s) => s.status === booking.status);
  const statusInfo = getStatusBadgeInfo(booking.status);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setIsUpdating(true);
    await onUpdateBooking(booking.id, { status: newStatus, mechanicId: selectedMechanic || booking.mechanicId || undefined });
    setIsUpdating(false);
  };

  const handleMechanicAssign = async (mechanicId: string) => {
    setSelectedMechanic(mechanicId);
    setIsUpdating(true);
    await onUpdateBooking(booking.id, {
      mechanicId,
      status: booking.status === 'PENDING' ? 'ASSIGNED' : booking.status,
    });
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl font-bold text-blue-400">{booking.bookingNumber}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.colorClass}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Created on {formatDate(booking.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Status Pipeline Stepper */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Real-time Service Progress
            </h4>
            <div className="relative flex items-center justify-between">
              {STEPPER_STAGES.map((stage, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div key={stage.status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] mt-2 font-medium text-center max-w-[70px] ${isCurrent ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Status Transition Buttons */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Dispatch Control</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                disabled={isUpdating}
                onClick={() => handleStatusChange('ASSIGNED')}
                className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                Dispatch
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleStatusChange('IN_TRANSIT')}
                className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                In Transit
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                In Progress
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleStatusChange('COMPLETED')}
                className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                Mark Complete
              </button>
            </div>
          </div>

          {/* Customer & Vehicle Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
                <User className="h-4 w-4" />
                <span>Customer Profile</span>
              </div>
              <div className="font-bold text-white text-base">{booking.customer?.name}</div>
              <div className="text-xs text-slate-300 flex items-center space-x-1.5">
                <Phone className="h-3 w-3 text-slate-400" />
                <span>{booking.customer?.phone}</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center space-x-1.5">
                <Mail className="h-3 w-3 text-slate-400" />
                <span>{booking.customer?.email}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-start space-x-1.5 pt-1">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{booking.address}</span>
              </div>
            </div>

            {/* Vehicle Details Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
                <Car className="h-4 w-4" />
                <span>Vehicle Specifications</span>
              </div>
              <div className="font-bold text-white text-base">
                {booking.vehicleMake} {booking.vehicleModel}
              </div>
              <div className="text-xs text-slate-300 font-mono">Model Year: {booking.vehicleYear}</div>
              <div className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                {booking.licensePlate}
              </div>
              <div className="text-xs text-slate-400 pt-1">
                Payment: <span className="text-emerald-400 font-semibold">{booking.paymentMethod}</span> ({booking.paymentStatus})
              </div>
            </div>
          </div>

          {/* Service & Pricing Details */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">Requested Service</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{formatCurrency(booking.amount)}</span>
            </div>
            <div className="font-semibold text-white text-sm">{booking.serviceCategory?.name}</div>
            <p className="text-xs text-slate-400">{booking.serviceCategory?.description}</p>
            {booking.notes && (
              <div className="text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 italic">
                "{booking.notes}"
              </div>
            )}
          </div>

          {/* Mechanic Assignment Picker */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-cyan-400" />
                <span>Assign Mechanic Specialist</span>
              </label>
            </div>
            <select
              value={booking.mechanicId || ''}
              onChange={(e) => handleMechanicAssign(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Available Mechanic...</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.specialization}) — Rating {m.rating}★ [{m.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => handleStatusChange('CANCELLED')}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
          >
            Cancel Booking
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
