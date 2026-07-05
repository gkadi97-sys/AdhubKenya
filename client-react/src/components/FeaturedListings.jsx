import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getFeaturedListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function FeaturedListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => getFeaturedListings(10),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-0.5">
                Handpicked
              </span>
              <h2 className="font-display text-xl font-bold sm:text-2xl lg:text-[1.6rem] tracking-tight leading-tight">
                Premium Picks
              </h2>
            </div>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[260px] md:w-auto h-[320px] rounded-2xl bg-secondary/50 animate-pulse shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (!data?.listings?.length) return null;

  return (
    <section>
      {/* ── Section header ── */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-0.5">
              Handpicked
            </span>
            <h2 className="font-display text-xl font-bold sm:text-2xl lg:text-[1.6rem] tracking-tight leading-tight">
              Premium Picks
            </h2>
          </div>
        </div>
        <Link
          to="/browse"
          className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
        >
          Explore all
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Mobile: horizontal scroll. md+: responsive grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:snap-none">
        {data.listings.map((listing) => (
          <div key={listing.id} className="w-[260px] md:w-auto shrink-0 snap-center">
            <ListingCard listing={listing} featured={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
