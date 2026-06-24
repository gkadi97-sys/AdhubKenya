import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    // Mocking "featured" listings by grabbing the 6 most recent.
    // In the future, this should query for listings with a 'featured' flag or a specific premium sort.
    queryFn: () => getListings({ limit: 6, sort: 'createdAt' }),
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Featured Listings</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[280px] sm:w-auto h-[320px] rounded-2xl bg-secondary/50 animate-pulse shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (!data?.listings?.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Premium Picks</h2>
        </div>
        <Link to="/browse" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          Explore all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Mobile: horizontal scroll. Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
        {data.listings.map((listing) => (
          <div key={listing.id} className="w-[280px] sm:w-auto shrink-0">
            <ListingCard listing={listing} featured={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
