'use client';

import React from 'react';
import {
  Wrench,
  LayoutDashboard,
  BarChart3,
  Users,
  UserCheck,
  Code2,
  Radio,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLiveActive: boolean;
  setIsLiveActive: (active: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSimulation: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  setIsLiveActive,
  onRefresh,
  isRefreshing,
  onOpenSimulation,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Operations Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'mechanics', label: 'Mechanic Fleet', icon: UserCheck },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'api-docs', label: 'API Documentation', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wrench className="h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">Instant Mechanic</h1>
                <span className="text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Vehicle Service Operations Center</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Live Indicator Switch */}
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isLiveActive
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Server-Sent Events (SSE) Live Feed"
            >
              <Radio className={`h-3.5 w-3.5 ${isLiveActive ? 'text-emerald-400 animate-ping' : 'text-slate-500'}`} />
              <span>{isLiveActive ? 'Live SSE Sync' : 'Live Off'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            {/* Live Simulator Drawer Trigger */}
            <button
              onClick={onOpenSimulation}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:brightness-110 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden sm:inline">Evaluator Controls</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900 border border-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
