import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { useSEO } from '@/lib/useSEO';
import GuidedSearch from '@/components/GuidedSearch';
import { POPULAR_SEARCHES } from '@/lib/filterConfig';



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

  // Fetch latest listings
  useEffect(() => {
    getListings({ limit: 40, sort: 'createdAt' })
      .then(res => setListings(res.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const totalAds = listings.length;
  const showDeepSections = totalAds >= 12;

  return (
    <>
      {/* ── STICKY HERO & SEARCH ─────────────────────────────────────────── */}
      <section className="hero-sticky">
        <div className="container">
          <div className="hero-content-compressed" style={{ textAlign: 'center' }}>
            <h1 className="hero-title-compressed" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
              Kenya's Trusted <span className="text-gradient">Marketplace</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Buy, Sell &amp; Discover Deals Near You
            </p>

            {/* ── Guided Search ── */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <GuidedSearch compact={true} />
              
              {/* Popular Searches */}
              <div className="trending-chips-wrap" style={{ justifyContent: 'center', marginTop: '12px' }}>
                <span className="trending-label" style={{ fontSize: '0.85rem' }}>Popular:</span>
                <div className="trending-chips-scroll" style={{ paddingBottom: '4px' }}>
                  {POPULAR_SEARCHES.slice(0, 5).map((s, i) => (
                    <button
                      key={s}
                      className="trending-action-chip"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => navigate(`/browse?keyword=${encodeURIComponent(s)}`)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="trust-signals" style={{ marginTop: '10px', gap: '16px' }}>
                <span>✓ 12,000+ Active Listings</span>
                <span>✓ Verified Sellers</span>
                <span>✓ Free Posting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED ADS (ABOVE THE FOLD) ───────────────────────────────── */}
      {showDeepSections && (
        <section style={{ padding: '24px 0 16px', background: 'var(--bg-1)' }}>
          <div className="container" style={{ maxWidth: '1440px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>🔥 Featured Ads</h2>
            </div>
            <div className="listings-grid">
              {listings.slice(0, 4).map(l => <ListingCard key={l.id + 'feat'} listing={l} featured={true} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── NEAR YOU SECTION ── */}
      {showDeepSections && (
        <section style={{ padding: '0 0 24px', background: 'var(--bg-1)' }}>
          <div className="container" style={{ maxWidth: '1440px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>📍 Near You</h2>
            </div>
            <div className="listings-grid">
              {listings.slice(4, 8).map(l => <ListingCard key={l.id + 'near'} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── MARKETPLACE ACTIVITY STRIP ── */}
      <section style={{ background: 'var(--primary)', color: '#fff', padding: '16px 0', borderTop: '1px solid var(--primary-dark)', borderBottom: '1px solid var(--primary-dark)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center' }}>
            <span>🔥 236 New Ads Today</span>
            <span>🟢 42 Ads Posted This Hour</span>
            <span>⭐ 1,200 Listings Added This Week</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (FEATURED & SECONDARY) ───────────────────────── */}
      <section style={{ padding: '32px 0 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1440px' }}>
          
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', padding: '0 20px' }}>Featured Categories</h2>
          <div className="featured-categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '0 20px', marginBottom: '24px' }}>
            {TOP_CATEGORIES.filter(c => ['vehicles', 'property', 'phones-tablets', 'jobs'].includes(c.slug)).map(cat => (
              <div
                key={cat.slug}
                className="cat-card-large"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{cat.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>({cat.count ? cat.count.toLocaleString() : '1,000+'})</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '12px', padding: '0 20px' }}>Explore More</h3>
          <div className="cat-scroll-row" style={{ padding: '0 20px' }}>
            {TOP_CATEGORIES.filter(c => !['vehicles', 'property', 'phones-tablets', 'jobs'].includes(c.slug)).map(cat => (
              <div
                key={cat.slug}
                className="cat-scroll-item"
                onClick={() => navigate(`/browse?category=${cat.slug}`)}
              >
                <span className="cat-scroll-icon">{cat.icon}</span>
                <span className="cat-scroll-name">{cat.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({cat.count || '500+'})</span>
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
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="icon">🏪</div>
                <h3 style={{ fontSize: '1.2rem' }}>No listings yet</h3>
                <p>Be the first to post an ad on AdHub Kenya!</p>
                <Link to="/post-ad" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Post Free Ad</Link>
              </div>
            )}
          </div>

          {/* TRENDING LISTINGS - Hidden if inventory low */}
          {showDeepSections && (
            <div className="feed-section" style={{ marginBottom: '48px' }}>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem' }}>⭐ Trending Listings</h2>
              </div>
              <div className="listings-grid">
                {listings.slice(8, 16).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}

          {/* NEAR YOU - Hidden if inventory low */}
          {showDeepSections && (
            <div className="feed-section" style={{ marginBottom: '48px' }}>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem' }}>📍 Near You</h2>
                <Link to="/browse?location=Nairobi" className="btn btn-ghost btn-sm">Update location →</Link>
              </div>
              <div className="listings-grid">
                {listings.slice(16, 24).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}

          {/* CONTINUE BROWSING - Hidden if inventory low */}
          {showDeepSections && (
            <div className="feed-section" style={{ padding: '32px', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', marginBottom: '48px' }}>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>Continue Browsing</h2>
                <Link to="/saved" className="btn btn-outline btn-sm">View Saved</Link>
              </div>
              <div className="listings-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {listings.slice(0, 4).map(l => <ListingCard key={l.id + 'cont'} listing={l} />)}
              </div>
            </div>
          )}

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
                            {t}
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
