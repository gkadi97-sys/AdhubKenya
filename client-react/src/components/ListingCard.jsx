import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { imageUrl, formatPrice, timeAgo } from '@/lib/api';
import { getSpecTags } from '@/lib/categoryData';
import { useMetadataCache } from '@/lib/useMetadataCache';
import { Heart, MapPin, Camera, Clock, Truck, Image as ImageIcon } from 'lucide-react';
import Image from './Image';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';

function getSaved() {
  try { return JSON.parse(localStorage.getItem('adhub_saved') || '[]'); }
  catch { return []; }
}
function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
  localStorage.setItem('adhub_saved', JSON.stringify(next));
  return next.includes(id);
}

export default function ListingCard({ listing, featured }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(getSaved().includes(listing.id)); }, [listing.id]);

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'save') {
      const isNowSaved = toggleSaved(listing.id);
      setSaved(isNowSaved);
    }
  };

  const isVerified = listing.seller &&
    listing.seller.created_at &&
    (new Date() - new Date(listing.seller.created_at)) / (1000 * 60 * 60 * 24) > 30;

  // Primary Badge (Top Left)
  let primaryBadge = null;
  if (featured) primaryBadge = { label: 'Featured', variant: 'featured' };
  else if (listing.id.endsWith('1') || listing.id.endsWith('5')) primaryBadge = { label: 'Hot', variant: 'hot' };
  else if (isVerified) primaryBadge = { label: 'Verified', variant: 'verified' };

  // Fetch metadata dynamically to determine which fields are marked for the listing card
  const metadata = useMetadataCache(listing.category);
  let specTags = [];

  if (metadata && metadata.attributes) {
    const cardAttrs = metadata.attributes.filter(a => a.is_listing_card).sort((a, b) => a.display_order - b.display_order);
    cardAttrs.forEach(attr => {
      const val = listing[attr.name] || (listing.specs && listing.specs[attr.name]);
      if (val) specTags.push(val);
    });
  } else {
    specTags = getSpecTags(listing);
  }

  const imageCount = listing.images?.length || 0;

  return (
    <Link to={`/listing/${listing.slug || listing.id}`} className="block h-full group">
      <article className="card-hover overflow-hidden rounded-2xl border border-border bg-card h-full flex flex-col relative">
        {/* Fixed aspect ratio container */}
        <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '4/3' }}>
          <Image
            src={listing.images?.[0] ? imageUrl(listing.images[0]) : null}
            alt={`${listing.title} – Image 1`}
            className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
            fallbackIconSize={32}
          />

          {primaryBadge && (
            <div className="absolute left-3 top-3 z-10">
              <Badge variant={primaryBadge.variant}>{primaryBadge.label}</Badge>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => handleAction(e, 'save')}
            className={`absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full glass shadow-sm transition-all hover:scale-110 active:scale-95 ${saved ? 'text-destructive bg-destructive/10 border-destructive/20' : 'text-foreground/70 hover:text-destructive'}`}
            aria-label={saved ? `Remove "${listing.title}" from saved` : `Save "${listing.title}"`}
            aria-pressed={saved}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${saved ? 'fill-current scale-110' : ''}`} />
          </button>

          {imageCount > 1 && (
            <div className="absolute left-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur shadow-sm">
              <Camera className="w-3 h-3" /> {imageCount}
            </div>
          )}
        </div>

        <div className="p-4 lg:p-5 flex flex-col flex-1">
          <h3 className="line-clamp-2 font-display text-[15px] font-semibold text-foreground leading-snug mb-2 min-h-[2.5rem]">
            {listing.title}
          </h3>

          {/* ── Smart spec strip ── */}
          {(specTags.length > 0 || listing.condition || listing.delivery_available === 'Yes' || listing.deliveryAvailable === 'Yes') && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              {listing.condition && (
                <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {listing.condition}
                </span>
              )}
              {specTags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {tag}
                </span>
              ))}
              {(listing.delivery_available === 'Yes' || listing.deliveryAvailable === 'Yes') && (
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Truck className="w-3 h-3" /> Delivery
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-1 mt-auto">
            <div className="font-display text-xl font-extrabold text-primary">
              {formatPrice(listing.price)}
            </div>
            {listing.negotiable && (
              <span className="inline-flex items-center rounded-sm bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                Negotiable
              </span>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="inline-flex items-center gap-1 truncate max-w-[60%]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{listing.location || listing.county || 'Kenya'}</span>
            </span>
            {timeAgo(listing.created_at) && (
              <span className="inline-flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                {timeAgo(listing.created_at)}
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                {listing.seller?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate">
                {listing.seller?.name || 'Seller'}
              </span>
            </div>
            {isVerified && (
              <div className="shrink-0 ml-2">
                <Badge variant="verified">Verified</Badge>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

ListingCard.Skeleton = function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card h-full flex flex-col">
      <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '4/3' }}>
        <Skeleton variant="card" className="h-full w-full rounded-none" />
      </div>
      <div className="p-4 lg:p-5 flex flex-col flex-1">
        <Skeleton variant="title" className="mb-2 w-full" />
        <Skeleton variant="title" className="mb-4 w-2/3" />
        <div className="flex gap-2 mb-auto">
          <Skeleton className="w-16 h-5 rounded" />
          <Skeleton className="w-16 h-5 rounded" />
        </div>
        <Skeleton className="w-1/3 h-6 mt-4 mb-2" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="w-1/3 h-3" />
          <Skeleton className="w-1/4 h-3" />
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-between">
          <Skeleton className="w-1/3 h-5 rounded" />
          <Skeleton className="w-1/4 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
};
