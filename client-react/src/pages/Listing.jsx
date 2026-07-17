import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import { getListing, getListings, toggleSaved, getSaved, imageUrl, formatPrice, timeAgo, getSellerStats, getListingViews, trackInteraction, canUserReviewSeller } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/lib/useSEO';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import SEOEngine from '@/lib/seo/SEOEngine';
import SchemaFactory from '@/lib/seo/SchemaFactory';
import UrlService from '@/lib/seo/UrlService';
import MetadataListingSpecs from '@/components/MetadataListingSpecs';
import CandidateProfile from '@/components/CandidateProfile';
import ListingCard from '@/components/ListingCard';
import MessageButton from '@/components/MessageButton';
import ReportModal from '@/components/ReportModal';
import StarRating from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';
// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import { Heart, Share2, MapPin, Eye, Clock, Flag, ShieldCheck, ChevronDown, ChevronUp, Maximize2, MessageCircle, Phone, ArrowLeft, AlertCircle, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import Image from '@/components/Image';

export default function ListingDetailPage() {
  // eslint-disable-next-line no-unused-vars -- `category` comes from route but listing.category is used directly
  const { id, category: _category, slugId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addListing, recentListings } = useRecentlyViewed();
  const [listing, setListing] = useState(null);
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  const [zoomedImage, setZoomedImage] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [listingViews, setListingViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [relatedListings, setRelatedListings] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingListing, setSavingListing] = useState(false);

  // Keyboard navigation for zoom modal
  const handleZoomKeyDown = useCallback((e) => {
    if (!isZoomModalOpen) return;
    if (e.key === 'Escape') { setIsZoomModalOpen(false); }
    if (e.key === 'ArrowLeft') { setActiveImg(prev => prev === 0 ? images.length - 1 : prev - 1); }
    if (e.key === 'ArrowRight') { setActiveImg(prev => (prev + 1) % images.length); }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally run only on initial mount
  }, [isZoomModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleZoomKeyDown);
    return () => window.removeEventListener('keydown', handleZoomKeyDown);
  }, [handleZoomKeyDown]);

  // Extract UUID if present (either from 'id' param or trailing part of 'slugId')
  const paramVal = id || slugId || '';
  const uuidMatch = paramVal.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  const actualId = uuidMatch ? uuidMatch[0] : paramVal;

  useSEO(listing ? {
    ...SEOEngine.generateListing(listing),
    schema: [
      SchemaFactory.generate('BreadcrumbList', [
        { name: 'Home', url: '/' },
        { name: listing.category?.replace(/-/g, ' '), url: UrlService.category(listing.category) },
        { name: listing.title, url: UrlService.listing(listing) }
      ]),
      SchemaFactory.generate(listing.category === 'vehicles' ? 'Vehicle' : 'Product', listing)
    ]
  } : SEOEngine.generateStatic('Loading Listing...', '', location.pathname));

  useEffect(() => {
    window.scrollTo(0, 0); 
    if (actualId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: initiates loading state
      setLoading(true);
      getListing(actualId).then(data => {
        if (!data) {
          setListing(null);
          return;
        }

        // URL Normalization & Redirect Strategy
        const canonicalUrl = UrlService.listing(data);
        if (location.pathname !== canonicalUrl) {
          // If they visited /listing/:id or a malformed slug URL, we 301 replace to canonical
          navigate(canonicalUrl, { replace: true });
          // Note: The router will re-render with the new canonical URL
        }

        setListing(data);
        addListing(data);
        trackInteraction(data.id, data.category, 'view');
        
        if (data.seller_id) {
          getSellerStats(data.seller_id).then(setSellerStats);
          canUserReviewSeller(data.seller_id).then(setCanReview);
        }
        setListingViews(data.views || 0);
        getListingViews(data.id).then(count => { if (count > 0) setListingViews(count); });
      }).catch(() => setListing(null)).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- addListing/navigate/location are stable refs; only re-run when actualId changes
  }, [actualId]);

  useEffect(() => {
    if (listing?.category) {
      getListings({ category: listing.category, limit: 5 }).then(data => {
        // getListings returns { listings, total, pages } â€” use .listings
        const items = data?.listings || [];
        setRelatedListings(items.filter(item => item.id !== listing.id).slice(0, 4));
      }).catch(() => {});
    }
  }, [listing?.category, listing?.id]);

  // Load saved state for this listing
  useEffect(() => {
    if (!user || !listing?.id) return;
    getSaved().then(saved => {
      setIsSaved(saved.some(s => s.listing_id === listing.id));
    }).catch(() => {});
  }, [user, listing?.id]);

  const handleToggleSave = async () => {
    // eslint-disable-next-line no-undef
    if (!user) { toast('Sign in to save listings', { icon: 'ðŸ”’' }); return; }
    setSavingListing(true);
    try {
      const newState = await toggleSaved(listing.id);
      setIsSaved(newState);
      // eslint-disable-next-line no-undef
      toast.success(newState ? 'Saved to your list!' : 'Removed from saved');
    } catch {
      // eslint-disable-next-line no-undef
      toast.error('Failed to save. Please try again.');
    } finally {
      setSavingListing(false);
    }
  };

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
      <div className="text-6xl mb-4">ðŸ˜•</div>
      <h3 className="font-display text-2xl font-bold mb-2">Listing not found</h3>
      <p className="text-muted-foreground mb-6">This ad may have been removed or expired</p>
      <Link to="/browse" className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold text-sm hover:opacity-90 transition-opacity">Browse Ads</Link>
    </div>
  );

  const images = listing.images?.length ? listing.images : [];
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in your ad: "${listing.title}" on AdHub Kenya.`);
  const waNumber = listing.whatsapp?.replace(/\D/g, '') || listing.phone?.replace(/\D/g, '');
  const waLink = waNumber ? `https://wa.me/${waNumber.startsWith('0') ? '254' + waNumber.slice(1) : waNumber}?text=${whatsappMsg}` : null;

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
          <CandidateProfile listing={listing} listingViews={listingViews} />
        ) : (
          <>
            {/* Breadcrumb - Truncated earlier items, only active final */}
            <nav className="flex items-center gap-1 sm:gap-2 mb-4 text-xs sm:text-sm text-muted-foreground flex-nowrap overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
              <Link to="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">â–¶</span>
              <Link to="/browse" className="hover:text-foreground transition-colors shrink-0">Browse</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">â–¶</span>
              <Link to={`/browse?category=${listing.category}`} className="hover:text-foreground transition-colors capitalize shrink-0">{listing.category?.replace(/-/g, ' ')}</Link>
              <span className="shrink-0 text-[10px] sm:text-xs">â–¶</span>
              <span className="text-foreground font-semibold truncate flex-1 min-w-[100px]">{listing.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
              
              {/* â”€â”€ LEFT COLUMN â”€â”€ */}
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
                        <Eye className="w-3 h-3" /> {listingViews} Views
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
                        <Image
                          key={activeImg}
                          src={imageUrl(images[activeImg])}
                          alt={`${listing.title} â€“ image ${activeImg + 1} of ${images.length}`}
                          className="w-full transition-transform duration-500 group-hover:scale-105"
                          style={{ maxHeight: 'max(380px, min(65vh, 520px))', height: 'max(380px, min(65vh, 520px))' }}
                          fallbackIconSize={48}
                        />
                        {/* Image Counter Overlay */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 shadow-sm border border-white/10 pointer-events-none">
                          {activeImg + 1} / {images.length}
                        </div>
                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                              aria-label="Previous image"
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/80 transition backdrop-blur-md z-10 opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                              aria-label="Next image"
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/80 transition backdrop-blur-md z-10 opacity-0 group-hover:opacity-100 border border-white/20 shadow-lg"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {/* Fullscreen Hint */}
                        <button 
                          onClick={() => setIsZoomModalOpen(true)}
                          className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black border border-white/10 shadow-sm">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <Image src={null} className="w-full" style={{ height: 400 }} fallbackIconSize={56} />
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
                            <Image
                            src={imageUrl(img)}
                            alt={`Thumbnail ${i + 1}`}
                            className="w-full h-full"
                            fallbackIconSize={14}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. SPECS (Moved up) */}
                <MetadataListingSpecs listing={listing} />

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

              {/* â”€â”€ RIGHT COLUMN: Contact card (sticky on desktop) â”€â”€ */}
              <aside className="lg:sticky lg:top-24 z-10 flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col">
                  
                  {/* Seller Info (Compact) */}
                  <div className="p-5 flex items-center gap-4 group">
                    <Link to={`/user/${listing.seller_id}`} className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 border border-primary/20 hover:opacity-80 transition-opacity">
                      {listing.seller?.name?.[0]?.toUpperCase() || 'S'}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/user/${listing.seller_id}`} className="font-bold text-foreground text-lg truncate hover:underline hover:text-primary transition-colors block">
                        {listing.seller?.name || 'Seller'}
                      </Link>
                      <div className="mt-1">
                        <StarRating rating={sellerStats?.average_rating || 0} count={sellerStats?.review_count || 0} size="sm" />
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
                        {canReview && (
                          <div className="pt-2">
                            <button onClick={() => setIsReviewModalOpen(true)} className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 px-4 font-bold text-primary text-sm bg-primary/10 hover:bg-primary/20 transition-colors">
                              <Star className="w-4 h-4 fill-current" /> Rate Seller
                            </button>
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
                          <div className="text-3xl">ðŸ”’</div>
                          <div className="font-bold text-sm">Sign in to contact</div>
                          <div className="flex gap-2 w-full">
                            <Link to="/login" state={{ from: UrlService.listing(listing) }} className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 font-semibold text-xs text-center hover:opacity-90 transition-opacity">Login</Link>
                            <Link to="/register" state={{ from: UrlService.listing(listing) }} className="flex-1 rounded-lg border border-border bg-secondary py-2 font-semibold text-xs text-center hover:bg-secondary/70 transition-colors">Register</Link>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Row (Save / Share Inline) */}
                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={handleToggleSave}
                        disabled={savingListing}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors text-sm font-semibold disabled:opacity-50 ${
                          isSaved
                            ? 'border-rose-400/50 bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                            : 'border-border bg-secondary hover:bg-secondary/70 text-foreground'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-all ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
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
                        <Link to="/safety" className="text-primary font-semibold hover:underline">Learn More â†’</Link>
                      </div>
                   </div>
                </div>

              </aside>

            </div>
          </>
        )}

        {/* â”€â”€ SEO CONTEXT LINKS â”€â”€ */}
        <div className="mt-8 flex flex-wrap gap-2 text-sm font-medium">
          <Link 
            to={UrlService.category(listing.category)}
            className="rounded-full bg-secondary px-4 py-2 text-foreground hover:bg-secondary/80 transition-colors"
          >
            All {listing.category.replace(/-/g, ' ')}
          </Link>

          {(listing.metadata?.make || listing.metadata?.brand) && (
            <Link 
              to={UrlService.brand(listing.category, listing.metadata.make || listing.metadata.brand)}
              className="rounded-full bg-secondary px-4 py-2 text-foreground hover:bg-secondary/80 transition-colors"
            >
              {listing.metadata.make || listing.metadata.brand} {listing.category.replace(/-/g, ' ')}
            </Link>
          )}

          {((listing.metadata?.make || listing.metadata?.brand) && listing.metadata?.model) && (
            <Link 
              to={UrlService.model(listing.category, listing.metadata.make || listing.metadata.brand, listing.metadata.model)}
              className="rounded-full bg-secondary px-4 py-2 text-foreground hover:bg-secondary/80 transition-colors"
            >
              {listing.metadata.model}
            </Link>
          )}

          {listing.county && (
            <Link 
              to={UrlService.location(listing.category, listing.county)}
              className="rounded-full bg-secondary px-4 py-2 text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              {listing.category.replace(/-/g, ' ')} in {listing.county}
            </Link>
          )}
        </div>

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

        {/* 6. RECENTLY VIEWED */}
        {recentListings.filter(item => item.id !== listing.id).length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="font-display text-2xl font-bold mb-6">Recently viewed</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentListings.filter(item => item.id !== listing.id).slice(0, 4).map(item => (
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
               <Link to="/login" state={{ from: UrlService.listing(listing) }} className="flex items-center justify-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">
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
      
      {isReviewModalOpen && (
        <ReviewModal
          sellerId={listing.seller_id}
          sellerName={listing.seller?.name || 'Seller'}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => getSellerStats(listing.seller_id).then(setSellerStats)}
        />
      )}
    </div>
  );
}
