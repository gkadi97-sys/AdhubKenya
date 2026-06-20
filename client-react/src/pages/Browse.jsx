import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getListings, getCategoryCounts } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { COUNTIES, getTowns, getAreas } from '@/lib/countyData';
import { CATEGORY_ATTRIBUTES, CATEGORY_ICONS } from '@/lib/categoryData';
import { JOB_CATEGORIES } from '@/lib/jobsData';
import { useSEO } from '@/lib/useSEO';

function getCategoryContents(slug) {
  if (slug === 'jobs') return Object.keys(JOB_CATEGORIES || {}).slice(0, 8);
  if (CATEGORY_ATTRIBUTES[slug]?.data) return Object.keys(CATEGORY_ATTRIBUTES[slug].data).slice(0, 8);
  return [];
}

const CATEGORIES = CATEGORY_ICONS;

function BrowseContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [catCounts, setCatCounts] = useState({});

  // ── Single source of truth: read everything from the URL ──────────────────
  const category = searchParams.get('category') || '';
  const make     = searchParams.get('make')     || '';
  const location = searchParams.get('location') || '';
  const keyword  = searchParams.get('keyword')  || '';
  const sort     = searchParams.get('sort')     || 'createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  // Derive location display helpers from URL
  const locationParts = location ? location.split(',').map(s => s.trim()) : [];
  const selectedCounty = locationParts.length >= 1 ? locationParts[locationParts.length - 1] : '';
  const selectedTown   = locationParts.length >= 2 ? locationParts[locationParts.length - 2] : '';

  // SEO
  useSEO({
    title: `${category ? `${category.charAt(0).toUpperCase() + category.slice(1)} | ` : ''}Browse Listings`,
    description: `Browse ${total} ads in Kenya. Find the best deals on cars, property, jobs, and services near you.`
  });

  // Local-only UI state (not filters)
  const [keywordInput, setKeywordInput] = useState(keyword);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Load category counts once on mount
  useEffect(() => {
    getCategoryCounts().then(setCatCounts).catch(() => {});
  }, []);

  // ── Fetch listings whenever the URL changes — reads directly from searchParams ──
  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const params = { page };
        if (keyword)  params.keyword  = keyword;
        if (category) params.category = category;
        if (make)     params.make     = make;
        if (location) params.location = location;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort)     params.sort     = sort;
        const data = await getListings(params);
        setListings(data.listings || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch (e) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [searchParams]); // runs every time the URL changes — no stale state

  // ── Navigation helpers ────────────────────────────────────────────────────
  const applyFilter = useCallback((overrides) => {
    const next = {};
    if (category) next.category = category;
    if (make)     next.make     = make;
    if (location) next.location = location;
    if (keyword)  next.keyword  = keyword;
    if (sort !== 'createdAt') next.sort = sort;
    Object.assign(next, overrides);
    // Remove falsy / page-reset
    Object.keys(next).forEach(k => { if (!next[k] && next[k] !== 0) delete next[k]; });
    navigate(`/browse?${new URLSearchParams(next).toString()}`);
  }, [category, make, location, keyword, sort, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilter({ keyword: keywordInput, page: undefined });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>
            Browse Ads
            {category && ` — ${CATEGORIES.find(c => c.slug === category)?.name || category}`}
            {make     && ` › ${make}`}
          </h1>
          <p style={{color:'var(--text-muted)',marginTop:6}}>{total.toLocaleString()} listings found</p>
        </div>
      </div>

      <div className="container" style={{padding:'32px 20px'}}>
        <div className="browse-layout">
          {/* Filters Sidebar */}
          <aside>
            <div className="filters-wrap">

              {/* Search */}
              <div className="filter-section">
                <h4>Search</h4>
                <form onSubmit={handleSearch} style={{display:'flex',gap:8}}>
                  <input
                    className="form-control"
                    placeholder="Keywords..."
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    style={{flex:1,padding:'10px 12px'}}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Go</button>
                </form>
              </div>

              {/* Category list with flyout */}
              <div className="filter-section">
                <h4>Category</h4>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  {/* All Categories */}
                  <div
                    className={`sidebar-cat-item ${category===''?'active':''}`}
                    onClick={() => navigate('/browse')}
                  >
                    <span className="sidebar-cat-icon">🏷️</span>
                    <span style={{flex:1}}>All Categories</span>
                    <span className="sidebar-cat-count">
                      {Object.values(catCounts).reduce((a,b) => a+b, 0) || ''}
                    </span>
                  </div>

                  {CATEGORIES.map(c => {
                    const subItems = getCategoryContents(c.slug);
                    const count = catCounts[c.slug];
                    return (
                      <div key={c.slug} className="sidebar-cat-wrapper">
                        {/* Category trigger */}
                        <div
                          className={`sidebar-cat-item ${category === c.slug ? 'active' : ''}`}
                          onClick={() => navigate(`/browse?category=${c.slug}`)}
                        >
                          <span className="sidebar-cat-icon">{c.icon}</span>
                          <span style={{flex:1}}>{c.name}</span>
                          <span className="sidebar-cat-count">{count || ''}</span>
                          {subItems.length > 0 && <span style={{fontSize:'0.6rem',color:'var(--text-muted)'}}>›</span>}
                        </div>

                        {/* Flyout popup — shown by pure CSS :hover */}
                        {subItems.length > 0 && (
                          <div className="sidebar-cat-popup">
                            <div className="sidebar-popup-header">
                              <span>{c.icon} {c.name}</span>
                            </div>
                            <div className="sidebar-popup-grid">
                              {subItems.map(item => (
                                <div
                                  key={item}
                                  className="sidebar-popup-cell"
                                  onClick={() => navigate(`/browse?category=${c.slug}&make=${encodeURIComponent(item)}`)}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                            <div
                              className="sidebar-popup-footer"
                              onClick={() => navigate(`/browse?category=${c.slug}`)}
                            >
                              Browse all {c.name} →
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location — County → Town cascading */}
              <div className="filter-section">
                <h4>County</h4>
                <select
                  className="form-control"
                  value={selectedCounty}
                  onChange={e => applyFilter({ location: e.target.value })}
                >
                  <option value="">All Counties</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {selectedCounty && getTowns(selectedCounty).length > 0 && (
                <div className="filter-section" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <h4>Town / City</h4>
                  <select
                    className="form-control"
                    value={selectedTown}
                    onChange={e => {
                      const t = e.target.value;
                      applyFilter({ location: t ? `${t}, ${selectedCounty}` : selectedCounty });
                    }}
                  >
                    <option value="">All of {selectedCounty}</option>
                    {getTowns(selectedCounty).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range (KES)</h4>
                <div className="price-range">
                  <input className="form-control" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{padding:'10px 12px'}}/>
                  <input className="form-control" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{padding:'10px 12px'}}/>
                </div>
                <button onClick={() => applyFilter({})} className="btn btn-primary btn-sm btn-full" style={{marginTop:10}}>Apply</button>
              </div>

            </div>
          </aside>

          {/* Listings panel */}
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{total} results</span>
              <select
                className="form-control"
                style={{width:'auto',padding:'8px 12px'}}
                value={sort}
                onChange={e => applyFilter({ sort: e.target.value })}
              >
                <option value="createdAt">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="listings-grid">
                {[...Array(12)].map((_,i) => (
                  <div key={i} style={{borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--surface)'}}>
                    <div className="skeleton" style={{aspectRatio:'4/3'}}/>
                    <div style={{padding:16}}>
                      <div className="skeleton" style={{height:18,width:'60%',marginBottom:8}}/>
                      <div className="skeleton" style={{height:14,width:'90%',marginBottom:6}}/>
                      <div className="skeleton" style={{height:12,width:'40%'}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="listings-grid">
                  {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
                {pages > 1 && (
                  <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:40}}>
                    {[...Array(pages)].map((_,i) => (
                      <button
                        key={i}
                        onClick={() => applyFilter({ page: i+1 })}
                        className={`btn btn-sm ${page===i+1?'btn-primary':'btn-ghost'}`}
                      >
                        {i+1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No listings found</h3>
                <p>Try adjusting your search or filters</p>
                <button onClick={() => navigate('/browse')} className="btn btn-primary">Clear Filters</button>
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
