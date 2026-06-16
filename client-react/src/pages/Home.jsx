
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getFeaturedListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CategoryGrid from '@/components/CategoryGrid';
import { TOP_CATEGORIES } from '@/lib/categoryData';
export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedListings()
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (category) params.set('category', category);
    navigate(`/browse?${params.toString()}`);
  };

  const counties = ['Nairobi','Mombasa','Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Garissa','Wajir','Mandera','Marsabit','Isiolo','Meru','Tharaka-Nithi','Embu','Kitui','Machakos','Makueni','Nyandarua','Nyeri','Kirinyaga',"Murang'a",'Kiambu','Turkana','West Pokot','Samburu','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia','Nakuru','Narok','Kajiado','Kericho','Bomet','Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisumu','Homa Bay','Migori','Kisii','Nyamira'];


  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--primary-glow)',border:'1px solid var(--primary)',borderRadius:'var(--radius-full)',padding:'6px 16px',fontSize:'0.8rem',color:'var(--primary-light)',marginBottom:20,fontWeight:600}}>
              🇰🇪 Kenya's #1 Classified Ads Platform
            </div>
            <h1>
              Buy & Sell Anything<br/>
              <span className="text-gradient">In Kenya</span>
            </h1>
            <p>Join thousands of Kenyans buying and selling electronics, vehicles, property, and more — completely free.</p>

            {/* Search bar */}
            <form className="search-bar" onSubmit={handleSearch}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c8065" strokeWidth="2" style={{flexShrink:0}}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="What are you looking for?"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              <select
                value={category} onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {TOP_CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <button type="submit">Search</button>
            </form>

            {/* Quick county links */}
            <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:20}}>
              {counties.map(c => (
                <Link key={c} href={`/browse?location=${c}`}
                  style={{fontSize:'0.8rem',color:'var(--text-muted)',padding:'4px 12px',borderRadius:'var(--radius-full)',border:'1px solid var(--border)',background:'var(--surface)',transition:'var(--transition)'}}
                  onMouseEnter={e => { e.target.style.color='var(--primary-light)'; e.target.style.borderColor='var(--primary)'; }}
                  onMouseLeave={e => { e.target.style.color='var(--text-muted)'; e.target.style.borderColor='var(--border)'; }}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'20px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,textAlign:'center'}}>
            {[['10,000+','Active Listings'],['50,000+','Happy Users'],['47','Counties Covered'],['Free','To Post Ads']].map(([val,lbl]) => (
              <div key={lbl}>
                <div style={{fontSize:'1.6rem',fontWeight:800,fontFamily:'var(--font-display)',color:'var(--primary-light)'}}>{val}</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:2}}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <h2 style={{fontSize:'1.5rem'}}>Browse by Category</h2>
              <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:'0.9rem'}}>Find exactly what you're looking for</p>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="section" style={{paddingTop:0}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <h2 style={{fontSize:'1.5rem'}}>Latest Listings</h2>
              <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:'0.9rem'}}>Fresh ads posted by sellers near you</p>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">See all →</Link>
          </div>

          {loading ? (
            <div className="listings-grid">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="listing-card">
                  <div className="skeleton" style={{aspectRatio:'4/3'}}/>
                  <div className="card-body">
                    <div className="skeleton" style={{height:20,width:'60%',marginBottom:8}}/>
                    <div className="skeleton" style={{height:14,width:'90%',marginBottom:6}}/>
                    <div className="skeleton" style={{height:12,width:'40%'}}/>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🏪</div>
              <h3>No listings yet</h3>
              <p>Be the first to post an ad on AdHub Kenya!</p>
              <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{background:'linear-gradient(135deg, var(--bg-3), #0d2215)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'64px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontSize:'2rem',marginBottom:12}}>Ready to Sell Something?</h2>
          <p style={{color:'var(--text-secondary)',marginBottom:28,maxWidth:480,margin:'0 auto 28px'}}>Posting your first ad is completely free. Reach thousands of buyers across Kenya in minutes.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/post-ad" className="btn btn-accent btn-lg">Post Free Ad Now</Link>
            <Link href="/browse" className="btn btn-outline btn-lg">Browse Listings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
