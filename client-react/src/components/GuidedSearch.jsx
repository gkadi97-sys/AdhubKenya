import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FILTER_CONFIG, POPULAR_SEARCHES } from '@/lib/filterConfig';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { supabase } from '@/lib/supabase';

const COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale','Garissa',
  'Kakamega','Machakos','Meru','Nyeri','Kisii','Kericho','Narok','Kajiado','Kiambu',
  'Muranga',"Murang'a",'Embu','Mombasa','Kilifi','Lamu','Taita-Taveta','Laikipia',
  'Nyandarua','Kirinyaga','Tharaka-Nithi','Makueni','Kitui','Nandi','Baringo',
  'West Pokot','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Bungoma','Busia',
  'Siaya','Homa Bay','Migori','Bomet','Kericho','Nyamira','Vihiga','Marsabit',
  'Isiolo','Samburu','Mandera','Wajir','Tana River','Turkana'
];

export default function GuidedSearch() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [extraFilters, setExtraFilters] = useState({});
  const [minPrice, setMinPrice]   = useState('');
  const [maxPrice, setMaxPrice]   = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg]   = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const catConfig = category ? FILTER_CONFIG[category] : null;

  // Autocomplete — debounced Supabase query
  useEffect(() => {
    if (!keyword.trim() || keyword.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('listings')
        .select('title')
        .ilike('title', `%${keyword}%`)
        .limit(6);
      if (data) {
        const unique = [...new Set(data.map(d => d.title))];
        setSuggestions(unique);
        setShowSugg(true);
      }
    }, 300);
  }, [keyword]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category)       params.set('category', category);
    if (location)       params.set('location', location);
    if (minPrice)       params.set('minPrice', minPrice);
    if (maxPrice)       params.set('maxPrice', maxPrice);
    Object.entries(extraFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/browse?${params.toString()}`);
  };

  const setFilter = (id, value) =>
    setExtraFilters(prev => ({ ...prev, [id]: value === prev[id] ? '' : value }));

  const selectSuggestion = (s) => { setKeyword(s); setShowSugg(false); };

  return (
    <form className="guided-search" onSubmit={handleSearch}>

      {/* ── Keyword ───────────────────────────────────── */}
      <div className="gs-keyword-wrap">
        <svg className="gs-kw-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className="gs-kw-input"
          type="text"
          placeholder="Search products, vehicles, property..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onFocus={() => suggestions.length && setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 160)}
          autoComplete="off"
        />
        {showSugg && suggestions.length > 0 && (
          <div className="gs-suggestions">
            {suggestions.map((s, i) => (
              <div key={i} className="gs-sugg-item" onMouseDown={() => selectSuggestion(s)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Popular searches (empty state) ───────────── */}
      {!keyword && !category && (
        <div className="gs-popular">
          <span className="gs-popular-label">Trending:</span>
          {POPULAR_SEARCHES.slice(0, 6).map(s => (
            <button
              key={s}
              type="button"
              className="gs-popular-chip"
              onClick={() => { setKeyword(s); handleSearch(); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Category + Location ───────────────────────── */}
      <div className="gs-row">
        <div className="gs-field">
          <label className="gs-label">Category</label>
          <select
            className="gs-select"
            value={category}
            onChange={e => { setCategory(e.target.value); setExtraFilters({}); }}
          >
            <option value="">All Categories</option>
            {TOP_CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="gs-field">
          <label className="gs-label">Location</label>
          <select className="gs-select" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">All Kenya</option>
            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Dynamic category-specific filters ─────────── */}
      {catConfig && catConfig.filters.length > 0 && (
        <div className="gs-dynamic">
          {catConfig.filters.slice(0, 4).map(f => (
            <div className="gs-field" key={f.id}>
              <label className="gs-label">{f.label}</label>
              {f.type === 'text' ? (
                <input
                  className="gs-select"
                  type="text"
                  placeholder={f.placeholder || f.label}
                  value={extraFilters[f.urlParam] || ''}
                  onChange={e => setFilter(f.urlParam, e.target.value)}
                />
              ) : (
                <select
                  className="gs-select"
                  value={extraFilters[f.urlParam] || ''}
                  onChange={e => setFilter(f.urlParam, e.target.value)}
                >
                  <option value="">Any {f.label}</option>
                  {(f.options || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Price + Submit ────────────────────────────── */}
      <div className="gs-row gs-bottom-row">
        <div className="gs-field">
          <label className="gs-label">Min Price (KES)</label>
          <input
            className="gs-select"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </div>
        <div className="gs-field">
          <label className="gs-label">Max Price (KES)</label>
          <input
            className="gs-select"
            type="number"
            min="0"
            placeholder="No limit"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="gs-field gs-submit-wrap">
          <label className="gs-label">&nbsp;</label>
          <button type="submit" className="gs-submit-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
