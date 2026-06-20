import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import GuidedSearch from '@/components/GuidedSearch';
import { POPULAR_SEARCHES } from '@/lib/filterConfig';

// Mock inventory counts for visual density
const MOCK_COUNTS = {
  Vehicles: '4,321',
  Property: '1,874',
  Electronics: '829',
  Fashion: '1,204',
  Furniture: '532',
  Jobs: '312'
};

const LOCATIONS = {
  'Major Cities': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  'Popular Towns': ['Kitengela', 'Rongai', 'Westlands', 'Embakasi', 'Thika', 'Ruaka']
};

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useSEO({
    title: 'AdHub Kenya – Buy & Sell Anything in Kenya',
    description: "AdHub Kenya is Kenya's free classifieds marketplace. Buy and sell cars, property, electronics, phones, fashion, and jobs across all 47 counties.",
    canonicalPath: '/'
  });

  // Fetch and duplicate listings to simulate deep inventory
  useEffect(() => {
    getListings({ limit: 12, sort: 'createdAt' })
      .then(res => {
        const fetched = res.listings || [];
        // Duplicate data to mock 20-40 listings if needed
        let expanded = [...fetched];
        if (fetched.length > 0 && fetched.length < 24) {
          while(expanded.length < 24) {
            expanded = [...expanded, ...fetched.map(f => ({...f, id: f.id + Math.random().toString()}))];
          }
        }
        setListings(expanded);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── STICKY HERO & SEARCH ─────────────────────────────────────────── */}
      <section className="hero-sticky">
        <div className="container">
          <div className="hero-content-compressed" style={{ textAlign: 'center' }}>
            <h1 className="hero-title-compressed" style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
              Buy &amp; Sell Anything <span className="text-gradient">in Kenya</span>
            </h1>

            {/* ── Guided Search ── */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <GuidedSearch compact={true} />
              
              {/* Trust Signals */}
              <div className="trust-signals" style={{ marginTop: '12px' }}>
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
      <section style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
           <div className="trending-chips-wrap">
              <span className="trending-label">🔥 Trending:</span>
              <div className="trending-chips-scroll">
                {POPULAR_SEARCHES.map((s, i) => (
                  <button
                    key={s}
                    className="trending-action-chip"
                    onClick={() => navigate(`/browse?keyword=${encodeURIComponent(s)}`)}
                  >
                    {s} <span style={{ opacity: 0.5, fontSize: '0.75rem', marginLeft: '4px' }}>({Math.floor(Math.random() * 300) + 50})</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── CATEGORY QUICK-ACCESS (SCROLLABLE ROW) ───────────────────────── */}
      <section style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '24px 20px', maxWidth: '1440px' }}>
          <div className="cat-scroll-row">
            {TOP_CATEGORIES.map(cat => (
              <div
                key={cat.slug}
                className="cat-scroll-item"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
              >
                <span className="cat-scroll-icon">{cat.icon}</span>
                <span className="cat-scroll-name">{cat.name}</span>
                <span className="cat-scroll-count">{MOCK_COUNTS[cat.name] || '400+'}</span>
              </div>
            ))}
            <Link to="/browse" className="cat-scroll-item cat-scroll-more">
              <span className="cat-scroll-icon" style={{ marginTop: '8px' }}>→</span>
              <span className="cat-scroll-name">All Categories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEEP INVENTORY FEEDS ────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="container" style={{ maxWidth: '1440px' }}>
          
          {/* CATEGORY TABS */}
          <div className="cat-tabs">
            {['All', 'Vehicles', 'Property', 'Electronics', 'Fashion', 'Jobs'].map(tab => (
              <button
                key={tab}
                className={`cat-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* NEW TODAY */}
          <div className="feed-section" style={{ marginBottom: '48px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>🔥 New Today</h2>
              <Link to="/browse" className="btn btn-ghost btn-sm">See all new →</Link>
            </div>
            {loading ? (
              <div className="listings-grid">
                {[...Array(8)].map((_,i) => (
                  <div key={i} className="listing-card">
                    <div className="skeleton" style={{ aspectRatio: '4/4.8' }}/>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="listings-grid">
                {listings.slice(0, 8).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            ) : null}
          </div>

          {/* TRENDING LISTINGS */}
          <div className="feed-section" style={{ marginBottom: '48px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>⭐ Trending Listings</h2>
            </div>
            {loading ? null : (
              <div className="listings-grid">
                {listings.slice(8, 16).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>

          {/* NEAR YOU */}
          <div className="feed-section" style={{ marginBottom: '48px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>📍 Near You</h2>
              <Link to="/browse?location=Nairobi" className="btn btn-ghost btn-sm">Update location →</Link>
            </div>
            {loading ? null : (
              <div className="listings-grid">
                {listings.slice(16, 24).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>

          {/* CONTINUE BROWSING (Moved down) */}
          <div className="feed-section" style={{ padding: '32px', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', marginBottom: '48px' }}>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Continue Browsing</h2>
              <Link to="/saved" className="btn btn-outline btn-sm">View Saved</Link>
            </div>
            {loading ? null : (
              <div className="listings-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {listings.slice(0, 4).map(l => <ListingCard key={l.id + 'cont'} listing={l} />)}
              </div>
            )}
          </div>

          {/* BROWSE BY LOCATION */}
          <div className="feed-section" style={{ marginBottom: '24px' }}>
             <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Browse Near You</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                {Object.entries(LOCATIONS).map(([group, towns]) => (
                  <div key={group}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{group}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {towns.map(t => (
                        <li key={t}>
                          <Link to={`/browse?location=${t}`} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, transition: 'var(--transition)' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text)'}>
                            {t} <span style={{ opacity: 0.4, fontSize: '0.8rem', marginLeft: '4px' }}>({Math.floor(Math.random() * 500) + 10})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </section>
    </>
  );
}
