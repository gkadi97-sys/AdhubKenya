import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { imageUrl, formatPrice, timeAgo } from '@/lib/api';

function getSaved() {
  try { return JSON.parse(localStorage.getItem('adhub_saved') || '[]'); }
  catch { return []; }
}
function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
  localStorage.setItem('adhub_saved', JSON.stringify(next));
  return next.includes(id);
}

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(getSaved().includes(listing.id)); }, [listing.id]);

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'save') {
      const isNowSaved = toggleSaved(listing.id);
      setSaved(isNowSaved);
    } else if (action === 'share') {
      if (navigator.share) {
        navigator.share({ title: listing.title, url: `${window.location.origin}/listing/${listing.id}` }).catch(()=>{});
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/listing/${listing.id}`);
        alert('Link copied!');
      }
    } else if (action === 'compare') {
      alert('Added to comparison (coming soon!)');
    }
  };

  const isVerified = listing.seller &&
    listing.seller.created_at &&
    (new Date() - new Date(listing.seller.created_at)) / (1000 * 60 * 60 * 24) > 30;

  return (
    <Link to={`/listing/${listing.id}`} className="listing-card fade-in">
      <div className="image-wrap">
        <img
          src={listing.images?.[0]
            ? imageUrl(listing.images[0])
            : `https://placehold.co/400x500/1a2b1e/00d168?text=${encodeURIComponent(listing.category || 'Ad')}`}
          alt={listing.title}
          loading="lazy"
          onError={e => { e.target.src = `https://placehold.co/400x500/1a2b1e/00d168?text=AdHub`; }}
        />
        
        {/* Status Badges */}
        <div className="card-badges">
          {/* Mock urgency badges based on ID for visual variety */}
          {listing.id.endsWith('1') || listing.id.endsWith('5') ? (
            <span className="badge" style={{ background: '#ff3366', color: '#fff', borderColor: '#ff3366' }}>🔥 HOT</span>
          ) : listing.id.endsWith('2') || listing.id.endsWith('7') ? (
            <span className="badge" style={{ background: '#ffcc00', color: '#000', borderColor: '#ffcc00' }}>⭐ FEATURED</span>
          ) : null}

          {listing.condition === 'New' || listing.condition === 'Brand New' ? (
            <span className="badge badge-new">New</span>
          ) : listing.negotiable ? (
            <span className="badge badge-neg">Negotiable</span>
          ) : null}
        </div>

        {/* Micro-actions Overlay */}
        <div className="card-micro-actions">
          <button className="card-action-btn" onClick={(e) => handleAction(e, 'compare')} title="Compare">⚖</button>
          <button className="card-action-btn" onClick={(e) => handleAction(e, 'share')} title="Share">📤</button>
          <button className={`card-action-btn ${saved ? 'saved' : ''}`} onClick={(e) => handleAction(e, 'save')} title={saved ? 'Saved' : 'Save'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Image count */}
        {listing.images?.length > 1 && (
          <span className="card-img-count">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {listing.images.length}
          </span>
        )}
      </div>

      <div className="content">
        <div className="price">{formatPrice(listing.price)}</div>
        <div className="title">{listing.title}</div>
        <div className="meta">
          <span className="location">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--text-muted)" stroke="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {listing.location}
          </span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>
        {/* Seller Info & Trust Signals */}
        <div className="card-seller-info" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.6rem' }}>
              {listing.seller?.name?.charAt(0) || 'U'}
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>⭐ 4.8</span>
          </div>
          
          {isVerified && (
            <div className="card-verified" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-light)', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Verified
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
