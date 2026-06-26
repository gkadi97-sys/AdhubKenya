import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getListings, saveSearch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ListingCard from '@/components/ListingCard';
import CandidateCard from '@/components/CandidateCard';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import FilterPanel from '@/components/filters/FilterPanel';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { Filter, X, Search, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = CATEGORY_ICONS;

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load listings. Please try again.');
    }
  }, [isError]);



  const listings = data?.listings || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  // SEO
  const catEntry = CATEGORIES?.find(c => c.slug === category);
  const catLabel = catEntry?.name || (category ? category.replace(/-/g, ' ') : null);
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
      toast.success('Search saved successfully!');
    } catch (err) {
      console.error('Failed to save search:', err);
      toast.error('Failed to save search. Please try again.');
    } finally {
      setSavingSearch(false);
    }
  };

  // ── Active filter chips — human-readable labels ────────────────────────────
  // Maps URL param keys → display names shown on the chip badges
  const PARAM_LABELS = {
    // Location & price
    county: 'County', minPrice: 'Min Price', maxPrice: 'Max Price',
    // Cascades
    make: 'Brand', model: 'Model', subcategory: 'Type', system: 'System', part: 'Part',
    // Vehicles
    vehicle_type: 'Vehicle Type', bodyStyle: 'Body Style', bodyType: 'Body Type',
    fuel: 'Fuel', fuelType: 'Fuel', transmission: 'Gearbox', drive: 'Drive',
    engineCC_max: 'Max CC', mileage_max: 'Max KM',
    color: 'Color', numSeats: 'Seats', numDoors: 'Doors',
    registered: 'Registered', exchange: 'Exchange',
    year_min: 'Year From', year_max: 'Year To',
    variant: 'Variant', usageType: 'Usage', overallCondition: 'Condition',
    // Phones & Laptops
    os: 'OS', ram: 'RAM', storage: 'Storage', network: 'Network', chipset: 'Chipset',
    storageSize: 'Storage', cpuBrand: 'Processor', gpu: 'GPU',
    // Electronics
    equipmentType: 'Equipment Type', brand: 'Brand', series: 'Series',
    tv_size: 'TV Size', tv_tech: 'Display Tech', screenSize: 'Screen Size',
    displayTech: 'Display Tech', resolution: 'Resolution', smartPlatform: 'Platform',
    channels: 'Channels', connectivity: 'Connectivity',
    // Property
    property_type: 'Property Type', purpose: 'Purpose', listingCategory: 'Listing Type',
    bedrooms: 'Beds', bathrooms: 'Baths', furnished: 'Furnished',
    parking: 'Parking', amenities: 'Amenities', floors: 'Floor',
    // Jobs
    job_type: 'Job Type', employmentType: 'Employment', workArrangement: 'Arrangement',
    experienceLevel: 'Experience', educationLevel: 'Education', industry: 'Industry',
    // Animals / Fashion / Universal
    animal_type: 'Animal', gender: 'For',
    condition: 'Condition', posted: 'Posted', seller_type: 'Seller',
  };
  const activeChips = [];
  for (const [k, v] of searchParams.entries()) {
    if (ignoredKeys.has(k) || !v) continue;
    activeChips.push({ key: k, label: PARAM_LABELS[k] || k.replace(/_/g, ' '), value: v });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="bg-secondary/30 border-b border-border py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {category === 'seeking-work' ? 'Browse Candidates' : (catLabel ? `${catLabel}` : 'Browse Ads')}
                {keyword && <span className="text-muted-foreground font-normal ml-2">"{keyword}"</span>}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm font-medium">
                {category === 'seeking-work' ? `Find your next hire among ${total.toLocaleString()} profile${total !== 1 ? 's' : ''}` : `${total.toLocaleString()} listing${total !== 1 ? 's' : ''} found`}
              </p>
            </div>
            {/* Mobile filter button */}
            <button
              className="md:hidden flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-secondary"
              onClick={() => setDrawerOpen(true)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ml-1">{activeFilterCount}</span>}
            </button>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── Desktop Sidebar ──────────────────────── */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24">
            <div className="h-[calc(100vh-100px)] overflow-hidden">
              <FilterPanel isMobile={false} />
            </div>
          </div>

          {/* ── Mobile Drawer ────────────────────────── */}
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

            {/* Sort + count bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                Showing {listings.length} of {total.toLocaleString()} result{total !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSaveSearch} 
                  disabled={savingSearch}
                  className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <Heart className="h-4 w-4" /> {savingSearch ? 'Saving...' : 'Save Search'}
                </button>
                <div className="h-6 w-px bg-border hidden sm:block"></div>
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
                        // Build sliding window: always show first, last, current ±1, with ellipsis
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
                            if (i - l === 2) {
                              rangeWithDots.push(l + 1);
                            } else if (i - l > 2) {
                              rangeWithDots.push('...');
                            }
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
              /* ── Improved Empty State ── */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-secondary/20">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {category === 'seeking-work' ? 'No candidates match your search' : 'No exact matches found'}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {category === 'seeking-work' ? 'Try widening your search, removing some filters, or browsing broader categories to find the right talent.' : 'Try widening your search or removing some filters to see more results.'}
                </p>
                
                {activeChips.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 max-w-2xl mb-8">
                    {activeChips.map(chip => (
                      <button key={chip.key} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors shadow-sm" onClick={() => applyFilter({ [chip.key]: '' })}>
                        <X className="w-4 h-4" /> Remove "{chip.value}" filter
                      </button>
                    ))}
                    {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors shadow-sm" onClick={() => {
                        applyFilter({ minPrice: '', maxPrice: '' });
                      }}>
                        <X className="w-4 h-4" /> Expand price range
                      </button>
                    )}
                    {searchParams.get('county') && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors shadow-sm" onClick={() => applyFilter({ county: '', location: '' })}>
                        <X className="w-4 h-4" /> Search all of Kenya
                      </button>
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {activeChips.length > 0 && (
                    <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition-opacity" onClick={clearAll}>
                      Clear All Filters
                    </button>
                  )}
                  <Link to="/post-ad" className="px-6 py-2.5 rounded-xl bg-background border border-border text-foreground font-semibold shadow-sm hover:bg-secondary transition-colors">
                    Post an Ad
                  </Link>
                </div>

                {/* Similar category suggestions */}
                {category && (
                  <div className="mt-12 w-full max-w-3xl border-t border-border pt-8">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Browse similar categories</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {CATEGORIES.filter(c => c.slug !== category).slice(0, 5).map(c => (
                        <Link key={c.slug} to={`/browse?category=${c.slug}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-sm transition-all text-sm font-medium">
                          <span className="text-lg">{c.icon}</span> {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return <BrowseContent />;
}
