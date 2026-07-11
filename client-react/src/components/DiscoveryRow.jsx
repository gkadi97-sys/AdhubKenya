import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';

export default function DiscoveryRow({
  title,
  subtitle,
  sort = 'createdAt',
  limit = 10,
  linkTo = '/browse',
  category,
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['discovery', sort, limit, category],
    queryFn: () => getListings({ limit, sort, ...(category ? { category } : {}) }),
    staleTime: 1000 * 60 * 5,
  });

  const listings = data?.listings || [];

  return (
    <section>
      {/* ── Section header ── */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {subtitle && (
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-1">
              {subtitle}
            </span>
          )}
          <h2 className="font-display text-xl font-bold sm:text-2xl lg:text-[1.6rem] tracking-tight leading-tight">
            {title}
          </h2>
        </div>
        <Link
          to={linkTo}
          className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
        >
          View All
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── Grid / Scroll ── */}
      {isLoading ? (
        /* Skeleton — horizontal scroll on mobile, grid on desktop */
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[260px] md:w-auto shrink-0">
              <ListingCardSkeleton />
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:snap-none">
          {listings.map((listing, i) => (
            <div key={listing.id} className="w-[260px] md:w-auto shrink-0 snap-center">
              <ListingCard listing={listing} featured={i < 2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
          No listings found here yet.
        </div>
      )}
    </section>
  );
}
