import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getListings, saveSearch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ListingCard from '@/components/ListingCard';
import CandidateCard from '@/components/CandidateCard';
import DiscoveryRow from '@/components/DiscoveryRow';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import FilterPanel from '@/components/filters/FilterPanel';
import { Filter, X, Search, Bell, PlusCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = CATEGORY_ICONS;

// ── Category metadata ──────────────────────────────────────────────────────────
const CATEGORY_META = {
  'animals-pets':         { description: 'Pets, livestock and animal products across Kenya.', placeholder: 'Search pets, livestock, feeds…', suggestions: ['Dogs', 'Cats', 'Birds', 'Fish', 'Livestock', 'Pet Accessories', 'Rabbits', 'Poultry'] },
  'vehicles':             { description: 'Cars, trucks, motorbikes and commercial vehicles.', placeholder: 'Search Toyota, Nissan, trucks…', suggestions: ['Toyota', 'Nissan', 'Isuzu', 'Motorbike', 'Truck', 'Tuk Tuk'] },
  'property':             { description: 'Houses, apartments, land and commercial property.', placeholder: 'Search apartments, land, houses…', suggestions: ['Apartment', 'Land for Sale', 'House', 'Office Space', 'Bedsitter'] },
  'phones-tablets':       { description: 'Smartphones, tablets and accessories.', placeholder: 'Search iPhone, Samsung, tablets…', suggestions: ['iPhone', 'Samsung', 'Tecno', 'iPad', 'Smartwatch', 'Earbuds'] },
  'electronics':          { description: 'TVs, laptops, cameras and home electronics.', placeholder: 'Search laptops, TVs, cameras…', suggestions: ['Laptop', 'Smart TV', 'Camera', 'Speaker', 'Projector'] },
  'home-furniture':       { description: 'Sofas, beds, kitchen items and home décor.', placeholder: 'Search sofas, beds, fridges…', suggestions: ['Sofa', 'Bed', 'Dining Table', 'Curtains', 'Fridge'] },
  'fashion':              { description: 'Clothes, shoes, bags and accessories.', placeholder: 'Search dresses, shoes, bags…', suggestions: ['Dresses', 'Sneakers', 'Handbag', 'Suit', 'Jewelry'] },
  'beauty':               { description: 'Skincare, makeup, haircare and personal care.', placeholder: 'Search skincare, wigs, perfume…', suggestions: ['Skincare', 'Wig', 'Perfume', 'Makeup', 'Hair Extensions'] },
  'services':             { description: 'Skilled professionals for any job across Kenya.', placeholder: 'Search plumbers, tutors, drivers…', suggestions: ['Plumber', 'Electrician', 'Cleaner', 'Driver', 'Tutor'] },
  'repair-construction':  { description: 'Builders, contractors and construction services.', placeholder: 'Search builders, painters…', suggestions: ['Builder', 'Painter', 'Tiler', 'Welder', 'Carpenter'] },
  'commercial-equipment': { description: 'Industrial, farming and commercial machinery.', placeholder: 'Search generators, tractors…', suggestions: ['Generator', 'Tractor', 'Pump', 'Compressor', 'Fork Lift'] },
  'leisure':              { description: 'Sports gear, hobbies, games and outdoor equipment.', placeholder: 'Search bicycles, gym gear…', suggestions: ['Bicycle', 'Gym Equipment', 'Guitar', 'Tent', 'Football'] },
  'babies-kids':          { description: 'Baby products, kids clothes, toys and strollers.', placeholder: 'Search strollers, toys, clothes…', suggestions: ['Stroller', 'Baby Clothes', 'Toys', 'Crib', 'Car Seat'] },
  'food-agriculture':     { description: 'Farm produce, agricultural inputs and food products.', placeholder: 'Search maize, seeds, fertilizer…', suggestions: ['Maize', 'Fertilizer', 'Seeds', 'Poultry', 'Milk'] },
  'jobs':                 { description: 'Job openings, internships and gig opportunities.', placeholder: 'Search accountant, nurse, driver…', suggestions: ['Accountant', 'Driver', 'Nurse', 'Teacher', 'Sales Rep'] },
  'seeking-work':         { description: 'Talented professionals and graduates ready to work.', placeholder: 'Search by skill, title…', suggestions: [] },
  'auto-spares':          { description: 'Genuine and aftermarket auto parts for all vehicles.', placeholder: 'Search brake pads, alternators…', suggestions: ['Brake Pads', 'Filters', 'Alternator', 'Bumper', 'Shock Absorbers'] },
};

// Popular categories shown in sidebar when category is empty
const POPULAR_SIDEBAR = ['vehicles', 'property', 'phones-tablets', 'electronics', 'services', 'jobs'];

function BrowseContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savingSearch, setSavingSearch] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const searchInputRef = useRef(null);

  const category = searchParams.get('category') || '';
  const keyword  = searchParams.get('keyword')  || '';
  const sort     = searchParams.get('sort')      || 'createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  const queryParams = { page, sort };
  for (const [k, v] of searchParams.entries()) {
    if (v) queryParams[k] = v;
  }

  const { data, isLoading: loading, isError } = useQuery({
    queryKey: ['browse-listings', queryParams],
    queryFn: () => getListings(queryParams),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to load listings. Please try again.');
  }, [isError]);

  const listings = data?.listings || [];
  const total    = data?.total    || 0;
  const pages    = data?.pages    || 1;

  const catEntry   = CATEGORIES?.find(c => c.slug === category);
  const catLabel   = catEntry?.name || (category ? category.replace(/-/g, ' ') : null);
  const catMeta    = CATEGORY_META[category] || {};
  const suggestions = catMeta.suggestions || [];

  useSEO({
    title: catLabel ? `${catLabel} for Sale in Kenya | AdHub Kenya` : 'Browse Ads in Kenya | AdHub Kenya',
    description: catLabel
      ? `Browse ${total} ${catLabel} listings across Kenya.`
      : `Browse ${total} classified ads in Kenya.`,
    canonicalPath: `/browse${category ? `?category=${category}` : ''}`
  });

  const ignoredKeys = new Set(['category', 'keyword', 'sort', 'page']);
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

  const handleSaveSearch = async () => {
    if (!user) {
      toast('Sign in to get notified when listings appear.', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setSavingSearch(true);
    try {
      const filters = {};
      for (const [k, v] of searchParams.entries()) {
        if (k !== 'keyword' && k !== 'page' && k !== 'sort' && v) filters[k] = v;
      }
      await saveSearch(keyword || 'All', filters);
      toast.success("You'll be notified when the first listing is posted!");
    } catch {
      toast.error('Failed. Please try again.');
    } finally {
      setSavingSearch(false);
    }
  };

  const handleLocalSearch = (e) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    const next = new URLSearchParams(searchParams);
    next.set('keyword', localSearch.trim());
    next.delete('page');
    navigate(`/browse?${next.toString()}`);
  };

  const PARAM_LABELS = {
    county: 'County', minPrice: 'Min Price', maxPrice: 'Max Price',
    make: 'Brand', model: 'Model', subcategory: 'Type', system: 'System', part: 'Part',
    vehicle_type: 'Vehicle Type', bodyStyle: 'Body Style', bodyType: 'Body Type',
    fuel: 'Fuel', fuelType: 'Fuel', transmission: 'Gearbox', drive: 'Drive',
    engineCC_max: 'Max CC', mileage_max: 'Max KM',
    color: 'Color', numSeats: 'Seats', numDoors: 'Doors',
    registered: 'Registered', exchange: 'Exchange',
    year_min: 'Year From', year_max: 'Year To',
    variant: 'Variant', usageType: 'Usage', overallCondition: 'Condition',
    os: 'OS', ram: 'RAM', storage: 'Storage', network: 'Network', chipset: 'Chipset',
    storageSize: 'Storage', cpuBrand: 'Processor', gpu: 'GPU',
    equipmentType: 'Equipment Type', brand: 'Brand', series: 'Series',
    tv_size: 'TV Size', tv_tech: 'Display Tech', screenSize: 'Screen Size',
    displayTech: 'Display Tech', resolution: 'Resolution', smartPlatform: 'Platform',
    channels: 'Channels', connectivity: 'Connectivity',
    property_type: 'Property Type', purpose: 'Purpose', listingCategory: 'Listing Type',
    bedrooms: 'Beds', bathrooms: 'Baths', furnished: 'Furnished',
    parking: 'Parking', amenities: 'Amenities', floors: 'Floor',
    job_type: 'Job Type', employmentType: 'Employment', workArrangement: 'Arrangement',
    experienceLevel: 'Experience', educationLevel: 'Education', industry: 'Industry',
    animal_type: 'Animal', gender: 'For',
    condition: 'Condition', posted: 'Posted', seller_type: 'Seller',
  };
  const activeChips = [];
  for (const [k, v] of searchParams.entries()) {
    if (ignoredKeys.has(k) || !v) continue;
    activeChips.push({ key: k, label: PARAM_LABELS[k] || k.replace(/_/g, ' '), value: v });
  }

  const isEmpty = !loading && total === 0;
  const isEmptyCategory = isEmpty && !!category && activeChips.length === 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ══════════════════════════════════════════════════════════
          EMPTY CATEGORY HERO — single source of truth for identity
      ══════════════════════════════════════════════════════════ */}
      {isEmptyCategory ? (
        <div className="border-b border-border bg-secondary/20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 py-10 sm:py-12 max-w-3xl">

              {/* Icon */}
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                <span className="text-4xl leading-none">{catEntry?.icon || '🔍'}</span>
              </div>

              {/* Text + actions */}
              <div className="flex-1 text-center sm:text-left">
                {/* Breadcrumb */}
                <div className="text-xs text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-1">
                  <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">{catLabel}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mb-1">
                  {catLabel}
                </h1>
                {catMeta.description && (
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {catMeta.description}
                  </p>
                )}

                <p className="text-sm font-medium text-muted-foreground mb-5">
                  No listings available yet
                </p>

                {/* Contextual search */}
                <form onSubmit={handleLocalSearch} className="flex gap-2 mb-5 max-w-sm">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    placeholder={catMeta.placeholder || `Search ${catLabel}…`}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
                  >
                    <Search className="w-4 h-4" /> Search
                  </button>
                </form>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/post-ad"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
                  >
                    <PlusCircle className="w-4 h-4" /> Post First Listing
                  </Link>
                  <button
                    onClick={handleSaveSearch}
                    disabled={savingSearch}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Bell className="w-4 h-4" /> {savingSearch ? 'Saving…' : 'Notify Me'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get notified when the first listing is posted in this category.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Normal header ── */
        <div className="bg-secondary/30 border-b border-border py-6">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {category === 'seeking-work' ? 'Browse Candidates' : (catLabel ? catLabel : 'Browse Ads')}
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
                    <span className="capitalize">{chip.label}: </span>
                    <span className="font-bold">{chip.value}</span>
                    <button className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors" onClick={() => applyFilter({ [chip.key]: '' })}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button className="text-sm font-semibold text-muted-foreground hover:text-foreground ml-2 transition-colors" onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
          {isEmptyCategory ? (
            /* Popular in Marketplace sidebar */
            <aside className="hidden md:flex w-[280px] shrink-0 sticky top-24 flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-1">
                Popular in marketplace
              </p>
              {POPULAR_SIDEBAR.map(slug => {
                const c = CATEGORIES.find(x => x.slug === slug);
                if (!c) return null;
                return (
                  <Link
                    key={slug}
                    to={`/browse?category=${slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group"
                  >
                    <span className="text-2xl leading-none w-8 text-center">{c.icon}</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}

              {/* Collapsed filter notice */}
              <div className="mt-4 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-4">
                <p className="text-xs font-semibold text-foreground mb-1">Filters</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Filters will be available once listings exist in this category.
                </p>
              </div>
            </aside>
          ) : (
            /* Normal FilterPanel */
            <div className="hidden md:block w-[280px] shrink-0 sticky top-24">
              <div className="h-[calc(100vh-100px)] overflow-hidden">
                <FilterPanel isMobile={false} />
              </div>
            </div>
          )}

          {/* ── MOBILE DRAWER ────────────────────────────────── */}
          {drawerOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)} />
              <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl sm:max-w-sm md:hidden animate-in slide-in-from-right duration-300">
                <FilterPanel isMobile={true} onClose={() => setDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── RIGHT CONTENT ─────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full">

            {/* Sort + count bar — only when results exist or loading */}
            {(loading || total > 0) && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                  {loading ? 'Searching…' : `Showing ${listings.length} of ${total.toLocaleString()} result${total !== 1 ? 's' : ''}`}
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSaveSearch}
                    disabled={savingSearch}
                    className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <Bell className="h-4 w-4" /> {savingSearch ? 'Saving…' : 'Notify Me'}
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

            {/* ── LOADING SKELETONS ── */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_,i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm animate-pulse">
                    <div className="w-full aspect-[4/3] bg-secondary/50"/>
                    <div className="p-4">
                      <div className="h-5 bg-secondary/60 rounded-md w-3/4 mb-3"/>
                      <div className="h-4 bg-secondary/50 rounded-md w-full mb-2"/>
                      <div className="h-4 bg-secondary/50 rounded-md w-2/3 mb-4"/>
                      <div className="h-3 bg-secondary/40 rounded-md w-1/3"/>
                    </div>
                  </div>
                ))}
              </div>

            ) : listings.length > 0 ? (
              /* ── LISTINGS GRID ── */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map(l => category === 'seeking-work'
                    ? <CandidateCard key={l.id} listing={l} />
                    : <ListingCard key={l.id} listing={l} />
                  )}
                </div>
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {page > 1 && (
                      <button className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => applyFilter({ page: page - 1 })}>← Prev</button>
                    )}
                    <div className="flex items-center gap-1">
                      {(() => {
                        const delta = 1;
                        const range = [];
                        const rangeWithDots = [];
                        let l;
                        for (let i = 1; i <= pages; i++) {
                          if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) range.push(i);
                        }
                        for (const i of range) {
                          if (l !== undefined) {
                            if (i - l === 2) rangeWithDots.push(l + 1);
                            else if (i - l > 2) rangeWithDots.push('...');
                          }
                          rangeWithDots.push(i);
                          l = i;
                        }
                        return rangeWithDots.map((item, idx) =>
                          item === '...' ? (
                            <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none">…</span>
                          ) : (
                            <button
                              key={item}
                              onClick={() => applyFilter({ page: item })}
                              className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${page === item ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-secondary'}`}
                            >{item}</button>
                          )
                        );
                      })()}
                    </div>
                    {page < pages && (
                      <button className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => applyFilter({ page: page + 1 })}>Next →</button>
                    )}
                  </div>
                )}
              </>

            ) : isEmptyCategory ? (
              /* ── EMPTY CATEGORY CONTENT (no duplicate header — already in hero) ── */
              <div className="flex flex-col gap-10 max-w-[760px]">

                {/* Suggested searches */}
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Popular searches</p>
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

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Trending marketplace listings */}
                <DiscoveryRow
                  title="Trending across marketplace"
                  subtitle="Popular listings right now in Kenya"
                  sort="price_asc"
                  limit={8}
                />
              </div>

            ) : (
              /* ── FILTERED EMPTY STATE (active chips / keyword with no results) ── */
              <div className="flex flex-col items-center text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-secondary/20 max-w-[760px]">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-5 shadow-sm">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                  Try removing filters or broadening your search.
                </p>
                {activeChips.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {activeChips.map(chip => (
                      <button key={chip.key} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors" onClick={() => applyFilter({ [chip.key]: '' })}>
                        <X className="w-3.5 h-3.5" /> Remove "{chip.value}"
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {activeChips.length > 0 && (
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:opacity-90 transition-opacity" onClick={clearAll}>
                      Clear All Filters
                    </button>
                  )}
                  <Link to="/post-ad" className="px-5 py-2.5 rounded-xl border border-border bg-background font-semibold text-sm hover:bg-secondary transition-colors">
                    Post an Ad
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY CTA (empty category only) ── */}
      {isEmptyCategory && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-3 px-4 z-40 flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <span className="text-sm font-semibold text-foreground truncate">Be first in {catLabel}</span>
          <Link
            to="/post-ad"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" /> Post Listing
          </Link>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return <BrowseContent />;
}
