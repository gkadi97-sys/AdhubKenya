import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedListings, getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import GuidedSearch from '@/components/GuidedSearch';
import QuickChips from '@/components/QuickChips';
import { POPULAR_SEARCHES } from '@/lib/filterConfig';

// Recently Viewed helpers
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem('adhub_recently_viewed') || '[]'); }
  catch { return []; }
}

export default function HomePage() {
  const [listings, setListings]         = useState([]);
  const [recentListings, setRecent]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  useSEO({
    title: 'AdHub Kenya – Buy & Sell Anything in Kenya',
    description: "AdHub Kenya is Kenya's free classifieds marketplace. Buy and sell cars, property, electronics, phones, fashion, and jobs across all 47 counties.",
    canonicalPath: '/'
  });

  // Latest listings
  useEffect(() => {
    getListings({ limit: 8, sort: 'createdAt' })
      .then(res => setListings(res.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  // Recently viewed (from localStorage IDs → fetch)
  useEffect(() => {
    const ids = getRecentlyViewed();
    if (!ids.length) return;
    // Fetch only the most recent 4
    Promise.all(
      ids.slice(0, 4).map(id =>
        fetch(`/listing/${id}`).catch(() => null)
      )
    );
    // We don't do full fetch here; IDs are shown as chips
  }, []);

  const recentIds = getRecentlyViewed().slice(0, 6);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'var(--primary-glow)', border:'1px solid var(--primary)',
              borderRadius:'var(--radius-full)', padding:'6px 16px',
              fontSize:'0.8rem', color:'var(--primary-light)', marginBottom:16, fontWeight:600
            }}>
              🇰🇪 Kenya's #1 Classified Ads Platform
            </div>
            <h1>
              Buy &amp; Sell Anything<br/>
              <span className="text-gradient">In Kenya</span>
            </h1>
            <p>Join thousands of Kenyans buying and selling electronics, vehicles, property, and more — completely free.</p>

            {/* ── Guided Search ── */}
            <GuidedSearch />
          </div>
        </div>
      </section>

      {/* ── QUICK CHIPS ──────────────────────────────────── */}
      <section style={{ background:'var(--bg-2)', borderBottom:'1px solid var(--border)', padding:'0' }}>
        <div className="container">
          <QuickChips />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section style={{ background:'var(--bg-2)', borderBottom:'1px solid var(--border)', padding:'20px 0' }}>
        <div className="container">
          <div className="stats-grid">
            {[['Growing','Community'],['New','Listings Daily'],['47','Counties Covered'],['100%','Free to Post']].map(([val,lbl]) => (
              <div key={lbl} style={{ textAlign:'center', padding:'8px 4px' }}>
                <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-display)', color:'var(--primary-light)' }}>{val}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2, lineHeight:'1.2' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SEARCHES ─────────────────────────────── */}
      <section style={{ background:'var(--bg-2)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-muted)', whiteSpace:'nowrap' }}>
              🔥 Trending:
            </span>
            {POPULAR_SEARCHES.map(s => (
              <button
                key={s}
                className="popular-search-chip"
                onClick={() => navigate(`/browse?keyword=${encodeURIComponent(s)}`)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ONBOARDING CARDS ─────────────────────────────── */}
      <section style={{ background:'var(--bg-2)', borderBottom:'1px solid var(--border)', paddingBottom:20 }}>
        <div className="container">
          <div className="onboard-cards">
            <Link to="/browse" className="onboard-card">
              <span className="onboard-icon">🛍️</span>
              <div>
                <div className="onboard-title">How to buy</div>
                <div className="onboard-sub">Browse thousands of ads near you</div>
              </div>
              <span className="onboard-arrow">›</span>
            </Link>
            <Link to="/post-ad" className="onboard-card">
              <span className="onboard-icon">💰</span>
              <div>
                <div className="onboard-title">How to sell</div>
                <div className="onboard-sub">Post your free ad in 2 minutes</div>
              </div>
              <span className="onboard-arrow">›</span>
            </Link>
            <Link to="/browse?category=jobs" className="onboard-card">
              <span className="onboard-icon">💼</span>
              <div>
                <div className="onboard-title">Find a job</div>
                <div className="onboard-sub">Jobs across all 47 counties</div>
              </div>
              <span className="onboard-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ───────────────────────────────── */}
      <section className="cat-strip-section">
        <div className="container">
          <div className="cat-strip-header">
            <span className="cat-strip-title">Browse by Category</span>
            <Link to="/browse" className="cat-strip-viewall">View all →</Link>
          </div>
          <div className="cat-strip">
            {TOP_CATEGORIES.map(cat => (
              <div
                key={cat.slug}
                className="cat-pill"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
              >
                <span className="cat-pill-icon">{cat.icon}</span>
                <span className="cat-pill-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST LISTINGS ──────────────────────────────── */}
      <section className="section" style={{ paddingTop:32 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize:'1.5rem' }}>Latest Listings</h2>
              <p style={{ color:'var(--text-secondary)', marginTop:4, fontSize:'0.9rem' }}>Fresh ads posted by sellers near you</p>
            </div>
            <Link to="/browse" className="btn btn-ghost btn-sm" style={{ whiteSpace:'nowrap' }}>See all →</Link>
          </div>

          {loading ? (
            <div className="listings-grid">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="listing-card">
                  <div className="skeleton" style={{ aspectRatio:'4/3' }}/>
                  <div className="card-body">
                    <div className="skeleton" style={{ height:20, width:'60%', marginBottom:8 }}/>
                    <div className="skeleton" style={{ height:14, width:'90%', marginBottom:6 }}/>
                    <div className="skeleton" style={{ height:12, width:'40%' }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🏪</div>
              <h3>No listings yet</h3>
              <p>Be the first to post an ad on AdHub Kenya!</p>
              <Link to="/post-ad" className="btn btn-primary">Post Free Ad</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section style={{
        background:'linear-gradient(135deg, var(--bg-3), #0d2215)',
        borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'64px 0'
      }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2 style={{ fontSize:'2rem', marginBottom:12 }}>Ready to Sell Something?</h2>
          <p style={{ color:'var(--text-secondary)', maxWidth:480, margin:'0 auto 28px' }}>
            Posting your first ad is completely free. Reach thousands of buyers across Kenya in minutes.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/post-ad" className="btn btn-accent btn-lg">Post Free Ad Now</Link>
            <Link to="/browse" className="btn btn-outline btn-lg">Browse Listings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
