import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 1y

    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === '1y') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all bookings in range
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        serviceCategory: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 1. Group by Date
    const dateMap: Record<string, { bookings: number; revenue: number }> = {};
    const daysArr = Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return d.toISOString().split('T')[0];
    });

    daysArr.forEach((dateStr) => {
      dateMap[dateStr] = { bookings: 0, revenue: 0 };
    });

    bookings.forEach((b) => {
      const dateStr = new Date(b.createdAt).toISOString().split('T')[0];
      if (dateMap[dateStr]) {
        dateMap[dateStr].bookings += 1;
        if (b.status !== 'CANCELLED') {
          dateMap[dateStr].revenue += b.amount;
        }
      }
    });

    const bookingsOverTime = Object.entries(dateMap).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bookings: data.bookings,
      revenue: data.revenue,
    }));

    // 2. Status Distribution
    const statusCounts: Record<string, number> = {
      COMPLETED: 0,
      IN_PROGRESS: 0,
      IN_TRANSIT: 0,
      ASSIGNED: 0,
      PENDING: 0,
      CANCELLED: 0,
    };

    bookings.forEach((b) => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });

    const totalInPeriod = bookings.length || 1;
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Number(((count / totalInPeriod) * 100).toFixed(1)),
    }));

    // 3. Category Breakdown
    const catMap: Record<string, { count: number; totalRevenue: number }> = {};
    bookings.forEach((b) => {
      const catName = b.serviceCategory?.name || 'General Repair';
      if (!catMap[catName]) {
        catMap[catName] = { count: 0, totalRevenue: 0 };
      }
      catMap[catName].count += 1;
      if (b.status !== 'CANCELLED') {
        catMap[catName].totalRevenue += b.amount;
      }
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, data]) => ({
      category,
      count: data.count,
      totalRevenue: data.totalRevenue,
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: {
        bookingsOverTime,
        statusDistribution,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('API Error /api/analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
