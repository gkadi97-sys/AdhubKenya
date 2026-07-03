import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing, getListings, toggleSaved, getSaved, imageUrl, formatPrice, timeAgo, getSellerStats, getListingViews } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { SCHEMA_ATTRIBUTES } from '@/lib/schemaEngine';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { useSEO } from '@/lib/useSEO';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import CandidateProfile from '@/components/CandidateProfile';
import ListingCard from '@/components/ListingCard';
import MessageButton from '@/components/MessageButton';
import ReportModal from '@/components/ReportModal';
import { Heart, Share2, MapPin, Eye, Clock, Flag, ShieldCheck, ChevronDown, ChevronUp, Maximize2, MessageCircle, Phone, ArrowLeft, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addListing } = useRecentlyViewed();
  const [listing, setListing] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [listingViews, setListingViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [relatedListings, setRelatedListings] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Keyboard navigation for zoom modal
  const handleZoomKeyDown = useCallback((e) => {
    if (!isZoomModalOpen) return;
    if (e.key === 'Escape') { setIsZoomModalOpen(false); }
    if (e.key === 'ArrowLeft') { setActiveImg(prev => prev === 0 ? images.length - 1 : prev - 1); }
    if (e.key === 'ArrowRight') { setActiveImg(prev => (prev + 1) % images.length); }
  }, [isZoomModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleZoomKeyDown);
    return () => window.removeEventListener('keydown', handleZoomKeyDown);
  }, [handleZoomKeyDown]);

  const firstImage = listing?.images?.[0] ? imageUrl(listing.images[0]) : null;
  const listingKeywords = listing ? [
    listing.title,
    listing.category?.replace(/-/g, ' '),
    listing.make,
    listing.model,
    listing.location,
    `${listing.category?.replace(/-/g, ' ')} Kenya`,
    `buy ${listing.category?.replace(/-/g, ' ')} Kenya`,
    'AdHub Kenya',
  ].filter(Boolean) : [];

  useSEO({
    title: listing ? `${listing.title} – ${formatPrice(listing.price)} | AdHub Kenya` : 'View Listing | AdHub Kenya',
    description: listing
      ? `${listing.title} for ${formatPrice(listing.price)} in ${listing.location || 'Kenya'}. ${listing.description ? listing.description.slice(0, 120) + '...' : 'View this listing on AdHub Kenya.'}`
      : 'View this listing on AdHub Kenya.',
    canonicalPath: listing?.slug ? `/listing/${listing.slug}` : `/listing/${id}`,
    ogImage: firstImage || undefined,
    ogType: 'product',
    keywords: listingKeywords,
  });

  useEffect(() => {
    if (!listing) return;
    const scriptId = 'listing-jsonld';
    let el = document.getElementById(scriptId);
    if (!el) { el = document.createElement('script'); el.id = scriptId; el.type = 'application/ld+json'; document.head.appendChild(el); }
    const imgUrl = listing.images?.[0] ? imageUrl(listing.images[0]) : '';
    const listingUrl = `https://adhubkenya.co.ke/listing/${listing.slug || listing.id}`;
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': listing.title,
      'description': listing.description || listing.title,
      'image': imgUrl ? [imgUrl] : [],
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'KES',
        'price': listing.price,
        'itemCondition': 'https://schema.org/UsedCondition',
        'availability': 'https://schema.org/InStock',
        'url': listingUrl,
        'seller': { '@type': 'Person', 'name': listing.seller?.name || 'Seller on AdHub Kenya' }
      }
    };
    el.textContent = JSON.stringify(jsonld).replace(/</g, '\\u003c');
    return () => { const s = document.getElementById(scriptId); if (s) s.remove(); };
  }, [listing, id]);

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position when id changes
    if (id) {
      setLoading(true);
      getListing(id).then(data => {
        setListing(data);
        if (data) {
          addListing(data);
          getSellerStats(data.seller_id).then(setSellerStats);
          getListingViews(data.id).then(setListingViews);
        }
      }).catch(() => setListing(null)).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (listing?.category) {
      getListings({ category: listing.category, limit: 5 }).then(data => {
        // filter out current listing and take top 4
        setRelatedListings(data.filter(item => item.id !== listing.id).slice(0, 4));
      }).catch(() => {});
    }
  }, [listing?.category, listing?.id]);

  if (loading) return (
    <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          <div className="h-8 bg-secondary rounded w-3/4 animate-pulse" />
          <div className="rounded-2xl bg-secondary animate-pulse" style={{ aspectRatio: '4/3' }} />
        </div>
        <div className="rounded-2xl bg-secondary animate-pulse h-96" />
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
    partNumber: 'OEM Part No.', generationChassis: 'Chassis', compatibleYear: 'Compatible Year'
  };

  const flatSchema = {};
  Object.values(ATTRIBUTE_ENGINE).forEach(cat => { if (cat.attributes) cat.attributes.forEach(attr => { flatSchema[attr.id] = attr; }); });

  const booleanFeatures = [];
  const keyValueSpecs = [];
  if (listing.specs) {
    Object.entries(listing.specs).forEach(([k, v]) => {
      if (FEATURE_KEYS.includes(k)) return;
      if (v === '' || v === null || v === undefined || v === 'N/A' || String(v).trim().toLowerCase() === 'n/a') return;
      const schemaAttr = SCHEMA_ATTRIBUTES[k] || flatSchema[k];
      const isBoolean = v === true || v === false || schemaAttr?.type === 'checkbox' || (schemaAttr?.type === 'radio' && v === 'Yes');
      const label = schemaAttr?.label || FRIENDLY_LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      if (isBoolean) { if (v === true) booleanFeatures.push(label); }
      else { keyValueSpecs.push({ key: k, label, val: String(v) }); }
    });
  }
  const featureSpecs = listing.specs ? Object.entries(listing.specs).filter(([k, v]) => FEATURE_KEYS.includes(k) && Array.isArray(v) && v.length > 0) : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isVerifiedSeller = listing.seller?.created_at && (new Date() - new Date(listing.seller.created_at)) / (1000 * 60 * 60 * 24) > 30;
  const isDescriptionShort = listing.description?.length < 150;
  const isDescriptionLong = listing.description?.length > 250;

  return (
    <div className="py-4 sm:py-8 pb-36 sm:pb-20 lg:pb-8 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-6xl">

        {listing.category === 'seeking-work' ? (
          <CandidateProfile listing={listing} />
        ) : (
          <>
            {/* Breadcrumb - Truncated earlier items, only active final */}
            <nav className="flex items-center gap-1 sm:gap-2 mb-4 text-xs sm:text-sm text-muted-foreground flex-nowrap overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
              <Link to="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">▶</span>
              <Link to="/browse" className="hover:text-foreground transition-colors shrink-0">Browse</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">▶</span>
              <Link to={`/browse?category=${listing.category}`} className="hover:text-foreground transition-colors capitalize shrink-0">{listing.category?.replace(/-/g, ' ')}</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">▶</span>
              <span className="text-foreground font-semibold truncate flex-1 min-w-[100px]">{listing.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
              
              {/* ── LEFT COLUMN ── */}
              <div className="min-w-0 flex flex-col gap-6">

                {/* 1. TITLE & PRICE BLOCK */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground mb-3 leading-tight">
                      {listing.title}
                    </h1>
                    
                    {/* Quick Facts Chips */}
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      {listing.condition && (
                         <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-1">
                          {listing.condition}
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 capitalize">
                        {listing.category?.replace(/-/g, ' ')}
                      </span>
                      {listing.make && (
                        <span className="inline-flex items-center rounded-full bg-border text-foreground px-2.5 py-1">
                           {listing.make} {listing.model}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-muted-foreground px-2 py-1">
                        <MapPin className="w-3 h-3" /> {listing.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground px-2 py-1">
                        <Eye className="w-3 h-3" /> {listing.views} Views
                      </span>
                    </div>
                  </div>
                  
                  {listing.price > 0 && (
                    <div className="shrink-0 text-right">
                      <div className="text-3xl sm:text-4xl font-display font-black text-primary">{formatPrice(listing.price)}</div>
                      {listing.negotiable && <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1 uppercase tracking-wider">Negotiable</div>}
                    </div>
                  )}
                </div>

                {/* 2. IMAGE GALLERY */}
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden border border-border bg-[#0f1411] dark:bg-black group flex items-center justify-center">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={imageUrl(images[activeImg])}
                          alt={`${listing.title} – image ${activeImg + 1} of ${images.length}`}
                          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                          style={{ maxHeight: 'max(380px, min(65vh, 520px))' }}
                          onError={e => { e.target.src = 'https://placehold.co/800x600/1a2b1e/00d168?text=AdHub'; }}
                        />
                        {/* Image Counter Overlay */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 shadow-sm border border-white/10">
                          {activeImg + 1} / {images.length}
                        </div>
                        {/* Fullscreen Hint */}
                        <button 
                          onClick={() => setIsZoomModalOpen(true)}
                          className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black border border-white/10 shadow-sm">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-6xl bg-secondary w-full" style={{ height: 400 }}>🖼️</div>
                    )}
                  </div>
                  
                  {/* Thumbnail Strip (Moved below image) */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                      {images.map((img, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActiveImg(i)}
                          className={`snap-start relative h-16 w-20 sm:h-20 sm:w-28 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${i === activeImg ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'}`}
                        >
                          <img 
                            src={imageUrl(img)} 
                            alt=""
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://placehold.co/72x72/1a2b1e/00d168?text=img'; }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. SPECS (Moved up) */}
                {keyValueSpecs.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="text-primary">📋</span> Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
                      {(showAllSpecs ? keyValueSpecs : keyValueSpecs.slice(0, 12)).map(item => (
                        <div key={item.key} className="bg-background px-4 py-2 flex flex-col justify-center min-h-[44px]">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</span>
                          <span className="font-semibold text-sm text-foreground">{item.val}</span>
                        </div>
                      ))}
                    </div>
                    {keyValueSpecs.length > 12 && (
                      <button 
                        onClick={() => setShowAllSpecs(!showAllSpecs)}
                        className="mt-3 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        {showAllSpecs ? 'Hide full specifications' : `View all ${keyValueSpecs.length} specifications`}
                      </button>
                    )}
                  </div>
                )}

                {/* Features (Boolean) */}
                {(booleanFeatures.length > 0 || featureSpecs.length > 0) && (
                   <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="text-primary">✨</span> Features & Amenities
                    </h3>
                    <div className="flex flex-col gap-5">
                      {booleanFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {booleanFeatures.map(f => (
                            <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary text-foreground">✓ {f}</span>
                          ))}
                        </div>
                      )}
                      
                      {featureSpecs.map(([key, features]) => (
                        <div key={key}>
                          <h4 className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-wider">{FEATURE_LABELS[key]}</h4>
                          <div className="flex flex-wrap gap-2">
                            {features.map(f => (
                              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary text-foreground">✓ {f}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                   </div>
                )}

                {/* 4. DESCRIPTION (Expandable) */}
                <div className={`rounded-2xl border border-border bg-card ${isDescriptionShort ? 'p-5' : 'p-5 sm:p-7'} relative overflow-hidden`}>
                   <h3 className="font-bold text-lg mb-3">Description</h3>
                   <div className={`text-muted-foreground leading-relaxed whitespace-pre-wrap transition-all duration-300 relative ${isDescriptionLong && !descExpanded ? 'line-clamp-3' : ''}`}>
                     {listing.description}
                   </div>
                   
                   {/* Toggle Button */}
                   {isDescriptionLong && (
                     <button 
                       onClick={() => setDescExpanded(!descExpanded)}
                       className="mt-3 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                     >
                       {descExpanded ? 'Show Less' : 'Read More'}
                     </button>
                   )}
                </div>
                
              </div>

              {/* ── RIGHT COLUMN: Contact card (sticky on desktop) ── */}
              <aside className="lg:sticky lg:top-24 z-10 flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col">
                  
                  {/* Seller Info (Compact) */}
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 border border-primary/20">
                      {listing.seller?.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-foreground text-lg truncate">{listing.seller?.name || 'Seller'}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                         Member since {new Date(listing.seller?.created_at || listing.created_at).getFullYear()}
                      </div>
                    </div>
                  </div>
                  
                  {isVerifiedSeller && (
                    <div className="px-5 pb-4">
                      <div className="flex items-center justify-center gap-1.5 w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-green-200 dark:border-green-800">
                        <ShieldCheck className="w-4 h-4" /> Verified Seller
                      </div>
                    </div>
                  )}

                  <hr className="border-border" />

                  {/* Trust Indicators Section */}
                  <div className="px-5 py-4 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-semibold">Joined</span>
                      <span className="font-bold text-foreground">
                        {new Date(sellerStats?.member_since || listing.seller?.created_at || listing.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-semibold">Listings</span>
                      <span className="font-bold text-foreground">{sellerStats?.total_listings || 1}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-semibold">Last Active</span>
                      <span className="font-bold text-foreground">Recently</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-semibold">Response</span>
                      <span className="font-bold text-foreground">Usually fast</span>
                    </div>
                  </div>

                  <hr className="border-border" />
                  
                  {/* Contact Conversion Banner */}
                  <div className="px-5 pt-4 text-xs font-medium text-muted-foreground flex flex-col gap-1">
                     <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Viewed {listingViews} times</span>
                  </div>

                  {/* Contact Buttons (Redesigned) */}
                  <div className="p-5 flex flex-col gap-3">
                    {user ? (
                      <>
                        {(listing.whatsapp || listing.phone) && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-[13px] px-4 font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-sm"
                            style={{ background: '#25D366' }}>
                            <MessageCircle className="w-5 h-5 fill-current" /> Chat on WhatsApp
                          </a>
                        )}
                        
                        <MessageButton listing={listing} variant="primary" />
                        
                        {!showNumber ? (
                          <button onClick={() => setShowNumber(true)}
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 px-4 font-bold text-foreground text-sm border border-border bg-background hover:bg-secondary transition-colors">
                            <Phone className="w-4 h-4" /> Show Phone Number
                          </button>
                        ) : (
                          <div className="flex gap-2">
                             <a href={`tel:${listing.phone}`}
                              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 font-bold text-white text-sm bg-primary hover:bg-primary/90 transition-colors">
                              <Phone className="w-4 h-4" /> Call Now
                            </a>
                            <div className="flex-1 flex items-center justify-center rounded-xl bg-secondary border border-border px-4 py-2.5 text-center font-bold text-sm tracking-wide">
                              {listing.phone}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="relative">
                        <div className="blur-[4px] pointer-events-none select-none opacity-60 flex flex-col gap-3">
                          <div className="flex items-center justify-center gap-2 w-full rounded-xl py-[13px] px-4 font-bold text-white text-sm" style={{ background: '#25D366' }}><MessageCircle className="w-5 h-5" /> Chat on WhatsApp</div>
                          <div className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 px-4 font-bold text-foreground text-sm border border-border bg-background"><Phone className="w-4 h-4" /> Show Phone Number</div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/80 rounded-xl backdrop-blur-sm p-4 text-center border border-border shadow-sm">
                          <div className="text-3xl">🔒</div>
                          <div className="font-bold text-sm">Sign in to contact</div>
                          <div className="flex gap-2 w-full">
                            <Link to="/login" state={{ from: `/listing/${listing.id}` }} className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 font-semibold text-xs text-center hover:opacity-90 transition-opacity">Login</Link>
                            <Link to="/register" state={{ from: `/listing/${listing.id}` }} className="flex-1 rounded-lg border border-border bg-secondary py-2 font-semibold text-xs text-center hover:bg-secondary/70 transition-colors">Register</Link>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Row (Save / Share Inline) */}
                    <div className="flex gap-3 mt-1">
                       <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/70 transition-colors text-sm font-semibold">
                         <Heart className="w-4 h-4" /> Save
                       </button>
                       <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/70 transition-colors text-sm font-semibold">
                         <Share2 className="w-4 h-4" /> Share
                       </button>
                    </div>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="flex flex-col gap-3">
                   <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors w-fit font-semibold text-sm group mx-1">
                     <Flag className="w-4 h-4 group-hover:fill-destructive" /> Report this listing
                   </button>
                   <div className="text-muted-foreground flex gap-2 items-start bg-secondary/50 p-3 rounded-xl border border-border text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <p>Meet in a public place. Never send money in advance.</p>
                        <Link to="/safety" className="text-primary font-semibold hover:underline">Learn More →</Link>
                      </div>
                   </div>
                </div>

              </aside>

            </div>
          </>
        )}

        {/* 5. RELATED CONTENT (Moved outside the grid to span full width above footer) */}
        {listing.category !== 'seeking-work' && relatedListings.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="font-display text-2xl font-bold mb-6">You may also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedListings.map(item => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      {listing.category !== 'seeking-work' && (
        <div
          className="lg:hidden fixed left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-3 px-4 z-[45] flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 60px)' }}
        >
          <div className="flex flex-col min-w-0">
             {listing.price > 0 && <span className="font-display font-black text-xl text-primary">{formatPrice(listing.price)}</span>}
             <span className="text-xs text-muted-foreground truncate">{listing.seller?.name || 'Seller'}</span>
          </div>
          <div className="flex gap-2 shrink-0">
            {user ? (
               <>
                 {listing.phone && (
                   <a href={`tel:${listing.phone}`} className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary border border-border text-foreground">
                     <Phone className="w-5 h-5" />
                   </a>
                 )}
                 {(listing.whatsapp || listing.phone) && (
                   <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-11 px-5 rounded-full text-white font-bold text-sm shadow-md" style={{ background: '#25D366' }}>
                     <MessageCircle className="w-5 h-5 fill-current" /> Chat
                   </a>
                 )}
                 <MessageButton listing={listing} variant="secondary" className="!rounded-full !w-auto !px-5 !h-11" />
               </>
            ) : (
               <Link to="/login" state={{ from: `/listing/${listing.id}` }} className="flex items-center justify-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                 Sign in to Contact
               </Link>
            )}
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
      {isZoomModalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Zoom Modal Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
             <span className="text-white/80 font-medium">{activeImg + 1} / {images.length}</span>
             <button onClick={() => setIsZoomModalOpen(false)} aria-label="Close zoom" className="text-white/80 hover:text-white transition p-2 bg-black/20 rounded-full backdrop-blur-md">
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Zoom Modal Main Image Container */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden w-full" tabIndex={0} autoFocus onKeyDown={handleZoomKeyDown}>
             {/* Main Image */}
             <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 mt-12 mb-24">
               <img src={imageUrl(images[activeImg])} alt="" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
             </div>

             {/* Prev/Next Controls */}
             {images.length > 1 && (
               <>
                 <button onClick={() => setActiveImg(prev => prev === 0 ? images.length - 1 : prev - 1)} aria-label="Previous image" className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition backdrop-blur-md z-10">
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button onClick={() => setActiveImg(prev => prev === images.length - 1 ? 0 : prev + 1)} aria-label="Next image" className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition backdrop-blur-md z-10">
                   <ChevronRight className="w-6 h-6" />
                 </button>
               </>
             )}
          </div>

          {/* Zoom Modal Thumbnails */}
          <div className="absolute bottom-4 sm:bottom-8 flex gap-2 overflow-x-auto max-w-full px-4 snap-x py-2 z-10">
             {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`snap-start relative h-16 w-20 sm:h-20 sm:w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === activeImg ? 'border-white scale-105 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={imageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
             ))}
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </div>
  );
}
