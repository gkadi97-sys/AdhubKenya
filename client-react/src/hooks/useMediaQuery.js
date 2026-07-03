/**
 * Reactive media query hooks for AdHub Kenya.
 *
 * Unlike `window.innerWidth` checks, these hooks re-evaluate whenever the
 * browser's matching result changes — orientation flips, resizing, folding.
 * They are also SSR-safe (return false on the server).
 */
import { useState, useEffect } from 'react';

/**
 * Returns true while the given CSS media query matches.
 * Re-renders automatically on every change.
 *
 * @param {string} query – e.g. '(max-width: 767px)'
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    // Modern API (Chrome 38+, FF 55+, Safari 14+)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
    // Legacy fallback
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [query]);

  return matches;
}

/** true when viewport < 768 px (Tailwind `md` breakpoint). Reactive to orientation changes. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

/** true when viewport < 1024 px (Tailwind `lg` breakpoint). */
export function useIsTablet() {
  return useMediaQuery('(max-width: 1023px)');
}

/** true when the device is in landscape orientation. */
export function useIsLandscape() {
  return useMediaQuery('(orientation: landscape)');
}
