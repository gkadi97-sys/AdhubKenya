import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FILTER_CONFIG, POPULAR_SEARCHES } from '@/lib/filterConfig';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { supabase } from '@/lib/supabase';
import { COUNTIES } from '@/lib/countyData';
import { getTowns } from '@/lib/countyData';

// Category-specific quick filter definitions (shown inline under search row)
const QUICK_FILTERS = {
  vehicles:          [{ id: 'make', label: 'Brand', type: 'select', options: ['Toyota','Nissan','Mitsubishi','Mazda','Honda','Subaru','Isuzu','Suzuki','Land Rover','Mercedes-Benz','BMW','Volkswagen','Ford','Hyundai','Kia'] }, { id: 'vehicle_type', label: 'Type', type: 'select', options: ['Cars','SUVs','Pickups','Vans','Buses','Motorcycles'] }, { id: 'year_min', label: 'Year from', type: 'select', options: Array.from({length:26},(_,i)=>String(2025-i)) }, { id: 'minPrice', label: 'Min Price', type: 'number', placeholder: '0' }, { id: 'maxPrice', label: 'Max Price', type: 'number', placeholder: 'Any' }],
  property:          [{ id: 'purpose', label: 'Purpose', type: 'select', options: ['Rent','Sale'] }, { id: 'property_type', label: 'Type', type: 'select', options: ['Apartment','House','Studio','Bedsitter','Maisonette','Land','Office'] }, { id: 'bedrooms', label: 'Bedrooms', type: 'select', options: ['1','2','3','4','5+'] }, { id: 'minPrice', label: 'Min Price', type: 'number', placeholder: '0' }, { id: 'maxPrice', label: 'Max Price', type: 'number', placeholder: 'Any' }],
  'phones-tablets':  [{ id: 'make', label: 'Brand', type: 'select', options: ['Apple','Samsung','Tecno','Infinix','Itel','Huawei','Nokia','Xiaomi'] }, { id: 'condition', label: 'Condition', type: 'select', options: ['Brand New','Ex-UK','Ex-USA','Locally Used','Refurbished'] }, { id: 'maxPrice', label: 'Max Price', type: 'number', placeholder: 'Any' }],
  electronics:       [{ id: 'condition', label: 'Condition', type: 'select', options: ['New','Used - Like New','Used - Good','Used - Fair'] }, { id: 'maxPrice', label: 'Max Price', type: 'number', placeholder: 'Any' }],
  'home-living':  [{ id: 'condition', label: 'Condition', type: 'select', options: ['New','Used - Like New','Used - Good'] }, { id: 'maxPrice', label: 'Max Price', type: 'number', placeholder: 'Any' }],
  jobs:              [{ id: 'job_type', label: 'Job Type', type: 'select', options: ['Full Time','Part Time','Contract','Internship','Freelance','Remote'] }, { id: 'industry', label: 'Industry', type: 'select', options: ['IT & Tech','Finance','Healthcare','Education','NGO','Transport','Construction','Sales'] }],
  'auto-spares':     [{ id: 'make', label: 'Compatible Brand', type: 'select', options: ['Toyota','Nissan','Mitsubishi','Mazda','Honda','Subaru','Isuzu','Universal'] }, { id: 'condition', label: 'Condition', type: 'select', options: ['New','Ex-Japan','Locally Used','OEM','Aftermarket'] }],
};

// Saved recent searches
function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem('adhub_recent_searches') || '[]'); }
  catch { return []; }
}
function saveRecentSearch(term) {
  if (!term?.trim()) return;
  const prev = getRecentSearches().filter(s => s !== term);
  localStorage.setItem('adhub_recent_searches', JSON.stringify([term, ...prev].slice(0, 6)));
}

import { useMetadataCache } from '@/lib/useMetadataCache';
import { getLookupValues } from '@/lib/api';

// ... (skipping to component)
export default function GuidedSearch({ compact = false }) {
  const [keyword, setKeyword]     = useState('');
  const [category, setCategory]   = useState('');
  const [county, setCounty]       = useState('');
  const [town, setTown]           = useState('');
  const [extraFilters, setExtra]  = useState({});
  const [showMore, setShowMore]   = useState(false);
  const [suggestions, setSugg]    = useState([]);
  const [showSugg, setShowSugg]   = useState(false);
  const [focused, setFocused]     = useState(false);
  const debounceRef = useRef(null);
  const navigate    = useNavigate();

  const metadata = useMetadataCache(category);
  const [dynamicOptions, setDynamicOptions] = useState({});

  let quickFilters = category ? (QUICK_FILTERS[category] || []) : [];
  
  if (metadata && metadata.attributes) {
    const searchableAttrs = metadata.attributes
      .filter(a => a.is_searchable)
      .sort((a, b) => a.display_order - b.display_order)
      .slice(0, 5); // Max 5 for Guided Search

    if (searchableAttrs.length > 0) {
      quickFilters = searchableAttrs.map(attr => {
        let type = 'select';
        let options = [];
        
        if (attr.field_type === 'number') type = 'number';
        
        if (attr.is_lookup && attr.lookup_type) {
           // Fetch lookup values asynchronously if not already fetched
           if (!dynamicOptions[attr.name]) {
             getLookupValues(attr.lookup_type).then(data => {
               setDynamicOptions(prev => ({ ...prev, [attr.name]: data.map(d => d.value) }));
             });
           }
           options = dynamicOptions[attr.name] || [];
        } else if (attr.options) {
           options = attr.options;
        }

        return {
          id: attr.name,
          label: attr.label,
          type,
          options,
          placeholder: attr.placeholder || 'Any'
        };
      });
    }
  }

  const towns        = county ? getTowns(county) : [];
  const recentSearch = getRecentSearches();

  // Autocomplete — Supabase + popular fallback
  useEffect(() => {
    if (!keyword.trim() || keyword.length < 2) { setSugg([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase.from('listings').select('title').ilike('title', `%${keyword}%`).limit(5);
      const live     = (data || []).map(d => d.title);
      const popular  = POPULAR_SEARCHES.filter(s => s.toLowerCase().includes(keyword.toLowerCase()));
      const combined = [...new Set([...live, ...popular])].slice(0, 6);
      setSugg(combined);
      setShowSugg(true);
    }, 280);
  }, [keyword]);

  const buildLocation = () => {
    if (town && county) return `${town}, ${county}`;
    if (county) return county;
    return '';
  };

  const handleSearch = (term) => {
    const kw = (term !== undefined ? term : keyword).trim();
    saveRecentSearch(kw);
    const params = new URLSearchParams();
    if (kw)           params.set('keyword', kw);
    if (category)     params.set('category', category);
    const loc = buildLocation();
    if (loc)          params.set('location', loc);
    if (county)       params.set('county', county);
    if (town)         params.set('town', town);
    Object.entries(extraFilters).forEach(([k,v]) => { if (v) params.set(k, v); });
    navigate(`/browse?${params.toString()}`);
  };

  const setFilter = (id, val) => setExtra(prev => ({ ...prev, [id]: val }));

  const showSuggestions = showSugg && focused && (suggestions.length > 0 || recentSearch.length > 0);

  return (
    <div className="gs2-wrap">
      {/* ── Row 1: Keyword ── */}
      <div className="gs2-keyword-row">
        <div className="gs2-keyword-field">
          <svg className="gs2-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="gs2-keyword-input"
            type="text"
            placeholder="Search Toyota, iPhone, Land, Apartment..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => { setFocused(false); setShowSugg(false); }, 170)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
          />
          {keyword && (
            <button className="gs2-clear-btn" onClick={() => { setKeyword(''); setSugg([]); }} type="button">✕</button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="gs2-suggestions">
              {recentSearch.length > 0 && !keyword && (
                <>
                  <div className="gs2-sugg-group">Recent Searches</div>
                  {recentSearch.map(s => (
                    <div key={s} className="gs2-sugg-item" onMouseDown={() => { setKeyword(s); handleSearch(s); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ flex: 1 }}>{s}</span>
                    </div>
                  ))}
                </>
              )}
              {keyword && suggestions.length > 0 && (
                <>
                  {suggestions.map(s => (
                    <div key={s} className="gs2-sugg-item" onMouseDown={() => { setKeyword(s); handleSearch(s); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      <span style={{ flex: 1 }}>{s}</span>
                      <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>({Math.floor(Math.random() * 200) + 12})</span>
                    </div>
                  ))}
                </>
              )}
              {!keyword && POPULAR_SEARCHES.slice(0, 4).map(s => (
                <div key={s} className="gs2-sugg-item gs2-sugg-popular" onMouseDown={() => { setKeyword(s); handleSearch(s); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  <span style={{ flex: 1 }}>{s}</span>
                  <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>({Math.floor(Math.random() * 500) + 50})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Category + Location + Search ── */}
      <div className="gs2-main-row">
        <div className="gs2-field">
          <label className="gs2-label">Category</label>
          <select
            className="gs2-select"
            value={category}
            onChange={e => { setCategory(e.target.value); setExtra({}); setShowMore(false); }}
          >
            <option value="">All Categories</option>
            {TOP_CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="gs2-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="gs2-label">County</label>
            <button 
              type="button" 
              onClick={() => { setCounty('Nairobi'); setTown('Westlands'); alert('Location detected (Mock)'); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              📍 Detect
            </button>
          </div>
          <select className="gs2-select" value={county} onChange={e => { setCounty(e.target.value); setTown(''); }}>
            <option value="">All Kenya</option>
            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Town — only when county selected */}
        {county && towns.length > 0 && (
          <div className="gs2-field gs2-field-town">
            <label className="gs2-label">Town</label>
            <select className="gs2-select" value={town} onChange={e => setTown(e.target.value)}>
              <option value="">All of {county}</option>
              {towns.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        <div className="gs2-field gs2-field-btn">
          <label className="gs2-label">&nbsp;</label>
          <button className="gs2-search-btn" type="button" onClick={() => handleSearch()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>
      </div>

      {/* ── Row 3: Category-specific quick filters (shown when category selected) ── */}
      {quickFilters.length > 0 && (
        <div className="gs2-filters-container" style={{ marginTop: '12px' }}>
          {!showMore ? (
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={() => setShowMore(true)}
              style={{ width: '100%' }}
            >
              + Advanced Filters
            </button>
          ) : (
            <div className="gs2-quick-filters">
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Advanced Filters</span>
                <button
                  type="button"
                  onClick={() => setShowMore(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Close ✕
                </button>
              </div>
              {quickFilters.map(f => (
                <div className="gs2-qf-field" key={f.id}>
                  <label className="gs2-label">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      className="gs2-select gs2-select-sm"
                      value={extraFilters[f.id] || ''}
                      onChange={e => setFilter(f.id, e.target.value)}
                    >
                      <option value="">Any</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="number"
                      className="gs2-select gs2-select-sm"
                      placeholder={f.placeholder}
                      value={extraFilters[f.id] || ''}
                      onChange={e => setFilter(f.id, e.target.value)}
                      min="0"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
