import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, BadgeCheck, ShieldCheck, Sparkles, Flame, TrendingUp,
  Clock, ChevronRight, ArrowUpRight, PlusCircle, ChevronLeft, SlidersHorizontal
} from 'lucide-react';
import { getListings } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { SCHEMA_REGISTRY } from '@/lib/schemaRegistry';
import {
  hasCascadeFilters,
  getLevel1Options,
  getLevel2Options,
  getCascadeLabels,
  CASCADE_URL_PARAMS,
} from '@/lib/filterEngine';
import ListingCard from '@/components/ListingCard';
import { useSEO } from '@/lib/useSEO';

// Import Assets
import heroNairobi from '@/assets/hero-nairobi.jpg';
import catVehicles from '@/assets/cat-vehicles.jpg';
import catPhones from '@/assets/cat-phones.jpg';
import catProperty from '@/assets/cat-property.jpg';
import catFashion from '@/assets/cat-fashion.jpg';
import catElectronics from '@/assets/cat-electronics.jpg';
import catFurniture from '@/assets/cat-furniture.jpg';
import catServices from '@/assets/cat-services.jpg';

const featuredCategories = [
  { slug: 'vehicles',       img: catVehicles,    tint: 'from-emerald-900/70' },
  { slug: 'phones-tablets', img: catPhones,      tint: 'from-amber-900/60'  },
  { slug: 'property',       img: catProperty,    tint: 'from-stone-900/60'  },
  { slug: 'fashion',        img: catFashion,     tint: 'from-orange-900/60' },
  { slug: 'electronics',    img: catElectronics, tint: 'from-emerald-900/60'},
  { slug: 'home-furniture', img: catFurniture,   tint: 'from-amber-900/60'  },
  { slug: 'jobs',           img: catServices,    tint: 'from-stone-900/60'  },
  { slug: 'services',       img: catServices,    tint: 'from-emerald-900/60'},
];

const counties = ['All Kenya', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
const popularSearches = ['Toyota Fielder', 'Bedsitter Nairobi', 'iPhone 15', 'Mitsubishi FH', 'PlayStation 5'];

// ─── Inline Category Browser ─────────────────────────────────────────────────

function CategoryBrowser({ onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filters, setFilters] = useState({});

  const selectedCat = CATEGORY_ICONS.find(c => c.slug === selectedSlug);
  const schema = selectedSlug ? (SCHEMA_REGISTRY[selectedSlug] || SCHEMA_REGISTRY['default']) : null;

  // cascade state
  const cascadeParams = selectedSlug ? CASCADE_URL_PARAMS[selectedSlug] : null;
  const level1Opts = selectedSlug ? getLevel1Options(selectedSlug, filters.subcategory) : [];
  const level2Opts = cascadeParams && filters[cascadeParams.level1]
    ? getLevel2Options(selectedSlug, filters[cascadeParams.level1], filters.subcategory)
    : [];
  const labels = selectedSlug ? getCascadeLabels(selectedSlug, filters.subcategory) : {};
  const hasCascade = selectedSlug ? hasCascadeFilters(selectedSlug, filters.subcategory) : false;

  const flatFilters = schema
    ? schema.attributes.filter(a => a.type !== 'dynamic-cascade' && a.type !== 'text' && a.type !== 'number' && a.id !== 'listingType')
    : [];

  const handleSelect = (slug) => {
    setSelectedSlug(slug);
    setFilters({});
  };

  const handleBrowse = () => {
    const params = new URLSearchParams();
    params.set('category', selectedSlug);
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    onNavigate(`/browse?${params.toString()}`);
  };

  const handleBack = () => {
    setSelectedSlug(null);
    setFilters({});
  };

  const setFilter = (key, val) => {
    // When cascade level 1 changes, reset level 2+
    const next = { ...filters, [key]: val };
    if (cascadeParams && key === cascadeParams.level1) {
      if (cascadeParams.level2) delete next[cascadeParams.level2];
      if (cascadeParams.level3) delete next[cascadeParams.level3];
    }
    setFilters(next);
  };

  if (!selectedSlug) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
        {CATEGORY_ICONS.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleSelect(cat.slug)}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
            <span className="text-[11px] font-semibold leading-tight text-foreground">{cat.name}</span>
            <span className="text-[10px] text-muted-foreground">{cat.count.toLocaleString()}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Back + Category Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            All Categories
          </button>
          <span className="text-border">|</span>
          <span className="text-2xl">{selectedCat?.icon}</span>
          <h3 className="text-lg font-bold text-foreground">{selectedCat?.name}</h3>
        </div>
        <button
          onClick={handleBrowse}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl gradient-emerald px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition cursor-pointer"
        >
          Browse {selectedCat?.name} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left: Cascade selectors */}
        {hasCascade && level1Opts.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Narrow by
            </p>

            {/* Level 1 */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground/70 px-1">{labels.level1Label}</label>
              <select
                value={filters[cascadeParams.level1] || ''}
                onChange={e => setFilter(cascadeParams.level1, e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Any {labels.level1Label}</option>
                {level1Opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Level 2 (only when L1 selected) */}
            {filters[cascadeParams.level1] && level2Opts.length > 0 && (
              <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-semibold text-foreground/70 px-1">{labels.level2Label}</label>
                <select
                  value={filters[cascadeParams.level2] || ''}
                  onChange={e => setFilter(cascadeParams.level2, e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Any {labels.level2Label}</option>
                  {level2Opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Right: Flat schema filters as pill selects */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {flatFilters.map(attr => {
              const opts = Array.isArray(attr.options) ? attr.options : [];
              if (opts.length === 0) return null;
              return (
                <select
                  key={attr.id}
                  value={filters[attr.id] || ''}
                  onChange={e => setFilter(attr.id, e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30 hover:border-primary/30"
                >
                  <option value="">{attr.label}</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              );
            })}
          </div>
        </div>
      </div>

      {/* Browse CTA (mobile) */}
      <div className="mt-5 flex sm:hidden">
        <button
          onClick={handleBrowse}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition cursor-pointer"
        >
          Browse {selectedCat?.name} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    const params = new URLSearchParams();
    if (search.trim()) params.set('keyword', search.trim());
    if (location !== 'All Kenya') params.set('county', location);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement strip */}
      <div className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="opacity-90">Free posting all June — list your ad in under 60 seconds.</span>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroNairobi}
            alt="Nairobi marketplace at golden hour"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-background/80" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:pb-16 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live from 47 counties · 236 ads today
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Kenya's trusted{' '}
              <span className="text-gold-grad">marketplace</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Buy, sell and discover real deals near you — from Westlands to Mombasa.
              Verified sellers. Zero listing fees.
            </p>
          </div>

          {/* Search card */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-card p-3 shadow-elevated sm:p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                placeholder="Search cars, phones, property and more…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
              <label className="group flex items-center gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border hover:ring-primary/40">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                >
                  {counties.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:opacity-95 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Popular</span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSearch(s)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* Trust strip */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-4 text-center">
            {[
              { icon: BadgeCheck, label: '12,000+ Live Ads' },
              { icon: ShieldCheck, label: 'Verified Sellers' },
              { icon: Sparkles,   label: 'Always Free Posting' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Browser ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Browse</span>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">What are you looking for?</h2>
          </div>
          <Link
            to="/browse"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            All listings <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <CategoryBrowser onNavigate={navigate} />
        </div>
      </section>

      {/* ── Live counters band ──────────────────────────────────────── */}
      <section className="gradient-emerald text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Flame,       n: '236',   l: 'New ads today' },
            { icon: TrendingUp,  n: '42',    l: 'Posted this hour' },
            { icon: Clock,       n: '1,200', l: 'Added this week' },
          ].map(({ icon: Icon, n, l }) => (
            <div key={l} className="flex items-center justify-center gap-3 sm:justify-start">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold leading-none">{n}</div>
                <div className="text-xs opacity-80">{l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Categories (photo grid) ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Featured</span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Popular categories</h2>
          </div>
          <Link to="/browse" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            All categories <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featuredCategories.map(fc => {
            const cat = CATEGORY_ICONS.find(c => c.slug === fc.slug);
            if (!cat) return null;
            return (
              <Link
                key={fc.slug}
                to={`/browse?category=${fc.slug}`}
                className="group relative aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated block"
              >
                <img
                  src={fc.img}
                  alt={cat.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${fc.tint} via-transparent to-transparent`} />
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur text-xl">
                      {cat.icon}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-background opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="text-background">
                    <div className="font-display text-lg font-bold leading-tight">{cat.name}</div>
                    <div className="text-xs opacity-90">{cat.count.toLocaleString()} ads</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Fresh Listings ──────────────────────────────────────────── */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Trending now</span>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Fresh deals near you</h2>
            </div>
            <Link to="/browse" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              See all listings <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading fresh deals…</div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {listings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} featured={i < 2} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">No listings found. Post the first ad!</div>
          )}
        </div>
      </section>

      {/* ── Sell CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl gradient-emerald p-8 text-primary-foreground sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Sell smarter</span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
                Got something to sell?
                <br />
                <span className="text-gold-grad">Reach 12,000+ buyers today.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm opacity-90 sm:text-base">
                Snap a photo, set your price, get offers in minutes. No fees,
                no middlemen — just real Kenyans buying and selling.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/post-ad"
                  className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-primary shadow-elevated hover:bg-cream"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post your free ad
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10 cursor-pointer">
                  How it works
                </button>
              </div>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                'List in under 60 seconds',
                'Reach buyers across 47 counties',
                'Verified seller badges build trust',
                'Chat directly — no commissions',
              ].map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3 ring-1 ring-primary-foreground/15"
                >
                  <BadgeCheck className="h-4 w-4 shrink-0 text-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
