/**
 * Centralised z-index scale for AdHub Kenya.
 *
 * ┌─────────────────────────────────┬───────┐
 * │ Layer                           │ Value │
 * ├─────────────────────────────────┼───────┤
 * │ Page content                    │   10  │
 * │ Sticky content within a section │   20  │
 * │ Dropdowns / tooltips            │   30  │
 * │ Top Navbar (sticky)             │   40  │
 * │ Hero search (sticky)            │   35  │
 * │ Page-level bottom action bars   │   45  │  ← sits above MobileBottomNav
 * │ MobileBottomNav (global)        │   50  │
 * │ Slide-in drawers                │   60  │
 * │ Modal backdrop                  │   65  │
 * │ Modal / dialog content          │   70  │
 * │ Emoji picker (inside modal)     │   70  │
 * │ React-hot-toast                 │   80  │
 * │ Fullscreen overlays (image zoom,│   90  │
 * │   mobile search overlay)        │       │
 * └─────────────────────────────────┴───────┘
 *
 * Usage in JSX (inline style — preferred when Tailwind arbitrary z-index isn't enough):
 *   import { Z } from '@/lib/zIndex';
 *   <div style={{ zIndex: Z.MODAL }}>…</div>
 *
 * Usage with Tailwind arbitrary values (where no dynamic value is needed):
 *   className="z-[45]"  →  equals Z.PAGE_BOTTOM_BAR
 *   className="z-50"    →  equals Z.MOBILE_NAV
 *   className="z-[70]"  →  equals Z.MODAL
 */
export const Z = {
  PAGE_CONTENT:    10,
  STICKY_CONTENT:  20,
  DROPDOWNS:       30,
  HERO_SEARCH:     35,
  NAVBAR:          40,
  PAGE_BOTTOM_BAR: 45,
  MOBILE_NAV:      50,
  DRAWER:          60,
  MODAL_BACKDROP:  65,
  MODAL:           70,
  TOAST:           80,
  FULLSCREEN:      90,
};
