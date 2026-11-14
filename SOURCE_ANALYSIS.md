# Source Repository Analysis: Kova (Uber/Lyft Clone)
**Target Transformation**: Personal Companion Booking Platform  
**Source Repository**: [https://github.com/rajkandula/uber-lyft-clone](https://github.com/rajkandula/uber-lyft-clone)  
**Analysis Date**: November 2026  
**Document Version**: 1.0.0  

---

## 1. Executive Summary & Architecture Overview

The source repository is an open-source, full-stack ride-hailing platform named **Kova**. It combines a Rider web app, Driver web app, and an Admin operations console within a single Next.js 16 codebase. 

### Current System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Web Browsers                           │
│  ┌───────────────────────┬──────────────────────┬───────────────────┐  │
│  │ Rider App (/dashboard)│Driver App (/driver/*)│Admin (/admin/*)   │  │
│  └───────────┬───────────┴──────────┬───────────┴─────────┬─────────┘  │
└──────────────┼──────────────────────┼─────────────────────┼────────────┘
               │ HTTPS                │ HTTPS               │ HTTPS
               │ & WebSockets         │ & WebSockets        │ & WebSockets
┌──────────────▼──────────────────────▼─────────────────────▼────────────┐
│              Single Node.js Process (server.js + Next.js 16)           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ src/proxy.js (Route-level role redirection & in-memory RL)       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Next.js App Router (Client & Server Components, 22 Pages)        │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Next.js API Routes (35 Endpoints with Session Auth Verification) │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Socket.IO Server (Namespaces: /rider, /driver, /admin)           │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ In-Process Services: dispatch cascade, ride-matcher, fare engine │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Background Timers (instrumentation.js: sweeper, location-flusher)│  │
│  └──────────────┬───────────────────┬────────────────────┬──────────┘  │
└─────────────────┼───────────────────┼────────────────────┼─────────────┘
                  │                   │                    │
        ┌─────────▼────────┐  ┌───────▼────────┐  ┌────────▼──────────┐
        │     MongoDB 7    │  │    Redis 7     │  │ External Services │
        │  (Mongoose ORM)  │  │ (ioredis + H3) │  │ - OSRM (Routing)  │
        │ - 7 Collections  │  │ - Driver index │  │ - Photon (Geo)    │
        │ - Durable state  │  │ - Surge demand │  │ - CARTO OSM Tiles │
        │ - 2dsphere index │  │ - Dispatch lock│  │ - Stripe Checkout │
        └──────────────────┘  └────────────────┘  └───────────────────┘
```

### Critical Findings from Source Inspection:
1. **No Google Maps**: Despite the common assumption for Uber clones, the source repository contains **zero Google Maps integration**. It uses open-source MapLibre GL with raster map tiles from CARTO / OpenStreetMap, routing via public OSRM, and place searching via Photon (Komoot).
2. **No WebRTC or Voice Calling**: Voice calling is **completely absent** in the source repository.
3. **No Push Notifications**: Notifications are strictly ephemeral in-app toast popups powered by Socket.IO events while the browser tab is open.
4. **Single-Process Constraint**: The current realtime architecture binds Socket.IO, dispatch loops, and in-memory rate limiters to `server.js` using `global.io`, making multi-instance horizontal scaling impossible without restructuring.
5. **Language & Styling**: The codebase is written in standard JavaScript (ESM/JSX, no TypeScript) and styled with custom vanilla CSS variables and classes (no Tailwind CSS, no shadcn/ui).

---

## 2. Existing Technologies vs Target Architecture

| Component / Layer | Source Repository Implementation | Target Companion Platform Architecture | Transformation Requirement |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 16.2.6 (App Router, JavaScript/JSX) | Next.js (latest stable, TypeScript) | Complete migration to TypeScript (`.tsx`) |
| **Styling & UI** | Vanilla CSS variables (`globals.css`), custom `bits.jsx` | Tailwind CSS + shadcn/ui + Lucide React | Complete UI redesign with modern component library |
| **Icons & Motion** | `lucide-react` (1.16.0), `framer-motion` (12.40.0) | `lucide-react` + Framer Motion / shadcn | Reusable icon & animation paradigms |
| **Primary Database** | MongoDB 7 via Mongoose (9.6.2) | Supabase PostgreSQL 15+ | Schema redesign, foreign keys, triggers & RLS |
| **Realtime Engine** | Socket.IO (4.8.3) via custom `server.js` | Supabase Realtime (Channels, Broadcast, Presence) | Eliminate `server.js`, use serverless Supabase Realtime |
| **Caching / Spatial** | Redis 7 (`ioredis`) + Uber H3 (`h3-js`) | Supabase PostgreSQL + PostGIS spatial queries | Replace Redis H3 with PostGIS / Supabase spatial queries |
| **Authentication** | NextAuth v5 (credentials + bcrypt + JWT cookie) | Supabase Authentication (Email/Password, OAuth, RLS) | Replace NextAuth with Supabase Auth & session handling |
| **Map Rendering** | `maplibre-gl` (6.3.0) + CARTO / OSM raster tiles | Google Maps JavaScript API | Complete redevelopment using Google Maps SDK |
| **Routing & Geo** | OSRM (`router.project-osrm.org`) + Photon API | Google Directions API + Google Places / Geocoding | Replace OSRM/Photon with Google Maps Platform APIs |
| **Device GPS** | Browser Geolocation API (`watchPosition`) | Browser Geolocation API (`watchPosition`) | Reusable; hook into Supabase location channel |
| **Payments** | Stripe Checkout & Stripe Connect (USD) | Razorpay (Orders, Webhooks, Companion Payouts) | Replace Stripe with Razorpay SDK & verify signatures |
| **File Storage** | Inline base64 in MongoDB / Unused S3 stub | Supabase Storage (Buckets: avatars, identity_docs) | Implement proper cloud storage with signed URLs |
| **Voice Calling** | **None** | WebRTC 1-to-1 Voice Calling + Supabase Signaling | Full development from scratch |
| **In-Ride Chat** | Messages array embedded in MongoDB Ride doc | Supabase PostgreSQL `messages` + Supabase Realtime | Restructure into normalized relational conversations |

---

## 3. Detailed Inspection of Existing Features

### 3.1 Authentication & Authorization
- **Implementation**: Handled by NextAuth.js v5 beta (`src/lib/auth/config.js`) using a single `CredentialsProvider`.
- **Password Security**: Passwords are required to be 8–128 characters, hashed with `bcryptjs` (salt rounds: 12).
- **Session Strategy**: 30-day JWT session cookie storing `id`, `username`, `name`, `role`, and `avatar`.
- **Role Enforcement**:
  - `src/proxy.js` intercepts requests and enforces role-based path routing:
    - `rider` -> `/dashboard`, `/rides`, `/wallet`, `/profile`
    - `driver` -> `/driver/dashboard`, `/driver/earnings`, `/driver/trips`, `/driver/profile`
    - `admin` -> `/admin/dashboard`, `/admin/drivers`, `/admin/rides`, `/admin/users`, `/admin/pricing`, `/admin/support`
  - Every API route validates sessions via `requireAuth(['role'])` in `src/lib/auth/helpers.js`.
- **Gaps**: No password reset, no email verification, no multi-factor authentication, no social logins, and no UI for admins to modify user roles or disable accounts.

### 3.2 Rider (Customer) Features
- **Booking Flow**: Pick pickup and dropoff points via place search autocomplete or map click, view route and fare estimates for 4 vehicle tiers (`economy`, `comfort`, `premium`, `xl`), and confirm booking.
- **Active Ride Tracking**: Live interactive map showing assigned driver's location, real-time animated car marker interpolation, trip status banners (`searching`, `accepted`, `arrived`, `in_progress`), and 4-digit verification PIN display.
- **In-Ride Messaging**: Floating `ChatSheet` drawer allowing text messaging with the driver while the trip is active.
- **Ride History**: Paginated ride history list with status badges, timestamps, pickup/dropoff addresses, fare totals, and route receipts.
- **Wallet**: Prepaid balance display, demo credit top-ups (when Stripe is unset), Stripe Checkout integration, and transaction ledger.
- **Ratings & Reviews**: 1–5 star rating submission with optional text comment upon ride completion.

### 3.3 Driver (Companion) Features
- **Online / Offline Toggle**: Drivers toggle availability (`POST /api/drivers/me/status`). Requires vehicle plate, approved status, and wallet balance ≥ -$25.
- **Live GPS Streaming**: Uses `navigator.geolocation.watchPosition` to emit `driver:location` every 3.5 seconds to the Socket.IO server.
- **Incoming Offer Modal**: Displays a 15-second countdown with earnings, pickup distance, rider rating, and Accept/Decline actions.
- **Trip Lifecycle Controls**: Step-by-step buttons to mark `Arrived`, enter the rider's 4-digit PIN to `Start Trip`, and `Complete Trip`.
- **Earnings & Cashouts**: Daily/weekly revenue summaries, recent trip earnings breakdown, and Stripe Connect Express cash-out.
- **Profile & Vehicle Details**: Update driver license number, vehicle make, model, color, plate number, and vehicle tier.

### 3.4 Booking & Dispatch Lifecycle
1. **Estimate**: Rider enters locations -> `POST /api/rides/estimate` calls OSRM -> computes base fare + per-km + per-min + H3 demand/supply surge multiplier.
2. **Create Booking**: `POST /api/rides` validates that rider has no active ride and has sufficient wallet balance -> sets status to `searching` -> starts background dispatch.
3. **Dispatch Cascade**:
   - `startDispatch` acquires Redis key lock `ride:dispatch:{rideId}`.
   - Searches candidate drivers in expanding concentric rings of H3 resolution 9 cells in Redis (up to 15 km), falling back to MongoDB `$geoNear`.
   - Scores candidates: `40 * closeness + 25 * (rating/5) + 20 * (acceptanceRate/100) + 15 * (1 - cancellationRate/100)`.
   - Dispatches offer sequentially to top candidate via Socket.IO `ride:offer` with a 15-second response window.
   - Repeats up to 8 candidate drivers. If none accept, transitions ride status to `no_drivers`.
4. **Acceptance & Execution**:
   - Driver accepts -> atomic update marks driver busy (`currentRideId`) and ride `accepted`.
   - Driver clicks "Arrived" -> status becomes `arrived`.
   - Driver enters rider's 4-digit PIN -> status becomes `in_progress`.
   - Driver completes trip -> status becomes `completed`.
5. **Settlement**: Rider wallet debited, driver wallet credited with earnings minus platform commission, `WalletTransaction` ledger rows created, and `Payment` record written.
6. **Cancellation**:
   - By rider: If cancelled after driver arrived, charges $3.00 late fee ($2.40 to driver, $0.60 to platform).
   - By driver: Increments cancellation count; ride returns to `searching` for redispatch.

### 3.5 GPS Tracking Implementation
- **Source Code Verification**:
  - Driver client: `src/hooks/useDriverState.js` polls `navigator.geolocation.watchPosition` with high accuracy and debounces pings to 3,500 ms.
  - Server handler: `server.js` receives `driver:location`, converts coordinates to H3 resolution 9 cell index via `h3-js`, updates Redis key `driver:loc:{profileId}` and set `h3:drivers:{cell}`.
  - Sockets relay: Relays position to rider room `ride:{rideId}` on the `/rider` namespace and broadcasts to `/admin`.
  - Batch Mongo persistence: `src/lib/realtime/location-flusher.js` runs every 10 seconds to flush dirty positions from Redis to MongoDB `drivers.location`.
  - Rider map rendering: `src/components/maps/MapView.jsx` uses requestAnimationFrame to smoothly glide (cubic ease-out lerp over 900 ms) the vehicle marker to the latest coordinates.

### 3.6 Mapping, Routing & Geocoding
- **Map Viewer**: MapLibre GL (`src/components/maps/MapView.jsx`) rendering CARTO Light raster tiles:
  `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png`
- **Routing**: `src/lib/services/routing.js` calls public OSRM (`https://router.project-osrm.org/route/v1/driving/...`). Falls back to haversine straight-line distance * 1.35 if OSRM times out (6 s timeout).
- **Geocoding**: `src/components/maps/PlaceSearch.jsx` queries `/api/geo/search`, which proxies Komoot Photon (`https://photon.komoot.io/api/?q=...`).

### 3.7 Chat & Messaging
- **Implementation**: Text-only messaging active strictly during `accepted`, `arrived`, or `in_progress` rides.
- **Storage**: Array of subdocuments `messages: [{ from, text, at }]` stored inside the MongoDB `Ride` document.
- **Relay**: Sockets emit `ride:message` to the socket room `ride:{rideId}`.
- **Gaps**: No media attachments, no read receipts, no typing indicators, no persistent chat history once a ride is completed and unmounted.

### 3.8 Voice Calling
- **Actual Status**: **0% Implemented**.
- There is no WebRTC, audio stream handling, or signaling logic anywhere in the repository. Must be built from scratch using WebRTC and Supabase Realtime signaling.

### 3.9 Notifications & Realtime Alerts
- **Actual Status**: Only ephemeral Socket.IO push events connected to React `Toast.jsx`.
- No persistent notification inbox, no email alerts, no SMS notifications, and no browser Web Push API.

### 3.10 Wallet & Payments
- **Ledger Model**: Double-entry style `WalletTransaction` tracking `topup`, `ride_payment`, `ride_earning`, `payout`, `cancellation_fee`.
- **Payment Gateway**: Stripe Checkout sessions for wallet top-up, Stripe Connect Express for driver bank payouts. If Stripe keys are omitted, defaults to an instant demo credit faucet.

### 3.11 Admin Console & Management
- **Dashboard (`/admin/dashboard`)**: KPIs (active rides, online drivers, 24h revenue, completed trips), 7-day revenue bar chart, status breakdowns, and a live fleet map.
- **Driver Management (`/admin/drivers`)**: Lists all drivers with vehicle and license details; buttons to Approve or Suspend drivers.
- **Ride Monitoring (`/admin/rides`)**: Filterable ride table with timeline inspection.
- **User List (`/admin/users`)**: Read-only listing of users with search and role filters.
- **Pricing Configuration (`/admin/pricing`)**: Form to configure base fare, per-km rate, per-minute rate, booking fee, platform commission %, and surge multiplier cap per vehicle tier.
- **Support Inbox (`/admin/support`)**: Triage contact messages with `Resolve` and `Reopen` status toggles.

---

## 4. Existing Database Structure & Data Models

### 4.1 MongoDB Collections (Mongoose)

#### `users` (`User.js`)
```typescript
interface User {
  _id: ObjectId;
  username: string; // unique, lowercase
  passwordHash: string; // bcrypt hash (select: false)
  name: string;
  phone?: string; // unique sparse
  email?: string; // unique sparse
  avatar?: string; // base64 data URI
  role: 'rider' | 'driver' | 'admin';
  wallet: {
    balance: number; // default 0
    currency: string; // 'USD'
  };
  rating: {
    average: number; // default 5.0
    count: number; // default 0
  };
  isActive: boolean; // default true
  lastLoginAt?: Date;
  savedPlaces: Array<{
    label: string;
    address: string;
    location: { type: 'Point'; coordinates: [number, number] };
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `drivers` (`Driver.js`)
```typescript
interface Driver {
  _id: ObjectId;
  userId: ObjectId; // ref: users, unique
  license: {
    number: string;
    expiry?: Date;
    imageUrl?: string;
    verified: boolean;
  };
  vehicle: {
    make: string;
    model: string;
    color: string;
    plate: string;
    year: number;
    type: 'economy' | 'comfort' | 'premium' | 'xl';
    imageUrl?: string;
  };
  documents: Array<{
    type: 'license' | 'insurance' | 'registration' | 'background_check' | 'profile_photo';
    url: string;
    verified: boolean;
    uploadedAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
  }>;
  payouts: {
    stripeAccountId?: string;
    detailsSubmitted: boolean;
    payoutsEnabled: boolean;
    lastPayoutAt?: Date;
  };
  isOnline: boolean;
  isApproved: boolean;
  location?: { type: 'Point'; coordinates: [number, number] };
  lastLocationUpdate?: Date;
  currentRideId?: ObjectId; // ref: rides
  stats: {
    totalTrips: number;
    totalEarnings: number;
    totalOnlineHours: number;
    acceptanceRate: number; // 0-100
    cancellationRate: number; // counter
    averageRating: number;
    totalOffers?: number;
    acceptedOffers?: number;
  };
  h3Cell?: string;
  h3Resolution: number; // default 9
  createdAt: Date;
  updatedAt: Date;
}
```

#### `rides` (`Ride.js`)
```typescript
interface Ride {
  _id: ObjectId;
  riderId: ObjectId; // ref: users
  driverId?: ObjectId; // ref: users
  driverProfileId?: ObjectId; // ref: drivers
  status: 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'no_drivers';
  pickup: {
    address: string;
    location: { type: 'Point'; coordinates: [number, number] };
    arrivedAt?: Date;
  };
  dropoff: {
    address: string;
    location: { type: 'Point'; coordinates: [number, number] };
  };
  route: {
    distanceMeters: number;
    durationSeconds: number;
    geometry: Array<[number, number]>;
    actualDurationSeconds?: number;
    actualDistanceMeters?: number;
  };
  vehicleType: 'economy' | 'comfort' | 'premium' | 'xl';
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeFare: number;
    bookingFee: number;
    platformFee: number;
    driverEarnings: number;
    total: number;
    estimatedTotal: number;
    surgeMultiplier: number;
    tip?: number;
    discount?: number;
    cancellationFee?: number;
    currency: string;
  };
  payment: {
    method: 'wallet' | 'cash';
    status: 'pending' | 'captured' | 'failed' | 'refunded' | 'waived';
  };
  pin: string; // 4-digit verification code
  rating: {
    byRider?: number;
    byDriver?: number;
    riderComment?: string;
    driverComment?: string;
  };
  messages: Array<{
    from: 'rider' | 'driver';
    text: string;
    at: Date;
  }>;
  dispatch: {
    offeredTo: ObjectId[];
    declinedBy: ObjectId[];
    offersSent: number;
  };
  timeline: Array<{
    status: string;
    timestamp: Date;
    location?: { type: 'Point'; coordinates: [number, number] };
    note?: string;
  }>;
  cancelledBy?: 'rider' | 'driver' | 'system';
  cancellationReason?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Other Collections:
- `Payment` (`payments`): Stores individual transaction settlement records (`amount`, `platformFee`, `driverPayout`, `status: succeeded`).
- `WalletTransaction` (`wallettransactions`): The ledger tracking every credit/debit with `balanceAfter` and idempotency references.
- `PricingRule` (`pricingrules`): Dynamic pricing rules per vehicle tier and city.
- `ContactMessage` (`contactmessages`): Contact form submissions with status (`open` / `resolved`).

### 4.2 Redis Ephemeral Key Structure
- `h3:drivers:{cell}`: Set of driver IDs located in H3 cell (TTL: 300s).
- `h3:driver:cell:{profileId}`: String storing driver's current H3 cell (TTL: 300s).
- `driver:loc:{profileId}`: Hash of latest GPS coordinates and heading (TTL: 600s).
- `h3:demand:{cell}`: Sorted set tracking booking attempts in H3 resolution 7 cell (TTL: 600s).
- `ride:members:{rideId}`: Set of authorized user IDs for socket room admission (TTL: 24h).
- `ride:offer:{rideId}`: String storing the driver profile ID currently holding the offer (TTL: 25s).
- `ride:dispatch:{rideId}`: Mutex lock ensuring single dispatch loop execution per ride (TTL: 300s).
- `contact:rl:{ip}`: Rate limit counter for contact submissions (TTL: 1h).

---

## 5. Existing API Endpoints Inventory (35 Routes)

| Endpoint | Method | Allowed Roles | Description / Functionality |
| :--- | :---: | :---: | :--- |
| `/api/auth/[...nextauth]` | GET, POST | Public | NextAuth session handler, credentials sign-in, CSRF token |
| `/api/auth/signup` | POST | Public | User registration (creates `User`, and `Driver` if role=driver) |
| `/api/auth/socket-token` | GET | Signed in | Issues short-lived JWT for Socket.IO namespace authentication |
| `/api/users/me` | GET, PATCH | Signed in | Fetch or update user profile, phone, email, and saved places |
| `/api/users/me/avatar` | POST, DELETE| Signed in | Upload image (resized via sharp to 256px base64) or remove avatar |
| `/api/rides/estimate` | POST | Signed in | Calculates route distance, duration, and prices for all 4 vehicle tiers |
| `/api/rides` | GET, POST | Rider / Driver | GET: ride history list; POST: create new ride & trigger dispatch |
| `/api/rides/active` | GET | Rider / Driver | Retrieves current active ride to restore client UI on reload |
| `/api/rides/[id]` | GET | Participants, Admin | Detailed ride information with driver and rider summaries |
| `/api/rides/[id]/accept` | POST | Driver | Accept current offer (verifies Redis offer claim and locks driver) |
| `/api/rides/[id]/decline` | POST | Driver | Decline ride offer; triggers dispatch to advance to next candidate |
| `/api/rides/[id]/arrive` | POST | Driver | Mark driver arrived at pickup location |
| `/api/rides/[id]/start` | POST | Driver | Verify 4-digit PIN provided by rider and start the trip |
| `/api/rides/[id]/complete` | POST | Driver | Complete trip, execute wallet settlement, and free driver |
| `/api/rides/[id]/cancel` | POST | Rider / Driver | Cancel ride; handles cancellation fees if driver already arrived |
| `/api/rides/[id]/rate` | POST | Rider / Driver | Submit 1–5 star rating and comment for completed trip |
| `/api/rides/[id]/messages`| POST | Rider / Driver | Send in-ride chat message, persisted to Ride doc & emitted via socket |
| `/api/drivers/me` | GET, PATCH | Driver | Read or update driver profile, license, and vehicle specs |
| `/api/drivers/me/status` | POST | Driver | Toggle driver online/offline status with initial GPS coordinates |
| `/api/drivers/me/earnings`| GET | Driver | Summary of today's and weekly earnings, recent trips, and ledger |
| `/api/drivers/me/payouts` | GET, POST | Driver | Check Stripe Connect payout status or initiate bank cash-out |
| `/api/drivers/nearby` | GET | Signed in | Returns available drivers around coordinates for map pins |
| `/api/geo/search` | GET | Signed in | Autocomplete place search or reverse geocoding via Photon API |
| `/api/wallet` | GET, POST | Signed in | GET: balance and ledger; POST: instant demo credits top-up |
| `/api/wallet/checkout` | GET, POST | Signed in | Create Stripe Checkout top-up session or verify returned session |
| `/api/webhooks/stripe` | POST | Stripe Signature | Webhook handler for `checkout.session.completed` & `account.updated` |
| `/api/admin/overview` | GET | Admin | Platform KPI metrics, 7-day revenue summary, active counts |
| `/api/admin/rides` | GET | Admin | All rides with status filtering and pagination |
| `/api/admin/drivers` | GET, PATCH | Admin | GET: driver listing; PATCH: approve or suspend driver |
| `/api/admin/users` | GET | Admin | User listing with role filter and search (read-only) |
| `/api/admin/pricing` | GET, PUT | Admin | GET: active pricing rules; PUT: upsert pricing rules per tier/city |
| `/api/admin/support` | GET, PATCH | Admin | GET: contact messages; PATCH: update status (resolve/reopen) |
| `/api/contact` | POST | Public | Submit contact message with honeypot and IP rate limiting |
| `/api/upload/presigned` | POST | Signed in | S3 presigned upload URL stub (returns 503 if unconfigured) |
| `/api/health` | GET | Public | Health check verifying MongoDB and Redis connection status |

---

## 6. Existing UI Modules & Component Hierarchy

### Page Structure (App Router)
- `(public)`: Marketing landing page (`/`), `/contact`, `/terms`, `/privacy`.
- `(auth)`: Login (`/login`) and Signup (`/signup`) with role selector (`rider` vs `driver`).
- `(rider)`:
  - `/dashboard`: Primary booking screen with map, place inputs, tier selector, and active ride card.
  - `/rides`: Paginated trip history and receipts.
  - `/rides/[id]`: Detailed single ride breakdown.
  - `/wallet`: Balance card, top-up modal, transaction ledger list.
  - `/profile`: Name, phone, email, avatar upload, saved places management.
- `driver`:
  - `/driver/dashboard`: Go online switch, incoming offer modal, active trip navigation sheet.
  - `/driver/earnings`: Revenue metrics, cash-out triggers, Stripe Connect status.
  - `/driver/trips`: Driver trip history.
  - `/driver/wallet`: Driver wallet balance and ledger.
  - `/driver/profile`: Vehicle specifications and driver license entry.
- `admin`:
  - `/admin/dashboard`: Live fleet map, metric cards, revenue graphs.
  - `/admin/drivers`: Approval and suspension dashboard.
  - `/admin/rides`: Global ride inspection.
  - `/admin/users`: User registry.
  - `/admin/pricing`: Pricing rules configuration table.
  - `/admin/support`: Support ticket management.

### Component Breakdown
- `MapView.jsx`: MapLibre GL instance, marker management, route GeoJSON rendering, vehicle animation lerp.
- `PlaceSearch.jsx`: Portaled dropdown with debounced input, Photon API integration, keyboard navigation.
- `ChatSheet.jsx`: Slide-over chat sheet for active ride messaging.
- `PayoutCard.jsx`: Stripe Connect onboarding banner and payout trigger.
- `WalletPanel.jsx`: Wallet balance, top-up trigger, ledger table.
- `ProfileCard.jsx`: Avatar presentation and editable contact details.
- `ui/bits.jsx`, `Modal.jsx`, `Toast.jsx`: Custom minimalist UI primitives (buttons, badges, modals, toasts).

---

## 7. Gap Analysis & Transformation Mapping

### 7.1 Features That Can Be Reused
1. **Dispatch Cascade & Matching Engine Logic**: The sequential dispatch loop, scoring algorithm (distance, rating, acceptance rate, cancellation rate), and mutex locking concepts are robust and can be adapted for companions.
2. **Atomic State Transition Pattern**: Strict status transitions (`pending -> accepted -> arriving -> active -> completed`) with concurrency guards prevent race conditions.
3. **Double-Entry Wallet Ledger Design**: The transaction ledger concept (`balanceAfter`, idempotency references, separate driver/companion earnings) can be ported directly to PostgreSQL.
4. **GPS Interpolation Technique**: The `requestAnimationFrame` ease-out cubic interpolation for vehicle/companion marker gliding provides an ultra-smooth experience and should be retained in the Google Maps implementation.

### 7.2 Features Requiring Modification
1. **Domain Model & Terminology**:
   - `Driver` -> `Companion`
   - `Rider` -> `Customer`
   - `Ride` -> `CompanionBooking`
   - `Vehicle Type` (`economy`, `comfort`, `xl`) -> `Companion Activity Category` (`Shopping`, `Hospital Visit`, `Restaurant`, `Salon`, `Travel`, `Event`, `General Personal`)
   - `Pickup & Dropoff` -> `Meeting Location & Destination / Itinerary`
2. **Booking Mechanics (On-Demand vs Scheduled)**:
   - Current: Strictly immediate, on-demand taxi hailing with a 15-second response window.
   - Required: Both immediate and advance scheduled reservations (date picker, time slots, duration in hours) with calendar collision prevention.
3. **Payments**:
   - Current: Stripe Checkout & Stripe Connect (USD).
   - Required: Razorpay integration (Order generation, Razorpay checkout modal, webhook signature verification, companion payout accounting).
4. **Chat & Communication**:
   - Current: Ephemeral array in Ride document.
   - Required: Normalized `conversations` and `messages` tables in Supabase with real-time subscriptions and persistent access.

### 7.3 Features Requiring Complete Redevelopment
1. **Maps & Geolocation**:
   - Source uses MapLibre GL + CARTO OSM raster tiles + OSRM + Photon.
   - Must be completely redeveloped using **Google Maps JavaScript API**, **Google Places Autocomplete API**, **Google Directions API**, and **Google Geocoding API**.
2. **Database & Infrastructure**:
   - Source uses MongoDB (Mongoose) + Redis + custom Node server (`server.js`).
   - Must be migrated to **Supabase PostgreSQL** with full relational schema, PostGIS spatial queries, Row Level Security (RLS) policies, and Supabase migrations.
3. **Realtime Engine**:
   - Source uses Socket.IO with server-bound rooms and namespaces.
   - Must be migrated to **Supabase Realtime** (Channels, Broadcast, Presence).
4. **Voice Calling**:
   - Does not exist in the source code.
   - Must be built from the ground up using **WebRTC** with Supabase Realtime for SDP offer/answer/ICE candidate signaling.
5. **UI & Design System**:
   - Source uses JavaScript and vanilla CSS.
   - Must be rebuilt with **Next.js (TypeScript)**, **Tailwind CSS**, and **shadcn/ui** components.
6. **Companion Identity Verification**:
   - Source has unutilized schema placeholders.
   - Must build document upload (Gov ID, background check) via Supabase Storage and an admin verification approval flow.

---

## 8. Transformation Mapping Matrix

| Original Concept (Ride-Hailing) | Transformed Concept (Companion Booking) | Key Architectural Adjustments |
| :--- | :--- | :--- |
| **Driver** | **Companion** | Adds bio, hourly rates, verified skills, activity categories, identity docs, availability calendar |
| **Rider** | **Customer** | Manages personal preferences, companion booking requests, live companion tracking |
| **Ride** | **Companion Booking** | Adds booking date, start time, duration (hours), meeting location, selected activity category, and companion OTP/PIN verification |
| **Vehicle Types** | **Activity Categories** | Shopping, Hospital Visit, Restaurant, Salon, Travel, Event, General Companion |
| **Ride Fare (Distance + Time)** | **Companion Fee (Hourly Rate + Activity)** | Base booking fee + (hourly companion rate * duration) + platform service commission |
| **Immediate Dispatch (15s)** | **Scheduled & On-Demand Booking** | Support for advance booking requests with companion approval, plus immediate booking requests |
| **Driver Location Streaming** | **Live Companion Meeting Tracking** | Companion location shared strictly once booking status is `companion_arriving` or `active`; never exposed publicly |

---

## 9. Next Steps & Development Roadmap

1. **Phase 1 Complete**: Repository fully analyzed and documented in `SOURCE_ANALYSIS.md`.
2. **Phase 2 (Immediate Next Phase)**:
   - Initialize modern Next.js project with TypeScript, Tailwind CSS, shadcn/ui, and Lucide React.
   - Establish directory structure, brand identity, and UI layout shells (Customer, Companion, Admin).
3. **Phase 3**:
   - Design and execute Supabase PostgreSQL migrations (all 19 normalized tables, indexes, constraints, and Row Level Security policies).
4. **Phase 4–11**:
   - Implement Supabase Auth, role dashboards, companion search, Google Maps & live tracking, Supabase Realtime chat, WebRTC voice calling, Razorpay payments, and Admin management.

