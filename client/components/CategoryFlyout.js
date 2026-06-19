'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORY_ATTRIBUTES } from '@/lib/categoryData';

/**
 * CategoryFlyout – accordion sidebar with hover on the OUTER wrapper.
 *
 * onMouseEnter/Leave is on the <div> that wraps BOTH the trigger chip
 * and the expanded sub-list, so moving the mouse between them never
 * triggers a close.
 */
export default function CategoryFlyout({ category, onSelect }) {
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {SIDEBAR_CATEGORIES.map((cat) => {
        const subKeys = CATEGORY_ATTRIBUTES[cat.slug]?.data
          ? Object.keys(CATEGORY_ATTRIBUTES[cat.slug].data).slice(0, 10)
          : [];
        const hasChildren = subKeys.length > 0;
        const isOpen = openSlug === cat.slug;
        const isActive = category === cat.slug;

        return (
          // ← hover handlers are HERE, wrapping everything
          <div
            key={cat.slug}
            onMouseEnter={() => hasChildren && setOpenSlug(cat.slug)}
            onMouseLeave={() => setOpenSlug(null)}
          >
            {/* Trigger chip */}
            <div
              className={`filter-chip ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: isOpen
                  ? 'var(--radius-full) var(--radius-full) 0 0'
                  : 'var(--radius-full)',
                marginBottom: 0,
              }}
              onClick={() => onSelect(cat.slug === category ? '' : cat.slug)}
            >
              <span>{cat.icon} {cat.name}</span>
              {hasChildren && (
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  style={{
                    opacity: 0.5,
                    flexShrink: 0,
                    marginLeft: 6,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>

            {/* Inline sub-list — directly below, zero gap */}
            {hasChildren && isOpen && (
              <div
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--radius) var(--radius)',
                  overflow: 'hidden',
                }}
              >
                {subKeys.map((sub) => (
                  <Link
                    key={sub}
                    href={`/browse?category=${cat.slug}&make=${encodeURIComponent(sub)}`}
                    onClick={() => setOpenSlug(null)}
                    style={{
                      display: 'block',
                      padding: '7px 14px',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s, color 0.15s',
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
                <Link
                  href={`/browse?category=${cat.slug}`}
                  onClick={() => { onSelect(cat.slug); setOpenSlug(null); }}
                  style={{
                    display: 'block',
                    padding: '7px 14px',
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  Browse all {cat.name} →
                </Link>
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
