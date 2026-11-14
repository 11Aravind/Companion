Act as a Senior Full-Stack Architect, UI/UX Designer,
Next.js Developer, and Supabase Database Architect.

PROJECT:
Personal Companion Booking Platform
(Uber/Rapido-inspired companion booking application)

SOURCE GITHUB REPOSITORY:
https://github.com/rajkandula/uber-lyft-clone

--------------------------------------------------
1. PROJECT OBJECTIVE
--------------------------------------------------

I want to convert the existing source code into a modern,
production-ready web application using:

Frontend:
- Next.js (latest stable version)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

Backend:
- Supabase
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions where appropriate

Maps:
- Google Maps JavaScript API
- Google Places API
- Google Directions API
- Browser Geolocation API

Real-time:
- Supabase Realtime for chat and booking updates.
- Secure location updates for active bookings.
- WebRTC for optional voice calling.

Payments:
- Razorpay integration.

--------------------------------------------------
2. FIRST TASK: ANALYZE THE SOURCE REPOSITORY
--------------------------------------------------

Before writing any code:

1. Clone and inspect the complete repository.
2. Understand its existing architecture.
3. Identify all existing features.
4. Identify the existing frontend and backend technologies.
5. Identify authentication and authorization.
6. Identify database tables and relationships.
7. Identify Google Maps functionality.
8. Identify GPS tracking implementation.
9. Identify booking workflows.
10. Identify chat and notification implementations.
11. Identify existing admin functionality.

Create a SOURCE_ANALYSIS.md document.

The document must contain:

- Existing features.
- Existing technologies.
- Existing database structure.
- Existing API endpoints.
- Existing UI modules.
- Features that can be reused.
- Features requiring modification.
- Features that need complete redevelopment.

IMPORTANT:
Do not assume that a feature exists just because it is
mentioned in the repository description.

Verify its actual implementation in the source code.

--------------------------------------------------
3. TRANSFORM THE BUSINESS LOGIC
--------------------------------------------------

The existing application may be a taxi, ride-booking,
or service-booking application.

Transform its business logic into a PERSONAL
COMPANION BOOKING PLATFORM.

The application is NOT a taxi booking application.

Customers book a person to accompany them.

Example activities:

- Shopping companion.
- Hospital visit companion.
- Restaurant companion.
- Salon companion.
- Travel companion.
- Event companion.
- General personal companion.

Replace driver/technician terminology with companion.

Replace rides/services terminology with companion activities.

Do not remove useful existing functionality.

--------------------------------------------------
4. USER ROLES
--------------------------------------------------

Create three main roles.

A. CUSTOMER

Features:

- Registration and login.
- Customer profile.
- Current location detection.
- Google Maps interface.
- Search nearby companions.
- Browse companion profiles.
- Filter by activity category.
- View companion ratings.
- View availability.
- Select date and time.
- Select meeting location.
- Send booking requests.
- Cancel bookings according to policy.
- View booking history.
- Track companion location.
- Real-time messaging.
- Voice calling.
- Payment history.
- Submit reviews.
- Report users.

B. COMPANION

Features:

- Companion registration.
- Profile creation.
- Profile photo.
- Identity verification workflow.
- Activity categories.
- Description and introduction.
- Service locations.
- Availability calendar.
- Online/offline status.
- Booking request management.
- Accept/reject bookings.
- Upcoming bookings.
- Active booking management.
- Live location sharing during active bookings.
- Customer chat.
- Voice calling.
- Earnings dashboard.
- Booking history.
- Customer reviews.

C. ADMIN

Features:
- Admin dashboard.
- Customer management.
- Companion management.
- Identity verification.
- Category management.
- Booking management.
- Payment management.
- Commission management.
- Reports and complaints.
- User blocking.
- Reviews management.
- Analytics.

--------------------------------------------------
5. UBER/RAPIDO-STYLE GOOGLE MAPS
--------------------------------------------------

This is one of the most important requirements.

I want a modern Google Maps experience similar to
Uber and Rapido.

Customer map:

- Detect current location.
- Show current location marker.
- Display nearby available companions.
- Show companion markers.
- Display companion distance.
- Show companion profile when clicking a marker.
- Show booking pickup/meeting location.
- Display route between customer and companion.
- Display estimated arrival time.
- Update companion location in real time.
- Animate the moving companion marker smoothly.

Companion map:

- Display current GPS location.
- Allow companion to enable/disable availability.
- Share live location after accepting a booking.
- Update location periodically during active booking.
- Stop sharing after booking completion or cancellation.

Tracking architecture:

- Browser Geolocation API.
- Google Maps JavaScript API.
- Supabase Realtime or a suitable secure real-time
  location channel.
- PostgreSQL for booking and location metadata.

IMPORTANT:

Do not expose a user's location publicly.

Only authorized participants in an active booking
should be able to access its live location.

Implement appropriate location-sharing permissions.

--------------------------------------------------
6. BOOKING SYSTEM
--------------------------------------------------

Create a complete booking lifecycle.

Booking statuses:

- Pending
- Accepted
- Rejected
- Confirmed
- Companion Arriving
- Active
- Completed
- Cancelled

Booking workflow:

1. Customer selects a companion.
2. Customer chooses an activity.
3. Customer selects date and time.
4. Customer specifies meeting location.
5. Customer submits booking.
6. Companion receives notification.
7. Companion accepts or rejects.
8. Customer receives confirmation.
9. Live location tracking becomes available.
10. Companion and customer meet.
11. Booking starts.
12. Booking is completed.
13. Payment and review process.

Prevent double bookings and overlapping reservations.

--------------------------------------------------
7. REAL-TIME CHAT AND VOICE CALLING
--------------------------------------------------

Chat functionality:

- One-to-one messaging.
- Text messages.
- Message timestamps.
- Message delivery status.
- Chat history.
- Booking-specific conversations.
- Notifications for new messages.

Voice calling:

- WebRTC-based one-to-one audio calls.
- Incoming call notification.
- Accept/reject call.
- End call.
- Mute/unmute.
- Call status.

Use Supabase Realtime or another appropriate
signaling mechanism for WebRTC.

Do not implement voice calling as a fake UI.

--------------------------------------------------
8. SUPABASE DATABASE DESIGN
--------------------------------------------------

Create a properly normalized PostgreSQL database.

Suggested tables:

- profiles
- customer_profiles
- companion_profiles
- companion_categories
- companion_services
- companion_availability
- bookings
- booking_locations
- live_locations
- conversations
- conversation_participants
- messages
- call_sessions
- payments
- reviews
- notifications
- identity_verifications
- reports
- admin_users

Requirements:

- Proper primary keys.
- Foreign key relationships.
- Indexes.
- Created and updated timestamps.
- Appropriate constraints.
- Row Level Security policies.
- Secure role-based access.

Use Supabase migrations.

Never expose the Supabase service-role key
in frontend code.

--------------------------------------------------
9. UI/UX DESIGN
--------------------------------------------------

Create a premium, modern, responsive application.

Design inspiration:

- Uber.
- Rapido.
- Airbnb.
- Modern service marketplaces.

Design requirements:
- Clean interface.
- Professional typography.
- Minimal design.
- Modern cards.
- Rounded components.
- Responsive layouts.
- Mobile-first customer experience.
- Desktop-friendly admin dashboard.
- Interactive map interface.
- Smooth transitions.
- Loading states.
- Empty states.
- Error handling.

Suggested color direction:

- Primary: Dark navy.
- Secondary: White.
- Accent: Modern blue or green.

Avoid an outdated template-like design.

--------------------------------------------------
10. PROJECT STRUCTURE
--------------------------------------------------

Use a maintainable feature-based architecture.

Separate:

- Authentication.
- Customers.
- Companions.
- Bookings.
- Maps.
- Location tracking.
- Chat.
- Voice calls.
- Payments.
- Notifications.
- Admin.

Keep reusable components separate.

Use TypeScript types and validation.

Use appropriate server-side and client-side
components.

--------------------------------------------------
11. SECURITY
--------------------------------------------------

Implement:

- Supabase Row Level Security.
- Role-based authorization.
- Secure authentication.
- Input validation.
- Booking ownership checks.
- Location access restrictions.
- Secure payment verification.
- API rate limiting where needed.
- Protected admin routes.
- Identity verification workflow.

--------------------------------------------------
12. DEVELOPMENT APPROACH
--------------------------------------------------

Do not try to convert everything in one step.

Follow these phases:

PHASE 1:
Repository analysis and architecture documentation.

PHASE 2:
Next.js project setup and UI architecture.

PHASE 3:
Supabase configuration and database migrations.

PHASE 4:
Authentication and role management.

PHASE 5:
Customer and companion dashboards.

PHASE 6:
Companion search and booking system.

PHASE 7:
Google Maps and live GPS tracking.

PHASE 8:
Real-time chat and voice calling.

PHASE 9:
Payments and notifications.

PHASE 10:
Admin dashboard.

PHASE 11:
Testing, optimization and deployment.

After each phase:

- Explain what was implemented.
- List modified files.
- List new files.
- Explain database changes.
- Report incomplete functionality.
- Test the implemented features.

Do not claim a feature is complete unless it
actually works.

--------------------------------------------------
13. IMPORTANT DEVELOPMENT RULES
--------------------------------------------------

1. Preserve useful business logic from the original
   repository.
2. Do not blindly copy the existing UI.
3. Rebuild the UI using Next.js.
4. Replace the existing database with Supabase.
5. Do not use mock data as production functionality.
6. Do not create fake GPS tracking.
7. Do not create fake chat or voice calling.
8. Do not hardcode API keys.
9. Keep the code modular and maintainable.
10. Document all environment variables.
11. Provide SQL migrations.
12. Provide setup instructions.
13. Ensure the project can be deployed.

First complete the repository analysis.

Do not start the full implementation until the
existing source code has been inspected and the
conversion plan has been documented.