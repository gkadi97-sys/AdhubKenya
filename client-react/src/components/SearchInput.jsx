import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Grid, X } from 'lucide-react';
import { getListings } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';

export default function SearchInput({ className = '', placeholder = 'Search Toyota, iPhone, apartment…' }) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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

  const { data: suggestionsData } = useQuery({
    queryKey: ['search-suggestions-navbar', debouncedKeyword],
    queryFn: async () => {
      if (!debouncedKeyword.trim()) return null;
      return getListings({ keyword: debouncedKeyword, limit: 15 });
    },
    enabled: !!debouncedKeyword.trim(),
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (e, explicitKeyword = null) => {
    if (e) e.preventDefault();
    const finalKeyword = explicitKeyword !== null ? explicitKeyword : keyword;
    setIsFocused(false);
    if (finalKeyword.trim()) {
      navigate(`/browse?keyword=${encodeURIComponent(finalKeyword.trim())}`);
    }
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
        results.push({ type: 'category', value: c, label: `Search in ${catData.name}`, icon: Grid, category: c });
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

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={(e) => handleSearch(e)} className="flex w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm transition focus-within:border-primary/50 focus-within:shadow-elevated">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {keyword && (
          <button type="button" onClick={() => { setKeyword(''); setDebouncedKeyword(''); setIsFocused(false); }} className="p-1 hover:bg-secondary rounded-full">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </form>

      {isFocused && keyword.trim() && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-card border border-border shadow-elevated z-50 overflow-hidden">
          <ul className="max-h-80 overflow-y-auto p-2">
            {suggestions.map((s, idx) => (
              <li key={`${s.type}-${idx}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.type === 'category') {
                      setIsFocused(false);
                      navigate(`/browse?category=${s.category}&keyword=${encodeURIComponent(keyword)}`);
                    } else {
                      setKeyword(s.value);
                      handleSearch(null, s.value);
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{s.type}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
