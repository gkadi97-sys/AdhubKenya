import { Link } from 'react-router-dom';
import { History, X } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ListingCard from '@/components/ListingCard';

export default function RecentlyViewed() {
  const { recentListings, clearHistory } = useRecentlyViewed();

  if (!recentListings || recentListings.length === 0) return null;

  return (
    <section className="mb-0">
      <div className="mt-12 mb-5 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold sm:text-2xl tracking-tight">Recently Viewed</h2>
        </div>
        <button 
          onClick={clearHistory}
          className="text-xs font-semibold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
        >
          Clear <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {recentListings.map((listing) => (
          <div key={listing.id} className="w-[280px] sm:w-[320px] shrink-0">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
}
