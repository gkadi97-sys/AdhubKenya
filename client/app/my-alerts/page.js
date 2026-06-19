'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSavedSearches } from '@/lib/api';
import Link from 'next/link';

export default function MyAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getSavedSearches().then(setAlerts).catch(()=>setAlerts([])).finally(()=>setLoading(false));
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
            <Link href="/my-alerts" style={{color:'var(--primary-light)',fontWeight:600,textDecoration:'underline'}}>Saved Searches</Link>
            <Link href="/analytics" style={{color:'var(--text-muted)'}}>Analytics</Link>
            <Link href="/verify" style={{color:'var(--text-muted)'}}>Verify Account</Link>
          </div>
        </div>

        {loading ? <p>Loading alerts...</p> : alerts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔔</div>
            <h3>No Saved Searches</h3>
            <p>Save searches while browsing to get alerts.</p>
            <Link href="/browse" className="btn btn-primary">Browse Ads</Link>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {alerts.map(a => (
              <div key={a._id || a.id} className="card" style={{padding:20}}>
                <h3 style={{marginBottom:8}}>Keyword: {a.query || 'Any'}</h3>
                <div style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:12}}>
                  Filters: {JSON.stringify(a.filters)}
                </div>
                <div style={{display:'flex',gap:12}}>
                  <span className={`badge ${a.isAlertEnabled ? 'badge-primary' : 'badge-gray'}`}>
                    {a.isAlertEnabled ? 'Alerts Active' : 'Alerts Paused'}
                  </span>
                  <Link href={`/browse?keyword=${a.query || ''}`} className="btn btn-sm btn-ghost">View Results</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
