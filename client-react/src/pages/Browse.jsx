// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getListings, saveSearch } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import CandidateCard from '@/components/CandidateCard';
import DiscoveryRow from '@/components/DiscoveryRow';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import FilterPanel from '@/components/filters/FilterPanel';
import EmptyState from '@/components/ui/EmptyState';
import { Filter, X, Search, Bell, PlusCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cleanInvalidFilters } from '@/lib/filterValidation';

const CATEGORIES = CATEGORY_ICONS;

// ── Per-category metadata ──────────────────────────────────────────────────────
const CATEGORY_META = {
  'animals-pets':         { description: 'Pets, livestock and animal products across Kenya.',         placeholder: 'Search pets, livestock, feeds…',        suggestions: ['Dogs','Cats','Birds','Fish','Livestock','Pet Accessories','Rabbits','Poultry'] },
  'vehicles':             { description: 'Cars, trucks, motorbikes and commercial vehicles.',         placeholder: 'Search Toyota, Nissan, trucks…',         suggestions: ['Toyota','Nissan','Isuzu','Motorbike','Truck','Tuk Tuk'] },
  'property':             { description: 'Houses, apartments, land and commercial property.',         placeholder: 'Search apartments, land, houses…',       suggestions: ['Apartment','Land for Sale','House','Office Space','Bedsitter'] },
  'phones-tablets':       { description: 'Smartphones, tablets and accessories.',                    placeholder: 'Search iPhone, Samsung, tablets…',       suggestions: ['iPhone','Samsung','Tecno','iPad','Smartwatch','Earbuds'] },
  'electronics':          { description: 'TVs, laptops, cameras and home electronics.',              placeholder: 'Search laptops, TVs, cameras…',          suggestions: ['Laptop','Smart TV','Camera','Speaker','Projector'] },
  'home-living':       { description: 'Sofas, beds, kitchen items and home décor.',               placeholder: 'Search sofas, beds, fridges…',           suggestions: ['Sofa','Bed','Dining Table','Curtains','Fridge'] },
  'fashion':              { description: 'Clothes, shoes, bags, skincare and beauty products.',      placeholder: 'Search dresses, shoes, makeup, bags…',   suggestions: ['Dresses','Sneakers','Handbag','Skincare','Perfume','Suit','Jewelry','Wig'] },
  'services':             { description: 'Skilled professionals for any job across Kenya.',          placeholder: 'Search plumbers, tutors, drivers…',      suggestions: ['Plumber','Electrician','Cleaner','Driver','Tutor'] },
  'repair-construction':  { description: 'Builders, contractors and construction services.',         placeholder: 'Search builders, painters…',             suggestions: ['Builder','Painter','Tiler','Welder','Carpenter'] },
  'commercial-equipment': { description: 'Industrial, farming and commercial machinery.',            placeholder: 'Search generators, tractors…',           suggestions: ['Generator','Tractor','Pump','Compressor','Fork Lift'] },
  'leisure':              { description: 'Sports gear, hobbies, games and outdoor equipment.',       placeholder: 'Search bicycles, gym gear…',             suggestions: ['Bicycle','Gym Equipment','Guitar','Tent','Football'] },
  'babies-kids':          { description: 'Baby products, kids clothes, toys and strollers.',         placeholder: 'Search strollers, toys, clothes…',       suggestions: ['Stroller','Baby Clothes','Toys','Crib','Car Seat'] },
  'food-agriculture':     { description: 'Farm produce, agricultural inputs and food products.',     placeholder: 'Search maize, seeds, fertilizer…',       suggestions: ['Maize','Fertilizer','Seeds','Poultry','Milk'] },
  'jobs':                 { description: 'Job openings, internships and gig opportunities.',         placeholder: 'Search accountant, nurse, driver…',      suggestions: ['Accountant','Driver','Nurse','Teacher','Sales Rep'] },
  'seeking-work':         { description: 'Talented professionals and graduates ready to work.',      placeholder: 'Search by skill or job title…',          suggestions: [] },
  'auto-spares':          { description: 'Genuine and aftermarket auto parts for all vehicles.',     placeholder: 'Search brake pads, alternators…',        suggestions: ['Brake Pads','Filters','Alternator','Bumper','Shock Absorbers'] },
};

// ── Per-category quick links ──────────────────────────────────────────────────
const CATEGORY_QUICK_LINKS = {
  vehicles: [
    { label: 'Toyota', query: { make: 'Toyota' } },
    { label: 'Nissan', query: { make: 'Nissan' } },
    { label: 'Mercedes-Benz', query: { make: 'Mercedes-Benz' } },
    { label: 'Trucks', query: { subcategory: 'Trucks & Trailers' } },
    { label: 'Motorbikes', query: { subcategory: 'Motorbikes' } }
  ],
  property: [
    { label: 'Houses for Sale', query: { property_type: 'House', listingCategory: 'For Sale' } },
    { label: 'Apartments for Rent', query: { property_type: 'Apartment', listingCategory: 'For Rent' } },
    { label: 'Land', query: { property_type: 'Land & Plots' } },
    { label: 'Commercial', query: { property_type: 'Commercial Property' } }
  ],
  'phones-tablets': [
    { label: 'Mobile Phones', query: { subcategory: 'Mobile Phones' } },
    { label: 'Tablets', query: { subcategory: 'Tablets' } },
    { label: 'Wearables', query: { subcategory: 'Wearables' } },
    { label: 'Feature Phones', query: { subcategory: 'Feature Phones' } },
  ],
  electronics: [
    { label: 'Laptops', query: { subcategory: 'Laptops & Computers' } },
    { label: 'Smart TVs', query: { subcategory: 'TVs & Audio' } },
    { label: 'Cameras', query: { subcategory: 'Cameras & Lenses' } }
  ]
};

// ── BrowseContent ──────────────────────────────────────────────────────────────
function BrowseContent({ defaultCategory }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savingSearch, setSavingSearch] = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [heroSearch, setHeroSearch]     = useState('');

  const category = searchParams.get('category') || defaultCategory || '';
  const keyword  = searchParams.get('keyword')  || '';
  const sort     = searchParams.get('sort')      || 'createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  const queryParams = { page, sort };
  for (const [k, v] of searchParams.entries()) {
    if (v) queryParams[k] = v;
  }

  // Validate and clean parameters synchronously before the API call
  const { cleaned: finalParams, changed: paramsChanged } = category 
    ? cleanInvalidFilters(category, queryParams) 
    : { cleaned: queryParams, changed: false };

  useEffect(() => {
    if (paramsChanged) {
      // Replace URL with cleaned params silently
      navigate(`/browse?${new URLSearchParams(finalParams).toString()}`, { replace: true });
      toast('Filters updated to match available configurations.', { icon: '✨', id: 'filter-clean' });
    }
  }, [paramsChanged, finalParams, navigate]);

  const { 
    data, 
    isLoading: loading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['listings', finalParams],
    queryFn: ({ pageParam = 1 }) => getListings({ ...finalParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev, // Keep previous data while refetching
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to load listings. Please try again.');
  }, [isError]);

  const listings = data?.pages.flatMap(page => page.listings) || [];
  const total    = data?.pages[0]?.total || 0;

  const catEntry    = CATEGORIES.find(c => c.slug === category);
  const catLabel    = catEntry?.name || (category ? category.replace(/-/g, ' ') : null);
  const catMeta     = CATEGORY_META[category] || {};
  const suggestions = catMeta.suggestions || [];

  const canonicalPath = defaultCategory
    ? `/${defaultCategory}`
    : (category && !keyword) ? `/browse?category=${category}` : '/browse';

  // Noindex pages with active keyword search or complex filters — prevents index bloat
  const hasActiveFilters = keyword || [...searchParams.entries()].filter(([k]) => !['category','sort','page'].includes(k)).length > 0;

  // Build a keyword-aware title
  const pageTitle = (() => {
    if (keyword && catLabel) return `${keyword} ${catLabel} for Sale in Kenya | AdHub Kenya`;
    if (keyword)             return `${keyword} – Search Results | AdHub Kenya`;
    if (catLabel)            return `${catLabel} for Sale in Kenya | AdHub Kenya`;
    return 'Browse Ads in Kenya | AdHub Kenya';
  })();

  // Build keywords array for meta tag
  const seoKeywords = [
    ...(catLabel ? [catLabel, `${catLabel} Kenya`, `${catLabel} for sale Kenya`] : ['Kenya classifieds', 'buy and sell Kenya']),
    ...(keyword ? [keyword, `${keyword} Kenya`] : []),
    ...(suggestions.slice(0, 5)),
    'AdHub Kenya',
  ];

  useSEO({
    title: pageTitle,
    description: catLabel
      ? `Browse ${total} ${catLabel} listings across Kenya. Find the best deals from verified sellers.`
      : `Browse ${total} classified ads in Kenya. Cars, property, electronics, jobs and more.`,
    canonicalPath,
    keywords: seoKeywords,
    noindex: !!hasActiveFilters,
  });

  // Inject BreadcrumbList JSON-LD for category pages
  useEffect(() => {
    if (!category) return;
    const scriptId = 'browse-breadcrumb-jsonld';
    let el = document.getElementById(scriptId);
    if (!el) { el = document.createElement('script'); el.id = scriptId; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://adhubkenya.co.ke/' },
        { '@type': 'ListItem', 'position': 2, 'name': catLabel || category, 'item': `https://adhubkenya.co.ke${canonicalPath}` }
      ]
    });
    return () => { const s = document.getElementById(scriptId); if (s) s.remove(); };
  }, [category, catLabel, canonicalPath]);

  const ignoredKeys      = new Set(['category','keyword','sort','page']);
  const activeFilterCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;

  const applyFilter = useCallback((overrides) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) next.set(k, v); else next.delete(k);
    });
    next.delete('page');
    navigate(`/browse?${next.toString()}`);
  }, [searchParams, navigate]);

  const clearAll = () => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    navigate(`/browse?${next.toString()}`);
  };

  const handleNotifyMe = async () => {
    if (!user) {
      toast('Sign in to get notified when listings appear.', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setSavingSearch(true);
    try {
      const filters = {};
      for (const [k, v] of searchParams.entries()) {
        if (!['keyword','page','sort'].includes(k) && v) filters[k] = v;
      }
      await saveSearch(keyword || 'All', filters);
      toast.success("You'll be notified when the first listing is posted!");
    } catch {
      toast.error('Failed. Please try again.');
    } finally {
      setSavingSearch(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    params.set('keyword', heroSearch.trim());
    navigate(`/browse?${params.toString()}`);
  };

  // Active chips
  const PARAM_LABELS = {
    county:'County', minPrice:'Min Price', maxPrice:'Max Price',
    make:'Brand', model:'Model', subcategory:'Type', system:'System', part:'Part',
    vehicle_type:'Vehicle Type', bodyStyle:'Body Style', bodyType:'Body Type',
    fuel:'Fuel', fuelType:'Fuel', transmission:'Gearbox', drive:'Drive',
    engineCC_max:'Max CC', mileage_max:'Max KM', color:'Color', numSeats:'Seats',
    numDoors:'Doors', registered:'Registered', exchange:'Exchange',
    year_min:'Year From', year_max:'Year To', variant:'Variant',
    usageType:'Usage', overallCondition:'Condition',
    os:'OS', ram:'RAM', storage:'Storage', network:'Network', chipset:'Chipset',
    storageSize:'Storage', cpuBrand:'Processor', gpu:'GPU',
    equipmentType:'Equipment Type', brand:'Brand', series:'Series',
    tv_size:'TV Size', tv_tech:'Display Tech', screenSize:'Screen Size',
    displayTech:'Display Tech', resolution:'Resolution', smartPlatform:'Platform',
    property_type:'Property Type', purpose:'Purpose', listingCategory:'Listing Type',
    bedrooms:'Beds', bathrooms:'Baths', furnished:'Furnished', parking:'Parking',
    job_type:'Job Type', employmentType:'Employment', workArrangement:'Arrangement',
    experienceLevel:'Experience', educationLevel:'Education', industry:'Industry',
    animal_type:'Animal', gender:'For', condition:'Condition', posted:'Posted', seller_type:'Seller',
  };
  const activeChips = [];
  for (const [k, v] of searchParams.entries()) {
    if (ignoredKeys.has(k) || !v) continue;
    activeChips.push({ key: k, label: PARAM_LABELS[k] || k.replace(/_/g,' '), value: v });
  }

  // Derived state
  const isEmptyCategory = !loading && total === 0 && !!category && activeChips.length === 0 && !keyword;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* ════════════════════════════════════════════════════════
          CASE A: EMPTY CATEGORY — single centered hero
      ════════════════════════════════════════════════════════ */}
      {isEmptyCategory ? (
        <>
          {/* ── Hero ── */}
          <section
            className="border-b border-border bg-gradient-to-b from-secondary/40 to-background flex items-center justify-center"
            style={{ minHeight: 320 }}
            aria-label={`${catLabel} category — no listings yet`}
          >
            <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center gap-5">

              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                <span className="text-5xl leading-none" role="img" aria-label={catLabel}>{catEntry?.icon || '🔍'}</span>
              </div>

              {/* Identity */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
                  {' › '}
                  <span className="text-foreground font-medium">{catLabel}</span>
                </p>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mb-2 leading-tight">
                  {catLabel}
                </h1>
                {catMeta.description && (
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {catMeta.description}
                  </p>
                )}
              </div>

              {/* Status */}
              <p className="text-sm font-medium text-muted-foreground">
                No listings available yet
              </p>

              {/* Contextual search */}
              <form
                onSubmit={handleHeroSearch}
                className="flex w-full max-w-sm gap-2"
                role="search"
                aria-label={`Search ${catLabel}`}
              >
                <label htmlFor="hero-cat-search" className="sr-only">
                  Search {catLabel}
                </label>
                <input
                  id="hero-cat-search"
                  type="text"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  placeholder={catMeta.placeholder || `Search ${catLabel}…`}
                  aria-label={catMeta.placeholder || `Search ${catLabel}`}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="submit"
                  aria-label="Search listings"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
                >
                  <Search className="w-4 h-4" aria-hidden="true" /> Search
                </button>
              </form>

              {/* Single CTA group */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/post-ad"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" /> Post First Listing
                </Link>
                <button
                  onClick={handleNotifyMe}
                  disabled={savingSearch}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <Bell className="w-4 h-4" aria-hidden="true" /> {savingSearch ? 'Saving…' : 'Notify Me'}
                </button>
              </div>

              <p className="text-xs text-muted-foreground -mt-1">
                Get notified when listings become available in this category.
              </p>

              {/* Tertiary link */}
              <Link to="/browse" className="text-xs font-semibold text-primary hover:underline">
                Browse all categories →
              </Link>

              {/* Quick Links Section */}
              {CATEGORY_QUICK_LINKS[category] && (
                <div className="mt-8 pt-6 border-t border-border/50 w-full">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Links</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {CATEGORY_QUICK_LINKS[category].map(ql => {
                      const params = new URLSearchParams({ category });
                      Object.entries(ql.query).forEach(([k, v]) => params.set(k, v));
                      return (
                        <Link
                          key={ql.label}
                          to={`/browse?${params.toString()}`}
                          className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm flex items-center gap-2 group"
                        >
                          {ql.label} <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Two-column content ── */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-28">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Sidebar: Popular + collapsed filters */}
              <aside className="hidden md:flex w-[280px] shrink-0 flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 px-1">
                  Browse Categories
                </p>
                {CATEGORIES.map(c => (
                  <Link
                    key={c.slug}
                    to={`/browse?category=${c.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group"
                  >
                    <span className="text-2xl leading-none w-8 text-center">{c.icon}</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{c.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                ))}

                {/* Collapsed filter notice */}
                <div className="mt-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-4">
                  <p className="text-xs font-semibold text-foreground mb-1">Filters</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Filters become available once listings exist in this category.
                  </p>
                </div>
              </aside>

              {/* Content column */}
              <div className="flex-1 min-w-0 flex flex-col gap-10 max-w-[760px]">

                {/* Popular searches */}
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-foreground mb-3">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(s => (
                        <Link
                          key={s}
                          to={`/browse?category=${category}&keyword=${encodeURIComponent(s)}`}
                          className="px-4 py-2 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border" />

                {/* Trending marketplace listings */}
                <DiscoveryRow
                  title="Trending across marketplace"
                  subtitle="Popular listings right now in Kenya"
                  sort="price_asc"
                  limit={6}
                />
              </div>
            </div>
          </div>

          {/* Mobile sticky CTA — positioned above MobileBottomNav */}
          <div
            className="lg:hidden fixed left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 z-[45] flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 60px)' }}
          >
            <span className="text-sm font-semibold text-foreground truncate">Be first in {catLabel}</span>
            <Link
              to="/post-ad"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" /> Post Listing
            </Link>
          </div>
        </>

      ) : (
        /* ════════════════════════════════════════════════════════
           CASE B: NORMAL BROWSE (has results, or filter-empty)
        ════════════════════════════════════════════════════════ */
        <>
          {/* Standard page header */}
          <div className="bg-secondary/30 border-b border-border py-6">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {category === 'seeking-work' ? 'Browse Candidates' : (catLabel || 'Browse Ads')}
                    {keyword && <span className="text-muted-foreground font-normal ml-2">"{keyword}"</span>}
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm font-medium">
                    {loading
                      ? 'Loading listings…'
                      : category === 'seeking-work'
                        ? `${total.toLocaleString()} profile${total !== 1 ? 's' : ''} found`
                        : `${total.toLocaleString()} listing${total !== 1 ? 's' : ''} found`}
                  </p>
                </div>
                {/* Mobile filter button */}
                <button
                  className="md:hidden flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-secondary"
                  onClick={() => setDrawerOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ml-1">{activeFilterCount}</span>
                  )}
                </button>
              </div>

              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {activeChips.map(chip => (
                    <span key={chip.key} className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
                      <span className="capitalize">{chip.label}:</span>
                      <span className="font-bold">{chip.value}</span>
                      <button
                        className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                        onClick={() => applyFilter({ [chip.key]: '' })}
                        aria-label={`Remove ${chip.label} filter`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground ml-2 transition-colors"
                    onClick={clearAll}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Desktop filter sidebar */}
              <div className="hidden md:block w-[280px] shrink-0 sticky top-24">
                <div className="h-[calc(100vh-100px)] overflow-hidden">
                  <FilterPanel isMobile={false} />
                </div>
              </div>

              {/* Mobile drawer */}
              {drawerOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)} />
                  <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl sm:max-w-sm md:hidden animate-in slide-in-from-right duration-300">
                    <FilterPanel isMobile={true} onClose={() => setDrawerOpen(false)} />
                  </div>
                </>
              )}

              {/* Results column */}
              <div className="flex-1 min-w-0 w-full">

                {/* Sort + actions bar */}
                {(loading || total > 0) && (
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    {/* Mobile: compact result count always visible */}
                    <span className="sm:hidden text-sm font-semibold text-foreground tabular-nums">
                      {loading ? '…' : `${total.toLocaleString()} result${total !== 1 ? 's' : ''}`}
                    </span>
                    {/* Desktop: full context string */}
                    <span className="hidden sm:block text-sm font-medium text-muted-foreground">
                      {loading ? 'Searching…' : `Showing ${listings.length} of ${total.toLocaleString()} result${total !== 1 ? 's' : ''}`}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleNotifyMe}
                        disabled={savingSearch}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                          (keyword || activeChips.length > 0)
                            ? 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:bg-secondary/80 hover:text-primary'
                        }`}
                        title={savingSearch ? 'Saving…' : 'Save this search & get alerts'}
                      >
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">{savingSearch ? 'Saving…' : 'Save Search'}</span>
                      </button>
                      <div className="h-6 w-px bg-border hidden sm:block" />
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">Sort by:</span>
                      <select
                        className="w-full sm:w-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        value={sort}
                        onChange={e => applyFilter({ sort: e.target.value })}
                      >
                        <option value="createdAt">Newest First</option>
                        {category !== 'seeking-work' && (
                          <>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                          </>
                        )}
                        {category === 'seeking-work' && (
                          <>
                            <option value="experience_desc">Most Experienced</option>
                            <option value="salary_asc">Lowest Salary Expectation</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                )}

                {/* Loading skeletons */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(12)].map((_,i) => (
                      <ListingCardSkeleton key={i} />
                    ))}
                  </div>

                ) : listings.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {listings.map(l => category === 'seeking-work'
                        ? <CandidateCard key={l.id} listing={l} />
                        : <ListingCard   key={l.id} listing={l} />
                      )}
                    </div>

                    {/* Load More Button */}
                    {hasNextPage && (
                      <div className="flex justify-center mt-12 mb-8">
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3 text-sm font-bold text-foreground shadow-sm hover:border-primary/40 hover:bg-secondary transition-all disabled:opacity-50"
                        >
                          {isFetchingNextPage ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Loading more...</>
                          ) : (
                            'Load more results'
                          )}
                        </button>
                      </div>
                    )}
                  </>

                ) : (
                  /* Filter-induced empty state */
                  <EmptyState 
                    icon={Search}
                    title={keyword ? `No results for "${keyword}"` : 'No results found'}
                    description={
                      keyword
                        ? `We couldn't find any listings matching "${keyword}"${category ? ` in ${catLabel}` : ''}. Try a different keyword or save this search to be notified when matches appear.`
                        : 'Try removing filters or broadening your search terms to find what you\'re looking for.'
                    }
                    primaryAction={{
                      label: activeChips.length > 0 ? 'Clear Filters' : (keyword && category ? `Browse all ${catLabel}` : 'Browse All Listings'),
                      onClick: (e) => { e.preventDefault(); clearAll(); }
                    }}
                    secondaryAction={
                      keyword
                        ? { label: savingSearch ? 'Saving…' : '🔔 Save & Get Alerts', onClick: (e) => { e.preventDefault(); handleNotifyMe(); } }
                        : { label: 'Post an Ad', href: '/post-ad' }
                    }
                    className="mt-8"
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function BrowsePage({ defaultCategory } = {}) {
  return <BrowseContent defaultCategory={defaultCategory} />;
}
