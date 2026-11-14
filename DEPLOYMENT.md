# Personal Companion Booking Platform — Deployment & Production Guide

This guide describes how to configure, deploy, and verify the Personal Companion Booking Platform across Supabase (Database, Auth, Storage, Realtime) and Vercel (Next.js App Router Frontend).

---

## 1. Environment Variables Configuration

Create `.env.local` for local development or enter the following environment variables in your Vercel Project Settings:

```env
# ==============================================================================
# 1. SUPABASE (Database, Auth, Storage, Realtime)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# ==============================================================================
# 2. GOOGLE MAPS JAVASCRIPT API & PLACES
# ==============================================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# ==============================================================================
# 3. RAZORPAY PAYMENT GATEWAY
# ==============================================================================
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret...
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret...

# ==============================================================================
# 4. APPLICATION URL
# ==============================================================================
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 2. Supabase Backend Setup

### Step 2.1: Run Database Migration
1. Go to your Supabase Project Dashboard -> **SQL Editor**.
2. Open [supabase/migrations/20261114000000_initial_schema.sql](file:///c:/Users/Dell/Pictures/New%20folder/supabase/migrations/20261114000000_initial_schema.sql).
3. Paste the contents and click **Run**.
4. This script automatically:
   - Enables `uuid-ossp` and `postgis` spatial extensions.
   - Creates all 19 relational tables with PostGIS `geography(Point, 4326)` coordinates and GIST spatial indexes.
   - Enforces PostgreSQL triggers for `updated_at`, `handle_new_user`, and `update_companion_rating`.
   - Enables Row Level Security (RLS) across all tables, ensuring companion live GPS is strictly scoped to active bookings.
   - Seeds the 7 Companion Activity Categories.

### Step 2.2: Configure Storage Buckets
1. In Supabase Dashboard, navigate to **Storage**.
2. Create two buckets:
   - `avatars` (Public: **Yes**) — for profile pictures.
   - `verification-docs` (Public: **No**, Private) — for Aadhaar, Passport, DL scans, and biometric selfie checks.
3. Apply RLS storage policies to ensure only authenticated users can upload documents to their own path prefix (`user_id/*`).

### Step 2.3: Configure Realtime Channels
1. In Supabase Dashboard, navigate to **Database** -> **Replication**.
2. Ensure the following tables are enabled for Realtime replication:
   - `messages` (for live in-session chat)
   - `notifications` (for real-time dispatch alerts)
   - `bookings` (for instant state synchronization)
   - `live_locations` (for companion GPS broadcast)

---

## 3. Google Maps Platform Setup

1. In the [Google Cloud Console](https://console.cloud.google.com/), create a project or select an existing one.
2. Under **APIs & Services** -> **Library**, enable:
   - **Maps JavaScript API**
   - **Places API (New)**
   - **Directions API**
   - **Geocoding API**
3. Create an API Key in **Credentials**.
4. Set **Application Restrictions**:
   - HTTP referrers: `https://your-domain.vercel.app/*` and `http://localhost:3000/*` (for dev).
5. Set **API Restrictions**:
   - Limit the key strictly to Maps JavaScript API, Places API, and Directions API.

---

## 4. Razorpay Payment Gateway Setup

1. In the [Razorpay Dashboard](https://dashboard.razorpay.com/), generate API Keys under **Settings** -> **API Keys**.
2. In **Settings** -> **Webhooks**, add your production webhook URL:
   `https://your-domain.vercel.app/api/payments/verify`
3. Select the events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Copy the Webhook Secret into your environment variables as `RAZORPAY_WEBHOOK_SECRET`.

---

## 5. Vercel Deployment

1. Push your repository to your Git provider (GitHub, GitLab, or Bitbucket) with explicit user approval.
2. In [Vercel](https://vercel.com/), click **Add New Project** and import the repository.
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Install Command**: `pnpm install`
4. Add all environment variables from Section 1 above.
5. Click **Deploy**.

---

## 6. Post-Deployment Smoke Test Checklist

- [ ] Customer account signup & login creates profile record in `public.profiles`.
- [ ] Companion onboarding flow allows category selection, hourly rate, and ID verification document upload.
- [ ] Companion search filters by city, activity category, and spatial distance radius.
- [ ] In-person meeting spot selection populates Google Places Autocomplete.
- [ ] Razorpay checkout successfully initiates in test mode with 10% platform fee calculation.
- [ ] 4-digit start OTP displays in customer booking card and verifies before companion can activate session.
- [ ] WebRTC 1-to-1 audio call connects over Google STUN servers with mute/hangup controls.
- [ ] Supabase Realtime chat transmits text messages instantly between customer and companion.
- [ ] Admin console allows viewing roster, approving ID verifications, and triaging safety reports.

