/**
 * Smoothly interpolates (lerps) a Google Maps Marker between two coordinates
 * using requestAnimationFrame and cubic ease-out for an Uber/Rapido-style glide.
 */
export function animateMarkerTo(
  marker: google.maps.Marker,
  targetLat: number,
  targetLng: number,
  durationMs: number = 900
): () => void {
  const startPos = marker.getPosition();
  if (!startPos) {
    marker.setPosition(new google.maps.LatLng(targetLat, targetLng));
    return () => {};
  }

  const fromLat = startPos.lat();
  const fromLng = startPos.lng();

  // If already at target, skip animation
  if (Math.abs(fromLat - targetLat) < 0.00001 && Math.abs(fromLng - targetLng) < 0.00001) {
    return () => {};
  }

  const startTime = performance.now();
  let animFrameId: number;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / durationMs);

    // Ease-out cubic curve: 1 - (1 - t)^3
    const ease = 1 - Math.pow(1 - progress, 3);

    const currentLat = fromLat + (targetLat - fromLat) * ease;
    const currentLng = fromLng + (targetLng - fromLng) * ease;

    marker.setPosition(new google.maps.LatLng(currentLat, currentLng));

    if (progress < 1) {
      animFrameId = requestAnimationFrame(step);
    }
  };

  animFrameId = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(animFrameId);
  };
}

