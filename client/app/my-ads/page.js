'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSellerListings, deleteListing, formatPrice, timeAgo, imageUrl } from '@/lib/api';
import Link from 'next/link';

export default function MyAdsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?._id) {
      getSellerListings(user._id).then(setListings).catch(()=>setListings([])).finally(()=>setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(id);
    try {
      await deleteListing(id);
      setListings(l => l.filter(x => x._id !== id));
    } catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  };

  if (!user) return (
    <div className="empty-state" style={{padding:'100px 20px'}}>
      <div className="icon">🔐</div>
      <h3>Login Required</h3>
      <p>You need to be logged in to view your ads</p>
      <Link href="/login" className="btn btn-primary">Login</Link>
    </div>
  );

  return (
    <div style={{padding:'40px 0 80px'}}>
      <div className="container">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <h1 style={{fontSize:'1.8rem'}}>My Dashboard</h1>
            <p style={{color:'var(--text-secondary)',marginTop:4}}>Welcome, {user.name} 👋</p>
            <div style={{display:'flex',gap:16,marginTop:16}}>
              <Link href="/my-ads" style={{color:'var(--primary-light)',fontWeight:600,textDecoration:'underline'}}>My Ads</Link>
              <Link href="/my-alerts" style={{color:'var(--text-muted)'}}>Saved Searches</Link>
              <Link href="/analytics" style={{color:'var(--text-muted)'}}>Analytics</Link>
              <Link href="/verify" style={{color:'var(--text-muted)'}}>Verify Account</Link>
            </div>
          </div>
          <Link href="/post-ad" className="btn btn-accent">+ Post New Ad</Link>
        </div>

        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{height:100,borderRadius:'var(--radius-lg)'}}/>)}
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No ads yet</h3>
            <p>You haven't posted any ads. Start selling today!</p>
            <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {listings.map(l => (
              <div key={l._id} className="card" style={{display:'flex',gap:0,overflow:'hidden'}}>
                {/* Image */}
                <div style={{width:140,flexShrink:0}}>
                  <img
                    src={l.images?.[0] ? imageUrl(l.images[0]) : `https://placehold.co/140x110/1a2b1e/00d168?text=Ad`}
                    alt={l.title} style={{width:'100%',height:'100%',objectFit:'cover'}}
                    onError={e=>{e.target.src='https://placehold.co/140x110/1a2b1e/00d168?text=Ad';}}
                  />
                </div>
                {/* Content */}
                <div style={{flex:1,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'start',gap:12,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <Link href={`/listing/${l._id}`} style={{fontSize:'1rem',fontWeight:600,color:'var(--text)',transition:'color 0.2s'}}
                      onMouseEnter={e=>e.target.style.color='var(--primary-light)'}
                      onMouseLeave={e=>e.target.style.color='var(--text)'}
                    >{l.title}</Link>
                    <div style={{fontSize:'1.2rem',fontWeight:800,color:'var(--primary-light)',margin:'4px 0',fontFamily:'var(--font-display)'}}>{formatPrice(l.price)}</div>
                    <div style={{display:'flex',gap:12,fontSize:'0.8rem',color:'var(--text-muted)',flexWrap:'wrap'}}>
                      <span>📍 {l.location}</span>
                      <span>👁️ {l.views} views</span>
                      <span>🕐 {timeAgo(l.createdAt)}</span>
                      <span className={`badge ${l.status === 'active' ? 'badge-primary' : 'badge-gray'}`}
                        style={{fontSize:'0.7rem',padding:'2px 8px'}}>{l.status}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    <Link href={`/listing/${l._id}`} className="btn btn-ghost btn-sm">View</Link>
                    <button onClick={()=>handleDelete(l._id)} disabled={deleting===l._id}
                      className="btn btn-sm"
                      style={{background:'rgba(239,68,68,0.1)',color:'#fca5a5',border:'1px solid rgba(239,68,68,0.3)'}}>
                      {deleting===l._id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
