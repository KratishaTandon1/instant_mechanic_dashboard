export type BookingStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MechanicStatus = 'AVAILABLE' | 'ON_DUTY' | 'IN_TRANSIT' | 'BUSY' | 'OFFLINE';

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl?: string | null;
  totalSpent: number;
  createdAt: string;
  _count?: {
    bookings: number;
  };
}

export interface MechanicType {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  status: MechanicStatus;
  rating: number;
  jobsCompleted: number;
  currentLat: number;
  currentLng: number;
  specialization: string;
  createdAt: string;
  _count?: {
    bookings: number;
  };
}

export interface ServiceCategoryType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  iconName: string;
}

export interface BookingType {
  id: string;
  bookingNumber: string;
  customerId: string;
  customer: CustomerType;
  mechanicId?: string | null;
  mechanic?: MechanicType | null;
  serviceCategoryId: string;
  serviceCategory: ServiceCategoryType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  status: BookingStatus;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  address: string;
  notes?: string | null;
  rating?: number | null;
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface DashboardOverview {
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  inProgressBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  activeMechanics: number;
  totalMechanics: number;
  newCustomersCount: number;
  totalCustomersCount: number;
  recentBookings: BookingType[];
}

export interface AnalyticsData {
  bookingsOverTime: { date: string; bookings: number; revenue: number }[];
  statusDistribution: { status: BookingStatus; count: number; percentage: number }[];
  categoryBreakdown: { category: string; count: number; totalRevenue: number }[];
}
