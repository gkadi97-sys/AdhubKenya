'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CATEGORY_ATTRIBUTES } from '@/lib/categoryData';

/**
 * CategoryFlyout – sidebar category list with a reliable subcategory flyout.
 *
 * Uses React state (not CSS :hover) so there is ZERO gap problem.
 * The flyout stays open while the mouse is over either the trigger or the panel.
 */
export default function CategoryFlyout({ category, onSelect }) {
  const [openSlug, setOpenSlug] = useState(null);
  const closeTimer = useRef(null);

  // Clear any pending close
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Schedule a close with a 120 ms delay so the mouse can travel the gap
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenSlug(null), 120);
  }, []);

  const openFor = (slug) => {
    cancelClose();
    setOpenSlug(slug);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {SIDEBAR_CATEGORIES.map((cat) => {
        const subKeys = CATEGORY_ATTRIBUTES[cat.slug]?.data
          ? Object.keys(CATEGORY_ATTRIBUTES[cat.slug].data).slice(0, 8)
          : [];
        const hasChildren = subKeys.length > 0;
        const isOpen = openSlug === cat.slug;
        const isActive = category === cat.slug;

        return (
          <div
            key={cat.slug}
            style={{ position: 'relative' }}
            onMouseEnter={() => hasChildren && openFor(cat.slug)}
            onMouseLeave={() => hasChildren && scheduleClose()}
          >
            {/* Trigger chip */}
            <div
              className={`filter-chip ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => {
                onSelect(cat.slug === category ? '' : cat.slug);
                setOpenSlug(null);
              }}
            >
              <span>{cat.icon} {cat.name}</span>
              {hasChildren && (
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  style={{ opacity: 0.6, flexShrink: 0, marginLeft: 6 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>

            {/* Flyout panel */}
            {hasChildren && isOpen && (
              <div
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 6px)',
                  top: 0,
                  zIndex: 200,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '10px 0',
                  minWidth: 180,
                  boxShadow: 'var(--shadow-lg)',
                  // Invisible left extension so mouse can cross the gap without losing hover
                  marginLeft: -6,
                  paddingLeft: 6,
                }}
              >
                {subKeys.map((sub) => (
                  <Link
                    key={sub}
                    href={`/browse?category=${cat.slug}&keyword=${encodeURIComponent(sub)}`}
                    onClick={() => setOpenSlug(null)}
                    style={{
                      display: 'block',
                      padding: '7px 18px',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.15s, color 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-glow)';
                      e.currentTarget.style.color = 'var(--primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    {sub}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6 }}>
                  <Link
                    href={`/browse?category=${cat.slug}`}
                    onClick={() => { onSelect(cat.slug); setOpenSlug(null); }}
                    style={{
                      display: 'block',
                      padding: '7px 18px',
                      fontSize: '0.82rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                    }}
                  >
                    Browse all {cat.name} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const SIDEBAR_CATEGORIES = [
  { slug: 'vehicles',             name: 'Vehicles',                     icon: '🚗' },
  { slug: 'auto-spares',          name: 'Auto Spares & Accessories',    icon: '🔩' },
  { slug: 'property',             name: 'Property',                     icon: '🏠' },
  { slug: 'phones-tablets',       name: 'Phones & Tablets',             icon: '📱' },
  { slug: 'electronics',          name: 'Electronics',                  icon: '💻' },
  { slug: 'home-furniture',       name: 'Home, Furniture & Appliances', icon: '🛋️' },
  { slug: 'fashion',              name: 'Fashion',                      icon: '👗' },
  { slug: 'beauty',               name: 'Beauty & Personal Care',       icon: '✨' },
  { slug: 'services',             name: 'Services',                     icon: '🔧' },
  { slug: 'repair-construction',  name: 'Repair & Construction',        icon: '🔨' },
  { slug: 'commercial-equipment', name: 'Commercial Equipment & Tools', icon: '🚜' },
  { slug: 'leisure',              name: 'Leisure & Activities',         icon: '⚽' },
  { slug: 'babies-kids',          name: 'Babies & Kids',                icon: '👶' },
  { slug: 'food-agriculture',     name: 'Food, Agriculture & Farming',  icon: '🌱' },
  { slug: 'animals-pets',         name: 'Animals & Pets',               icon: '🐶' },
  { slug: 'jobs',                 name: 'Jobs',                         icon: '💼' },
  { slug: 'seeking-work',         name: 'Seeking Work - CVs',           icon: '📄' },
];
