import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, BadgeCheck, ShieldCheck, Sparkles, Flame, TrendingUp, Clock, ChevronRight, ArrowUpRight, PlusCircle, Car, Smartphone, Home, Shirt, Laptop, Sofa, Briefcase, Wrench, SlidersHorizontal } from 'lucide-react';
import { getListings } from '@/lib/api';
import { FILTER_CONFIG } from '@/lib/filterConfig';
import { 
  hasCascadeFilters, 
  getLevel1Options, 
  getLevel2Options, 
  getCascadeLabels, 
  CASCADE_URL_PARAMS 
} from '@/lib/filterEngine';
import ListingCard from '@/components/ListingCard';
import FilterSidebar, { DynamicDataFilter } from '@/components/FilterSidebar';
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

const categories = [
  { name: "Vehicles", count: "3,420", icon: Car, img: catVehicles, tint: "from-emerald-900/70" },
  { name: "Phones & Tablets", count: "2,180", icon: Smartphone, img: catPhones, tint: "from-amber-900/60" },
  { name: "Property", count: "1,940", icon: Home, img: catProperty, tint: "from-stone-900/60" },
  { name: "Fashion", count: "1,560", icon: Shirt, img: catFashion, tint: "from-orange-900/60" },
  { name: "Electronics", count: "1,330", icon: Laptop, img: catElectronics, tint: "from-emerald-900/60" },
  { name: "Furniture", count: "870", icon: Sofa, img: catFurniture, tint: "from-amber-900/60" },
  { name: "Jobs", count: "640", icon: Briefcase, img: catServices, tint: "from-stone-900/60" },
  { name: "Services", count: "1,210", icon: Wrench, img: catServices, tint: "from-emerald-900/60" },
];

const counties = ["All Kenya", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"];
const popularSearches = ["Toyota Fielder", "Bedsitter Nairobi", "iPhone 15", "Mitsubishi FH", "PlayStation 5"];

const categoryMap = {
  "Vehicles": "vehicles",
  "Phones & Tablets": "phones-tablets",
  "Property": "property",
  "Fashion": "fashion",
  "Electronics": "electronics",
  "Furniture": "home-furniture",
  "Jobs": "jobs",
  "Services": "services",
  "Auto Spares": "auto-spares",
  "Animals & Pets": "animals-pets"
};

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('All Kenya');
  const [dynamicFilters, setDynamicFilters] = useState({});
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

  // Reset dynamic filters when category changes
  useEffect(() => {
    setDynamicFilters({});
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    let query = `/browse?`;
    if (search.trim()) query += `keyword=${encodeURIComponent(search)}&`;
    if (category !== 'All categories') query += `category=${encodeURIComponent(categoryMap[category] || category)}&`;
    if (location !== 'All Kenya') query += `location=${encodeURIComponent(location)}&`;
    
    // Append dynamic filters
    Object.entries(dynamicFilters).forEach(([k, v]) => {
      if (v) query += `${k}=${encodeURIComponent(v)}&`;
    });

    navigate(query);
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

      {/* Hero */}
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

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live from 47 counties · 236 ads today
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Kenya's trusted{" "}
              <span className="text-gold-grad">marketplace</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Buy, sell and discover real deals near you — from Westlands to Mombasa.
              Verified sellers. Zero listing fees.
            </p>
          </div>

          {/* Search card */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-4xl rounded-3xl border border-border bg-card p-3 shadow-elevated sm:p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                placeholder="What are you looking for today?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <label className="group flex items-center gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border hover:ring-primary/40">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Category
                </span>
                <select value={category} onChange={e => setCategory(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none">
                  <option>All categories</option>
                  {categories.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label className="group flex items-center gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border hover:ring-primary/40">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <select value={location} onChange={e => setLocation(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none">
                  {counties.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:opacity-95 cursor-pointer">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Dynamic Inline Filters */}
            {category !== 'All categories' && categoryMap[category] && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-secondary/30 px-3 py-2.5">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-xs font-semibold text-muted-foreground mr-2 hidden sm:inline">Advanced:</span>
                
                {/* ── Cascade Filters (Brand/Model) ── */}
                {(() => {
                  const catSlug = categoryMap[category];
                  if (!hasCascadeFilters(catSlug)) return null;
                  
                  const params = CASCADE_URL_PARAMS[catSlug];
                  const labels = getCascadeLabels(catSlug);
                  const val1 = dynamicFilters[params.level1] || '';
                  const val2 = dynamicFilters[params.level2] || '';
                  
                  const opts1 = getLevel1Options(catSlug);
                  const opts2 = getLevel2Options(catSlug, val1);
                  
                  return (
                    <>
                      {opts1.length > 0 && (
                        <select
                          value={val1}
                          onChange={(e) => {
                            const newFilters = { ...dynamicFilters, [params.level1]: e.target.value };
                            delete newFilters[params.level2];
                            if (params.level3) delete newFilters[params.level3];
                            setDynamicFilters(newFilters);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                        >
                          <option value="">{labels.level1Label}</option>
                          {opts1.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                      
                      {val1 && opts2.length > 0 && (
                        <select
                          value={val2}
                          onChange={(e) => {
                            const newFilters = { ...dynamicFilters, [params.level2]: e.target.value };
                            if (params.level3) delete newFilters[params.level3];
                            setDynamicFilters(newFilters);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                        >
                          <option value="">{labels.level2Label}</option>
                          {opts2.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                    </>
                  );
                })()}

                {/* ── Flat Filters (Condition, etc) ── */}
                {FILTER_CONFIG[categoryMap[category]]?.filters
                  .filter(f => f.type === 'select' || f.type === 'radio' || f.type === 'dynamic-select')
                  .slice(0, 3) // Show top 3 standard filters
                  .map(f => (
                    f.type === 'dynamic-select' ? (
                      <DynamicDataFilter
                        key={f.id}
                        category={categoryMap[category]}
                        urlParam={f.urlParam}
                        searchParams={new URLSearchParams(dynamicFilters)}
                        onChange={(v) => setDynamicFilters(prev => ({ ...prev, [f.urlParam]: v }))}
                      />
                    ) : (
                      <select
                        key={f.id}
                        value={dynamicFilters[f.urlParam] || ''}
                        onChange={(e) => setDynamicFilters(prev => ({ ...prev, [f.urlParam]: e.target.value }))}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      >
                        <option value="">{f.label}</option>
                        {f.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Popular
              </span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setSearch(s); }}
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
              { icon: BadgeCheck, label: "12,000+ Live Ads" },
              { icon: ShieldCheck, label: "Verified Sellers" },
              { icon: Sparkles, label: "Always Free Posting" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live counters band */}
      <section className="gradient-emerald text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Flame, n: "236", l: "New ads today" },
            { icon: TrendingUp, n: "42", l: "Posted this hour" },
            { icon: Clock, n: "1,200", l: "Added this week" },
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

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Browse
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Featured categories
            </h2>
          </div>
          <Link to="/browse" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            All categories <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/browse?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated block"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                width={800}
                height={800}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} via-transparent to-transparent`} />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur">
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-background opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="text-background">
                  <div className="font-display text-lg font-bold leading-tight">{c.name}</div>
                  <div className="text-xs opacity-90">{c.count} ads</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending listings from Supabase */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Trending now
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Fresh deals near you
              </h2>
            </div>
            <Link to="/browse" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              See all listings <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading fresh deals...</div>
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

      {/* Sell CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl gradient-emerald p-8 text-primary-foreground sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Sell smarter
              </span>
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
                <Link to="/post-ad" className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-primary shadow-elevated hover:bg-cream">
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
                "List in under 60 seconds",
                "Reach buyers across 47 counties",
                "Verified seller badges build trust",
                "Chat directly — no commissions",
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
