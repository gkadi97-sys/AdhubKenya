import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/categoryData';

const RECENT_CATS_KEY = 'adhub_recent_categories';

export default function ContinueBrowsing() {
  const [recentCats, setRecentCats] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_CATS_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentCats(JSON.parse(stored).slice(0, 4));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      // ignore storage errors
    }

  }, []);

  if (recentCats.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Continue Browsing</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ width: 'max-content' }}>
        {recentCats.map(slug => {
          const c = CATEGORY_ICONS.find(x => x.slug === slug);
          if (!c) return null;
          return (
            <Link 
              key={slug} 
              to={`/browse?category=${slug}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 transition hover:border-primary/40 hover:bg-secondary/50 shrink-0 min-w-[160px]"
            >
              <div className="text-xl">{c.icon}</div>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  Resume <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
