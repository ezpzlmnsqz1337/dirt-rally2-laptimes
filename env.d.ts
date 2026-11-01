/// <reference types="vite/client" />

interface Window {
  // Google Maps invokes this when the API key is rejected (invalid key,
  // referrer or billing restriction). MapView hooks it to fall back to the
  // themed placeholder instead of Google's error box.
  gm_authFailure?: () => void;
}
