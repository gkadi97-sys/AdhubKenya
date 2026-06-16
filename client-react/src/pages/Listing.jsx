import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getListing, imageUrl, formatPrice, timeAgo } from '@/lib/api';
import { Link } from 'react-router-dom';

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
      <Link to="/browse" className="btn btn-primary">Browse Ads</Link>
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
          <Link to="/" style={{color:'var(--text-muted)'}}>Home</Link>
          <span>/</span>
          <Link to="/browse" style={{color:'var(--text-muted)'}}>Browse</Link>
          <span>/</span>
          <Link to={`/category/${listing.category}`} style={{color:'var(--text-muted)',textTransform:'capitalize'}}>{listing.category}</Link>
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

              {(listing.make || listing.model || listing.year) && (
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16,padding:'12px 16px',background:'var(--surface-2)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
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

              {listing.specs && Object.keys(listing.specs).filter(k => listing.specs[k] && listing.specs[k] !== '' && (Array.isArray(listing.specs[k]) ? listing.specs[k].length > 0 : true)).length > 0 && (() => {
                const FRIENDLY_LABELS = {
                  // Vehicle
                  vehicleType: 'Vehicle Type', bodyStyle: 'Body Style', variant: 'Variant / Trim',
                  regYear: 'Year of Registration', regNumber: 'Registration No.',
                  mileage: 'Mileage', mileageUnit: 'Mileage Unit', prevOwners: 'Previous Owners',
                  usageType: 'Usage Type', serviceHistory: 'Service History',
                  fuelType: 'Fuel Type', engineCC: 'Engine (CC)', engineSize: 'Engine Size',
                  horsepower: 'Horsepower', cylinders: 'Cylinders', engineConfig: 'Engine Config',
                  turbocharged: 'Turbocharged', transmission: 'Transmission', numGears: 'No. Gears',
                  driveType: 'Drive Type', color: 'Exterior Colour', colorType: 'Colour Type',
                  numDoors: 'Doors', numSeats: 'Seats', wheelSize: 'Wheel Size',
                  engineCapacityCc: 'Engine Size (cc)', bodyType: 'Body Type', fuelType: 'Fuel Type',
                  transmission: 'Transmission', driveType: 'Drive Type', interiorColor: 'Interior Color',
                  exteriorColor: 'Exterior Color', seatingCapacity: 'Seating Capacity', mileageKm: 'Mileage (km)',
                  listingCategory: 'Listing Category', currency: 'Currency', listingId: 'Listing ID',
                  landSize: 'Land Size', builtArea: 'Built-up Area', floors: 'Floors',
                  bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', livingRooms: 'Living Rooms',
                  meetingRooms: 'Meeting Rooms', agencyName: 'Agency / Company', website: 'Website',
                };
                
                // Legacy feature arrays
                const FEATURE_KEYS = [
                  'comfortFeatures', 'infotainmentFeatures', 'safetyFeatures', 'exteriorFeatures', 'conditionDetails',
                  'residentialFeatures', 'commercialFeatures', 'amenities', 'legalInfo'
                ];
                
                const FEATURE_LABELS = {
                  comfortFeatures: '❄️ Comfort & Convenience',
                  infotainmentFeatures: '📱 Infotainment & Connectivity',
                  safetyFeatures: '🛡️ Safety Features',
                  exteriorFeatures: '✨ Exterior Features',
                  conditionDetails: '📋 Condition Details',
                  residentialFeatures: '✨ Residential Features',
                  commercialFeatures: '💼 Commercial Features',
                  amenities: '🏊‍♂️ Amenities & Facilities',
                  legalInfo: '⚖️ Legal & Compliance',
                };
                
                // Separate boolean/checkbox attributes vs key-value attributes
                const booleanFeatures = [];
                const keyValueSpecs = [];
                
                Object.entries(listing.specs).forEach(([k, v]) => {
                  if (FEATURE_KEYS.includes(k)) return; // handled by legacy array loop below
                  if (v === '' || v === null || v === undefined) return;
                  
                  const isBoolean = v === true || v === false || schemaAttrs[k]?.type === 'checkbox';
                  const label = schemaAttrs[k]?.label || FRIENDLY_LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                  
                  if (isBoolean) {
                    if (v === true) booleanFeatures.push(label);
                  } else {
                    keyValueSpecs.push({ key: k, label, val: v });
                  }
                });

                const featureSpecs = Object.entries(listing.specs).filter(([k, v]) => FEATURE_KEYS.includes(k) && Array.isArray(v) && v.length > 0);

                return (
                  <div style={{ marginBottom: 28 }}>
                    {/* Key/Value Specs Grid */}
                    {keyValueSpecs.length > 0 && (
                      <>
                        <h3 style={{ marginBottom: 14, fontSize: '1rem' }}>Specifications</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 24 }}>
                          {keyValueSpecs.map((item) => (
                            <div key={item.key} style={{ background: 'var(--surface)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                {item.label}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.val}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Boolean Feature Pills */}
                    {booleanFeatures.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>✨ Included Features & Amenities</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {booleanFeatures.map(f => (
                            <span key={f} style={{
                              padding: '5px 12px', background: 'var(--primary-glow)',
                              border: '1px solid var(--primary)', borderRadius: 20,
                              fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 500
                            }}>✓ {f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Legacy Feature Pill Groups */}
                    {featureSpecs.map(([key, features]) => (
                      <div key={key} style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>{FEATURE_LABELS[key]}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {features.map(f => (
                            <span key={f} style={{
                              padding: '5px 12px', background: 'var(--primary-glow)',
                              border: '1px solid var(--primary)', borderRadius: 20,
                              fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 500
                            }}>✓ {f}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

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
