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

      {/* ── CATEGORY TILES (IMMEDIATELY UNDER SEARCH) ───────────────────────────────── */}
      <section className="category-tiles-section">
        <div className="container">
          <div className="category-tiles-grid">
            {TOP_CATEGORIES.map(cat => (
              <div
                key={cat.slug}
                className="category-tile-large"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
              >
                <div className="cat-tile-icon">{cat.icon}</div>
                <div className="cat-tile-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST LISTINGS (ABOVE THE FOLD) ──────────────────────────────── */}
      <section className="section" style={{ paddingTop: '24px', paddingBottom: '64px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>New Today</h2>
            <Link to="/browse" className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }}>See all →</Link>
          </div>

          {loading ? (
            <div className="listings-grid">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="listing-card">
                  <div className="skeleton" style={{ aspectRatio: '4/3' }}/>
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }}/>
                    <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }}/>
                    <div className="skeleton" style={{ height: 12, width: '40%' }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
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
