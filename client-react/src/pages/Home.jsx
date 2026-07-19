import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  MapPin, BadgeCheck, ShieldCheck, Sparkles,
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  ChevronRight, ChevronLeft, ArrowUpRight, PlusCircle, X, ChevronDown, Grid
} from 'lucide-react';
import { 
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  CATEGORY_ICONS, getRankedCategories 
} from '@/lib/categoryData';

// Merge real DB counts into the static CATEGORY_ICONS array
function mergeRealCounts(realCounts) {
  return CATEGORY_ICONS.map(c => ({ ...c, count: realCounts[c.slug] ?? 0 }));
}
function getRankedCategoriesWithCounts(slugs, enrichedIcons) {
  return slugs
    .map(slug => enrichedIcons.find(c => c.slug === slug))
    .filter(Boolean)
    .sort((a, b) => {
      const scoreA = (0.4 * a.count) + (0.3 * a.activity) + (0.2 * a.clicks) + (0.1 * a.searchDemand);
      const scoreB = (0.4 * b.count) + (0.3 * b.activity) + (0.2 * b.clicks) + (0.1 * b.searchDemand);
      return scoreB - scoreA;
    });
}
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { getLevel1Options, getLevel2Options, getLevel3Options, getCascadeConfig } from '@/lib/filterEngine';
import { getValidOptions, cleanInvalidFilters } from '@/lib/filterValidation';
import HeroSearch from '@/components/HeroSearch';
import QuickFilters from '@/components/QuickFilters';
import DynamicDataFilter from '@/components/filters/DynamicDataFilter';
import DiscoveryRow from '@/components/DiscoveryRow';
import FeaturedListings from '@/components/FeaturedListings';
import RecentlyViewed from '@/components/RecentlyViewed';
import ContinueBrowsing from '@/components/ContinueBrowsing';
import TrustSafety from '@/components/TrustSafety';
import RecommendedRow from '@/components/RecommendedRow';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/lib/useSEO';
import { getTrendingSearches, getCountyCounts } from '@/lib/api';
import HomeCategoryNav from '@/components/HomeCategoryNav';

import heroNairobi from '@/assets/hero-nairobi.jpg';
import catVehicles from '@/assets/cat-vehicles.jpg';
import catPhones from '@/assets/cat-phones.jpg';
import catProperty from '@/assets/cat-property.jpg';
import catFashion from '@/assets/cat-fashion.png';
import catElectronics from '@/assets/cat-electronics.jpg';
import catFurniture from '@/assets/cat-furniture.jpg';
import catServices from '@/assets/cat-services.png';
import catJobs from '@/assets/cat-jobs.png';

const CAT_IMAGES = {
  vehicles: catVehicles, 'phones-tablets': catPhones, property: catProperty,
  fashion: catFashion, electronics: catElectronics, 'home-living': catFurniture,
  jobs: catJobs, services: catServices,
};
const CAT_TINTS = {
  vehicles: 'from-emerald-900/70', 'phones-tablets': 'from-amber-900/60',
  property: 'from-stone-900/60', fashion: 'from-orange-900/60',
  electronics: 'from-emerald-900/60', 'home-living': 'from-amber-900/60',
  jobs: 'from-stone-900/60', services: 'from-emerald-900/60',
};
const SIDEBAR_SECTIONS = [
  { id: 'primary', title: 'PRIMARY', slugs: ['vehicles', 'property', 'jobs', 'phones-tablets', 'electronics', 'services'] },
  { id: 'lifestyle', title: 'SHOP & LIFESTYLE', slugs: ['home-living', 'fashion', 'animals-pets'] },
  { id: 'specialized', title: 'SPECIALIZED', slugs: ['auto-spares', 'commercial-equipment', 'leisure'] }
];
const MORE_SLUGS = CATEGORY_ICONS.filter(c => !SIDEBAR_SECTIONS.some(s => s.slugs.includes(c.slug))).map(c => c.slug);
SIDEBAR_SECTIONS.push({ id: 'more', title: 'MORE CATEGORIES', slugs: MORE_SLUGS });

// â”€â”€â”€ Left Category Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€ HomePage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liveAdCount, setLiveAdCount] = useState(null);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [countyCounts, setCountyCounts] = useState([]);
  const [focusedCat, setFocusedCat] = useState(null);
  // eslint-disable-next-line no-unused-vars -- Dev banner preserved for future use
  const [showDevBanner, setShowDevBanner] = useState(() => localStorage.getItem('adhub_hide_dev') !== 'true');
  const [realCategoryCounts, setRealCategoryCounts] = useState({});

  // enrichedIcons = CATEGORY_ICONS with real DB counts merged in
  const enrichedIcons = mergeRealCounts(realCategoryCounts);

  // eslint-disable-next-line no-unused-vars -- Dev banner preserved for future use
  const dismissDevBanner = () => {
    setShowDevBanner(false);
    localStorage.setItem('adhub_hide_dev', 'true');
  };

  useEffect(() => {
    // Total active listing count
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .then(({ count }) => {
        if (count !== null) setLiveAdCount(count);
      })
      .catch(() => {});

    // Per-category counts from real data
    supabase
      .from('listings')
      .select('category')
      .eq('status', 'active')
      .then(({ data }) => {
        if (!data) return;
        const counts = {};
        data.forEach(({ category }) => {
          if (category) counts[category] = (counts[category] || 0) + 1;
        });
        setRealCategoryCounts(counts);
      })
      .catch(() => {});

    getTrendingSearches().then(setTrendingSearches);
    getCountyCounts().then(setCountyCounts);
  }, []);

  useSEO({
    title: 'AdHub Kenya â€“ Buy & Sell Anything in Kenya',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* Announcement strip */}
      <div className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-1.5 text-xs">
          <Sparkles className="h-3 w-3 text-gold" />
          <span className="opacity-90">Free posting â€” list your ad in under 60 seconds.</span>
        </div>
      </div>

      {/* â”€â”€ TWO-COLUMN LAYOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6 pt-6">

          {/* â”€â”€ LEFT SIDEBAR: Categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <aside className="hidden lg:block w-full">
            {/* Breadcrumb â€” visible when a category is focused */}
            {focusedCat && (
              <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3 px-1" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span className="text-foreground font-semibold truncate">
                  {CATEGORY_ICONS.find(c => c.slug === focusedCat)?.name}
                </span>
              </nav>
            )}
            <div className="sticky top-4 rounded-2xl border border-border bg-card shadow-sm p-4 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin transition-all duration-200">
              <HomeCategoryNav />
            </div>
          </aside>

          {/* â”€â”€ RIGHT MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <main className="flex-1 min-w-0">

            {/* â”€â”€ DESKTOP HERO â”€â”€ */}
            <section className="relative mb-8 z-20 group hidden lg:block">
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-background">
                <img 
                  src={heroNairobi} 
                  alt="Nairobi marketplace" 
                  width={1920} 
                  height={800} 
                  fetchPriority="high"
                  decoding="sync"
                  className="h-full w-full object-cover blur-[1.5px] scale-100 saturate-[.95] opacity-[.92] transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(248,247,242,0.78)] via-[rgba(248,247,242,0.45)] via-45% to-[rgba(248,247,242,0.10)] dark:from-[rgba(10,10,10,0.85)] dark:via-[rgba(10,10,10,0.65)] dark:via-45% dark:to-[rgba(10,10,10,0.15)] pointer-events-none" />
              </div>

              <div className="px-8 pb-8 pt-6">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    {(liveAdCount !== null && liveAdCount >= 100) ? (
                       `Live from 47 counties Â· ${liveAdCount.toLocaleString()} active ads`
                    ) : (
                       `Live across Kenya`
                    )}
                  </span>
                  <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[68px] drop-shadow-sm">
                    Buy. Sell. Discover.<br />
                    <span className="text-gold-grad">Across Kenya.</span>
                  </h1>
                  <p className="mt-1 max-w-lg text-sm text-muted-foreground hidden sm:block">
                    Find vehicles, property, electronics, jobs and more.
                  </p>
                </div>

                <div className="mt-6">
                  <HeroSearch stickyCategory={focusedCat} />
                </div>

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground mr-1">Trending:</span>
                    {trendingSearches.map(({ search_term, search_count }) => (
                      <Link
                        key={search_term}
                        to={`/browse?keyword=${encodeURIComponent(search_term)}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-background/50 backdrop-blur border border-border/40 px-3 py-1.5 text-[10px] font-medium text-foreground/80 transition hover:bg-background/90 hover:border-primary/40 shadow-sm hover:shadow"
                      >
                        {search_term} <span className="text-muted-foreground text-[10px]">({search_count})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* â”€â”€ MOBILE HERO (Search + Categories) â”€â”€ */}
            <section className="lg:hidden mb-6 pt-2">
              <div className="px-4 pb-5">
                <HeroSearch stickyCategory={focusedCat} />
              </div>
              <div className="grid grid-cols-4 gap-3 sm:gap-4 px-4">
                {getRankedCategoriesWithCounts(SIDEBAR_SECTIONS[0].slugs.concat(['home-living', 'fashion']), enrichedIcons).slice(0, 8).map(c => (
                  <Link
                    key={c.slug}
                    to={`/browse?category=${c.slug}`}
                    className="flex flex-col items-center justify-start gap-1.5 rounded-2xl bg-card p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-border/50 hover:border-primary/30 active:scale-95 transition-all"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary/80 text-2xl mb-1 shrink-0">
                      {c.icon}
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[11px] font-bold text-foreground leading-tight truncate">{c.name}</div>
                      {c.count > 0 && <div className="text-[9px] font-medium text-muted-foreground mt-0.5">{c.count >= 1000 ? (c.count/1000).toFixed(1)+'k' : c.count}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* â”€â”€ TRUST & DISCOVERY (Moved up) â”€â”€ */}
            <div className="flex flex-col gap-10 lg:gap-12 mb-10">
              
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
                {/* Live counters */}
                <div className="rounded-2xl gradient-emerald text-primary-foreground relative overflow-hidden group shadow-sm h-full flex flex-col justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-4 py-3 sm:px-6 sm:py-4 relative z-10 divide-x divide-primary-foreground/10 h-full items-center">
                    {[
                      { icon: BadgeCheck, n: liveAdCount !== null ? liveAdCount.toLocaleString() : 'â€¦', l: 'Active Listings' },
                      { icon: Grid,       n: '18',     l: 'Categories' },
                      { icon: MapPin,     n: '47',      l: 'Counties' },
                      { icon: Sparkles,   n: '100%',    l: 'Free Posting' },
                    ].map(({ icon: Icon, n, l }) => (
                      <div key={l} className="flex flex-col items-center text-center gap-1.5 px-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20 text-gold shadow-inner">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-display text-lg font-bold leading-none">{n}</div>
                          <div className="text-[10px] opacity-90 mt-0.5 font-medium">{l}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust & Safety minimal block */}
                <div className="hidden lg:block w-[300px]">
                  <TrustSafety minimal />
                </div>
              </div>

              {/* Featured / Popular Categories */}
              <section className="mb-2">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Browse</span>
                    <h2 className="font-display text-xl font-bold sm:text-2xl lg:text-[1.6rem] tracking-tight leading-tight">Popular Categories</h2>
                  </div>
                  <Link to="/browse" className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm">
                    See all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:gap-6">
                  {getRankedCategoriesWithCounts(SIDEBAR_SECTIONS[0].slugs.concat(SIDEBAR_SECTIONS[1].slugs), enrichedIcons).slice(0, 8).map(c => {
                    const slug = c.slug;
                    let countBadge = null;
                    if (c.count > 0) {
                      countBadge = <span className="text-xs font-semibold opacity-95">{c.count.toLocaleString()} Listings</span>;
                    }

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
                              {countBadge}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* â”€â”€ MARKETPLACE FEEDS â”€â”€ */}
            <div className="flex flex-col gap-10 lg:gap-12">

              {/* Featured Listings */}
              <FeaturedListings />

              <hr className="border-border/40" />

              {/* Latest Listings */}
              <DiscoveryRow
                title="Latest Listings"
                subtitle="Just posted"
                sort="createdAt"
                limit={10}
                linkTo="/browse?sort=createdAt"
              />

              <hr className="border-border/40" />

              {/* Trending Listings */}
              <DiscoveryRow
                title="Trending Now"
                subtitle="Popular this week"
                sort="clicks"
                limit={10}
                linkTo="/browse?sort=clicks"
              />

              <hr className="border-border/40" />

              {/* Recently Viewed */}
              <RecentlyViewed />

              {/* Recommended For You */}
              {user ? (
                <RecommendedRow />
              ) : (
                <DiscoveryRow
                  title="Recommended For You"
                  subtitle="Based on your activity"
                  sort="price_asc"
                  limit={10}
                  linkTo="/browse"
                />
              )}

              {/* â”€â”€ UTILITIES â”€â”€ */}
              
              <hr className="border-border/50" />

              <div className="lg:hidden">
                <TrustSafety />
              </div>

              {/* Quick Filters */}
              <QuickFilters />

              {/* Continue Browsing */}
              <ContinueBrowsing />

              {/* Sell CTA */}
              <section>
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
                      {['List in under 60 seconds','Reach buyers across 47 counties','Verified seller badges build trust','Chat directly â€” no commissions'].map(p => (
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
              {countyCounts.length > 0 && (
                <section>
                  <div className="mb-4">
                    <h2 className="font-display text-xl font-bold sm:text-2xl">Browse by Location</h2>
                    <p className="text-sm text-muted-foreground mt-1">Find deals in your county</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {countyCounts.map(loc => (
                      <Link
                        key={loc.county}
                        to={`/browse?county=${encodeURIComponent(loc.county)}`}
                        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                      >
                        <MapPin className="mb-2 h-6 w-6 text-primary" />
                        <span className="text-sm font-bold text-foreground">{loc.county}</span>
                        <span className="text-xs font-medium text-muted-foreground">{loc.listing_count} ads</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* SEO Content Block */}
              <section className="mb-8 rounded-2xl border border-border/50 bg-card/50 p-6 sm:p-8">
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

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
