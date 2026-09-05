'use client';

import React from 'react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  UserCheck,
  UserPlus,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { DashboardOverview } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface KPICardsProps {
  overview: DashboardOverview | null;
  loading?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ overview, loading }) => {
  if (loading || !overview) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Bookings',
      value: overview.totalBookings.toLocaleString(),
      subtitle: '+14% from last month',
      icon: CalendarCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      badge: 'All Time',
    },
    {
      title: "Today's Bookings",
      value: overview.todayBookings.toLocaleString(),
      subtitle: 'Live dispatch tracking',
      icon: Calendar,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      badge: 'Today',
    },
    {
      title: 'Completed Jobs',
      value: overview.completedBookings.toLocaleString(),
      subtitle: 'Successfully serviced',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      badge: `${Math.round((overview.completedBookings / (overview.totalBookings || 1)) * 100)}% Success`,
    },
    {
      title: 'Pending & Active',
      value: (overview.pendingBookings + overview.inProgressBookings).toLocaleString(),
      subtitle: `${overview.pendingBookings} Pending • ${overview.inProgressBookings} Active`,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      badge: 'In Dispatch',
    },
    {
      title: 'Cancelled Bookings',
      value: overview.cancelledBookings.toLocaleString(),
      subtitle: `${Math.round((overview.cancelledBookings / (overview.totalBookings || 1)) * 100)}% cancellation rate`,
      icon: XCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      badge: 'Low Rate',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(overview.totalRevenue),
      subtitle: `Today: ${formatCurrency(overview.todayRevenue)}`,
      icon: IndianRupee,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      badge: '+18.5%',
    },
    {
      title: 'Active Mechanics',
      value: `${overview.activeMechanics} / ${overview.totalMechanics}`,
      subtitle: 'On-duty or in-transit',
      icon: UserCheck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      badge: 'Deployed',
    },
    {
      title: 'Customer Directory',
      value: overview.totalCustomersCount.toLocaleString(),
      subtitle: `${overview.newCustomersCount} New this week`,
      icon: UserPlus,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      badge: 'Retention 92%',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white tracking-tight">{card.value}</h3>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
                {card.badge}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>{card.subtitle}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};
