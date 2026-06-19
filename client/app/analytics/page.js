'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSellerListings, getListingAnalytics } from '@/lib/api';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getSellerListings(user._id).then(setListings).catch(()=>setListings([])).finally(()=>setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  if (!user) return (
    <div className="empty-state" style={{padding:'100px 20px'}}>
      <div className="icon">🔐</div>
      <h3>Login Required</h3>
      <Link href="/login" className="btn btn-primary">Login</Link>
    </div>
  );

  return (
    <div style={{padding:'40px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:'1.8rem'}}>My Dashboard</h1>
          <div style={{display:'flex',gap:16,marginTop:16}}>
            <Link href="/my-ads" style={{color:'var(--text-muted)'}}>My Ads</Link>
            <Link href="/my-alerts" style={{color:'var(--text-muted)'}}>Saved Searches</Link>
            <Link href="/analytics" style={{color:'var(--primary-light)',fontWeight:600,textDecoration:'underline'}}>Analytics</Link>
            <Link href="/verify" style={{color:'var(--text-muted)'}}>Verify Account</Link>
          </div>
        </div>

        {loading ? <p>Loading data...</p> : listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📊</div>
            <h3>No Analytics Available</h3>
            <p>You need to post ads to see their performance.</p>
            <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {listings.map(l => (
              <div key={l._id} className="card" style={{padding:20}}>
                <h3 style={{marginBottom:12}}>{l.title}</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))',gap:16}}>
                  <div style={{padding:16,background:'var(--bg-3)',borderRadius:'var(--radius)',textAlign:'center'}}>
                    <div style={{fontSize:'2rem',fontWeight:800,color:'var(--text)'}}>{l.views || 0}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Total Views</div>
                  </div>
                  <div style={{padding:16,background:'var(--bg-3)',borderRadius:'var(--radius)',textAlign:'center'}}>
                    <div style={{fontSize:'2rem',fontWeight:800,color:'var(--primary)'}}>--</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Phone Reveals</div>
                  </div>
                  <div style={{padding:16,background:'var(--bg-3)',borderRadius:'var(--radius)',textAlign:'center'}}>
                    <div style={{fontSize:'2rem',fontWeight:800,color:'#25D366'}}>--</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>WhatsApp Clicks</div>
                  </div>
                </div>
                <div style={{marginTop:12,fontSize:'0.8rem',color:'var(--text-muted)'}}>* Detailed event tracking is actively collecting data. Check back soon.</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
