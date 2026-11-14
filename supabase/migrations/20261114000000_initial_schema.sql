-- ==============================================================================
-- PERSONAL COMPANION BOOKING PLATFORM: INITIAL SCHEMA MIGRATION
-- Database: Supabase PostgreSQL with PostGIS Spatial Extensions
-- Migration: 20261114000000_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- 2. ENUMS
do $$ begin
  create type user_role as enum ('customer', 'companion', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type identity_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type booking_status as enum (
    'pending',
    'accepted',
    'rejected',
    'confirmed',
    'companion_arriving',
    'active',
    'completed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'captured', 'failed', 'refunded');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type call_status as enum ('initiating', 'ringing', 'connected', 'ended', 'rejected', 'missed');
exception
  when duplicate_object then null;
end $$;

-- 3. COMMON TRIGGER FUNCTION: AUTO-UPDATE UPDATED_AT
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==============================================================================
-- TABLE 1: profiles (Extends auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text unique,
  role user_role not null default 'customer',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'New Member'),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users (if not already attached)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- TABLE 2: customer_profiles
-- ==============================================================================
create table if not exists public.customer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  emergency_contact_name text,
  emergency_contact_phone text,
  preferences jsonb default '{}'::jsonb,
  saved_places jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_customer_profiles_updated_at
  before update on public.customer_profiles
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 3: companion_profiles
-- ==============================================================================
create table if not exists public.companion_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  bio text,
  city text not null default 'Chennai',
  hourly_rate numeric(10,2) not null default 350.00 check (hourly_rate >= 0),
  service_radius_km int not null default 25 check (service_radius_km > 0),
  languages text[] not null default array['English'],
  is_online boolean not null default false,
  is_verified boolean not null default false,
  identity_status identity_status not null default 'unverified',
  rating_average numeric(3,2) not null default 5.00 check (rating_average between 0.00 and 5.00),
  rating_count int not null default 0 check (rating_count >= 0),
  total_completed_bookings int not null default 0 check (total_completed_bookings >= 0),
  current_location geography(Point, 4326),
  last_location_update timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_companion_location on public.companion_profiles using gist (current_location);
create index if not exists idx_companion_online_verified on public.companion_profiles (is_online, is_verified);

create trigger tr_companion_profiles_updated_at
  before update on public.companion_profiles
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 4: companion_categories
-- ==============================================================================
create table if not exists public.companion_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  icon text not null,
  base_rate_per_hour numeric(10,2) not null check (base_rate_per_hour >= 0),
  recommended_duration text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- TABLE 5: companion_services (Junction between companion and categories)
-- ==============================================================================
create table if not exists public.companion_services (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  category_id uuid not null references public.companion_categories(id) on delete cascade,
  custom_rate_per_hour numeric(10,2) check (custom_rate_per_hour >= 0),
  experience_years int default 1 check (experience_years >= 0),
  special_skills text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (companion_id, category_id)
);

create index if not exists idx_companion_services_lookup on public.companion_services (category_id, companion_id);

-- ==============================================================================
-- TABLE 6: companion_availability
-- ==============================================================================
create table if not exists public.companion_availability (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sunday, 6=Saturday
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists idx_companion_availability on public.companion_availability (companion_id, day_of_week);

-- ==============================================================================
-- TABLE 7: bookings
-- ==============================================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  companion_id uuid not null references public.profiles(id),
  category_id uuid not null references public.companion_categories(id),
  status booking_status not null default 'pending',
  scheduled_date date not null,
  scheduled_start_time time not null,
  duration_hours int not null default 2 check (duration_hours > 0 and duration_hours <= 12),
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  platform_fee numeric(10,2) not null default 0.00 check (platform_fee >= 0),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  currency text not null default 'INR',
  payment_status payment_status not null default 'pending',
  verification_otp text check (length(verification_otp) = 4),
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles(id),
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_customer on public.bookings (customer_id, created_at desc);
create index if not exists idx_bookings_companion on public.bookings (companion_id, created_at desc);
create index if not exists idx_bookings_status on public.bookings (status);
create index if not exists idx_bookings_date on public.bookings (scheduled_date, companion_id);

create trigger tr_bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 8: booking_locations
-- ==============================================================================
create table if not exists public.booking_locations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  meeting_address text not null,
  meeting_location geography(Point, 4326) not null,
  destination_address text,
  destination_location geography(Point, 4326),
  meeting_notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_booking_meeting_location on public.booking_locations using gist (meeting_location);

-- ==============================================================================
-- TABLE 9: live_locations (Secure location tracking during active sessions)
-- ==============================================================================
create table if not exists public.live_locations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  location geography(Point, 4326) not null,
  heading numeric(5,2),
  speed numeric(6,2),
  accuracy numeric(6,2),
  recorded_at timestamptz not null default now()
);

create index if not exists idx_live_locations_booking on public.live_locations (booking_id, recorded_at desc);

-- ==============================================================================
-- TABLE 10: conversations
-- ==============================================================================
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_conversations_updated_at
  before update on public.conversations
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 11: conversation_participants
-- ==============================================================================
create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- ==============================================================================
-- TABLE 12: messages
-- ==============================================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  message_text text not null,
  message_type text not null default 'text',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages (conversation_id, created_at asc);

-- ==============================================================================
-- TABLE 13: call_sessions (WebRTC Audio Calls)
-- ==============================================================================
create table if not exists public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  caller_id uuid not null references public.profiles(id),
  receiver_id uuid not null references public.profiles(id),
  status call_status not null default 'initiating',
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds int default 0 check (duration_seconds >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_call_sessions_booking on public.call_sessions (booking_id);

-- ==============================================================================
-- TABLE 14: payments (Razorpay Integration)
-- ==============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  customer_id uuid not null references public.profiles(id),
  companion_id uuid not null references public.profiles(id),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  amount numeric(10,2) not null check (amount >= 0),
  platform_fee numeric(10,2) not null default 0.00 check (platform_fee >= 0),
  companion_earnings numeric(10,2) not null check (companion_earnings >= 0),
  status payment_status not null default 'pending',
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_booking on public.payments (booking_id);
create index if not exists idx_payments_customer on public.payments (customer_id);
create index if not exists idx_payments_companion on public.payments (companion_id);

create trigger tr_payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 15: reviews
-- ==============================================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  reviewer_id uuid not null references public.profiles(id),
  reviewee_id uuid not null references public.profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_id)
);

create index if not exists idx_reviews_reviewee on public.reviews (reviewee_id);

-- Trigger to recalculate companion rating on review insertion
create or replace function public.update_companion_rating()
returns trigger as $$
declare
  avg_rate numeric(3,2);
  cnt int;
begin
  select coalesce(round(avg(rating)::numeric, 2), 5.00), count(*)
  into avg_rate, cnt
  from public.reviews
  where reviewee_id = new.reviewee_id;

  update public.companion_profiles
  set rating_average = avg_rate, rating_count = cnt
  where id = new.reviewee_id;

  return new;
end;
$$ language plpgsql;

create trigger tr_reviews_rating_calc
  after insert on public.reviews
  for each row execute function public.update_companion_rating();

-- ==============================================================================
-- TABLE 16: notifications
-- ==============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'general',
  data jsonb default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, is_read, created_at desc);

-- ==============================================================================
-- TABLE 17: identity_verifications
-- ==============================================================================
create table if not exists public.identity_verifications (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  id_type text not null check (id_type in ('aadhaar', 'passport', 'driving_license', 'voter_id')),
  id_number_masked text not null,
  front_image_url text not null,
  back_image_url text,
  selfie_image_url text not null,
  status identity_status not null default 'pending',
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_identity_status on public.identity_verifications (status);

create trigger tr_identity_verifications_updated_at
  before update on public.identity_verifications
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 18: reports
-- ==============================================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  reported_user_id uuid not null references public.profiles(id),
  booking_id uuid references public.bookings(id),
  reason text not null,
  details text not null,
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'dismissed')),
  resolved_by uuid references public.profiles(id),
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reports_status on public.reports (status);

create trigger tr_reports_updated_at
  before update on public.reports
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 19: admin_users
-- ==============================================================================
create table if not exists public.admin_users (
  id uuid primary key references public.profiles(id) on delete cascade,
  permissions text[] not null default array['all'],
  is_super_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.companion_profiles enable row level security;
alter table public.companion_categories enable row level security;
alter table public.companion_services enable row level security;
alter table public.companion_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_locations enable row level security;
alter table public.live_locations enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.call_sessions enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.identity_verifications enable row level security;
alter table public.reports enable row level security;
alter table public.admin_users enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated using (is_active = true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = id);

-- CUSTOMER PROFILES POLICIES
create policy "Customers can manage their own profile"
  on public.customer_profiles for all
  to authenticated using (auth.uid() = id);

-- COMPANION PROFILES POLICIES
create policy "Verified companions are viewable by all authenticated users"
  on public.companion_profiles for select
  to authenticated using (true);

create policy "Companions can update their own profile"
  on public.companion_profiles for update
  to authenticated using (auth.uid() = id);

-- COMPANION CATEGORIES POLICIES
create policy "Categories are publicly viewable"
  on public.companion_categories for select
  to authenticated, anon using (is_active = true);

-- COMPANION SERVICES & AVAILABILITY
create policy "Companion services viewable by all"
  on public.companion_services for select
  to authenticated using (true);

create policy "Companions manage their own services"
  on public.companion_services for all
  to authenticated using (auth.uid() = companion_id);

create policy "Companion availability viewable by all"
  on public.companion_availability for select
  to authenticated using (true);

create policy "Companions manage their availability"
  on public.companion_availability for all
  to authenticated using (auth.uid() = companion_id);

-- BOOKINGS POLICIES (Participants & Admin only)
create policy "Participants and admin can view their bookings"
  on public.bookings for select
  to authenticated using (
    auth.uid() = customer_id or
    auth.uid() = companion_id or
    exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Customers can create bookings"
  on public.bookings for insert
  to authenticated with check (auth.uid() = customer_id);

create policy "Participants can update booking state"
  on public.bookings for update
  to authenticated using (
    auth.uid() = customer_id or
    auth.uid() = companion_id or
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- BOOKING LOCATIONS POLICIES
create policy "Booking location visible to participants"
  on public.booking_locations for select
  to authenticated using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and (b.customer_id = auth.uid() or b.companion_id = auth.uid())
    ) or exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Booking location insertable by customer"
  on public.booking_locations for insert
  to authenticated with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.customer_id = auth.uid()
    )
  );

-- LIVE LOCATIONS POLICIES (Strictly Active Session Participants Only)
create policy "Live location accessible strictly by booking participants"
  on public.live_locations for select
  to authenticated using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.status in ('companion_arriving', 'active')
        and (b.customer_id = auth.uid() or b.companion_id = auth.uid())
    ) or exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Companion can record live location during active session"
  on public.live_locations for insert
  to authenticated with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.companion_id = auth.uid()
        and b.status in ('companion_arriving', 'active')
    )
  );

-- CONVERSATIONS & MESSAGES
create policy "Conversation participants can view conversation"
  on public.conversations for select
  to authenticated using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = id and cp.user_id = auth.uid()
    ) or exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Participants can view messages"
  on public.messages for select
  to authenticated using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  to authenticated with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

-- CALL SESSIONS
create policy "Call participants can view call session"
  on public.call_sessions for select
  to authenticated using (auth.uid() = caller_id or auth.uid() = receiver_id);

create policy "Call participants can insert call session"
  on public.call_sessions for insert
  to authenticated with check (auth.uid() = caller_id);

create policy "Call participants can update call session"
  on public.call_sessions for update
  to authenticated using (auth.uid() = caller_id or auth.uid() = receiver_id);

-- PAYMENTS POLICIES
create policy "Payment records viewable by participants and admin"
  on public.payments for select
  to authenticated using (
    auth.uid() = customer_id or
    auth.uid() = companion_id or
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- REVIEWS POLICIES
create policy "Reviews are viewable by authenticated users"
  on public.reviews for select
  to authenticated using (true);

create policy "Participants can leave review for completed booking"
  on public.reviews for insert
  to authenticated with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.status = 'completed'
    )
  );

-- NOTIFICATIONS POLICIES
create policy "Users can view and update their own notifications"
  on public.notifications for all
  to authenticated using (auth.uid() = user_id);

-- IDENTITY VERIFICATIONS (Companions view their own, Admins review all)
create policy "Companions can view and submit their own verifications"
  on public.identity_verifications for all
  to authenticated using (
    auth.uid() = companion_id or
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- REPORTS POLICIES
create policy "Users can create reports and admins can view all"
  on public.reports for all
  to authenticated using (
    auth.uid() = reporter_id or
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- ADMIN USERS POLICY
create policy "Admin users checkable by admin"
  on public.admin_users for select
  to authenticated using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- ==============================================================================
-- 5. SEED DATA: 7 DEFAULT ACTIVITY CATEGORIES
-- ==============================================================================
insert into public.companion_categories (slug, name, description, icon, base_rate_per_hour, recommended_duration)
values
  ('shopping', 'Shopping Companion', 'Personal shopping assistant, styling guidance, mall visits, and carrying assistance.', 'ShoppingBag', 350.00, '2 - 4 hours'),
  ('hospital-visit', 'Hospital Visit Companion', 'Supportive, patient assistance for medical appointments, checkups, pharmacy, and clinic queues.', 'HeartHandshake', 400.00, '3 - 6 hours'),
  ('restaurant-dining', 'Restaurant & Dining', 'Polite company for lunch, dinner dates, coffee chats, food tasting, or networking meals.', 'UtensilsCrossed', 300.00, '2 - 3 hours'),
  ('salon-spa', 'Salon & Wellness', 'Relaxing company for spa sessions, salon visits, makeover days, and wellness routines.', 'Sparkles', 350.00, '2 - 4 hours'),
  ('travel-city-tour', 'Travel & City Guide', 'Local companion to explore landmarks, new cities, transit navigation, and hidden gems.', 'Compass', 450.00, '4 - 8 hours'),
  ('events-social', 'Events & Social Gatherings', 'Accompany you to weddings, conferences, exhibitions, galas, concerts, or movies.', 'Ticket', 500.00, '3 - 5 hours'),
  ('general-companion', 'General Personal Companion', 'Everyday friendly presence for casual walks, library sessions, errands, or friendly chats.', 'Users', 250.00, '1 - 3 hours')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  base_rate_per_hour = excluded.base_rate_per_hour,
  recommended_duration = excluded.recommended_duration;

