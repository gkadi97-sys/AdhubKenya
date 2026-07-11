import { History, X } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ListingCard from '@/components/ListingCard';

export default function RecentlyViewed() {
  const { recentListings, clearHistory } = useRecentlyViewed();

  if (!recentListings || recentListings.length === 0) return null;

  return (
    <section>
      {/* ── Section header ── */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <History className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
              Your History
            </span>
            <h2 className="font-display text-xl font-bold sm:text-2xl lg:text-[1.6rem] tracking-tight leading-tight">
              Recently Viewed
            </h2>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
        >
          Clear <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Mobile: horizontal scroll. md+: responsive grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:snap-none">
        {recentListings.map((listing) => (
          <div key={listing.id} className="w-[260px] md:w-auto shrink-0 snap-center">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
}
