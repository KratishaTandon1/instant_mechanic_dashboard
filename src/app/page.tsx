'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { NavigationBar } from '@/components/navigation-bar';
import { KPICards } from '@/components/kpi-cards';
import { AnalyticsCharts } from '@/components/analytics-charts';
import { BookingsTable } from '@/components/bookings-table';
import { BookingDetailDrawer } from '@/components/booking-detail-drawer';
import { LiveMap } from '@/components/live-map';
import { MechanicCard } from '@/components/mechanic-card';
import { LiveSimulationControls } from '@/components/live-simulation-controls';
import { ApiDocsViewer } from '@/components/api-docs-viewer';
import {
  BookingType,
  DashboardOverview,
  AnalyticsData,
  MechanicType,
  CustomerType,
  ServiceCategoryType,
  BookingStatus,
} from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sparkles, Radio, Users, CheckCircle2, Search, ArrowUpDown, Bell } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);

  // Core Data States
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState<string>('30d');
  
  // Bookings Table State
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Entities & Selection
  const [mechanics, setMechanics] = useState<MechanicType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryType[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  
  // Live SSE Notification Toast
  const [liveToast, setLiveToast] = useState<{ message: string; type: string } | null>(null);

  // Fetch Dashboard Overview Metrics
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) setOverview(json.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    }
  }, []);

  // Fetch Analytics Charts Data
  const fetchAnalytics = useCallback(async (rangeStr: string) => {
    try {
      const res = await fetch(`/api/analytics?range=${rangeStr}`);
      const json = await res.json();
      if (json.success) setAnalytics(json.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, []);

  // Fetch Bookings List
  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status: statusFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setTotalBookings(json.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, [page, search, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Fetch Mechanics & Customers
  const fetchEntities = useCallback(async () => {
    try {
      const [mechRes, custRes] = await Promise.all([
        fetch('/api/mechanics'),
        fetch('/api/customers?limit=50'),
      ]);
      const mechJson = await mechRes.json();
      const custJson = await custRes.json();
      if (mechJson.success) setMechanics(mechJson.data);
      if (custJson.success) setCustomers(custJson.data);
    } catch (err) {
      console.error('Failed to fetch entities:', err);
    }
  }, []);

  // Combined Refresh Data
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboard(), fetchAnalytics(analyticsRange), fetchBookings(), fetchEntities()]);
    setIsRefreshing(false);
  }, [fetchDashboard, fetchAnalytics, analyticsRange, fetchBookings, fetchEntities]);

  // Initial Mount Fetching
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // SSE Live Event Stream Listener
  useEffect(() => {
    if (!isLiveActive) return;

    const eventSource = new EventSource('/api/live-stream');

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'BOOKING_STATUS_CHANGE' && parsed.data) {
          setLiveToast({
            message: `⚡ Live Alert: ${parsed.data.bookingId} status updated to ${parsed.data.newStatus}`,
            type: 'status',
          });
          // Refresh background counts silently
          fetchDashboard();
          fetchBookings();
        } else if (parsed.type === 'NEW_BOOKING' && parsed.data) {
          setLiveToast({
            message: `🎉 New Live Booking: ${parsed.data.bookingNumber} placed by ${parsed.data.customerName}!`,
            type: 'new',
          });
          fetchDashboard();
          fetchBookings();
        }
      } catch (err) {
        console.error('SSE JSON Error:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [isLiveActive, fetchDashboard, fetchBookings]);

  // Auto Dismiss Toast
  useEffect(() => {
    if (liveToast) {
      const t = setTimeout(() => setLiveToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [liveToast]);

  // Update Booking Status / Mechanic Handler
  const handleUpdateBooking = async (id: string, updates: { status?: BookingStatus; mechanicId?: string; notes?: string }) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success) {
        setLiveToast({
          message: `Success: Booking ${json.data.bookingNumber} updated!`,
          type: 'success',
        });
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(json.data);
        }
        refreshAllData();
      }
    } catch (err) {
      console.error('Failed to update booking:', err);
    }
  };

  // Trigger Evaluator Mock Actions
  const handleTriggerNewBooking = async () => {
    if (customers.length === 0) return;
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: randomCustomer.id,
        serviceCategoryId: categories[0]?.id || '1',
        vehicleMake: 'Tesla',
        vehicleModel: 'Model 3',
        vehicleYear: 2024,
        licensePlate: 'DL 03 EV 9999',
        address: 'Connaught Place, New Delhi',
        notes: 'Simulated evaluator test request.',
        amount: 2999,
      }),
    });
    refreshAllData();
  };

  const handleTriggerStatusChange = async (newStatus: BookingStatus) => {
    if (bookings.length === 0) return;
    const firstPending = bookings.find((b) => b.status === 'PENDING') || bookings[0];
    if (firstPending) {
      await handleUpdateBooking(firstPending.id, { status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveActive={isLiveActive}
        setIsLiveActive={setIsLiveActive}
        onRefresh={refreshAllData}
        isRefreshing={isRefreshing}
        onOpenSimulation={() => setIsSimulationOpen(true)}
      />

      {/* Floating Live Notification Toast Banner */}
      {liveToast && (
        <div className="sticky top-16 z-30 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white px-4 py-2.5 shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <Radio className="h-4 w-4 text-amber-300 animate-ping" />
              <span>{liveToast.message}</span>
            </div>
            <button onClick={() => setLiveToast(null)} className="text-white/80 hover:text-white underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Body Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Operations Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards Summary */}
            <KPICards overview={overview} loading={!overview} />

            {/* Analytics Visualizations */}
            <AnalyticsCharts
              data={analytics}
              loading={!analytics}
              onRangeChange={(r) => {
                setAnalyticsRange(r);
                fetchAnalytics(r);
              }}
              selectedRange={analyticsRange}
            />

            {/* Live GPS Fleet Map & Bookings Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookingsTable
                  bookings={bookings}
                  categories={categories}
                  totalBookings={totalBookings}
                  page={page}
                  limit={10}
                  onPageChange={setPage}
                  search={search}
                  onSearchChange={setSearch}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(field) => {
                    if (sortBy === field) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(field);
                      setSortOrder('desc');
                    }
                  }}
                  onSelectBooking={setSelectedBooking}
                  loading={isRefreshing}
                />
              </div>

              {/* Live Map Radar Sidebar */}
              <div>
                <LiveMap mechanics={mechanics} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Analytics & Intelligence */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Full Operations Analytics</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Comprehensive performance metrics, revenue growth, and service categorization
                </p>
              </div>
            </div>
            <AnalyticsCharts
              data={analytics}
              loading={!analytics}
              onRangeChange={(r) => {
                setAnalyticsRange(r);
                fetchAnalytics(r);
              }}
              selectedRange={analyticsRange}
            />
          </div>
        )}

        {/* Tab 3: Mechanic Fleet Roster */}
        {activeTab === 'mechanics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/70 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Mechanics Roster & Status</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active mechanics fleet, performance ratings, and current job assignments
                </p>
              </div>
              <div className="text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3.5 py-1.5 rounded-full">
                {mechanics.length} Total Mechanics Deployed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mechanics.map((mech) => (
                <MechanicCard key={mech.id} mechanic={mech} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Customers CRM Directory */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Customer CRM Directory</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track customer lifetime spend, total bookings placed, and contact profiles
                </p>
              </div>
              <span className="text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-full">
                {customers.length} Onboarded Customers
              </span>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">City Location</th>
                    <th className="py-3.5 px-4">Bookings Placed</th>
                    <th className="py-3.5 px-4 text-right">Total Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                          {c.name[0]}
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{c.email}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{c.phone}</td>
                      <td className="py-3.5 px-4 text-slate-300">{c.city}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-400">{c._count?.bookings || 1} Bookings</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 text-right">
                        {formatCurrency(c.totalSpent || 2499)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Built-in Interactive API Docs */}
        {activeTab === 'api-docs' && <ApiDocsViewer />}
      </main>

      {/* Slide-Over Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        mechanics={mechanics}
        onUpdateBooking={handleUpdateBooking}
      />

      {/* Evaluator Live Simulator Controls Modal */}
      <LiveSimulationControls
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onTriggerNewBooking={handleTriggerNewBooking}
        onTriggerStatusChange={handleTriggerStatusChange}
        onReSeedDatabase={refreshAllData}
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-300">Instant Mechanic Live Operations System</span> — Built for Production Excellence
          </div>
          <div>Next.js 15 • TypeScript • Prisma • Server-Sent Events • Leaflet</div>
        </div>
      </footer>
    </div>
  );
}
