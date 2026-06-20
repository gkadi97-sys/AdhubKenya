import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getListings, getCategoryCounts } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import FilterSidebar from '@/components/FilterSidebar';
import { FILTER_CONFIG } from '@/lib/filterConfig';

const CATEGORIES = CATEGORY_ICONS;

function BrowseContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [catCounts, setCatCounts] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── URL as single source of truth ─────────────────────────
  const category = searchParams.get('category') || '';
  const keyword  = searchParams.get('keyword')  || '';
  const sort     = searchParams.get('sort')      || 'createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  // SEO
  const catEntry = CATEGORIES?.find(c => c.slug === category);
  const catLabel = catEntry?.name || (category ? category.replace(/-/g, ' ') : null);
  useSEO({
    title: catLabel ? `${catLabel} for Sale in Kenya | AdHub Kenya` : 'Browse Ads in Kenya | AdHub Kenya',
    description: catLabel
      ? `Browse ${total} ${catLabel} listings across Kenya. Find the best deals from sellers in Nairobi, Mombasa, Nakuru and all 47 counties.`
      : `Browse ${total} classified ads in Kenya. Find cars, property, electronics, jobs, phones and more.`,
    canonicalPath: `/browse${category ? `?category=${category}` : ''}`
  });

  // Count active non-structural filters
  const ignoredKeys = new Set(['category', 'keyword', 'sort', 'page']);
  const activeFilterCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;

  // Category counts for sidebar
  useEffect(() => {
    getCategoryCounts().then(setCatCounts).catch(() => {});
  }, []);

  // Fetch whenever URL changes
  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const params = { page, sort };
        for (const [k, v] of searchParams.entries()) {
          if (v) params[k] = v;
        }
        const data = await getListings(params);
        setListings(data.listings || []);
        setTotal(data.total   || 0);
        setPages(data.pages   || 1);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [searchParams]);

  // ── Navigation helpers ─────────────────────────────────────
  const applyFilter = useCallback((overrides) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) next.set(k, v); else next.delete(k);
    });
    next.delete('page');
    navigate(`/browse?${next.toString()}`);
  }, [searchParams, navigate]);

  const clearAll = () => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    navigate(`/browse?${next.toString()}`);
  };

  // ── Active filter chips ────────────────────────────────────
  const activeChips = [];
  for (const [k, v] of searchParams.entries()) {
    if (ignoredKeys.has(k) || !v) continue;
    activeChips.push({ key: k, value: v });
  }

  return (
    <div>
      {/* ── Page Header ─────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <h1>
                {catLabel ? `${catLabel}` : 'Browse Ads'}
                {keyword && <span style={{ color:'var(--text-muted)', fontWeight:400 }}> — "{keyword}"</span>}
              </h1>
              <p style={{ color:'var(--text-muted)', marginTop:4 }}>
                {total.toLocaleString()} listing{total !== 1 ? 's' : ''} found
              </p>
            </div>
            {/* Mobile filter button */}
            <button
              className="btn btn-outline btn-sm mobile-filter-btn"
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="14" y2="12"/>
                <line x1="4" y1="18" x2="10" y2="18"/>
              </svg>
              Filters
              {activeFilterCount > 0 && <span className="filter-count-badge" style={{ marginLeft:4 }}>{activeFilterCount}</span>}
            </button>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="active-filter-chips">
              {activeChips.map(chip => (
                <span key={chip.key} className="active-chip">
                  <span style={{ textTransform:'capitalize' }}>{chip.key.replace(/_/g,' ')}: </span>
                  {chip.value}
                  <button
                    className="active-chip-remove"
                    onClick={() => applyFilter({ [chip.key]: '' })}
                    aria-label={`Remove ${chip.key} filter`}
                  >✕</button>
                </span>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={clearAll} style={{ fontSize:'0.8rem' }}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:'24px 20px' }}>
        <div className="browse-layout-v2">

          {/* ── Desktop Sidebar ──────────────────────── */}
          <div className="browse-sidebar-col">
            <FilterSidebar />
          </div>

          {/* ── Mobile Drawer ────────────────────────── */}
          {drawerOpen && (
            <>
              <div className="filter-drawer-overlay" onClick={() => setDrawerOpen(false)} />
              <div className="filter-drawer">
                <FilterSidebar onClose={() => setDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── Results column ───────────────────────── */}
          <div className="browse-results-col">

            {/* Sort + count bar */}
            <div className="browse-results-bar">
              <span style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>
                {total.toLocaleString()} result{total !== 1 ? 's' : ''}
              </span>
              <select
                className="form-control"
                style={{ width:'auto', padding:'8px 12px', fontSize:'0.85rem' }}
                value={sort}
                onChange={e => applyFilter({ sort: e.target.value })}
              >
                <option value="createdAt">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>

            {/* Results */}
            {loading ? (
              <div className="listings-grid">
                {[...Array(12)].map((_,i) => (
                  <div key={i} style={{ borderRadius:'var(--radius-lg)', overflow:'hidden', background:'var(--surface)' }}>
                    <div className="skeleton" style={{ aspectRatio:'4/3' }}/>
                    <div style={{ padding:16 }}>
                      <div className="skeleton" style={{ height:18, width:'60%', marginBottom:8 }}/>
                      <div className="skeleton" style={{ height:14, width:'90%', marginBottom:6 }}/>
                      <div className="skeleton" style={{ height:12, width:'40%' }}/>
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
                  <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:40 }}>
                    {page > 1 && (
                      <button className="btn btn-ghost btn-sm" onClick={() => applyFilter({ page: page - 1 })}>← Prev</button>
                    )}
                    {[...Array(Math.min(pages, 7))].map((_,i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => applyFilter({ page: p })}
                          className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-ghost'}`}
                        >{p}</button>
                      );
                    })}
                    {page < pages && (
                      <button className="btn btn-ghost btn-sm" onClick={() => applyFilter({ page: page + 1 })}>Next →</button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* ── Improved Empty State ── */
              <div className="empty-state-recovery">
                <div className="esr-icon">🔍</div>
                <h3>No exact matches found</h3>
                <p>Try widening your search with these suggestions:</p>
                <div className="esr-suggestions">
                  {activeChips.map(chip => (
                    <button key={chip.key} className="esr-suggestion-btn" onClick={() => applyFilter({ [chip.key]: '' })}>
                      ✓ Remove "{chip.value}" filter
                    </button>
                  ))}
                  {searchParams.get('minPrice') || searchParams.get('maxPrice') ? (
                    <button className="esr-suggestion-btn" onClick={() => {
                      applyFilter({ minPrice: '', maxPrice: '' });
                    }}>
                      ✓ Expand price range
                    </button>
                  ) : null}
                  {searchParams.get('county') && (
                    <button className="esr-suggestion-btn" onClick={() => applyFilter({ county: '', location: '' })}>
                      ✓ Search all of Kenya
                    </button>
                  )}
                </div>
                <div style={{ marginTop:24, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  <button className="btn btn-primary" onClick={clearAll}>Clear All Filters</button>
                  <Link to="/post-ad" className="btn btn-ghost">Post an Ad</Link>
                </div>

                {/* Similar category suggestions */}
                {category && (
                  <div style={{ marginTop:32 }}>
                    <p style={{ color:'var(--text-muted)', marginBottom:12, fontSize:'0.9rem' }}>Browse similar categories:</p>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                      {CATEGORIES.filter(c => c.slug !== category).slice(0, 5).map(c => (
                        <Link key={c.slug} to={`/browse?category=${c.slug}`} className="btn btn-outline btn-sm">
                          {c.icon} {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
