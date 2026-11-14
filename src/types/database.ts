export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'companion' | 'admin';
export type IdentityStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'confirmed'
  | 'companion_arriving'
  | 'active'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';
export type CallStatus = 'initiating' | 'ringing' | 'connected' | 'ended' | 'rejected' | 'missed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      customer_profiles: {
        Row: {
          id: string;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          preferences: Json | null;
          saved_places: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          preferences?: Json | null;
          saved_places?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          preferences?: Json | null;
          saved_places?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      companion_profiles: {
        Row: {
          id: string;
          user_id?: string;
          headline: string | null;
          bio: string | null;
          city: string;
          hourly_rate: number;
          service_radius_km: number;
          languages: string[];
          is_online: boolean;
          is_verified: boolean;
          identity_status: IdentityStatus;
          rating_average: number;
          rating_count: number;
          total_completed_bookings: number;
          current_lat: number | null;
          current_lng: number | null;
          current_location?: any;
          last_location_update: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string;
          headline?: string | null;
          bio?: string | null;
          city?: string;
          hourly_rate?: number;
          service_radius_km?: number;
          languages?: string[];
          is_online?: boolean;
          is_verified?: boolean;
          identity_status?: IdentityStatus;
          rating_average?: number;
          rating_count?: number;
          total_completed_bookings?: number;
          current_lat?: number | null;
          current_lng?: number | null;
          current_location?: any;
          last_location_update?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          headline?: string | null;
          bio?: string | null;
          city?: string;
          hourly_rate?: number;
          service_radius_km?: number;
          languages?: string[];
          is_online?: boolean;
          is_verified?: boolean;
          identity_status?: IdentityStatus;
          rating_average?: number;
          rating_count?: number;
          total_completed_bookings?: number;
          current_lat?: number | null;
          current_lng?: number | null;
          current_location?: any;
          last_location_update?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      companion_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          base_rate_per_hour: number;
          recommended_duration: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          base_rate_per_hour: number;
          recommended_duration?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          icon?: string;
          base_rate_per_hour?: number;
          recommended_duration?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      companion_services: {
        Row: {
          id: string;
          companion_id: string;
          category_id: string;
          custom_rate_per_hour: number | null;
          experience_years: number | null;
          special_skills: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          companion_id: string;
          category_id: string;
          custom_rate_per_hour?: number | null;
          experience_years?: number | null;
          special_skills?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          companion_id?: string;
          category_id?: string;
          custom_rate_per_hour?: number | null;
          experience_years?: number | null;
          special_skills?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      companion_availability: {
        Row: {
          id: string;
          companion_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          companion_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          companion_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          companion_id: string;
          category_id?: string;
          category_slug?: string;
          status: BookingStatus;
          scheduled_date: string;
          scheduled_start_time: string;
          duration_hours: number;
          meeting_address?: string;
          meeting_lat?: number;
          meeting_lng?: number;
          hourly_rate: number;
          subtotal: number;
          platform_fee: number;
          total_amount: number;
          currency: string;
          payment_status: PaymentStatus;
          verification_otp: string | null;
          notes: string | null;
          started_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          cancelled_by?: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          companion_id: string;
          category_id?: string;
          category_slug?: string;
          status?: BookingStatus;
          scheduled_date: string;
          scheduled_start_time: string;
          duration_hours?: number;
          meeting_address?: string;
          meeting_lat?: number;
          meeting_lng?: number;
          hourly_rate: number;
          subtotal: number;
          platform_fee?: number;
          total_amount: number;
          currency?: string;
          payment_status?: PaymentStatus;
          verification_otp?: string | null;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          companion_id?: string;
          category_id?: string;
          category_slug?: string;
          status?: BookingStatus;
          scheduled_date?: string;
          scheduled_start_time?: string;
          duration_hours?: number;
          meeting_address?: string;
          meeting_lat?: number;
          meeting_lng?: number;
          hourly_rate?: number;
          subtotal?: number;
          platform_fee?: number;
          total_amount?: number;
          currency?: string;
          payment_status?: PaymentStatus;
          verification_otp?: string | null;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          cancellation_reason?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_locations: {
        Row: {
          id: string;
          booking_id: string;
          meeting_address: string;
          meeting_location: any;
          destination_address: string | null;
          destination_location: any;
          meeting_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          meeting_address: string;
          meeting_location: any;
          destination_address?: string | null;
          destination_location?: any;
          meeting_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          meeting_address?: string;
          meeting_location?: any;
          destination_address?: string | null;
          destination_location?: any;
          meeting_notes?: string | null;
        };
        Relationships: [];
      };
      live_locations: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          location: any;
          heading: number | null;
          speed: number | null;
          accuracy: number | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          user_id: string;
          location: any;
          heading?: number | null;
          speed?: number | null;
          accuracy?: number | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          user_id?: string;
          location?: any;
          heading?: number | null;
          speed?: number | null;
          accuracy?: number | null;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          booking_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
          last_read_at: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
          last_read_at?: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
          last_read_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id?: string;
          booking_id?: string;
          sender_id: string;
          recipient_id?: string;
          message_text: string;
          message_type?: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id?: string;
          booking_id?: string;
          sender_id: string;
          recipient_id?: string;
          message_text: string;
          message_type?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          booking_id?: string;
          sender_id?: string;
          recipient_id?: string;
          message_text?: string;
          message_type?: string;
          is_read?: boolean;
        };
        Relationships: [];
      };
      call_sessions: {
        Row: {
          id: string;
          booking_id: string;
          caller_id: string;
          receiver_id: string;
          status: CallStatus;
          started_at: string | null;
          ended_at: string | null;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          caller_id: string;
          receiver_id: string;
          status?: CallStatus;
          started_at?: string | null;
          ended_at?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          caller_id?: string;
          receiver_id?: string;
          status?: CallStatus;
          started_at?: string | null;
          ended_at?: string | null;
          duration_seconds?: number | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          companion_id: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature?: string | null;
          amount: number;
          platform_fee: number;
          companion_earnings: number;
          status: PaymentStatus;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          companion_id: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          amount: number;
          platform_fee?: number;
          companion_earnings: number;
          status?: PaymentStatus;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          companion_id?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          amount?: number;
          platform_fee?: number;
          companion_earnings?: number;
          status?: PaymentStatus;
          currency?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: string;
          data?: Json | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
      identity_verifications: {
        Row: {
          id: string;
          companion_id: string;
          id_type: string;
          id_number_masked: string;
          front_image_url: string;
          back_image_url: string | null;
          selfie_image_url: string;
          status: IdentityStatus;
          reviewer_id: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          companion_id: string;
          id_type: string;
          id_number_masked: string;
          front_image_url: string;
          back_image_url?: string | null;
          selfie_image_url: string;
          status?: IdentityStatus;
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          companion_id?: string;
          id_type?: string;
          id_number_masked?: string;
          front_image_url?: string;
          back_image_url?: string | null;
          selfie_image_url?: string;
          status?: IdentityStatus;
          reviewer_id?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          booking_id: string | null;
          reason: string;
          details: string;
          status: string;
          resolved_by: string | null;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id: string;
          booking_id?: string | null;
          reason: string;
          details: string;
          status?: string;
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          reported_user_id?: string;
          booking_id?: string | null;
          reason?: string;
          details?: string;
          status?: string;
          resolved_by?: string | null;
          resolution_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          permissions: string[];
          is_super_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          permissions?: string[];
          is_super_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          permissions?: string[];
          is_super_admin?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_companion_completed_bookings: {
        Args: { companion_id_param: string };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      identity_status: IdentityStatus;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      call_status: CallStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
