
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { COUNTIES, getTowns } from '@/lib/countyData';





const CATEGORIES = [
  { slug: 'vehicles',             name: 'Vehicles',                     icon: '🚗' },
  { slug: 'property',             name: 'Property',                     icon: '🏠' },
  { slug: 'phones-tablets',       name: 'Phones & Tablets',             icon: '📱' },
  { slug: 'electronics',          name: 'Electronics',                  icon: '💻' },
  { slug: 'home-furniture',       name: 'Home, Furniture & Appliances', icon: '🛋️' },
  { slug: 'fashion',              name: 'Fashion',                      icon: '👗' },
  { slug: 'beauty',               name: 'Beauty & Personal Care',       icon: '✨' },
  { slug: 'services',             name: 'Services',                     icon: '🔧' },
  { slug: 'repair-construction',  name: 'Repair & Construction',        icon: '🔨' },
  { slug: 'commercial-equipment', name: 'Commercial Equipment & Tools', icon: '🚜' },
  { slug: 'leisure',              name: 'Leisure & Activities',         icon: '⚽' },
  { slug: 'babies-kids',          name: 'Babies & Kids',                icon: '👶' },
  { slug: 'food-agriculture',     name: 'Food, Agriculture & Farming',  icon: '🌱' },
  { slug: 'animals-pets',         name: 'Animals & Pets',               icon: '🐶' },
  { slug: 'jobs',                 name: 'Jobs',                         icon: '💼' },
  { slug: 'seeking-work',         name: 'Seeking Work - CVs',           icon: '📄' },
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeKeyword, setActiveKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCounty, setSelectedCounty] = useState('');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  // Sync state when URL search params change (e.g. from Navbar search)
  useEffect(() => {
    const k = searchParams.get('keyword') || '';
    const c = searchParams.get('category') || '';
    const l = searchParams.get('location') || '';
    
    setKeyword(k);
    setActiveKeyword(k);
    setCategory(c);
    setLocation(l);
    if (COUNTIES.includes(l)) setSelectedCounty(l);
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (activeKeyword) params.keyword = activeKeyword;
      if (category) params.category = category;
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

  useEffect(() => { fetchListings(); }, [category, location, sort, page, activeKeyword]);

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
        <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:28,alignItems:'start'}}>
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
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <div className={`filter-chip ${category===''?'active':''}`} onClick={()=>{setCategory('');setPage(1);}}>All Categories</div>
                  {CATEGORIES.map(c=>(
                    <div key={c.slug} className={`filter-chip ${category===c.slug?'active':''}`} onClick={()=>{setCategory(c.slug);setPage(1);}}>
                      {c.icon} {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="filter-section">
                <h4>County</h4>
                <select className="form-control" value={selectedCounty} onChange={e=>{
                  setSelectedCounty(e.target.value);
                  setLocation(e.target.value);
                  setPage(1);
                }}>
                  <option value="">All Counties</option>
                  {COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {selectedCounty && getTowns(selectedCounty).length > 0 && (
                <div className="filter-section">
                  <h4>Town / Area</h4>
                  <select className="form-control" value={location} onChange={e=>{
                    setLocation(e.target.value);
                    setPage(1);
                  }}>
                    <option value={selectedCounty}>All of {selectedCounty}</option>
                    {getTowns(selectedCounty).map(t=><option key={t} value={t}>{t}</option>)}
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
