import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { imageUrl, formatPrice, timeAgo } from '@/lib/api';
import { Heart, MapPin, BadgeCheck, Phone } from 'lucide-react';

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

  // Determine mock badge
  let badgeLabel = 'New';
  if (featured) badgeLabel = 'Featured';
  else if (listing.id.endsWith('1') || listing.id.endsWith('5')) badgeLabel = 'Hot';
  else if (isVerified) badgeLabel = 'Verified';

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <article className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          <img
            src={listing.images?.[0]
              ? imageUrl(listing.images[0])
              : `https://placehold.co/800x600/1a2b1e/00d168?text=${encodeURIComponent(listing.category || 'Ad')}`}
            alt={listing.title}
            loading="lazy"
            onError={e => { e.target.src = `https://placehold.co/800x600/1a2b1e/00d168?text=AdHub`; }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur shadow-sm">
            {badgeLabel === 'Verified' ? <BadgeCheck className="h-3 w-3" /> : null}
            {badgeLabel}
          </span>
          
          <button 
            onClick={(e) => handleAction(e, 'save')}
            className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur shadow-sm transition-colors ${saved ? 'bg-destructive/10 text-destructive' : 'bg-background/95 text-foreground/70 hover:text-destructive'}`}
          >
            <Heart className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="line-clamp-1 font-display text-base font-semibold text-foreground">
            {listing.title}
          </h3>
          
          <div className="mt-1 font-display text-lg font-bold text-primary">
            {formatPrice(listing.price)}
          </div>
          
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <span className="inline-flex items-center gap-1 truncate max-w-[60%]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </span>
            <span className="shrink-0">{timeAgo(listing.created_at)}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                  {listing.seller?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs text-muted-foreground font-medium">⭐ 4.8</span>
              </div>
              {isVerified && (
                <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              <Phone className="h-3 w-3" /> Phone Verified
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
