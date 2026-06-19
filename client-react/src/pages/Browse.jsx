
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getListings, getCategoryCounts } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { COUNTIES, getTowns, getAreas } from '@/lib/countyData';
import { CATEGORY_ATTRIBUTES, CATEGORY_ICONS } from '@/lib/categoryData';
import { JOB_CATEGORIES } from '@/lib/jobsData';

function getCategoryContents(slug) {
  if (slug === 'jobs') return Object.keys(JOB_CATEGORIES || {}).slice(0, 8);
  if (CATEGORY_ATTRIBUTES[slug]?.data) return Object.keys(CATEGORY_ATTRIBUTES[slug].data).slice(0, 8);
  return [];
}





// Use the single source of truth from categoryData.js
const CATEGORIES = CATEGORY_ICONS;

function BrowseContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeKeyword, setActiveKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [hoveredCat, setHoveredCat] = useState(null);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [catCounts, setCatCounts] = useState({});

  // Load category counts once on mount
  useEffect(() => { getCategoryCounts().then(setCatCounts).catch(() => {}); }, []);

  // Sync state when URL search params change (e.g. from Navbar search)
  useEffect(() => {
    const k = searchParams.get('keyword') || '';
    const c = searchParams.get('category') || '';
    const l = searchParams.get('location') || '';
    const m = searchParams.get('make') || '';

    setKeyword(k);
    setActiveKeyword(k);
    setCategory(c);
    setMake(m);
    setLocation(l);
    if (l) {
      const parts = l.split(',').map(s => s.trim());
      if (parts.length === 3) {
        setSelectedCounty(parts[2]); setSelectedTown(parts[1]); setSelectedArea(parts[0]);
      } else if (parts.length === 2) {
        setSelectedCounty(parts[1]); setSelectedTown(parts[0]); setSelectedArea('');
      } else if (COUNTIES.includes(parts[0])) {
        setSelectedCounty(parts[0]); setSelectedTown(''); setSelectedArea('');
      }
    }
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (activeKeyword) params.keyword = activeKeyword;
      if (category) params.category = category;
      if (make)     params.make = make;
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;
      const data = await getListings(params);
      setListings(data.listings || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      setListings([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, [category, make, location, sort, page, activeKeyword]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setActiveKeyword(keyword); };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Browse Ads {category && `— ${CATEGORIES.find(c=>c.slug===category)?.name}`}</h1>
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
                  <input className="form-control" placeholder="Keywords..." value={keyword} onChange={e=>setKeyword(e.target.value)} style={{flex:1,padding:'10px 12px'}}/>
                  <button type="submit" className="btn btn-primary btn-sm">Go</button>
                </form>
              </div>

              {/* Category */}
              <div className="filter-section">
                <h4>Category</h4>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  <div
                    className={`sidebar-cat-item ${category===''?'active':''}`}
                    onClick={()=>{setCategory('');setPage(1);}}
                  >
                    <span className="sidebar-cat-icon">🏷️</span>
                    <span style={{flex:1}}>All Categories</span>
                    <span className="sidebar-cat-count">
                      {Object.values(catCounts).reduce((a,b)=>a+b,0) || ''}
                    </span>
                  </div>
                  {CATEGORIES.map(c => {
                    const subItems = getCategoryContents(c.slug);
                    const count = catCounts[c.slug];
                    return (
                      // Outer wrapper holds BOTH trigger + popup — hover never leaves
                      <div
                        key={c.slug}
                        style={{ position: 'relative' }}
                        onMouseEnter={() => subItems.length > 0 && setHoveredCat(c.slug)}
                        onMouseLeave={() => setHoveredCat(null)}
                      >
                        {/* Trigger row */}
                        <div
                          className={`sidebar-cat-item ${category === c.slug ? 'active' : ''}`}
                          onClick={() => { setCategory(c.slug); setMake(''); setPage(1); }}
                        >
                          <span className="sidebar-cat-icon">{c.icon}</span>
                          <span style={{flex:1}}>{c.name}</span>
                          <span className="sidebar-cat-count">{count || ''}</span>
                          {subItems.length > 0 && <span style={{fontSize:'0.6rem',color:'var(--text-muted)'}}>›</span>}
                        </div>

                        {/* Popup — inline below trigger, zero gap */}
                        {subItems.length > 0 && hoveredCat === c.slug && (
                          <div className="sidebar-cat-popup" onClick={e => e.stopPropagation()}>
                            <div className="sidebar-popup-header">
                              <span>{c.icon} {c.name}</span>
                            </div>
                            <div className="sidebar-popup-grid">
                              {subItems.map(item => (
                                <div
                                  key={item}
                                  className="sidebar-popup-cell"
                                  onClick={() => {
                                    setCategory(c.slug);
                                    setMake(item);   // ← sets the make filter
                                    setPage(1);
                                    setHoveredCat(null);
                                  }}
                                >{item}</div>
                              ))}
                            </div>
                            <div
                              className="sidebar-popup-footer"
                              onClick={() => { setCategory(c.slug); setMake(''); setPage(1); setHoveredCat(null); }}
                            >Browse all {c.name} →</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location — County → Town → Area cascading */}
              <div className="filter-section">
                <h4>County</h4>
                <select className="form-control" value={selectedCounty} onChange={e => {
                  const c = e.target.value;
                  setSelectedCounty(c);
                  setSelectedTown('');
                  setSelectedArea('');
                  setLocation(c);
                  setPage(1);
                }}>
                  <option value="">All Counties</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {selectedCounty && getTowns(selectedCounty).length > 0 && (
                <div className="filter-section" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <h4>Town / City</h4>
                  <select className="form-control" value={selectedTown} onChange={e => {
                    const t = e.target.value;
                    setSelectedTown(t);
                    setSelectedArea('');
                    setLocation(t ? `${t}, ${selectedCounty}` : selectedCounty);
                    setPage(1);
                  }}>
                    <option value="">All of {selectedCounty}</option>
                    {getTowns(selectedCounty).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              {selectedTown && getAreas(selectedCounty, selectedTown).length > 0 && (
                <div className="filter-section" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <h4>Area / Estate</h4>
                  <select className="form-control" value={selectedArea} onChange={e => {
                    const a = e.target.value;
                    setSelectedArea(a);
                    setLocation(a ? `${a}, ${selectedTown}, ${selectedCounty}` : `${selectedTown}, ${selectedCounty}`);
                    setPage(1);
                  }}>
                    <option value="">All of {selectedTown}</option>
                    {getAreas(selectedCounty, selectedTown).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range (KES)</h4>
                <div className="price-range">
                  <input className="form-control" type="number" placeholder="Min" value={minPrice} onChange={e=>setMinPrice(e.target.value)} style={{padding:'10px 12px'}}/>
                  <input className="form-control" type="number" placeholder="Max" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} style={{padding:'10px 12px'}}/>
                </div>
                <button onClick={()=>{setPage(1);fetchListings();}} className="btn btn-primary btn-sm btn-full" style={{marginTop:10}}>Apply</button>
              </div>
            </div>
          </aside>

          {/* Listings */}
          <div>
            {/* Sort bar */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{total} results</span>
              <select className="form-control" style={{width:'auto',padding:'8px 12px'}} value={sort} onChange={e=>setSort(e.target.value)}>
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
                {/* Pagination */}
                {pages > 1 && (
                  <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:40}}>
                    {[...Array(pages)].map((_,i) => (
                      <button key={i} onClick={()=>setPage(i+1)}
                        className={`btn btn-sm ${page===i+1?'btn-primary':'btn-ghost'}`}>
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
                <button onClick={()=>{setKeyword('');setCategory('');setLocation('');setMinPrice('');setMaxPrice('');setPage(1);fetchListings();}} className="btn btn-primary">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return <Suspense fallback={<div style={{textAlign:'center',padding:80,color:'var(--text-muted)'}}>Loading...</div>}><BrowseContent/></Suspense>;
}
