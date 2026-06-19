'use client';
import Link from 'next/link';
import { imageUrl, formatPrice, timeAgo } from '@/lib/api';

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listing/${listing._id}`} className="listing-card fade-in">
      <div className="image-wrap">
        <img
          src={listing.images?.[0] ? imageUrl(listing.images[0]) : `https://placehold.co/400x300/1a2b1e/00d168?text=${encodeURIComponent(listing.category)}`}
          alt={listing.title}
          onError={e => { e.target.src = `https://placehold.co/400x300/1a2b1e/00d168?text=AdHub`; }}
        />
        {listing.negotiable && <span className="badge">Negotiable</span>}
        {listing.condition === 'New' && (
          <span className="badge" style={{left:'auto',right:10,background:'var(--primary)'}}>New</span>
        )}
      </div>
      <div className="content">
        <div className="price">{formatPrice(listing.price)}</div>
        <div className="title">{listing.title}</div>
        {(listing.seller?.is_phone_verified || listing.seller?.is_business_verified) && (
          <div style={{fontSize:'0.75rem',color:'var(--primary)',marginBottom:4,display:'flex',alignItems:'center',gap:4}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Verified Seller
          </div>
        )}
        <div className="meta">
          <span className="location">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--text-muted)" stroke="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {listing.location}
          </span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
