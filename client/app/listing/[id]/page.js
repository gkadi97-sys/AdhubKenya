'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getListing, imageUrl, formatPrice, timeAgo } from '@/lib/api';
import Link from 'next/link';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (id) {
      getListing(id).then(setListing).catch(()=>setListing(null)).finally(()=>setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="container" style={{padding:'60px 20px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:32}}>
        <div><div className="skeleton" style={{aspectRatio:'4/3',borderRadius:'var(--radius-lg)'}}/></div>
        <div><div className="skeleton" style={{height:300,borderRadius:'var(--radius-lg)'}}/></div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="empty-state" style={{padding:'100px 20px'}}>
      <div className="icon">😕</div>
      <h3>Listing not found</h3>
      <p>This ad may have been removed or expired</p>
      <Link href="/browse" className="btn btn-primary">Browse Ads</Link>
    </div>
  );

  const images = listing.images?.length ? listing.images : [];
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in your ad: "${listing.title}" on AdHub Kenya.`);
  const waNumber = listing.whatsapp?.replace(/\D/g,'') || listing.phone?.replace(/\D/g,'');
  const waLink = `https://wa.me/${waNumber.startsWith('0') ? '254' + waNumber.slice(1) : waNumber}?text=${whatsappMsg}`;

  return (
    <div style={{padding:'32px 0 60px'}}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{display:'flex',gap:8,alignItems:'center',marginBottom:24,fontSize:'0.85rem',color:'var(--text-muted)'}}>
          <Link href="/" style={{color:'var(--text-muted)'}}>Home</Link>
          <span>/</span>
          <Link href="/browse" style={{color:'var(--text-muted)'}}>Browse</Link>
          <span>/</span>
          <Link href={`/category/${listing.category}`} style={{color:'var(--text-muted)',textTransform:'capitalize'}}>{listing.category}</Link>
          <span>/</span>
          <span style={{color:'var(--text)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{listing.title}</span>
        </nav>

        <div className="listing-detail-grid">
          {/* LEFT: Images + Details */}
          <div>
            {/* Image gallery */}
            <div className="image-gallery">
              {images.length > 0 ? (
                <>
                  <img className="main-image" src={imageUrl(images[activeImg])} alt={listing.title}
                    style={{borderRadius:'var(--radius-lg)',width:'100%',aspectRatio:'4/3',objectFit:'cover'}}
                    onError={e=>{e.target.src=`https://placehold.co/800x600/1a2b1e/00d168?text=AdHub`;}}
                  />
                  {images.length > 1 && (
                    <div className="thumb-strip" style={{marginTop:8}}>
                      {images.map((img,i) => (
                        <img key={i} src={imageUrl(img)} alt="" className={i===activeImg?'active':''}
                          onClick={()=>setActiveImg(i)}
                          onError={e=>{e.target.src=`https://placehold.co/72x72/1a2b1e/00d168?text=img`;}}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{aspectRatio:'4/3',background:'var(--surface)',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem'}}>🖼️</div>
              )}
            </div>

            {/* Details */}
            <div className="card" style={{marginTop:24,padding:28}}>
              <div style={{display:'flex',alignItems:'start',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:16}}>
                <div>
                  <h1 style={{fontSize:'1.6rem',marginBottom:8}}>{listing.title}</h1>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <span className="badge badge-primary" style={{textTransform:'capitalize'}}>{listing.category}</span>
                    {['vehicles', 'phones-tablets', 'electronics', 'home-furniture', 'fashion', 'repair-construction', 'commercial-equipment', 'leisure', 'babies-kids'].includes(listing.category) && listing.condition && (
                      <span className="badge badge-gray">{listing.condition}</span>
                    )}
                    {listing.negotiable && <span className="badge badge-accent">Negotiable</span>}
                  </div>
                </div>
                <div style={{fontSize:'2rem',fontWeight:800,color:'var(--primary-light)',fontFamily:'var(--font-display)',whiteSpace:'nowrap'}}>
                  {formatPrice(listing.price)}
                </div>
              </div>

              {/* Make / Model / Year attributes */}
              {(listing.make || listing.model || listing.year) && (
                <div style={{
                  display:'flex',gap:10,flexWrap:'wrap',marginBottom:16,
                  padding:'12px 16px',background:'var(--surface-2)',
                  borderRadius:'var(--radius)',border:'1px solid var(--border)'
                }}>
                  {listing.make && (
                    <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:90}}>
                      <span style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Make / Type</span>
                      <span style={{fontWeight:600,fontSize:'0.9rem'}}>{listing.make}</span>
                    </div>
                  )}
                  {listing.model && (
                    <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:90,paddingLeft:listing.make?16:0,borderLeft:listing.make?'1px solid var(--border)':'none'}}>
                      <span style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Model</span>
                      <span style={{fontWeight:600,fontSize:'0.9rem'}}>{listing.model}</span>
                    </div>
                  )}
                  {listing.year && (
                    <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:60,paddingLeft:16,borderLeft:'1px solid var(--border)'}}>
                      <span style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Year</span>
                      <span style={{fontWeight:600,fontSize:'0.9rem'}}>{listing.year}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{display:'flex',gap:20,fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:24,flexWrap:'wrap'}}>
                <span>📍 {listing.location}</span>
                <span>👁️ {listing.views} views</span>
                <span>🕐 {timeAgo(listing.createdAt)}</span>
              </div>


              <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'0 0 24px'}}/>

              {/* Additional Specifications table */}
              {listing.specs && Object.keys(listing.specs).filter(k => listing.specs[k]).length > 0 && (
                <div style={{marginBottom:28}}>
                  <h3 style={{marginBottom:14,fontSize:'1rem'}}>Specifications</h3>
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',
                    gap:'1px',
                    background:'var(--border)',
                    border:'1px solid var(--border)',
                    borderRadius:'var(--radius)',
                    overflow:'hidden',
                  }}>
                    {Object.entries(listing.specs)
                      .filter(([,v]) => v)
                      .map(([key, val]) => (
                        <div key={key} style={{
                          background:'var(--surface)',
                          padding:'10px 14px',
                          display:'flex',
                          flexDirection:'column',
                          gap:3,
                        }}>
                          <span style={{
                            fontSize:'0.7rem',
                            color:'var(--text-muted)',
                            textTransform:'uppercase',
                            letterSpacing:'0.05em',
                            fontWeight:600,
                          }}>
                            {key.replace(/([A-Z])/g,' $1').replace(/^./, s=>s.toUpperCase())}
                          </span>
                          <span style={{fontWeight:600,fontSize:'0.88rem'}}>{val}</span>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 style={{marginBottom:12,fontSize:'1rem'}}>Description</h3>
              <p style={{color:'var(--text-secondary)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{listing.description}</p>

            </div>
          </div>

          {/* RIGHT: Contact Card */}
          <aside>
            <div className="contact-card">
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,paddingBottom:20,borderBottom:'1px solid var(--border)'}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',fontWeight:700,color:'#fff',flexShrink:0}}>
                  {listing.seller?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <div className="seller-name">{listing.seller?.name || 'Seller'}</div>
                  <div className="seller-info">📍 {listing.seller?.location || listing.location}</div>
                  <div className="seller-info">Member since {new Date(listing.seller?.createdAt || listing.createdAt).getFullYear()}</div>
                </div>
              </div>

              <div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--primary-light)',marginBottom:4}}>{formatPrice(listing.price)}</div>
              {listing.negotiable && <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:16}}>Price is negotiable</div>}

              <div className="contact-btns">
                {(listing.whatsapp || listing.phone) && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary btn-full btn-lg"
                    style={{background:'#25D366',boxShadow:'0 4px 15px rgba(37,211,102,0.3)'}}>
                    <span>💬</span> WhatsApp Seller
                  </a>
                )}
                <a href={`tel:${listing.phone}`} className="btn btn-ghost btn-full btn-lg">
                  <span>📞</span> Call Seller
                </a>
                <div style={{background:'var(--bg-3)',borderRadius:'var(--radius)',padding:'12px 16px',textAlign:'center',fontSize:'0.85rem',color:'var(--text-muted)',border:'1px solid var(--border)'}}>
                  📱 {listing.phone}
                </div>
              </div>

              <div style={{marginTop:20,padding:'12px',background:'var(--primary-glow)',borderRadius:'var(--radius)',border:'1px solid var(--primary)',fontSize:'0.78rem',color:'var(--primary-light)'}}>
                ⚠️ Safety tip: Meet in a public place. Never send money in advance. Always inspect before buying.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
