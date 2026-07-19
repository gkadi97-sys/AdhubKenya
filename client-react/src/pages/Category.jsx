import { useState, useEffect, useMemo } from 'react';
import { getListings } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ListingCard from '@/components/ListingCard.jsx';
import { Link, useSearchParams } from 'react-router-dom';
import CategorySidebar from '@/components/CategorySidebar.jsx';
import CategoryBreadcrumbs from '@/components/CategoryBreadcrumbs.jsx';
import FilterPanel from '@/components/filters/FilterPanel.jsx';
import { CATEGORY_ICONS } from '@/lib/categoryData';

const getIcon = (slug, dbIcon) => {
  if (dbIcon) return dbIcon;
  const match = CATEGORY_ICONS.find(c => c.slug === slug);
  return match ? match.icon : '🏷️';
};

export default function CategoryPage({ context }) {
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  const { current, ancestors, children } = context;

  const [searchParams] = useSearchParams();

  const filters = useMemo(() => {
    // Build a complete set of slugs to match:
    // - current page slug (e.g. "cars")
    // - all ancestor slugs (e.g. "vehicles") — because sellers pick top-level only
    // - all direct children slugs (e.g. "sedan", "suv") — to catch more specific listings
    const categorySlugs = [
      ...(ancestors || []).map(a => a.slug),
      current.slug,
      ...(children || []).map(c => c.slug),
    ];
    // Deduplicate
    const uniqueSlugs = [...new Set(categorySlugs)];

    const obj = { category: uniqueSlugs.join(','), sort, page };
    for (const [k, v] of searchParams.entries()) {
      if (k === 'category') continue;
      obj[k] = v;
    }
    return obj;
  }, [current.slug, ancestors, children, sort, page, searchParams]);

  const { data, isLoading: loading, isError } = useQuery({
    queryKey: ['category-listings', filters],
    queryFn: () => getListings(filters),
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
  const icon = getIcon(current.slug, current.icon);

  return (
    <div>
      {/* Category Header */}
      <div style={{background:'linear-gradient(135deg, var(--bg-2), var(--bg-3))',borderBottom:'1px solid var(--border)',padding:'30px 0'}}>
        <div className="container">
          <CategoryBreadcrumbs ancestors={ancestors} current={current} />
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{fontSize:'3rem'}}>{icon}</span>
            <div>
              <h1 style={{fontSize:'2rem',marginBottom:4}}>{current.name}</h1>
              <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>
                {current.description || `Browse ${current.name} listings`} — <strong style={{color:'var(--primary-light)'}}>{total.toLocaleString()} ads</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="container flex flex-col lg:flex-row gap-6" style={{padding:'32px 20px 80px'}}>
        
        {/* Unified sticky wrapper for Sidebar and FilterPanel */}
        <aside className="w-full lg:w-[260px] shrink-0">
          <div className="sticky top-4 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin rounded-2xl border border-border bg-card">
            {/* Category Navigation Sidebar */}
            <CategorySidebar context={context} />
            
            {/* Filter Panel (Desktop) */}
            <div className="hidden lg:block border-t border-border">
              <FilterPanel categorySlug={[...(ancestors || []).map(a => a.slug), current.slug].join('/')} />
            </div>
          </div>
        </aside>
        
        <main className="flex-1 min-w-0">
          {/* Sort bar */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
            <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{total} listings</span>
            <select className="form-control" style={{width:'auto',padding:'8px 12px'}} value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}>
              <option value="createdAt">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
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
              <div className="icon">{icon}</div>
              <h3>No {current.name} listings yet</h3>
              <p>Be the first to post in this category!</p>
              <Link to="/post-ad" className="btn btn-primary">Post Free Ad</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
