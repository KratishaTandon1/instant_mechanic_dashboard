'use client';

import React, { useState } from 'react';
import { Sparkles, X, PlusCircle, Play, RefreshCw, Zap, Bell, CheckCircle } from 'lucide-react';
import { BookingStatus } from '@/lib/types';

interface LiveSimulationControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNewBooking: () => Promise<void>;
  onTriggerStatusChange: (status: BookingStatus) => Promise<void>;
  onReSeedDatabase: () => Promise<void>;
}

export const LiveSimulationControls: React.FC<LiveSimulationControlsProps> = ({
  isOpen,
  onClose,
  onTriggerNewBooking,
  onTriggerStatusChange,
  onReSeedDatabase,
}) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMockBooking = async () => {
    setIsSimulating(true);
    await onTriggerNewBooking();
    setIsSimulating(false);
    showNotification('⚡ Simulated Live Booking Generated Instantly!');
  };

  const handleMockStatus = async (status: BookingStatus) => {
    setIsSimulating(true);
    await onTriggerStatusChange(status);
    setIsSimulating(false);
    showNotification(`⚡ Live Status Advanced to ${status}!`);
  };

  const handleResetData = async () => {
    setIsSimulating(true);
    await onReSeedDatabase();
    setIsSimulating(false);
    showNotification('✨ Database Reset & 550+ Records Re-seeded!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-amber-300 border border-indigo-500/30">
              <Sparkles className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Evaluator Live Simulator</h3>
              <p className="text-xs text-slate-400">Interactively test real-time event updates & API actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notification Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2.5 flex items-center space-x-2 text-xs text-emerald-300 font-semibold animate-pulse">
            <Bell className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Body Controls */}
        <div className="p-6 space-y-6">
          {/* Action 1: Create Live Booking */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4 text-blue-400" />
              <span>1. Simulate Incoming Customer Booking</span>
            </h4>
            <p className="text-xs text-slate-400">
              Generates a new real-time emergency service request and pushes it to the dashboard.
            </p>
            <button
              disabled={isSimulating}
              onClick={handleMockBooking}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Trigger New Customer Booking</span>
            </button>
          </div>

          {/* Action 2: Advance Live Booking Pipeline */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Play className="h-4 w-4 text-purple-400" />
              <span>2. Advance Live Booking Status Pipeline</span>
            </h4>
            <p className="text-xs text-slate-400">
              Change status of the latest pending booking live without requiring page reload.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isSimulating}
                onClick={() => handleMockStatus('IN_TRANSIT')}
                className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                In Transit 🚚
              </button>
              <button
                disabled={isSimulating}
                onClick={() => handleMockStatus('IN_PROGRESS')}
                className="py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                In Progress 🔧
              </button>
              <button
                disabled={isSimulating}
                onClick={() => handleMockStatus('COMPLETED')}
                className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50 col-span-2"
              >
                Mark Completed 🎉
              </button>
            </div>
          </div>

          {/* Action 3: Database Reset */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
              <span>3. Reset & Re-Seed Database (550+ Records)</span>
            </h4>
            <p className="text-xs text-slate-400">Restores initial seed dataset with fresh dates and records.</p>
            <button
              disabled={isSimulating}
              onClick={handleResetData}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all disabled:opacity-50"
            >
              Re-seed Database
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-all"
          >
            Close Evaluator Panel
          </button>
        </div>
      </div>
    </div>
  );
};
