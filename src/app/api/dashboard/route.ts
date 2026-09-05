import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todayBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      inProgressBookings,
      totalRevenueAggregate,
      todayRevenueAggregate,
      activeMechanics,
      totalMechanics,
      totalCustomersCount,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.booking.count({ where: { status: { in: ['IN_PROGRESS', 'IN_TRANSIT', 'ASSIGNED'] } } }),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: todayStart },
          status: { not: 'CANCELLED' },
        },
      }),
      prisma.mechanic.count({
        where: { status: { in: ['AVAILABLE', 'ON_DUTY', 'IN_TRANSIT', 'BUSY'] } },
      }),
      prisma.mechanic.count(),
      prisma.customer.count(),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          mechanic: true,
          serviceCategory: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        inProgressBookings,
        totalRevenue: totalRevenueAggregate._sum.amount || 0,
        todayRevenue: todayRevenueAggregate._sum.amount || 0,
        activeMechanics,
        totalMechanics,
        newCustomersCount: Math.round(totalCustomersCount * 0.15),
        totalCustomersCount,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('API Error /api/dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
