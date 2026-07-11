import { useState, useEffect, useRef } from 'react';
import { getPersonalizedRecommendations } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CandidateCard from '@/components/CandidateCard';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export default function RecommendedRow({ 
  limit = 12,
  title = "Recommended for You",
  subtitle = "Based on your recent activity"
}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    getPersonalizedRecommendations(limit)
      .then(data => setListings(data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [limit]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.8 : 800;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!loading && listings.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" /> {title}
          </h2>
          {subtitle && <p className="text-sm font-medium text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-background border border-border/50 shadow-sm flex items-center justify-center text-foreground hover:bg-secondary hover:border-border transition-all active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-background border border-border/50 shadow-sm flex items-center justify-center text-foreground hover:bg-secondary hover:border-border transition-all active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 sm:px-0 pb-6 pt-2 hide-scrollbar scroll-smooth"
        >
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <ListingCardSkeleton />
              </div>
            ))
          ) : (
            listings.map(l => (
              <div key={l.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start h-full">
                {l.category === 'seeking-work' 
                  ? <CandidateCard listing={l} /> 
                  : <ListingCard listing={l} />}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* CSS to hide scrollbar but keep functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
