import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        mechanic: true,
        serviceCategory: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('API Error /api/bookings/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, mechanicId, notes } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (mechanicId !== undefined) updateData.mechanicId = mechanicId;
    if (notes !== undefined) updateData.notes = notes;

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
      updateData.paymentStatus = 'PAID';
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        mechanic: true,
        serviceCategory: true,
      },
    });

    // Also update mechanic status if assigned
    if (mechanicId && status) {
      let mechStatus = 'AVAILABLE';
      if (status === 'ASSIGNED') mechStatus = 'ON_DUTY';
      if (status === 'IN_TRANSIT') mechStatus = 'IN_TRANSIT';
      if (status === 'IN_PROGRESS') mechStatus = 'BUSY';
      if (status === 'COMPLETED') mechStatus = 'AVAILABLE';

      await prisma.mechanic.update({
        where: { id: mechanicId },
        data: { status: mechStatus },
      });
    }

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('API Error PATCH /api/bookings/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
