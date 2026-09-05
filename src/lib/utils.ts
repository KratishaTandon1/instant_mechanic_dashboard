import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BookingStatus, MechanicStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatShortDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getStatusBadgeInfo(status: BookingStatus): { label: string; colorClass: string; dotClass: string } {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dotClass: 'bg-amber-400 animate-pulse',
      };
    case 'ASSIGNED':
      return {
        label: 'Assigned',
        colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dotClass: 'bg-blue-400',
      };
    case 'IN_TRANSIT':
      return {
        label: 'Mechanic On The Way',
        colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        dotClass: 'bg-purple-400 animate-ping',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        colorClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        dotClass: 'bg-cyan-400 animate-spin',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dotClass: 'bg-emerald-400',
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        colorClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        dotClass: 'bg-rose-400',
      };
    default:
      return {
        label: status,
        colorClass: 'bg-slate-800 text-slate-300 border-slate-700',
        dotClass: 'bg-slate-400',
      };
  }
}

export function getMechanicStatusBadge(status: MechanicStatus): { label: string; colorClass: string } {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Available', colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'ON_DUTY':
      return { label: 'On Duty', colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'IN_TRANSIT':
      return { label: 'In Transit', colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'BUSY':
      return { label: 'Busy', colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'OFFLINE':
      return { label: 'Offline', colorClass: 'bg-slate-800 text-slate-400 border-slate-700' };
    default:
      return { label: status, colorClass: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            const rawVal = row[k] ?? '';
            let cellStr: string = rawVal instanceof Date ? rawVal.toISOString() : String(rawVal);
            cellStr = cellStr.replace(/"/g, '""');
            if (cellStr.search(/("|,|\n)/g) >= 0) {
              cellStr = `"${cellStr}"`;
            }
            return cellStr;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
