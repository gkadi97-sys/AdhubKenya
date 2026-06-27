import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  MapPin, BadgeCheck, ShieldCheck, Sparkles,
  ChevronRight, ArrowUpRight, PlusCircle, X, ChevronDown, Grid
} from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { getLevel1Options, getLevel2Options, getLevel3Options, getCascadeConfig } from '@/lib/filterEngine';
import HeroSearch from '@/components/HeroSearch';
import QuickFilters from '@/components/QuickFilters';
import DynamicDataFilter from '@/components/filters/DynamicDataFilter';
import DiscoveryRow from '@/components/DiscoveryRow';
import FeaturedListings from '@/components/FeaturedListings';
import RecentlyViewed from '@/components/RecentlyViewed';
import ContinueBrowsing from '@/components/ContinueBrowsing';
import TrustSafety from '@/components/TrustSafety';
import { useSEO } from '@/lib/useSEO';

import heroNairobi from '@/assets/hero-nairobi.jpg';
import catVehicles from '@/assets/cat-vehicles.jpg';
import catPhones from '@/assets/cat-phones.jpg';
import catProperty from '@/assets/cat-property.jpg';
import catFashion from '@/assets/cat-fashion.jpg';
import catElectronics from '@/assets/cat-electronics.jpg';
import catFurniture from '@/assets/cat-furniture.jpg';
import catServices from '@/assets/cat-services.jpg';

const CAT_IMAGES = {
  vehicles: catVehicles, 'phones-tablets': catPhones, property: catProperty,
  fashion: catFashion, electronics: catElectronics, 'home-furniture': catFurniture,
  jobs: catServices, services: catServices,
};
const CAT_TINTS = {
  vehicles: 'from-emerald-900/70', 'phones-tablets': 'from-amber-900/60',
  property: 'from-stone-900/60', fashion: 'from-orange-900/60',
  electronics: 'from-emerald-900/60', 'home-furniture': 'from-amber-900/60',
  jobs: 'from-stone-900/60', services: 'from-emerald-900/60',
};
const FEATURED_SLUGS = ['vehicles','phones-tablets','property','fashion','electronics','home-furniture','jobs','services'];

// ─── Left Category Sidebar ───────────────────────────────────────────────────
function CategorySidebar({ onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filters, setFilters]           = useState({});
  const [showAll, setShowAll]           = useState(false);

  const cat      = CATEGORY_ICONS.find(c => c.slug === selectedSlug);
  const schema   = selectedSlug ? (ATTRIBUTE_ENGINE[selectedSlug] || ATTRIBUTE_ENGINE.default) : null;

  const selectCategory = (slug) => { setSelectedSlug(slug); setFilters({}); };

  const evaluateSingleDep = (dep, currentFilters) => {
    if (dep.and) return dep.and.every(d => evaluateSingleDep(d, currentFilters));
    const { field, value, notValue } = dep;
    const currentVal = currentFilters[field];
    if (!currentVal) return false;
    if (notValue && currentVal === notValue) return false;
    if (value === undefined) return true;
    if (Array.isArray(value)) return value.includes(currentVal);
    return currentVal === value;
  };

  const evaluateDependsOn = (dependsOn, currentFilters) => {
    if (!dependsOn) return true;
    if (Array.isArray(dependsOn)) return dependsOn.some(dep => evaluateSingleDep(dep, currentFilters));
    return evaluateSingleDep(dependsOn, currentFilters);
  };

  const visibleAttrs = schema ? (schema.attributes || []).filter(attr => {
    if (!attr.search || attr.search.filterable === false) return false;
    return evaluateDependsOn(attr.dependsOn, filters);
  }) : [];
  
  const activeFilters = {};
  visibleAttrs.forEach(attr => {
    if (filters[attr.id]) activeFilters[attr.id] = filters[attr.id];
  });

  // Recursively find all descendant cascade attrs by cascadeParent linkage
  const getDescendantAttrs = (attrId, attrs) => {
    const direct = attrs.filter(a => a.cascadeParent === attrId);
    return direct.reduce((acc, child) => {
      acc.push(child);
      acc.push(...getDescendantAttrs(child.id, attrs));
      return acc;
    }, []);
  };

  const setFilter = (key, val) => {
    setFilters(prev => {
      const next = { ...prev, [key]: val };
      const attrs = schema?.attributes || [];
      const attr = attrs.find(a => a.id === key);
      if (attr && attr.type === 'dynamic-cascade') {
        // Clear cascadeParent-based descendants (new schema style)
        getDescendantAttrs(key, attrs).forEach(child => { delete next[child.id]; });
        // Also clear old cascadeLevel-based children (legacy schema style)
        if (attr.cascadeLevel) {
          attrs.filter(a => a.type === 'dynamic-cascade' && a.cascadeLevel > attr.cascadeLevel)
            .forEach(child => { delete next[child.id]; });
        }
      }
      return next;
    });
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      const attrs = schema?.attributes || [];
      const attr = attrs.find(a => a.id === key);
      if (attr && attr.type === 'dynamic-cascade') {
        // Clear cascadeParent-based descendants
        getDescendantAttrs(key, attrs).forEach(child => { delete next[child.id]; });
        // Also clear old cascadeLevel-based children
        if (attr.cascadeLevel) {
          attrs.filter(a => a.type === 'dynamic-cascade' && a.cascadeLevel > attr.cascadeLevel)
            .forEach(child => { delete next[child.id]; });
        }
      }
      return next;
    });
  };

  const browse = () => {
    const p = new URLSearchParams();
    p.set('category', selectedSlug);
    Object.entries(activeFilters).forEach(([k, v]) => p.set(k, v));
    // OEM number is a special shortcut — always inject it if present regardless of filterable flag
    if (filters['oemNumber']) p.set('oemNumber', filters['oemNumber']);
    onNavigate(`/browse?${p.toString()}`);
  };

  // Include oemNumber in active count so the Browse button badge reflects it
  const activeCount = Object.keys(activeFilters).length + (filters['oemNumber'] ? 1 : 0);

  // ── ACCORDION CATEGORIES LIST ──────────────────────────────────────────────
  return (
    <nav>
      <div className="flex items-center justify-between mb-3 px-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
        <button onClick={() => setShowAll(!showAll)} className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {(showAll ? CATEGORY_ICONS : CATEGORY_ICONS.slice(0, 8)).map(c => {
          const isSelected = selectedSlug === c.slug;
          return (
            <li key={c.slug} className="flex flex-col">
              <button
                onClick={() => isSelected ? selectCategory(null) : selectCategory(c.slug)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'border border-transparent hover:bg-secondary hover:border-border hover:shadow-sm'
                }`}
              >
                <span className={`text-xl w-7 text-center leading-none shrink-0 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>{c.icon}</span>
                <span className={`flex-1 text-[13px] leading-tight ${isSelected ? 'font-bold text-primary' : 'font-medium text-foreground group-hover:text-primary'}`}>
                  {c.name}
                </span>
                {!isSelected && c.count > 0 && (
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                    {c.count.toLocaleString()}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-180 text-primary' : '-rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
              </button>

              {/* ACCORDION EXPANSION */}
              {isSelected && schema && (() => {
                if (!visibleAttrs.length) return null;

                return (
                  <div className="pl-11 pr-3 py-3 flex flex-col gap-4 border-b border-border/50 mb-2">

                    {/* ── OEM QUICK-ACCESS (Auto Spares only) ── */}
                    {selectedSlug === 'auto-spares' && (
                      <div className="rounded-xl border border-amber-400/40 bg-amber-50/60 dark:bg-amber-900/10 px-3 py-2.5 flex flex-col gap-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          ⚡ OEM Part Number
                        </p>
                        <p className="text-[10px] text-amber-700/70 dark:text-amber-400/60 leading-tight">
                          Know the exact part no.? Skip the search.
                        </p>
                        <div className="relative mt-0.5">
                          <input
                            type="text"
                            placeholder="e.g. 45503-09220"
                            value={filters['oemNumber'] || ''}
                            onChange={e => setFilter('oemNumber', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none transition ${
                              filters['oemNumber']
                                ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100'
                                : 'border-amber-300/60 bg-white dark:bg-background text-foreground placeholder:text-amber-400/60'
                            } focus:border-amber-400`}
                          />
                          {filters['oemNumber'] && (
                            <button
                              onClick={() => clearFilter('oemNumber')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500 hover:text-destructive cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {filters['oemNumber'] && (
                          <button
                            onClick={browse}
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-[11px] font-bold text-white transition cursor-pointer"
                          >
                            Find by OEM No. →
                          </button>
                        )}
                      </div>
                    )}

                    {/* ── DIVIDER ── */}
                    {selectedSlug === 'auto-spares' && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">or browse by</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    {visibleAttrs.map((attr, idx) => {

                      const isFirst = idx === 0;
                      let opts = [];
                      if (attr.options) opts = attr.options;
                      else if (attr.type === 'dynamic-cascade') {
                        const config = getCascadeConfig(selectedSlug, filters.subcategory || filters.bodyType);
                        if (attr.cascadeLevel === 1) {
                          opts = getLevel1Options(selectedSlug, filters, attr.id);
                        } else if (attr.cascadeLevel === 2) {
                          const parentKey = attr.cascadeParent || (config && config.level1) || schema.attributes.find(a => a.cascadeLevel === 1)?.id;
                          if (filters[parentKey]) {
                            opts = getLevel2Options(selectedSlug, filters[parentKey], filters, attr.id);
                          }
                        } else if (attr.cascadeLevel === 3) {
                          const l1 = config?.level1 || schema.attributes.find(a => a.cascadeLevel === 1)?.id;
                          const l2 = config?.level2 || schema.attributes.find(a => a.cascadeLevel === 2)?.id;
                          if (filters[l1] && filters[l2]) {
                            opts = getLevel3Options(selectedSlug, filters[l1], filters[l2], filters, attr.id);
                          }
                        }
                      }
                      
                      const uiType = attr.search?.uiType || attr.type;
                      
                      if (uiType !== 'text' && uiType !== 'number' && uiType !== 'dynamic-select' && uiType !== 'range') {
                        if (!opts || !opts.length) return null;
                      }
                      
                      const val = filters[attr.id] || '';

                      if (uiType === 'dynamic-select') {
                        return (
                          <div key={attr.id}>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <DynamicDataFilter
                              category={selectedSlug}
                              urlParam={attr.id}
                              filters={filters}
                              value={val}
                              onChange={(newVal) => setFilter(attr.id, newVal)}
                            />
                          </div>
                        );
                      }

                      if (uiType === 'text' || uiType === 'number') {
                        return (
                          <div key={attr.id}>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <div className="relative">
                              <input
                                type={uiType}
                                placeholder={`Any ${attr.label}`}
                                value={val}
                                onChange={e => setFilter(attr.id, e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-xs font-medium outline-none transition ${
                                  val ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-foreground'
                                } focus:border-primary/50`}
                              />
                              {val && (
                                <button onClick={() => clearFilter(attr.id)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary hover:text-destructive cursor-pointer">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      if (uiType === 'range') {
                        const minKey = `${attr.id}_min`;
                        const maxKey = `${attr.id}_max`;
                        return (
                          <div key={attr.id}>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                value={filters[minKey] || ''}
                                onChange={e => setFilter(minKey, e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/50"
                              />
                              <span className="text-muted-foreground text-[10px] font-medium">to</span>
                              <input
                                type="number"
                                placeholder="Max"
                                value={filters[maxKey] || ''}
                                onChange={e => setFilter(maxKey, e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/50"
                              />
                            </div>
                          </div>
                        );
                      }

                      // ── radio: always render as wrapping chip buttons ──────
                      if (uiType === 'radio') {
                        return (
                          <div key={attr.id}>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <ul className="flex flex-wrap gap-1.5">
                              {opts.map(o => {
                                const isSel = val === o;
                                return (
                                  <li key={o}>
                                    <button
                                      onClick={() => setFilter(attr.id, isSel ? '' : o)}
                                      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer border leading-tight ${
                                        isSel ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-background hover:border-primary/40 text-foreground hover:bg-secondary/50'
                                      }`}
                                      title={o}
                                    >
                                      {o}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      }

                      // ── fallback: select dropdown ──────────────────────────
                      return (
                        <div key={attr.id}>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                          <div className="relative">
                            <select
                              value={val}
                              onChange={e => setFilter(attr.id, e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-xs font-medium outline-none transition cursor-pointer ${
                                val ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-foreground'
                              } focus:border-primary/50`}
                            >
                              <option value="">Any {attr.label}</option>
                              {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            {val && (
                              <button onClick={() => clearFilter(attr.id)} className="absolute right-[28px] top-1/2 -translate-y-1/2 text-primary hover:text-destructive cursor-pointer bg-primary/10 pl-1">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Active pills */}
                    {activeCount > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                        {Object.entries(activeFilters).map(([k, v]) => (
                          <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {v} <button onClick={() => clearFilter(k)} className="cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Browse CTA */}
                    <button
                      onClick={browse}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-4 py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition cursor-pointer mt-1"
                    >
                      Browse {cat?.name}
                      {activeCount > 0 && <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">{activeCount}</span>}
                    </button>
                  </div>
                );
              })()}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t border-border pt-4 px-3">
        <Link to="/browse" className="flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
          Browse all listings <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}

// ─── HomePage ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [liveAdCount, setLiveAdCount] = useState(null);
  const [showDevBanner, setShowDevBanner] = useState(() => localStorage.getItem('adhub_hide_dev') !== 'true');

  const dismissDevBanner = () => {
    setShowDevBanner(false);
    localStorage.setItem('adhub_hide_dev', 'true');
  };

  useEffect(() => {
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .then(({ count }) => {
        if (count !== null) setLiveAdCount(count);
      })
      .catch(() => {});
  }, []);

  useSEO({
    title: 'AdHub Kenya – Buy & Sell Anything in Kenya',
    description: "AdHub Kenya is Kenya's free classifieds marketplace. Buy and sell cars, property, electronics, phones, fashion, and jobs across all 47 counties.",
    canonicalPath: '/'
  });

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AdHub Kenya',
    url: 'https://adhubkenya.co.ke',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://adhubkenya.co.ke/browse?keyword={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Announcement strip */}
      <div className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="opacity-90">Free posting all June — list your ad in under 60 seconds.</span>
        </div>
      </div>

      {/* ── DEV NOTICE BANNER ─────────────────────────────────────────── */}
      {showDevBanner && (
        <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 relative h-12 flex items-center">
          <div className="mx-auto flex max-w-[1600px] w-full items-center justify-center gap-2 px-10 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <span className="animate-bounce inline-block text-base">🔧</span>
            <span className="font-semibold">Heads up!</span>
            <span className="opacity-80">We're improving AdHub — some features may still be evolving.</span>
          </div>
          <button 
            onClick={dismissDevBanner} 
            className="absolute right-4 text-amber-700 hover:text-amber-900 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(820px,1fr)] gap-6 pt-6">

          {/* ── LEFT SIDEBAR: Categories ──────────────────────────── */}
          <aside className="hidden lg:block w-full">
            <div className="sticky top-4 rounded-2xl border border-border bg-card shadow-sm p-4 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin">
              <CategorySidebar onNavigate={navigate} />
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Hero */}
            <section className="relative mb-2 z-20 group">
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-background">
                <img 
                  src={heroNairobi} 
                  alt="Nairobi marketplace" 
                  width={1920} 
                  height={800} 
                  className="h-full w-full object-cover blur-[1.5px] scale-100 saturate-[.95] opacity-[.92] transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(248,247,242,0.78)] via-[rgba(248,247,242,0.45)] via-45% to-[rgba(248,247,242,0.10)] dark:from-[rgba(10,10,10,0.85)] dark:via-[rgba(10,10,10,0.65)] dark:via-45% dark:to-[rgba(10,10,10,0.15)] pointer-events-none" />
              </div>

              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pt-6">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    {(liveAdCount !== null && liveAdCount >= 100) ? (
                       `Live from 47 counties · ${liveAdCount.toLocaleString()} active ads`
                    ) : (
                       `Live across Kenya`
                    )}
                  </span>
                  <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-[68px] drop-shadow-sm line-clamp-2">
                    Buy. Sell. Discover.<br />
                    <span className="text-gold-grad">Across Kenya.</span>
                  </h1>
                  <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
                    Find vehicles, property, electronics, jobs and more.
                  </p>
                </div>

                <div className="mt-6">
                  <HeroSearch />
                </div>

                {/* Trending Searches */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">Trending:</span>
                  {[
                    {term: 'Toyota Premio', count: 42}, 
                    {term: 'Land for Sale', count: 18}, 
                    {term: 'iPhone 15', count: 27}, 
                    {term: 'Apartments in Nairobi', count: 56}, 
                    {term: 'PS5', count: 14}
                  ].map(({term, count}) => (
                    <Link
                      key={term}
                      to={`/browse?keyword=${encodeURIComponent(term)}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-background/50 backdrop-blur border border-border/40 px-3 py-1.5 text-[10px] font-medium text-foreground/80 transition hover:bg-background/90 hover:border-primary/40 shadow-sm hover:shadow"
                    >
                      {term} <span className="text-muted-foreground text-[10px]">({count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Listings (Above the fold) */}
            <FeaturedListings />

            {/* Live counters (Moved up for Trust) */}
            <div className="mb-8 rounded-2xl gradient-emerald text-primary-foreground relative overflow-hidden group shadow-elevated mt-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]"></div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-4 relative z-10 divide-x divide-primary-foreground/10">
                {[
                  { icon: BadgeCheck, n: liveAdCount !== null ? liveAdCount.toLocaleString() : '…', l: 'Active Listings' },
                  { icon: Grid,       n: '15+',     l: 'Categories' },
                  { icon: MapPin,     n: '47',      l: 'Counties Covered' },
                  { icon: Sparkles,   n: '100%',    l: 'Free Posting' },
                ].map(({ icon: Icon, n, l }) => (
                  <div key={l} className="flex flex-col items-center text-center gap-2">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20 text-gold shadow-inner">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold leading-none">{n}</div>
                      <div className="text-[11px] opacity-90 mt-1 font-medium">{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-8 border-border/50" />

            {/* Trust & Safety */}
            <div className="mb-6">
              <TrustSafety />
            </div>

            {/* Quick Filters */}
            <QuickFilters />

            {/* Continue Browsing */}
            <ContinueBrowsing />

            {/* Mobile category row (lg hidden) */}
            <div className="lg:hidden mb-6 flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-hide">
              {CATEGORY_ICONS.map(c => (
                <Link
                  key={c.slug}
                  to={`/browse?category=${c.slug}`}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-4 text-center hover:border-primary/40 hover:bg-primary/5 transition min-w-[120px] snap-center shrink-0 shadow-sm"
                >
                  <span className="text-3xl leading-none mb-1">{c.icon}</span>
                  <span className="text-xs font-bold whitespace-nowrap text-foreground">{c.name}</span>
                </Link>
              ))}
            </div>

            {/* Featured Categories */}
            <section className="mb-10">
              <div className="mt-12 mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl tracking-tight">Popular categories</h2>
                </div>
                <Link to="/browse" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 transition-colors group">
                  See all categories <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:gap-6">
                {FEATURED_SLUGS.map(slug => {
                  const c = CATEGORY_ICONS.find(x => x.slug === slug);
                  if (!c) return null;
                  return (
                    <Link key={slug} to={`/browse?category=${slug}`} className="group relative aspect-[4/3] sm:aspect-[3/2] lg:h-[180px] xl:h-[220px] shrink-0 w-[240px] sm:w-[280px] lg:w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated block snap-center">
                      <img src={CAT_IMAGES[slug] || catServices} alt={c.name} loading="lazy" width={600} height={480} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${CAT_TINTS[slug] || 'from-gray-900/70'} via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity`} />
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/95 backdrop-blur text-xl shadow-sm border border-border/50">{c.icon}</div>
                          <ArrowUpRight className="h-4 w-4 text-background opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <div className="text-background">
                          <div className="font-display text-lg font-bold leading-tight tracking-wide">{c.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold opacity-95">{c.count.toLocaleString()} Listings</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Grid for Discovery Rows */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-8 mb-6">
              {/* Trending Listings */}
              <DiscoveryRow title="Trending Deals" sort="price_asc" limit={8} />

              {/* Fresh Listings */}
              <DiscoveryRow title="New Listings Today" sort="createdAt" limit={8} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-8 mb-10">
              {/* Recently Viewed */}
              <RecentlyViewed />

              {/* Recommended */}
              <DiscoveryRow title="Recommended for you" sort="clicks" limit={8} />
            </div>

            {/* Sell CTA */}
            <section className="mb-10">
              <div className="relative overflow-hidden rounded-3xl gradient-emerald p-8 text-primary-foreground sm:p-12">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
                <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Sell smarter</span>
                    <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl">
                      Got something to sell?<br />
                      <span className="text-gold-grad">Reach buyers today.</span>
                    </h2>
                    <p className="mt-3 max-w-lg text-sm opacity-90">
                      Snap a photo, set your price, get offers in minutes. No fees, no middlemen.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link to="/post-ad" className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-primary shadow-elevated hover:bg-cream">
                        <PlusCircle className="h-4 w-4" /> Post your free ad
                      </Link>
                    </div>
                  </div>
                  <ul className="grid gap-2.5 text-sm">
                    {['List in under 60 seconds','Reach buyers across 47 counties','Verified seller badges build trust','Chat directly — no commissions'].map(p => (
                      <li key={p} className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-2.5 ring-1 ring-primary-foreground/15">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-gold" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Location Discovery */}
            <section className="mb-10">
              <div className="mb-4">
                <h2 className="font-display text-xl font-bold sm:text-2xl">Browse by Location</h2>
                <p className="text-sm text-muted-foreground mt-1">Find deals in your county</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  { name: 'Nairobi', count: '5,400+' },
                  { name: 'Mombasa', count: '1,200+' },
                  { name: 'Kisumu', count: '850+' },
                  { name: 'Nakuru', count: '920+' },
                  { name: 'Eldoret', count: '600+' }
                ].map(loc => (
                  <Link
                    key={loc.name}
                    to={`/browse?county=${loc.name}`}
                    className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  >
                    <MapPin className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm font-bold text-foreground">{loc.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">{loc.count} ads</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* SEO Content Block */}
            <section className="mb-10 rounded-2xl border border-border/50 bg-card/50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground mb-3">Buy and Sell Anything in Kenya with AdHub</h2>
              <div className="text-sm text-muted-foreground space-y-4">
                <p>
                  Welcome to AdHub Kenya, the nation's fastest-growing free classifieds marketplace. Whether you're looking for <strong>cars for sale in Kenya</strong>, searching for affordable <strong>property for sale in Kenya</strong>, or upgrading to the latest <strong>phones and electronics</strong>, you'll find exactly what you need. Our platform connects thousands of verified buyers and sellers every day, ensuring a safe and seamless trading experience.
                </p>
                <p>
                  Explore localized marketplaces to find items near you. Discover the best deals in the <strong>Nairobi marketplace</strong>, find hidden gems in the <strong>Mombasa marketplace</strong>, or browse listings in the <strong>Kisumu marketplace</strong>. With coverage across all 47 counties, AdHub makes local commerce easier than ever.
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
