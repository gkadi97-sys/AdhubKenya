import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Clock, Flame, Grid, Navigation, X } from 'lucide-react';
import { getListings, getCategoryCounts } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';

const COUNTIES = ['All Kenya', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Meru'];
const RECENT_SEARCHES_KEY = 'adhub_recent_searches';

export default function HeroSearch() {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [location, setLocation] = useState('All Kenya');
  const [categoryTab, setCategoryTab] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed.slice(0, 8));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

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

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const termClean = term.trim();
    let updated = [termClean, ...recentSearches.filter(s => s.toLowerCase() !== termClean.toLowerCase())];
    updated = updated.slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSearch = (e, explicitKeyword = null, explicitCategory = null) => {
    if (e) e.preventDefault();
    
    const finalKeyword = explicitKeyword !== null ? explicitKeyword : keyword;
    const finalCategory = explicitCategory !== null ? explicitCategory : categoryTab;
    
    if (finalKeyword) saveRecentSearch(finalKeyword);
    
    setIsFocused(false);
    
    const p = new URLSearchParams();
    if (finalKeyword.trim()) p.set('keyword', finalKeyword.trim());
    if (location !== 'All Kenya') p.set('county', location);
    if (finalCategory) p.set('category', finalCategory);
    
    navigate(`/browse?${p.toString()}`);
  };

  const processSuggestions = () => {
    if (!suggestionsData || !suggestionsData.listings) return [];
    
    const listings = suggestionsData.listings;
    const cats = new Set();
    const makes = new Set();
    const titles = new Set();
    
    listings.forEach(l => {
      if (l.category) cats.add(l.category);
      if (l.make) makes.add(l.make);
      if (l.specs?.brand) makes.add(l.specs.brand);
      if (l.title) titles.add(l.title);
    });

    const results = [];
    
    Array.from(cats).slice(0, 2).forEach(c => {
      const catData = CATEGORY_ICONS.find(x => x.slug === c);
      if (catData) {
        results.push({ type: 'category', value: c, label: `Search in ${catData.name}`, icon: Grid });
      }
    });
    
    Array.from(makes).slice(0, 2).forEach(m => {
      if (m && m.toLowerCase().includes(debouncedKeyword.toLowerCase())) {
        results.push({ type: 'brand', value: m, label: m, icon: Search });
      }
    });
    
    Array.from(titles).slice(0, 4).forEach(t => {
      results.push({ type: 'title', value: t, label: t, icon: Search });
    });
    
    return results;
  };

  const suggestions = processSuggestions();

  const getPopularSearches = () => {
    if (!catCounts) return ['Toyota Fielder', 'iPhone 15', 'Nairobi Apartments', 'Laptops'];
    
    const sorted = Object.entries(catCounts)
      .filter(([k]) => k !== 'total')
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => {
        const c = CATEGORY_ICONS.find(x => x.slug === k);
        return c ? c.name : k;
      })
      .slice(0, 5);
      
    return sorted.length > 0 ? sorted : ['Toyota Fielder', 'iPhone 15', 'Nairobi Apartments', 'Laptops'];
  };

  const popular = getPopularSearches();

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mt-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Popular searches:</span>
        {[{ id: '', label: 'All' }, { id: 'vehicles', label: 'Vehicles' }, { id: 'property', label: 'Property' }, { id: 'electronics', label: 'Electronics' }, { id: 'phones-tablets', label: 'Phones' }].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryTab(tab.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              categoryTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-background/80 backdrop-blur border border-border text-foreground hover:bg-background'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => handleSearch(e)} className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-border bg-card/95 backdrop-blur p-2 shadow-elevated relative z-20">
        
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-background px-4 py-3 sm:py-0 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <label htmlFor="heroSearch" className="sr-only">Search listings</label>
          <input
            id="heroSearch"
            type="text"
            placeholder="Search vehicles, property, electronics…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="min-w-0 flex-1 bg-transparent text-base sm:text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl bg-background px-3 py-3 sm:py-2.5 ring-1 ring-border hover:ring-primary/40 min-w-[120px]">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <select 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none cursor-pointer"
            >
              {COUNTIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-3 sm:py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-95 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto p-2">
            
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
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-secondary/60 transition cursor-pointer"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 truncate">
                              {s.type === 'category' ? (
                                <>Search in <span className="text-primary font-bold">{s.label.replace('Search in ', '')}</span></>
                              ) : (
                                s.label
                              )}
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
                        onClick={() => {
                          setKeyword(s);
                          handleSearch(null, s);
                        }}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-secondary/60 transition group cursor-pointer"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{s}</span>
                        <div 
                          onClick={(e) => removeRecentSearch(s, e)}
                          className="p-1 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground opacity-0 group-hover:opacity-100 transition cursor-pointer"
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
                      onClick={() => {
                        setKeyword(p);
                        handleSearch(null, p);
                      }}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
