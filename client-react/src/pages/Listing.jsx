import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing, imageUrl, formatPrice, timeAgo } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { SCHEMA_ATTRIBUTES } from '@/lib/schemaEngine';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { useSEO } from '@/lib/useSEO';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import CandidateProfile from '@/components/CandidateProfile';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addListing } = useRecentlyViewed();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useSEO({
    title: listing ? `${listing.title} – ${formatPrice(listing.price)} | AdHub Kenya` : 'View Listing | AdHub Kenya',
    description: listing
      ? `${listing.title} for ${formatPrice(listing.price)} in ${listing.location || 'Kenya'}. ${listing.description ? listing.description.slice(0, 120) + '...' : 'View this listing on AdHub Kenya.'}`
      : 'View this listing on AdHub Kenya.',
    canonicalPath: `/listing/${id}`
  });

  useEffect(() => {
    if (!listing) return;
    const scriptId = 'listing-jsonld';
    let el = document.getElementById(scriptId);
    if (!el) { el = document.createElement('script'); el.id = scriptId; el.type = 'application/ld+json'; document.head.appendChild(el); }
    const firstImage = listing.images?.[0] ? imageUrl(listing.images[0]) : '';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': listing.title,
      'description': listing.description || listing.title,
      'image': firstImage ? [firstImage] : [],
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'KES',
        'price': listing.price,
        'itemCondition': 'https://schema.org/UsedCondition',
        'availability': 'https://schema.org/InStock',
        'url': `https://adhubkenya.co.ke/listing/${listing.id}`,
        'seller': { '@type': 'Person', 'name': listing.seller?.name || 'Seller on AdHub Kenya' }
      }
    });
    return () => { const s = document.getElementById(scriptId); if (s) s.remove(); };
  }, [listing, id]);

  useEffect(() => {
    if (id) {
      getListing(id).then(data => {
        setListing(data);
        if (data) addListing(data);
      }).catch(() => setListing(null)).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="rounded-2xl bg-secondary animate-pulse" style={{ aspectRatio: '4/3' }} />
        <div className="rounded-2xl bg-secondary animate-pulse h-72" />
      </div>
    </div>
  );

  if (!listing) return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="font-display text-2xl font-bold mb-2">Listing not found</h3>
      <p className="text-muted-foreground mb-6">This ad may have been removed or expired</p>
      <Link to="/browse" className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold text-sm hover:opacity-90 transition-opacity">Browse Ads</Link>
    </div>
  );

  const images = listing.images?.length ? listing.images : [];
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in your ad: "${listing.title}" on AdHub Kenya.`);
  const waNumber = listing.whatsapp?.replace(/\D/g, '') || listing.phone?.replace(/\D/g, '');
  const waLink = waNumber ? `https://wa.me/${waNumber.startsWith('0') ? '254' + waNumber.slice(1) : waNumber}?text=${whatsappMsg}` : null;

  const FEATURE_KEYS = ['comfortFeatures', 'infotainmentFeatures', 'safetyFeatures', 'exteriorFeatures', 'conditionDetails', 'residentialFeatures', 'commercialFeatures', 'amenities', 'legalInfo'];
  const FEATURE_LABELS = {
    comfortFeatures: '❄️ Comfort & Convenience', infotainmentFeatures: '📱 Infotainment & Connectivity',
    safetyFeatures: '🛡️ Safety Features', exteriorFeatures: '✨ Exterior Features',
    conditionDetails: '📋 Condition Details', residentialFeatures: '✨ Residential Features',
    commercialFeatures: '💼 Commercial Features', amenities: '🏊‍♂️ Amenities & Facilities', legalInfo: '⚖️ Legal & Compliance',
  };
  const FRIENDLY_LABELS = {
    vehicleType: 'Vehicle Type', bodyStyle: 'Body Style', variant: 'Variant / Trim',
    regYear: 'Year of Registration', regNumber: 'Registration No.',
    mileage: 'Mileage', mileageUnit: 'Mileage Unit', prevOwners: 'Previous Owners',
    usageType: 'Usage Type', serviceHistory: 'Service History',
    fuelType: 'Fuel Type', engineCC: 'Engine (CC)', engineSize: 'Engine Size',
    horsepower: 'Horsepower', cylinders: 'Cylinders', engineConfig: 'Engine Config',
    turbocharged: 'Turbocharged', transmission: 'Transmission', numGears: 'No. Gears',
    driveType: 'Drive Type', color: 'Exterior Colour', colorType: 'Colour Type',
    numDoors: 'Doors', numSeats: 'Seats', wheelSize: 'Wheel Size',
    engineCapacityCc: 'Engine Size (cc)', bodyType: 'Body Type', interiorColor: 'Interior Color',
    exteriorColor: 'Exterior Color', seatingCapacity: 'Seating Capacity', mileageKm: 'Mileage (km)',
    landSize: 'Land Size', builtArea: 'Built-up Area', floors: 'Floors',
    bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', livingRooms: 'Living Rooms',
    meetingRooms: 'Meeting Rooms', agencyName: 'Agency / Company', website: 'Website',
  };

  const flatSchema = {};
  Object.values(ATTRIBUTE_ENGINE).forEach(cat => { if (cat.attributes) cat.attributes.forEach(attr => { flatSchema[attr.id] = attr; }); });

  const booleanFeatures = [];
  const keyValueSpecs = [];
  if (listing.specs) {
    Object.entries(listing.specs).forEach(([k, v]) => {
      if (FEATURE_KEYS.includes(k)) return;
      if (v === '' || v === null || v === undefined) return;
      const schemaAttr = SCHEMA_ATTRIBUTES[k] || flatSchema[k];
      const isBoolean = v === true || v === false || schemaAttr?.type === 'checkbox' || (schemaAttr?.type === 'radio' && v === 'Yes');
      const label = schemaAttr?.label || FRIENDLY_LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      if (isBoolean) { if (v === true) booleanFeatures.push(label); }
      else { keyValueSpecs.push({ key: k, label, val: String(v) }); }
    });
  }
  const featureSpecs = listing.specs ? Object.entries(listing.specs).filter(([k, v]) => FEATURE_KEYS.includes(k) && Array.isArray(v) && v.length > 0) : [];

  return (
    <div className="py-8 pb-16 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-6xl">

        {listing.category === 'seeking-work' ? (
          <CandidateProfile listing={listing} />
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground flex-wrap">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
              <span>/</span>
              <Link to={`/browse?category=${listing.category}`} className="hover:text-foreground transition-colors capitalize">{listing.category?.replace(/-/g, ' ')}</Link>
              <span>/</span>
              <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
            </nav>

            {/* Main grid: left = images + details, right = contact card */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

              {/* ── LEFT COLUMN ── */}
              <div className="min-w-0">

                {/* Image gallery */}
                <div className="rounded-2xl overflow-hidden border border-border bg-card">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={imageUrl(images[activeImg])}
                        alt={listing.title}
                        className="w-full object-cover"
                        style={{ aspectRatio: '4/3', maxHeight: 500 }}
                        onError={e => { e.target.src = 'https://placehold.co/800x600/1a2b1e/00d168?text=AdHub'; }}
                      />
                      {images.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto">
                          {images.map((img, i) => (
                            <img key={i} src={imageUrl(img)} alt=""
                              onClick={() => setActiveImg(i)}
                              className={`h-16 w-16 rounded-lg object-cover cursor-pointer flex-shrink-0 border-2 transition-all ${i === activeImg ? 'border-primary shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                              onError={e => { e.target.src = 'https://placehold.co/72x72/1a2b1e/00d168?text=img'; }}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center text-6xl bg-secondary" style={{ aspectRatio: '4/3' }}>🖼️</div>
                  )}
                </div>

                {/* Details card */}
                <div className="mt-4 rounded-2xl border border-border bg-card p-5 sm:p-7">

                  {/* Title, badges, price */}
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-display font-bold text-foreground mb-2 leading-tight">{listing.title}</h1>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold capitalize">
                          {listing.category?.replace(/-/g, ' ')}
                        </span>
                        {['vehicles', 'phones-tablets', 'electronics', 'home-furniture', 'fashion', 'repair-construction', 'commercial-equipment', 'leisure', 'babies-kids', 'auto-spares'].includes(listing.category) && listing.condition && (
                          <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold">{listing.condition}</span>
                        )}
                        {listing.negotiable && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 text-xs font-semibold">Negotiable</span>
                        )}
                      </div>
                    </div>
                    {listing.price > 0 && (
                      <div className="text-3xl font-display font-extrabold text-primary whitespace-nowrap">{formatPrice(listing.price)}</div>
                    )}
                  </div>

                  {/* Make / Model / Year */}
                  {(listing.make || listing.model || listing.year) && (
                    <div className="flex gap-4 flex-wrap mb-4 p-3 bg-secondary/50 rounded-xl border border-border">
                      {listing.make && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Make / Type</span>
                          <span className="font-bold text-sm">{listing.make}</span>
                        </div>
                      )}
                      {listing.model && (
                        <div className="flex flex-col gap-0.5 pl-4 border-l border-border">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Model</span>
                          <span className="font-bold text-sm">{listing.model}</span>
                        </div>
                      )}
                      {listing.year && (
                        <div className="flex flex-col gap-0.5 pl-4 border-l border-border">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Year</span>
                          <span className="font-bold text-sm">{listing.year}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex gap-4 text-sm text-muted-foreground mb-5 flex-wrap">
                    <span>📍 {listing.location}</span>
                    <span>👁️ {listing.views} views</span>
                    <span>🕐 {timeAgo(listing.created_at || listing.createdAt)}</span>
                  </div>

                  <hr className="border-border mb-5" />

                  {/* Specs grid */}
                  {keyValueSpecs.length > 0 && (
                    <div className="mb-5">
                      <h3 className="font-bold text-base mb-3">Specifications</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border mb-2">
                        {keyValueSpecs.map(item => (
                          <div key={item.key} className="bg-background px-3 py-2.5 flex flex-col gap-0.5">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</span>
                            <span className="font-semibold text-sm text-foreground">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Boolean feature pills */}
                  {booleanFeatures.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-2">✨ Included Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {booleanFeatures.map(f => (
                          <span key={f} className="px-3 py-1 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 text-primary">✓ {f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Legacy feature pill groups */}
                  {featureSpecs.map(([key, features]) => (
                    <div key={key} className="mb-4">
                      <h4 className="text-sm font-bold mb-2">{FEATURE_LABELS[key]}</h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map(f => (
                          <span key={f} className="px-3 py-1 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 text-primary">✓ {f}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Description */}
                  <h3 className="font-bold text-base mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              </div>

              {/* ── RIGHT COLUMN: Contact card (sticky on desktop) ── */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                  {/* Seller info */}
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">
                      {listing.seller?.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">{listing.seller?.name || 'Seller'}</div>
                      <div className="text-xs text-muted-foreground">📍 {listing.seller?.location || listing.location}</div>
                      <div className="text-xs text-muted-foreground">
                        Member since {new Date(listing.seller?.created_at || listing.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Price (repeated for easy reference in sidebar) */}
                  {listing.price > 0 && (
                    <div className="mb-4">
                      <div className="text-2xl font-display font-extrabold text-primary">{formatPrice(listing.price)}</div>
                      {listing.negotiable && <div className="text-xs text-muted-foreground mt-0.5">Price is negotiable</div>}
                    </div>
                  )}

                  {/* Contact buttons */}
                  <div className="flex flex-col gap-3">
                    {user ? (
                      <>
                        {(listing.whatsapp || listing.phone) && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 font-semibold text-white text-sm hover:opacity-90 transition-opacity"
                            style={{ background: '#25D366', boxShadow: '0 4px 15px rgba(37,211,102,0.3)' }}>
                            💬 WhatsApp Seller
                          </a>
                        )}
                        <a href={`tel:${listing.phone}`}
                          className="flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 font-semibold text-foreground text-sm border border-border bg-secondary hover:bg-secondary/70 transition-colors">
                          📞 Call Seller
                        </a>
                        <div className="rounded-xl bg-secondary/50 border border-border px-4 py-3 text-center text-sm text-muted-foreground">
                          📱 {listing.phone}
                        </div>
                      </>
                    ) : (
                      <div className="relative">
                        <div className="blur-sm pointer-events-none select-none opacity-60 flex flex-col gap-3">
                          <div className="flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 font-semibold text-white text-sm" style={{ background: '#25D366' }}>💬 WhatsApp Seller</div>
                          <div className="flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 font-semibold text-foreground text-sm border border-border bg-secondary">📞 Call Seller</div>
                          <div className="rounded-xl bg-secondary/50 border border-border px-4 py-3 text-center text-sm">📱 07XX XXX XXX</div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 rounded-2xl backdrop-blur-sm p-5 text-center">
                          <div className="text-3xl">🔒</div>
                          <div className="text-white font-bold text-sm">Contact details hidden</div>
                          <div className="text-white/70 text-xs">Sign in to contact this seller</div>
                          <Link to="/login" state={{ from: `/listing/${listing.id}` }}
                            className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 px-4 font-semibold text-sm text-center hover:opacity-90 transition-opacity">
                            🔑 Sign In
                          </Link>
                          <Link to="/register" state={{ from: `/listing/${listing.id}` }}
                            className="w-full rounded-xl border border-white/30 text-white py-2 px-4 font-semibold text-xs text-center hover:bg-white/10 transition-colors">
                            ✨ Create Free Account
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-primary/80">
                    ⚠️ Safety tip: Meet in a public place. Never send money in advance. Always inspect before buying.
                  </div>
                </div>
              </aside>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
