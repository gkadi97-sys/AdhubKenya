'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

const CATEGORY_META = {
  electronics: { name:'Electronics', icon:'📱', desc:'Phones, laptops, TVs, cameras & accessories' },
  vehicles:    { name:'Vehicles',    icon:'🚗', desc:'Cars, motorcycles, trucks & spare parts' },
  property:    { name:'Property',    icon:'🏠', desc:'Houses, apartments, land & rentals' },
  fashion:     { name:'Fashion & Beauty', icon:'👗', desc:'Clothes, shoes, accessories & beauty products' },
  services:    { name:'Services',    icon:'🔧', desc:'Plumbing, cleaning, tutoring & professional services' },
  jobs:        { name:'Jobs',        icon:'💼', desc:'Full-time, part-time & freelance opportunities' },
  agriculture: { name:'Agriculture', icon:'🌱', desc:'Farm produce, livestock & farming equipment' },
  furniture:   { name:'Furniture & Home', icon:'🛋️', desc:'Sofas, beds, appliances & home decor' },
  sports:      { name:'Sports & Outdoors', icon:'⚽', desc:'Gym equipment, bicycles & outdoor gear' },
  kids:        { name:'Kids & Baby', icon:'👶', desc:'Toys, clothing, strollers & baby products' },
  food:        { name:'Food & Catering', icon:'🍽️', desc:'Catering services & food businesses' },
  health:      { name:'Health',      icon:'💊', desc:'Medical equipment, wellness & beauty' },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const meta = CATEGORY_META[slug] || { name: slug, icon: '🏷️', desc: `Browse ${slug} listings` };

  useEffect(() => {
    setLoading(true);
    getListings({ category: slug, sort, page })
      .then(data => {
        setListings(data.listings || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [slug, sort, page]);

  return (
    <div>
      {/* Category Header */}
      <div style={{background:'linear-gradient(135deg, var(--bg-2), var(--bg-3))',borderBottom:'1px solid var(--border)',padding:'40px 0'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{fontSize:'3rem'}}>{meta.icon}</span>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <Link href="/" style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>Home</Link>
                <span style={{color:'var(--text-muted)'}}>›</span>
                <span style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>{meta.name}</span>
              </div>
              <h1 style={{fontSize:'2rem',marginBottom:4}}>{meta.name}</h1>
              <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>{meta.desc} — <strong style={{color:'var(--primary-light)'}}>{total.toLocaleString()} ads</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{padding:'32px 20px 80px'}}>
        {/* Sort bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{total} listings</span>
          <select className="form-control" style={{width:'auto',padding:'8px 12px'}} value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}>
            <option value="createdAt">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="listings-grid">
            {[...Array(12)].map((_,i) => (
              <div key={i} style={{borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--surface)'}}>
                <div className="skeleton" style={{aspectRatio:'4/3'}}/>
                <div style={{padding:16}}>
                  <div className="skeleton" style={{height:18,width:'60%',marginBottom:8}}/>
                  <div className="skeleton" style={{height:14,width:'90%',marginBottom:6}}/>
                  <div className="skeleton" style={{height:12,width:'40%'}}/>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
            {pages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:40}}>
                {[...Array(pages)].map((_,i) => (
                  <button key={i} onClick={()=>setPage(i+1)}
                    className={`btn btn-sm ${page===i+1?'btn-primary':'btn-ghost'}`}>
                    {i+1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">{meta.icon}</div>
            <h3>No {meta.name} listings yet</h3>
            <p>Be the first to post in this category!</p>
            <Link href="/post-ad" className="btn btn-primary">Post Free Ad</Link>
          </div>
        )}
      </div>
    </div>
  );
}
