import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// ==============================================================================
// 1. HAVERSINE DISTANCE FORMULA
// ==============================================================================
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

test('Haversine: same coordinates return 0 distance', () => {
  const d = calculateHaversineDistanceKm(13.0827, 80.2707, 13.0827, 80.2707);
  assert.equal(d, 0);
});

test('Haversine: Chennai Central to Guindy is ~11.0 km', () => {
  const d = calculateHaversineDistanceKm(13.0827, 80.2707, 13.0067, 80.2016);
  assert.ok(d >= 10 && d <= 12, `Expected distance ~11 km, got ${d}`);
});

test('Haversine: Companion within service radius filter', () => {
  const meetingLat = 13.0827;
  const meetingLon = 80.2707;
  const companions = [
    { name: 'Within 25km', lat: 13.0067, lon: 80.2016, radiusKm: 25 },
    { name: 'Outside 5km', lat: 13.0067, lon: 80.2016, radiusKm: 5 },
  ];

  const matched = companions.filter((c) => {
    const dist = calculateHaversineDistanceKm(meetingLat, meetingLon, c.lat, c.lon);
    return dist <= c.radiusKm;
  });

  assert.equal(matched.length, 1);
  assert.equal(matched[0].name, 'Within 25km');
});

// ==============================================================================
// 2. FINANCIAL SETTLEMENT & 10% PLATFORM FEE
// ==============================================================================
function calculateSessionSettlement(hourlyRate, hours, feePercent = 10) {
  const subtotal = hourlyRate * hours;
  const platformFee = Math.round(subtotal * (feePercent / 100));
  const totalAmount = subtotal + platformFee;
  const companionEarnings = subtotal;
  return { subtotal, platformFee, totalAmount, companionEarnings };
}

test('Financial: Standard 3hr session with 10% platform commission', () => {
  const result = calculateSessionSettlement(450, 3, 10);
  assert.equal(result.subtotal, 1350);
  assert.equal(result.platformFee, 135);
  assert.equal(result.totalAmount, 1485);
  assert.equal(result.companionEarnings, 1350);
});

test('Financial: Zero fee when feePercent is 0', () => {
  const result = calculateSessionSettlement(500, 2, 0);
  assert.equal(result.subtotal, 1000);
  assert.equal(result.platformFee, 0);
  assert.equal(result.totalAmount, 1000);
  assert.equal(result.companionEarnings, 1000);
});

// ==============================================================================
// 3. CALENDAR TIME COLLISION LOGIC
// ==============================================================================
function hasTimeOverlap(start1, end1, start2, end2) {
  // start1 < end2 && end1 > start2
  return start1 < end2 && end1 > start2;
}

test('Calendar: Overlapping bookings detected', () => {
  // Booking 1: 10:00 to 13:00 (600 to 780 min)
  // Booking 2: 12:00 to 14:00 (720 to 840 min)
  const overlaps = hasTimeOverlap(600, 780, 720, 840);
  assert.equal(overlaps, true);
});

test('Calendar: Back-to-back bookings do NOT collide', () => {
  // Booking 1: 10:00 to 12:00 (600 to 720 min)
  // Booking 2: 12:00 to 14:00 (720 to 840 min)
  const overlaps = hasTimeOverlap(600, 720, 720, 840);
  assert.equal(overlaps, false);
});

// ==============================================================================
// 4. IN-PERSON START VERIFICATION PIN
// ==============================================================================
function generate4DigitOtp() {
  return String(crypto.randomInt(1000, 10000));
}

test('PIN: Generates exactly 4 numeric digits between 1000 and 9999', () => {
  for (let i = 0; i < 50; i++) {
    const pin = generate4DigitOtp();
    assert.equal(pin.length, 4);
    const num = Number(pin);
    assert.ok(num >= 1000 && num <= 9999);
  }
});

// ==============================================================================
// 5. RAZORPAY HMAC-SHA256 SIGNATURE VERIFICATION
// ==============================================================================
function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return expectedSignature === signature;
}

test('Razorpay: Valid payment signature successfully verifies', () => {
  const secret = 'rzp_test_secret_key_123';
  const orderId = 'order_DA2n9kLm8q';
  const paymentId = 'pay_29A1n4Lm8q';
  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature, secret);
  assert.equal(isValid, true);
});

test('Razorpay: Tampered signature is rejected', () => {
  const secret = 'rzp_test_secret_key_123';
  const orderId = 'order_DA2n9kLm8q';
  const paymentId = 'pay_29A1n4Lm8q';
  const tamperedSignature = 'deadbeefdeadbeefdeadbeef';

  const isValid = verifyRazorpaySignature(orderId, paymentId, tamperedSignature, secret);
  assert.equal(isValid, false);
});

// ==============================================================================
// 6. BOOKING STATE MACHINE TRANSITIONS
// ==============================================================================
const VALID_TRANSITIONS = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['companion_arriving', 'cancelled'],
  companion_arriving: ['active', 'cancelled'],
  active: ['completed'],
  completed: [],
  cancelled: [],
  rejected: [],
};

function canTransition(current, next) {
  return (VALID_TRANSITIONS[current] || []).includes(next);
}

test('State Machine: Permitted companion workflow transitions', () => {
  assert.ok(canTransition('pending', 'accepted'));
  assert.ok(canTransition('accepted', 'companion_arriving'));
  assert.ok(canTransition('companion_arriving', 'active'));
  assert.ok(canTransition('active', 'completed'));
});

test('State Machine: Prevents illegal skips or reverse transitions', () => {
  assert.equal(canTransition('pending', 'active'), false);
  assert.equal(canTransition('pending', 'completed'), false);
  assert.equal(canTransition('completed', 'active'), false);
  assert.equal(canTransition('cancelled', 'accepted'), false);
});

