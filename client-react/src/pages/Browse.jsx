import { useState, useEffect, useCallback } from 'react';
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
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { Filter, X, Search, Bell, PlusCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = CATEGORY_ICONS;

// ── Category-specific metadata ────────────────────────────────────────────────
const CATEGORY_META = {
  'animals-pets':         { description: 'Discover pets, livestock and animal products across Kenya.', suggestions: ['Dogs', 'Cats', 'Birds', 'Fish', 'Livestock', 'Pet Accessories', 'Rabbits', 'Poultry'] },
  'vehicles':             { description: 'Find cars, trucks, motorbikes and commercial vehicles for sale.', suggestions: ['Toyota', 'Nissan', 'Isuzu', 'Motorbike', 'Truck', 'Tuk Tuk'] },
  'property':             { description: 'Search houses, apartments, land and commercial property across Kenya.', suggestions: ['Apartment', 'Land for Sale', 'House', 'Office Space', 'Bedsitter'] },
  'phones-tablets':       { description: 'Shop smartphones, tablets, accessories and wearables.', suggestions: ['iPhone', 'Samsung', 'Tecno', 'iPad', 'Smartwatch', 'Earbuds'] },
  'electronics':          { description: 'Find TVs, laptops, cameras, audio and home electronics.', suggestions: ['Laptop', 'Smart TV', 'Camera', 'Speaker', 'Projector'] },
  'home-furniture':       { description: 'Browse sofas, beds, kitchen items and home décor.', suggestions: ['Sofa', 'Bed', 'Dining Table', 'Curtains', 'Fridge'] },
  'fashion':              { description: 'Shop clothes, shoes, bags and accessories for men and women.', suggestions: ['Dresses', 'Sneakers', 'Handbag', 'Suit', 'Jewelry'] },
  'beauty':               { description: 'Find skincare, makeup, haircare and personal care products.', suggestions: ['Skincare', 'Wig', 'Perfume', 'Makeup', 'Hair Extensions'] },
  'services':             { description: 'Hire skilled professionals for any job across Kenya.', suggestions: ['Plumber', 'Electrician', 'Cleaner', 'Driver', 'Tutor'] },
  'repair-construction':  { description: 'Find builders, contractors and construction services.', suggestions: ['Builder', 'Painter', 'Tiler', 'Welder', 'Carpenter'] },
  'commercial-equipment': { description: 'Buy and sell industrial, farming and commercial machinery.', suggestions: ['Generator', 'Tractor', 'Pump', 'Compressor', 'Fork Lift'] },
  'leisure':              { description: 'Find sports gear, hobbies, games and outdoor equipment.', suggestions: ['Bicycle', 'Gym Equipment', 'Guitar', 'Tent', 'Football'] },
  'babies-kids':          { description: 'Shop baby products, kids clothes, toys and strollers.', suggestions: ['Stroller', 'Baby Clothes', 'Toys', 'Crib', 'Car Seat'] },
  'food-agriculture':     { description: 'Buy and sell farm produce, agricultural inputs and food products.', suggestions: ['Maize', 'Fertilizer', 'Seeds', 'Poultry', 'Milk'] },
  'jobs':                 { description: 'Browse job openings, internships and gig opportunities in Kenya.', suggestions: ['Accountant', 'Driver', 'Nurse', 'Teacher', 'Sales Rep'] },
  'seeking-work':         { description: 'Discover talented professionals and fresh graduates ready to work.', suggestions: [] },
  'auto-spares':          { description: 'Find genuine and aftermarket auto parts for all vehicle types.', suggestions: ['Brake Pads', 'Filters', 'Alternator', 'Bumper', 'Shock Absorbers'] },
};

// ── Popular "fallback" category order for category discovery ──────────────────
const DISCOVERY_ORDER = ['vehicles', 'property', 'phones-tablets', 'electronics', 'home-furniture', 'services', 'fashion', 'babies-kids'];

function BrowseContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savingSearch, setSavingSearch] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── URL as single source of truth ─────────────────────────
  const category = searchParams.get('category') || '';
  const keyword  = searchParams.get('keyword')  || '';
  const sort     = searchParams.get('sort')      || 'createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  // ── Fetch Listings via React Query ─────────────────────────
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

  // SEO
  const catEntry = CATEGORIES?.find(c => c.slug === category);
  const catLabel = catEntry?.name || (category ? category.replace(/-/g, ' ') : null);
  const catMeta  = CATEGORY_META[category] || {};
  useSEO({
    title: catLabel ? `${catLabel} for Sale in Kenya | AdHub Kenya` : 'Browse Ads in Kenya | AdHub Kenya',
    description: catLabel
      ? `Browse ${total} ${catLabel} listings across Kenya. Find the best deals from sellers in Nairobi, Mombasa, Nakuru and all 47 counties.`
      : `Browse ${total} classified ads in Kenya. Find cars, property, electronics, jobs, phones and more.`,
    canonicalPath: `/browse${category ? `?category=${category}` : ''}`
  });

  // Count active non-structural filters
  const ignoredKeys = new Set(['category', 'keyword', 'sort', 'page']);
  const activeFilterCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;

  // ── Navigation helpers ─────────────────────────────────────
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
      toast('Please create an account or login to save searches.', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setSavingSearch(true);
    try {
      const filters = {};
      for (const [k, v] of searchParams.entries()) {
        if (k !== 'keyword' && k !== 'page' && k !== 'sort' && v) {
          filters[k] = v;
        }
      }
      await saveSearch(keyword || 'All', filters);
      toast.success('You\'ll be notified when new listings appear!');
    } catch (err) {
      console.error('Failed to save search:', err);
      toast.error('Failed to save search. Please try again.');
    } finally {
      setSavingSearch(false);
    }
  };

  // ── Active filter chips ──────────────────────────────────────────────────────
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

  // ── Flags ──────────────────────────────────────────────────────────────────
  const isEmpty    = !loading && total === 0;
  const hasCatMeta = !!catMeta.description;
  const suggestions = catMeta.suggestions || [];
  const discoveryCategories = DISCOVERY_ORDER
    .map(s => CATEGORIES.find(c => c.slug === s))
    .filter(c => c && c.slug !== category);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Page Header ─────────────────────────────── */}
      <div className={`border-b border-border ${isEmpty && category ? 'bg-gradient-to-b from-secondary/40 to-background' : 'bg-secondary/30 py-6'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── EMPTY CATEGORY HERO (only when category selected and empty) ── */}
          {isEmpty && category ? (
            <div className="flex flex-col items-center text-center py-12 sm:py-16 max-w-xl mx-auto">
              {/* Category Illustration */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                  <span className="text-6xl leading-none">{catEntry?.icon || '🔍'}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
                  <PlusCircle className="w-5 h-5 text-primary" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mb-2">
                {catLabel}
              </h1>
              {hasCatMeta && (
                <p className="text-muted-foreground text-sm sm:text-base mb-3 max-w-sm">
                  {catMeta.description}
                </p>
              )}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                0 listings available right now
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/post-ad"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-4 h-4" /> Post First Ad
                </Link>
                <button
                  onClick={handleSaveSearch}
                  disabled={savingSearch}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <Bell className="w-4 h-4" /> {savingSearch ? 'Saving…' : 'Notify Me'}
                </button>
              </div>
            </div>
          ) : (
            /* ── Normal header ── */
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {category === 'seeking-work' ? 'Browse Candidates' : (catLabel ? `${catLabel}` : 'Browse Ads')}
                  {keyword && <span className="text-muted-foreground font-normal ml-2">"{keyword}"</span>}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                  {loading
                    ? 'Loading listings…'
                    : category === 'seeking-work'
                      ? `Find your next hire among ${total.toLocaleString()} profile${total !== 1 ? 's' : ''}`
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
          )}

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pb-4">
              {activeChips.map(chip => (
                <span key={chip.key} className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
                  <span className="capitalize">{chip.label}: </span>
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
              <button className="text-sm font-semibold text-muted-foreground hover:text-foreground ml-2 transition-colors" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
          {/* Collapse filter sidebar when category is empty and no filters active */}
          {!(isEmpty && category && activeFilterCount === 0) && (
            <div className="hidden md:block w-[280px] shrink-0 sticky top-24">
              <div className="h-[calc(100vh-100px)] overflow-hidden">
                <FilterPanel isMobile={false} />
              </div>
            </div>
          )}

          {/* When category is empty + no active filters, show a minimal "where to start" sidebar */}
          {isEmpty && category && activeFilterCount === 0 && (
            <div className="hidden md:block w-[280px] shrink-0 sticky top-24">
              <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-5 flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick links</p>
                <Link to="/browse" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground" /> Browse all categories
                </Link>
                <Link to="/post-ad" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  <PlusCircle className="w-4 h-4 text-muted-foreground" /> Post a listing
                </Link>
                <button onClick={handleSaveSearch} disabled={savingSearch} className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors text-left disabled:opacity-50">
                  <Bell className="w-4 h-4 text-muted-foreground" /> Notify me when listed
                </button>
                <p className="text-[11px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
                  Filters will appear once listings become available in this category.
                </p>
              </div>
            </div>
          )}

          {/* ── Mobile Drawer ──────────────────────── */}
          {drawerOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)} />
              <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl sm:max-w-sm md:hidden animate-in slide-in-from-right duration-300">
                <FilterPanel isMobile={true} onClose={() => setDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── Results column ───────────────────────── */}
          <div className="flex-1 min-w-0 w-full">

            {/* ── Sort + count bar (only when there are results or loading) ── */}
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
                    <Bell className="h-4 w-4" /> {savingSearch ? 'Saving...' : 'Notify Me'}
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

            {/* Results */}
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map(l => category === 'seeking-work' ? <CandidateCard key={l.id} listing={l} /> : <ListingCard key={l.id} listing={l} />)}
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
                          if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
                            range.push(i);
                          }
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
            ) : (
              /* ── FULL EMPTY STATE ── */
              <div className="flex flex-col gap-10">

                {/* ── Empty message ── */}
                <div className="flex flex-col items-center text-center py-10 px-4 rounded-2xl border border-dashed border-border bg-secondary/20">
                  <div className="w-20 h-20 rounded-2xl bg-background border border-border flex items-center justify-center mb-5 shadow-sm">
                    <span className="text-4xl leading-none">{catEntry?.icon || '🔍'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {category
                      ? `No listings in ${catLabel} yet`
                      : activeChips.length > 0
                        ? 'No exact matches found'
                        : 'No active listings'}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md text-sm">
                    {category && !activeChips.length
                      ? 'Be the first seller or explore related categories below.'
                      : 'Try widening your search or removing some filters to see more results.'}
                  </p>

                  {/* Remove filter chips */}
                  {activeChips.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {activeChips.map(chip => (
                        <button key={chip.key} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors shadow-sm" onClick={() => applyFilter({ [chip.key]: '' })}>
                          <X className="w-3.5 h-3.5" /> Remove "{chip.value}"
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Primary CTAs */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/post-ad"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:opacity-90 transition-opacity"
                    >
                      <PlusCircle className="w-4 h-4" /> Post First Listing
                    </Link>
                    <button
                      onClick={handleSaveSearch}
                      disabled={savingSearch}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background font-semibold text-sm hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      <Bell className="w-4 h-4" /> {savingSearch ? 'Saving…' : 'Notify Me When Listed'}
                    </button>
                    {activeChips.length > 0 && (
                      <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-muted-foreground font-semibold text-sm hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={clearAll}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Suggested Searches (chips) ── */}
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Try searching for</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(s => (
                        <Link
                          key={s}
                          to={`/browse?${category ? `category=${category}&` : ''}keyword=${encodeURIComponent(s)}`}
                          className="px-4 py-2 rounded-full bg-background border border-border text-sm font-semibold hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Popular Category Discovery ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-foreground">Popular categories</p>
                    <Link to="/browse" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      All <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {discoveryCategories.slice(0, 6).map(c => (
                      <Link
                        key={c.slug}
                        to={`/browse?category=${c.slug}`}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all text-center"
                      >
                        <span className="text-2xl leading-none">{c.icon}</span>
                        <span className="text-[11px] font-semibold text-foreground leading-tight">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* ── Trending across marketplace ── */}
                <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-10 border-t border-border">
                  <DiscoveryRow
                    title="Trending Deals"
                    subtitle="Popular right now across Kenya"
                    sort="price_asc"
                    limit={8}
                  />
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sticky CTA (empty state only) ── */}
      {isEmpty && category && (
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
