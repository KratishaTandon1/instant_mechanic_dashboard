import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const mechanics = await prisma.mechanic.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: {
        bookings: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: true,
            serviceCategory: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: mechanics });
  } catch (error) {
    console.error('API Error /api/mechanics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mechanics' },
      { status: 500 }
    );
  }
}
