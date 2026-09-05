import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`)
      );

      // Interval pushing live simulation events every 4 seconds
      const interval = setInterval(() => {
        const eventTypes = ['BOOKING_STATUS_CHANGE', 'MECHANIC_LOCATION_UPDATE', 'NEW_BOOKING'];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        let eventPayload: any = {
          type: randomType,
          timestamp: new Date().toISOString(),
        };

        if (randomType === 'BOOKING_STATUS_CHANGE') {
          const statuses = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'IN_PROGRESS', 'COMPLETED'];
          eventPayload.data = {
            bookingId: `IM-2025-${Math.floor(1000 + Math.random() * 9000)}`,
            previousStatus: 'PENDING',
            newStatus: statuses[Math.floor(Math.random() * statuses.length)],
            message: `Booking status auto-updated to ${eventPayload.data?.newStatus || 'IN_PROGRESS'}`,
          };
        } else if (randomType === 'MECHANIC_LOCATION_UPDATE') {
          eventPayload.data = {
            mechanicName: ['Rajesh Kumar', 'Amit Sharma', 'Vikram Singh', 'Suresh Patel'][Math.floor(Math.random() * 4)],
            lat: 28.6139 + (Math.random() - 0.5) * 0.08,
            lng: 77.2090 + (Math.random() - 0.5) * 0.08,
            status: 'IN_TRANSIT',
          };
        } else {
          eventPayload.data = {
            bookingNumber: `IM-2025-${Math.floor(10000 + Math.random() * 89999)}`,
            customerName: ['Priya Sharma', 'Anil Verma', 'Rohan Mehta'][Math.floor(Math.random() * 3)],
            serviceName: 'Emergency Towing & Diagnostics',
            amount: 2499,
          };
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventPayload)}\n\n`));
      }, 4000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
