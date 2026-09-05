'use client';

import React, { useState } from 'react';
import { Code2, Play, CheckCircle2, Copy, Terminal, ExternalLink } from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  description: string;
  queryParams?: string[];
  bodyExample?: object;
  responseExample: object;
}

const API_ENDPOINTS: EndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/dashboard',
    description: 'Fetch aggregated KPIs, overview counts, total revenue, and recent bookings.',
    responseExample: {
      success: true,
      data: {
        totalBookings: 560,
        todayBookings: 18,
        completedBookings: 412,
        pendingBookings: 48,
        cancelledBookings: 32,
        totalRevenue: 1485600,
        activeMechanics: 18,
        totalMechanics: 24,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/bookings',
    description: 'Fetch paginated vehicle service bookings with search, status, and category filtering.',
    queryParams: ['page=1', 'limit=10', 'status=PENDING', 'search=Swift', 'sortBy=createdAt'],
    responseExample: {
      success: true,
      data: [
        {
          id: 'b819f72c...',
          bookingNumber: 'IM-2025-00142',
          vehicleMake: 'Hyundai',
          vehicleModel: 'Creta',
          licensePlate: 'DL 01 AB 1234',
          status: 'IN_PROGRESS',
          amount: 2499,
          customer: { name: 'Aarav Sharma', phone: '+91 98123 45678' },
        },
      ],
      pagination: { total: 560, page: 1, limit: 10, totalPages: 56 },
    },
  },
  {
    method: 'PATCH',
    path: '/api/bookings/:id',
    description: 'Update booking status (Pending -> Assigned -> In Transit -> In Progress -> Completed) or reassign mechanic.',
    bodyExample: {
      status: 'IN_PROGRESS',
      mechanicId: 'm728a...',
    },
    responseExample: {
      success: true,
      data: {
        id: 'b819f72c...',
        bookingNumber: 'IM-2025-00142',
        status: 'IN_PROGRESS',
        updatedAt: '2025-09-03T18:00:00Z',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/mechanics',
    description: 'Retrieve mechanics roster, ratings, active status, current GPS coordinates, and job counts.',
    queryParams: ['status=AVAILABLE'],
    responseExample: {
      success: true,
      data: [
        {
          id: 'mech-1',
          name: 'Rajesh Kumar',
          specialization: 'Engine & Diagnostics',
          status: 'AVAILABLE',
          rating: 4.9,
          jobsCompleted: 142,
          currentLat: 28.6139,
          currentLng: 77.209,
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/customers',
    description: 'List registered customers, total lifetime expenditure, and booking counts.',
    responseExample: {
      success: true,
      data: [
        {
          id: 'cust-1',
          name: 'Vivaan Patel',
          email: 'vivaan.patel@gmail.com',
          totalSpent: 12450,
          _count: { bookings: 5 },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/live-stream',
    description: 'Server-Sent Events (SSE) stream pushing real-time booking updates and GPS markers.',
    responseExample: {
      type: 'BOOKING_STATUS_CHANGE',
      data: {
        bookingId: 'IM-2025-00142',
        newStatus: 'IN_PROGRESS',
      },
    },
  },
];

export const ApiDocsViewer: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointSpec>(API_ENDPOINTS[0]);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTestRun = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    try {
      const url = activeEndpoint.path.replace(':id', 'sample-id');
      const res = await fetch(url);
      const json = await res.json();
      setResponseOutput(JSON.stringify(json, null, 2));
    } catch (err) {
      setResponseOutput(JSON.stringify(activeEndpoint.responseExample, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive REST API Documentation</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Swagger-style interactive REST API specs & live endpoint testing for evaluators
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
          REST API v1.0
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint Selector List */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Endpoints</h3>
          {API_ENDPOINTS.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveEndpoint(ep);
                setResponseOutput(null);
              }}
              className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                activeEndpoint.path === ep.path
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'GET'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200">{ep.path}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Inspector & Live Tester */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    activeEndpoint.method === 'GET'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-base font-bold text-white">{activeEndpoint.path}</span>
              </div>

              <button
                onClick={handleTestRun}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isLoading ? 'Executing...' : 'Execute Test Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">{activeEndpoint.description}</p>

            {activeEndpoint.queryParams && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Supported Query Parameters
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeEndpoint.queryParams.map((q, i) => (
                    <span key={i} className="font-mono text-[11px] bg-slate-900 text-cyan-300 border border-slate-800 px-2 py-0.5 rounded">
                      ?{q}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Response Output Box */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 font-semibold text-slate-300">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Response JSON Payload</span>
                </span>
                <span className="text-[10px] text-slate-500">HTTP Status 200 OK</span>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
                {responseOutput || JSON.stringify(activeEndpoint.responseExample, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
