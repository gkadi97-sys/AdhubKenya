import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Clock, Flame, Grid, Navigation, X, Mic, ArrowLeft } from 'lucide-react';
import { getListings, getCategoryCounts } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useIsMobile } from '@/hooks/useMediaQuery';

const COUNTIES = ['All Kenya', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Meru'];
const RECENT_SEARCHES_KEY = 'adhub_recent_searches';

export default function HeroSearch({ stickyCategory = null }) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [location, setLocation] = useState('All Kenya');
  const [categoryTab, setCategoryTab] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const searchRef = useRef(null);
  const overlayInputRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const PLACEHOLDERS = [
    'Search vehicles...',
    'Search apartments...',
    'Search jobs...',
    'Search phones...',
    'Search electronics...',
    'Search services...'
  ];

  // ── Placeholder rotation ────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // ── Recent searches from localStorage ──────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 8));
    } catch (e) { /* ignore */ }
  }, []);

  // ── Outside-click / outside-touch (iOS compatible) ─────────────────────────
  useEffect(() => {
    function handleOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    // mousedown covers desktop; touchstart covers iOS Safari
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // ── Body scroll lock while mobile overlay is open ──────────────────────────
  useEffect(() => {
    if (isMobile && isFocused) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobile, isFocused]);

  // ── Focus the overlay input when it mounts ─────────────────────────────────
  useEffect(() => {
    if (isMobile && isFocused && overlayInputRef.current) {
      // Small delay to let the overlay animate in before focusing
      const t = setTimeout(() => overlayInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isMobile, isFocused]);

  // ── Debounced keyword ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // ── Data queries ────────────────────────────────────────────────────────────
  const { data: catCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: getCategoryCounts,
    staleTime: 1000 * 60 * 60,
  });

  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedKeyword, categoryTab],
    queryFn: async () => {
      if (!debouncedKeyword.trim()) return null;
      const params = { keyword: debouncedKeyword, limit: 15 };
      if (categoryTab) params.category = categoryTab;
      return getListings(params);
    },
    enabled: !!debouncedKeyword.trim(),
    staleTime: 1000 * 60 * 5,
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const termClean = term.trim();
    let updated = [termClean, ...recentSearches.filter(s => s.toLowerCase() !== termClean.toLowerCase())];
    updated = updated.slice(0, 8);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) {}
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch (e) {}
  };

  const handleSearch = (e, explicitKeyword = null, explicitCategory = null) => {
    if (e) e.preventDefault();
    const finalKeyword = explicitKeyword !== null ? explicitKeyword : keyword;
    const finalCategory = explicitCategory !== null ? explicitCategory : (categoryTab || stickyCategory || '');
    if (finalKeyword) saveRecentSearch(finalKeyword);
    setIsFocused(false);
    const p = new URLSearchParams();
    if (finalKeyword.trim()) p.set('keyword', finalKeyword.trim());
    if (location !== 'All Kenya') p.set('county', location);
    if (finalCategory) p.set('category', finalCategory);
    navigate(`/browse?${p.toString()}`);
  };

  const closeOverlay = useCallback(() => setIsFocused(false), []);

  const processSuggestions = () => {
    if (!suggestionsData?.listings) return [];
    const listings = suggestionsData.listings;
    const cats = new Set(), makes = new Set(), titles = new Set();
    listings.forEach(l => {
      if (l.category) cats.add(l.category);
      if (l.make) makes.add(l.make);
      if (l.specs?.brand) makes.add(l.specs.brand);
      if (l.title) titles.add(l.title);
    });
    const results = [];
    Array.from(cats).slice(0, 2).forEach(c => {
      const catData = CATEGORY_ICONS.find(x => x.slug === c);
      if (catData) results.push({ type: 'category', value: c, label: `Search in ${catData.name}`, icon: Grid });
    });
    Array.from(makes).slice(0, 2).forEach(m => {
      if (m?.toLowerCase().includes(debouncedKeyword.toLowerCase()))
        results.push({ type: 'brand', value: m, label: m, icon: Search });
    });
    Array.from(titles).slice(0, 4).forEach(t =>
      results.push({ type: 'title', value: t, label: t, icon: Search })
    );
    return results;
  };

  const suggestions = processSuggestions();

  const getPopularSearches = () => {
    if (!catCounts) return ['Toyota Fielder', 'iPhone 15', 'Nairobi Apartments', 'Laptops'];
    const sorted = Object.entries(catCounts)
      .filter(([k]) => k !== 'total')
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => { const c = CATEGORY_ICONS.find(x => x.slug === k); return c ? c.name : k; })
      .slice(0, 5);
    return sorted.length > 0 ? sorted : ['Toyota Fielder', 'iPhone 15', 'Nairobi Apartments', 'Laptops'];
  };

  const popular = getPopularSearches();

  // ── Shared dropdown content (used in both desktop dropdown & mobile overlay) ─
  const DropdownContent = () => (
    <div className="p-2">
      {keyword.trim() && (
        <div className="mb-2">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {isLoading ? 'Searching...' : 'Suggestions'}
          </div>
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <li key={`${s.type}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword(s.type === 'category' ? '' : s.value);
                        handleSearch(null, s.type === 'category' ? '' : s.value, s.type === 'category' ? s.value : categoryTab);
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium hover:bg-secondary/60 active:bg-secondary transition cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 truncate">
                        {s.type === 'category' ? (
                          <>Search in <span className="text-primary font-bold">{s.label.replace('Search in ', '')}</span></>
                        ) : s.label}
                      </span>
                      <Navigation className="h-3 w-3 text-muted-foreground opacity-50" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : !isLoading ? (
            <div className="px-3 py-4 text-sm text-center text-muted-foreground">
              No matching suggestions found. Press Enter to search everywhere.
            </div>
          ) : null}
        </div>
      )}

      {!keyword.trim() && recentSearches.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Searches</span>
          </div>
          <ul>
            {recentSearches.map((s, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => { setKeyword(s); handleSearch(null, s); }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium hover:bg-secondary/60 active:bg-secondary transition group cursor-pointer"
                >
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{s}</span>
                  <div
                    onClick={(e) => removeRecentSearch(s, e)}
                    className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition cursor-pointer"
                    role="button"
                    aria-label={`Remove ${s}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!keyword.trim() && (
        <div className="mt-2 border-t border-border/50 pt-2">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-gold" /> Popular Right Now
          </div>
          <div className="flex flex-wrap gap-2 px-3 py-2">
            {popular.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => { setKeyword(p); handleSearch(null, p); }}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary active:scale-95 transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Category filter pills (shared) ─────────────────────────────────────────
  const CategoryPills = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
      <span className="text-xs font-semibold text-muted-foreground mr-1">Popular searches:</span>
      {[
        { id: '', label: 'All' },
        { id: 'vehicles', label: 'Vehicles' },
        { id: 'property', label: 'Property' },
        { id: 'electronics', label: 'Electronics' },
        { id: 'phones-tablets', label: 'Phones' },
      ].map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setCategoryTab(tab.id)}
          className={`px-3 py-1 rounded-full text-[10px] transition-colors cursor-pointer ${
            categoryTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'bg-background/60 backdrop-blur border border-border/50 text-foreground/80 hover:bg-background/90 font-medium'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Mobile full-screen search overlay ─────────────────────────────── */}
      {isMobile && isFocused && (
        <div
          className="fixed inset-0 bg-background flex flex-col"
          style={{ zIndex: 90 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Header row */}
          <div className="flex items-center gap-3 px-3 py-3 border-b border-border bg-card shadow-sm shrink-0">
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close search"
              className="p-2 -ml-1 rounded-full hover:bg-secondary active:scale-90 transition text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={overlayInputRef}
                type="text"
                placeholder="Search listings..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="Clear search"
                  className="shrink-0 p-0.5 rounded-full text-muted-foreground hover:text-foreground transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Location + category filters */}
          <div className="shrink-0 px-4 pt-3 pb-2 bg-background border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer text-foreground flex-1"
              >
                {COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {[{ id: '', label: 'All' }, { id: 'vehicles', label: 'Vehicles' }, { id: 'property', label: 'Property' }, { id: 'electronics', label: 'Electronics' }, { id: 'phones-tablets', label: 'Phones' }].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryTab(tab.id)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${categoryTab === tab.id ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable results */}
          <div className="flex-1 overflow-y-auto">
            <DropdownContent />
          </div>

          {/* Search button pinned at bottom */}
          <div className="shrink-0 p-4 border-t border-border bg-background" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
            <button
              type="button"
              onClick={(e) => handleSearch(e)}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-emerald py-4 text-base font-bold text-primary-foreground shadow transition hover:opacity-95 active:scale-[0.98]"
            >
              <Search className="h-5 w-5" />
              {keyword.trim() ? `Search "${keyword}"` : 'Browse All Listings'}
            </button>
          </div>
        </div>
      )}

      {/* ── Desktop / compact sticky search ───────────────────────────────── */}
      {/* z-[35] keeps it below the Navbar (z-40) and above page content (z-10) */}
      <div ref={searchRef} className="relative w-full max-w-3xl mt-4 sm:mt-6 sticky top-16 z-[35]">
        <CategoryPills />

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white dark:bg-card shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10 p-2 relative z-20 transition-all focus-within:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
        >
          <div className="flex flex-1 items-center gap-3 px-3 py-3 sm:py-2">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <label htmlFor="heroSearch" className="sr-only">Search listings</label>
            <div className="relative flex-1">
              <input
                id="heroSearch"
                type="text"
                placeholder={isFocused ? 'Type to search...' : PLACEHOLDERS[placeholderIdx]}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground transition-all duration-500 placeholder:transition-opacity"
                autoComplete="off"
              />
            </div>
            <button type="button" className="shrink-0 p-2 -mr-2 rounded-full text-muted-foreground hover:bg-secondary/50 transition" title="Voice Search">
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-border sm:border-0 pt-2 sm:pt-0">
            <label className="flex items-center gap-2 rounded-xl bg-transparent hover:bg-secondary/50 px-3 py-3 sm:py-2.5 transition min-w-[120px] flex-1 sm:flex-none">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base sm:text-sm font-medium outline-none cursor-pointer"
              >
                {COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-8 py-3.5 sm:py-3 text-base sm:text-sm font-bold text-primary-foreground shadow transition hover:opacity-95 hover:scale-[0.98] active:scale-95 cursor-pointer flex-1 sm:flex-none"
            >
              Search
            </button>
          </div>
        </form>

        {/* Desktop dropdown (not shown on mobile — overlay handles it) */}
        {!isMobile && isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <DropdownContent />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
