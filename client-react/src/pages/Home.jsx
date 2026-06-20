import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import GuidedSearch from '@/components/GuidedSearch';
import { POPULAR_SEARCHES } from '@/lib/filterConfig';

// Recently Viewed helpers
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem('adhub_recently_viewed') || '[]'); }
  catch { return []; }
}

export default function HomePage() {
  const [listings, setListings]         = useState([]);
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

  return (
    <>
      {/* ── HERO (COMPRESSED) ─────────────────────────────────────────── */}
      <section className="hero-compressed">
        <div className="container">
          <div className="hero-content-compressed">
            <h1 className="hero-title-compressed">
              Buy &amp; Sell Anything <span className="text-gradient">in Kenya</span>
            </h1>

            {/* ── Guided Search ── */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <GuidedSearch compact={true} />
              
              {/* Trust Signals */}
              <div className="trust-signals">
                <span>✓ 12,000+ Active Listings</span>
                <span>✓ Verified Sellers</span>
                <span>✓ Free Posting</span>
                <span>✓ Kenya Wide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING CHIPS ───────────────────────────────── */}
      <section style={{ padding: '0 0 24px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
           <div className="trending-chips-wrap">
              <span className="trending-label">🔥 Trending Searches:</span>
              <div className="trending-chips-scroll">
                {POPULAR_SEARCHES.map(s => (
                  <button
                    key={s}
                    className="trending-action-chip"
                    onClick={() => navigate(`/browse?keyword=${encodeURIComponent(s)}`)}
                  >
                    {s}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── CATEGORY QUICK-ACCESS (SCROLLABLE ROW) ───────────────────────── */}
      <section style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '16px 20px', maxWidth: '1440px' }}>
          <div className="cat-scroll-row">
            {TOP_CATEGORIES.map(cat => (
              <div
                key={cat.slug}
                className="cat-scroll-item"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
              >
                <span className="cat-scroll-icon">{cat.icon}</span>
                <span className="cat-scroll-name">{cat.name}</span>
              </div>
            ))}
            <Link to="/browse" className="cat-scroll-item cat-scroll-more">
              <span className="cat-scroll-icon">→</span>
              <span className="cat-scroll-name">More</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED (Placeholder for returning users) ──────────────── */}
      <section className="section" style={{ paddingTop: '32px', paddingBottom: '0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Continue Browsing</h2>
            <Link to="/saved" className="btn btn-ghost btn-sm">View Saved</Link>
          </div>
          {/* Mocked recently viewed for now to show density */}
          {loading ? (
             <div className="listings-grid">
               {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height: 280 }}/>)}
             </div>
          ) : listings.length >= 4 ? (
             <div className="listings-grid">
               {listings.slice(4, 8).map(l => <ListingCard key={l.id} listing={l} />)}
             </div>
          ) : null}
        </div>
      </section>

      {/* ── NEW TODAY (4x2 GRID) ────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>New Today</h2>
            <Link to="/browse" className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }}>See all →</Link>
          </div>

          {loading ? (
            <div className="listings-grid">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="listing-card">
                  <div className="skeleton" style={{ aspectRatio: '4/4.8' }}/>
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }}/>
                    <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {/* Show 8 items (4 columns x 2 rows) */}
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="icon">🏪</div>
              <h3 style={{ fontSize: '1.2rem' }}>No listings yet</h3>
              <p>Be the first to post an ad on AdHub Kenya!</p>
              <Link to="/post-ad" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Post Free Ad</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
