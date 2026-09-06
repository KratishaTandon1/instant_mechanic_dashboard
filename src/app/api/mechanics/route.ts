import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_MECHANICS } from '@/lib/mock-data';

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

    if (mechanics.length === 0) {
      return NextResponse.json({ success: true, data: MOCK_MECHANICS });
    }

    return NextResponse.json({ success: true, data: mechanics });
  } catch (error) {
    console.error('API Error /api/mechanics, using fallback:', error);
    return NextResponse.json({ success: true, data: MOCK_MECHANICS });
  }
}
