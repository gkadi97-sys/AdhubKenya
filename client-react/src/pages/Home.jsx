import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, BadgeCheck, ShieldCheck, Sparkles, Flame, TrendingUp,
  Clock, ChevronRight, ArrowUpRight, PlusCircle, ChevronLeft, SlidersHorizontal, X, ChevronDown
} from 'lucide-react';
import { getListings } from '@/lib/api';
import { CATEGORY_ICONS, VEHICLE_SPECS, MANUFACTURE_YEARS } from '@/lib/categoryData';
import { SCHEMA_REGISTRY } from '@/lib/schemaRegistry';
import { getLevel1Options, getLevel2Options, getLevel3Options, getCascadeLabels, CASCADE_URL_PARAMS } from '@/lib/filterEngine';
import ListingCard from '@/components/ListingCard';
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

const SUBCATEGORY_OVERRIDES = { vehicles: VEHICLE_SPECS.vehicleTypes };
const counties = ['All Kenya','Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Nyeri','Meru'];
const popularSearches = ['Toyota Fielder', 'Bedsitter Nairobi', 'iPhone 15', 'Mitsubishi FH', 'PlayStation 5'];

// ─── Left Category Sidebar ───────────────────────────────────────────────────
function CategorySidebar({ onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filters, setFilters]           = useState({});

  const cat      = CATEGORY_ICONS.find(c => c.slug === selectedSlug);
  const schema   = selectedSlug ? (SCHEMA_REGISTRY[selectedSlug] || SCHEMA_REGISTRY.default) : null;

  const selectCategory = (slug) => { setSelectedSlug(slug); setFilters({}); };

  const evaluateDependsOn = (dependsOn, currentFilters) => {
    if (!dependsOn) return true;
    const { field, value } = dependsOn;
    const currentVal = currentFilters[field];
    if (!currentVal) return false;
    return Array.isArray(value) ? value.includes(currentVal) : currentVal === value;
  };

  const visibleAttrs = schema ? (schema.attributes || []).filter(attr => evaluateDependsOn(attr.dependsOn, filters)) : [];
  
  const activeFilters = {};
  visibleAttrs.forEach(attr => {
    if (filters[attr.id]) activeFilters[attr.id] = filters[attr.id];
  });

  const setFilter = (key, val) => {
    setFilters(prev => {
      const next = { ...prev, [key]: val };
      const attr = schema?.attributes?.find(a => a.id === key);
      if (attr && attr.type === 'dynamic-cascade') {
        schema.attributes.filter(a => a.type === 'dynamic-cascade' && a.cascadeLevel > attr.cascadeLevel).forEach(child => {
          delete next[child.id];
        });
      }
      return next;
    });
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      const attr = schema?.attributes?.find(a => a.id === key);
      if (attr && attr.type === 'dynamic-cascade') {
        schema.attributes.filter(a => a.type === 'dynamic-cascade' && a.cascadeLevel > attr.cascadeLevel).forEach(child => {
          delete next[child.id];
        });
      }
      return next;
    });
  };

  const browse = () => {
    const p = new URLSearchParams();
    p.set('category', selectedSlug);
    Object.entries(activeFilters).forEach(([k, v]) => p.set(k, v));
    onNavigate(`/browse?${p.toString()}`);
  };

  const activeCount = Object.keys(activeFilters).length;

  // ── ACCORDION CATEGORIES LIST ──────────────────────────────────────────────
  return (
    <nav>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">All Categories</p>
      <ul className="flex flex-col gap-1">
        {CATEGORY_ICONS.map(c => {
          const isSelected = selectedSlug === c.slug;
          return (
            <li key={c.slug} className="flex flex-col">
              <button
                onClick={() => isSelected ? selectCategory(null) : selectCategory(c.slug)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-secondary/70'
                }`}
              >
                <span className="text-xl w-7 text-center leading-none shrink-0">{c.icon}</span>
                <span className={`flex-1 text-[13px] leading-tight ${isSelected ? 'font-bold text-primary' : 'font-medium text-foreground group-hover:text-primary'}`}>
                  {c.name}
                </span>
                {!isSelected && (
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{c.count.toLocaleString()}</span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-180 text-primary' : '-rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
              </button>

              {/* ACCORDION EXPANSION */}
              {isSelected && schema && (() => {
                if (!visibleAttrs.length) return null;

                return (
                  <div className="pl-11 pr-3 py-3 flex flex-col gap-4 border-b border-border/50 mb-2">
                    {visibleAttrs.map((attr, idx) => {
                      const isFirst = idx === 0;
                      let opts = [];
                      if (attr.options) opts = attr.options;
                      else if (attr.type === 'dynamic-cascade') {
                        if (attr.cascadeParent) {
                          const parentVal = filters[attr.cascadeParent];
                          // If there's a cascadeGrandparent, pass it as level1Value, and parent as level2Value
                          if (attr.cascadeGrandparent) {
                            const gpVal = filters[attr.cascadeGrandparent];
                            if (gpVal && parentVal) opts = getLevel3Options(selectedSlug, gpVal, parentVal, filters, attr.id);
                          } else {
                            if (parentVal) opts = getLevel2Options(selectedSlug, parentVal, filters, attr.id);
                          }
                        } else if (attr.cascadeLevel === 1) {
                          opts = getLevel1Options(selectedSlug, filters, attr.id);
                        } else if (attr.cascadeLevel === 2) {
                          const l1Attr = schema.attributes.find(a => a.cascadeLevel === 1 && a.type === 'dynamic-cascade');
                          if (l1Attr && filters[l1Attr.id]) opts = getLevel2Options(selectedSlug, filters[l1Attr.id], filters, attr.id);
                        } else if (attr.cascadeLevel === 3) {
                          const l1Attr = schema.attributes.find(a => a.cascadeLevel === 1 && a.type === 'dynamic-cascade');
                          const l2Attr = schema.attributes.find(a => a.cascadeLevel === 2 && a.type === 'dynamic-cascade');
                          if (l1Attr && l2Attr && filters[l1Attr.id] && filters[l2Attr.id]) {
                            opts = getLevel3Options(selectedSlug, filters[l1Attr.id], filters[l2Attr.id], filters, attr.id);
                          }
                        }
                      }
                      
                      if (attr.type !== 'text' && attr.type !== 'number') {
                        if (!opts || !opts.length) return null;
                      }
                      
                      const val = filters[attr.id] || '';

                      if (attr.type === 'text' || attr.type === 'number') {
                        return (
                          <div key={attr.id}>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <div className="relative">
                              <input
                                type={attr.type}
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

                      if (isFirst && opts.length <= 25) {
                        return (
                          <div key={attr.id}>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{attr.label}</p>
                            <ul className="grid grid-cols-2 gap-1.5 mt-1">
                              {opts.map(o => {
                                const isSel = val === o;
                                return (
                                  <li key={o}>
                                    <button
                                      onClick={() => setFilter(attr.id, isSel ? '' : o)}
                                      className={`w-full inline-flex items-center justify-center rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer border text-center ${
                                        isSel ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-background hover:border-primary/40 text-foreground hover:bg-secondary/50'
                                      }`}
                                      title={o}
                                    >
                                      <span className="truncate">{o}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      }

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
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [location, setLocation] = useState('All Kenya');
  const navigate = useNavigate();

  useSEO({
    title: 'AdHub Kenya – Buy & Sell Anything in Kenya',
    description: "AdHub Kenya is Kenya's free classifieds marketplace. Buy and sell cars, property, electronics, phones, fashion, and jobs across all 47 counties.",
    canonicalPath: '/'
  });

  useEffect(() => {
    getListings({ limit: 8, sort: 'createdAt' })
      .then(res => setListings(res.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.trim()) p.set('keyword', search.trim());
    if (location !== 'All Kenya') p.set('county', location);
    navigate(`/browse?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Announcement strip */}
      <div className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="opacity-90">Free posting all June — list your ad in under 60 seconds.</span>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex gap-6 pt-6">

          {/* ── LEFT SIDEBAR: Categories ──────────────────────────── */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-4 rounded-2xl border border-border bg-card shadow-sm p-4 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin">
              <CategorySidebar onNavigate={navigate} />
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl mb-6">
              <div className="absolute inset-0 -z-10">
                <img src={heroNairobi} alt="Nairobi marketplace" width={1920} height={800} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-background/70" />
              </div>

              <div className="px-6 pb-10 pt-12 sm:px-10 sm:pt-16">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Live from 47 counties · 236 ads today
                  </span>
                  <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Kenya's trusted{' '}
                    <span className="text-gold-grad">marketplace</span>
                  </h1>
                  <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                    Buy, sell and discover real deals — from Westlands to Mombasa.
                  </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mt-6 max-w-2xl rounded-2xl border border-border bg-card/95 backdrop-blur p-3 shadow-elevated">
                  <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      placeholder="Search cars, phones, property…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                    <label className="flex items-center gap-2 rounded-xl bg-background px-3 py-2 ring-1 ring-border hover:ring-primary/40">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <select value={location} onChange={e => setLocation(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none">
                        {counties.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </label>
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-95 cursor-pointer">
                      <Search className="h-4 w-4" /> Search
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">Popular</span>
                    {popularSearches.map(s => (
                      <button key={s} type="button" onClick={() => setSearch(s)} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary cursor-pointer">
                        {s}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Trust strip */}
                <div className="mt-5 flex flex-wrap gap-4">
                  {[{ icon: BadgeCheck, label: '12,000+ Live Ads' }, { icon: ShieldCheck, label: 'Verified Sellers' }, { icon: Sparkles, label: 'Always Free Posting' }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mobile category row (lg hidden) */}
            <div className="lg:hidden mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2" style={{ width: 'max-content' }}>
                {CATEGORY_ICONS.map(c => (
                  <Link
                    key={c.slug}
                    to={`/browse?category=${c.slug}`}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-3 py-3 text-center hover:border-primary/40 hover:bg-primary/5 transition"
                  >
                    <span className="text-2xl leading-none">{c.icon}</span>
                    <span className="text-[11px] font-semibold whitespace-nowrap text-foreground">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Live counters */}
            <div className="mb-6 rounded-2xl gradient-emerald text-primary-foreground">
              <div className="grid grid-cols-3 gap-4 px-6 py-5">
                {[
                  { icon: Flame,      n: '236',   l: 'New ads today' },
                  { icon: TrendingUp, n: '42',    l: 'Posted this hour' },
                  { icon: Clock,      n: '1,200', l: 'Added this week' },
                ].map(({ icon: Icon, n, l }) => (
                  <div key={l} className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
                      <Icon className="h-4 w-4 text-gold" />
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold leading-none">{n}</div>
                      <div className="text-[10px] opacity-80">{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Categories */}
            <section className="mb-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Featured</span>
                  <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Popular categories</h2>
                </div>
                <Link to="/browse" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {FEATURED_SLUGS.map(slug => {
                  const c = CATEGORY_ICONS.find(x => x.slug === slug);
                  if (!c) return null;
                  return (
                    <Link key={slug} to={`/browse?category=${slug}`} className="group relative aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated block">
                      <img src={CAT_IMAGES[slug] || catServices} alt={c.name} loading="lazy" width={600} height={480} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${CAT_TINTS[slug] || 'from-gray-900/60'} via-transparent to-transparent`} />
                      <div className="absolute inset-0 flex flex-col justify-between p-3">
                        <div className="flex items-center justify-between">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur text-lg">{c.icon}</div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-background opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <div className="text-background">
                          <div className="font-display text-base font-bold leading-tight">{c.name}</div>
                          <div className="text-[10px] opacity-90">{c.count.toLocaleString()} ads</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Fresh Listings */}
            <section className="mb-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Trending now</span>
                  <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Fresh deals near you</h2>
                </div>
                <Link to="/browse" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  See all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {loading ? (
                <div className="py-16 text-center text-muted-foreground">Loading fresh deals…</div>
              ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {listings.map((listing, i) => <ListingCard key={listing.id} listing={listing} featured={i < 2} />)}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground">No listings yet. Post the first ad!</div>
              )}
            </section>

            {/* Sell CTA */}
            <section className="mb-10">
              <div className="relative overflow-hidden rounded-3xl gradient-emerald p-8 text-primary-foreground sm:p-12">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
                <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Sell smarter</span>
                    <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl">
                      Got something to sell?<br />
                      <span className="text-gold-grad">Reach 12,000+ buyers today.</span>
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

          </main>
        </div>
      </div>
    </div>
  );
}
