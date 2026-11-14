import { BookingStatus } from '@/lib/constants';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone?: string;
  companionId: string;
  companionName: string;
  companionAvatar?: string;
  companionPhone?: string;
  categorySlug: string;
  categoryName: string;
  status: BookingStatus;
  scheduledDate: string; // "YYYY-MM-DD"
  scheduledStartTime: string; // "HH:MM"
  durationHours: number;
  meetingLocation: {
    address: string;
    lat: number;
    lng: number;
    notes?: string;
  };
  companionLiveLocation?: {
    lat: number;
    lng: number;
    heading?: number;
    updatedAt: string;
  };
  pricing: {
    hourlyRate: number;
    subtotal: number;
    platformFee: number;
    totalAmount: number;
    currency: string;
  };
  paymentStatus: 'pending' | 'captured' | 'failed' | 'refunded';
  verificationOtp?: string; // 4-digit start OTP
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  ratingByCustomer?: {
    stars: number;
    review?: string;
  };
  ratingByCompanion?: {
    stars: number;
    review?: string;
  };
  createdAt: string;
}

