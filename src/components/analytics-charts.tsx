'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { AnalyticsData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, PieChart as PieIcon, TrendingUp, Filter } from 'lucide-react';

interface AnalyticsChartsProps {
  data: AnalyticsData | null;
  loading?: boolean;
  onRangeChange?: (range: string) => void;
  selectedRange?: string;
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981', // emerald-500
  IN_PROGRESS: '#06b6d4', // cyan-500
  IN_TRANSIT: '#a855f7', // purple-500
  ASSIGNED: '#3b82f6', // blue-500
  PENDING: '#f59e0b', // amber-500
  CANCELLED: '#f43f5e', // rose-500
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  data,
  loading,
  onRangeChange,
  selectedRange = '30d',
}) => {
  const [metricView, setMetricView] = useState<'both' | 'bookings' | 'revenue'>('both');

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6" />
        <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Time-Series Line/Area Chart */}
      <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Service Volume & Revenue Trends</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Real-time daily vehicle service bookings & cumulative revenue</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Metric Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setMetricView('both')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  metricView === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Both
              </button>
              <button
                onClick={() => setMetricView('bookings')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  metricView === 'bookings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setMetricView('revenue')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  metricView === 'revenue' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue
              </button>
            </div>

            {/* Date Range Selector */}
            {onRangeChange && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['7d', '30d', '90d', '1y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => onRangeChange(r)}
                    className={`px-2.5 py-1 rounded-lg uppercase font-semibold transition-all ${
                      selectedRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.bookingsOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
              {metricView !== 'bookings' && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') return [formatCurrency(Number(value)), 'Total Revenue'];
                  return [value, 'Total Bookings'];
                }}
              />
              {(metricView === 'both' || metricView === 'bookings') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  name="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              )}
              {(metricView === 'both' || metricView === 'revenue') && (
                <Area
                  yAxisId={metricView === 'revenue' ? 'left' : 'right'}
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Donut Chart for Booking Status & Bar Chart for Service Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <PieIcon className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Booking Status Breakdown</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Live operational status distribution</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} Bookings (${props.payload.percentage}%)`,
                    props.payload.status,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {data.statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || '#64748b' }} />
                  <span className="text-slate-300 font-medium">{item.status.replace('_', ' ')}</span>
                </div>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Category Performance Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Service Category Revenue & Volume</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Top vehicle maintenance categories by job volume</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'totalRevenue') return [formatCurrency(Number(value)), 'Total Revenue'];
                    return [value, 'Jobs Completed'];
                  }}
                />
                <Bar dataKey="count" name="Jobs" fill="#06b6d4" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
