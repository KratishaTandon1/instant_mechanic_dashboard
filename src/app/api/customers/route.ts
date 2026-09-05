import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      take: limit,
      orderBy: { totalSpent: 'desc' },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('API Error /api/customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
