import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category && category !== 'ALL') {
      where.serviceCategoryId = category;
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search } },
        { vehicleMake: { contains: search } },
        { vehicleModel: { contains: search } },
        { licensePlate: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { mechanic: { name: { contains: search } } },
      ];
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: true,
          mechanic: true,
          serviceCategory: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('API Error /api/bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, serviceCategoryId, vehicleMake, vehicleModel, vehicleYear, licensePlate, address, notes, amount } = body;

    if (!customerId || !serviceCategoryId || !vehicleMake || !vehicleModel || !licensePlate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookingCount = await prisma.booking.count();
    const bookingNumber = `IM-2025-${String(bookingCount + 1).padStart(5, '0')}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId,
        serviceCategoryId,
        vehicleMake,
        vehicleModel,
        vehicleYear: Number(vehicleYear) || 2024,
        licensePlate,
        address: address || 'New Delhi',
        notes,
        amount: Number(amount) || 1999,
        status: 'PENDING',
      },
      include: {
        customer: true,
        mechanic: true,
        serviceCategory: true,
      },
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
