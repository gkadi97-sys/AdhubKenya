import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function DiscoveryRow({ title, subtitle, sort = 'createdAt', limit = 8, linkTo = '/browse' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['discovery', sort, limit],
    queryFn: () => getListings({ limit, sort }),
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  return (
    <section className="mb-0">
      <div className="mt-12 mb-5 flex items-end justify-between gap-4">
        <div>
          {subtitle && <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{subtitle}</span>}
          <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl tracking-tight">{title}</h2>
        </div>
        <Link to={linkTo} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group transition-colors">
          View All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        {isLoading ? (
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[280px] h-[320px] rounded-2xl bg-secondary/50 animate-pulse shrink-0" />
            ))}
          </div>
        ) : data?.listings?.length > 0 ? (
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {data.listings.map((listing, i) => (
              <div key={listing.id} className="w-[280px] sm:w-[320px] shrink-0">
                <ListingCard listing={listing} featured={i < 2} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground w-full border border-dashed border-border rounded-2xl">
            No listings found here yet.
          </div>
        )}
      </div>
    </section>
  );
}
