'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Car,
  User,
  Wrench,
  Calendar,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { BookingType, BookingStatus, ServiceCategoryType } from '@/lib/types';
import { formatCurrency, formatDate, getStatusBadgeInfo, exportToCSV } from '@/lib/utils';

interface BookingsTableProps {
  bookings: BookingType[];
  categories: ServiceCategoryType[];
  totalBookings: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onSelectBooking: (booking: BookingType) => void;
  loading?: boolean;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  categories,
  totalBookings,
  page,
  limit,
  onPageChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSelectBooking,
  loading,
}) => {
  const totalPages = Math.ceil(totalBookings / limit) || 1;

  const handleExportCSV = () => {
    const csvRows = bookings.map((b) => ({
      'Booking ID': b.bookingNumber,
      Customer: b.customer?.name || 'N/A',
      Phone: b.customer?.phone || 'N/A',
      Vehicle: `${b.vehicleMake} ${b.vehicleModel} (${b.licensePlate})`,
      Service: b.serviceCategory?.name || 'N/A',
      Mechanic: b.mechanic?.name || 'Unassigned',
      Status: b.status,
      Amount: b.amount,
      Date: formatDate(b.createdAt),
    }));
    exportToCSV(`InstantMechanic_Bookings_${new Date().toISOString().split('T')[0]}.csv`, csvRows);
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Table Action Controls Header */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-400" />
              <span>Service Bookings Directory</span>
              <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                {totalBookings} Total
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Manage and track live customer vehicle maintenance requests</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ID, Customer, Vehicle, Plate..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Service Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => onSortChange('bookingNumber')}>
                <div className="flex items-center space-x-1">
                  <span>Booking ID</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Vehicle Specs</th>
              <th className="py-3.5 px-4">Service Category</th>
              <th className="py-3.5 px-4">Assigned Mechanic</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => onSortChange('status')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => onSortChange('amount')}>
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => onSortChange('createdAt')}>
                <div className="flex items-center space-x-1">
                  <span>Date & Time</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={9} className="py-4 px-4">
                    <div className="h-5 bg-slate-800/40 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  No vehicle service bookings match your filter criteria.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const statusInfo = getStatusBadgeInfo(booking.status);
                return (
                  <tr
                    key={booking.id}
                    onClick={() => onSelectBooking(booking)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 group-hover:underline">
                      {booking.bookingNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-[10px] border border-slate-700">
                          {booking.customer?.name?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{booking.customer?.name}</div>
                          <div className="text-[11px] text-slate-400">{booking.customer?.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-medium text-slate-200">
                          {booking.vehicleMake} {booking.vehicleModel} ({booking.vehicleYear})
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 uppercase">{booking.licensePlate}</div>
                      </div>
                    </td>

                    {/* Service Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {booking.serviceCategory?.name || 'General Repair'}
                      </span>
                    </td>

                    {/* Mechanic */}
                    <td className="py-3.5 px-4">
                      {booking.mechanic ? (
                        <div className="flex items-center space-x-2">
                          <Wrench className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="text-slate-200 font-medium">{booking.mechanic.name}</span>
                        </div>
                      ) : (
                        <span className="text-amber-400/80 text-[11px] italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.colorClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatCurrency(booking.amount)}
                    </td>

                    {/* Date/Time */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(booking.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBooking(booking);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{bookings.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
          <span className="font-bold text-white">{Math.min(page * limit, totalBookings)}</span> of{' '}
          <span className="font-bold text-white">{totalBookings}</span> entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-white bg-slate-900 border border-slate-800 rounded-lg">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
