import { useNavigate } from 'react-router-dom';
import { BadgeCheck, SlidersHorizontal } from 'lucide-react';
import { COUNTIES } from '@/lib/countyData';

export default function QuickFilters() {
  const navigate = useNavigate();

  const handleFilter = (key, value) => {
    const p = new URLSearchParams();
    p.set(key, value);
    navigate(`/browse?${p.toString()}`);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <div
        role="toolbar"
        aria-label="Quick filters"
        className="flex items-center gap-3 w-max px-1"
      >
        <div className="flex items-center gap-2 pr-4 border-r border-border" aria-hidden="true">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Filters</span>
        </div>

        <button
          type="button"
          onClick={() => handleFilter('seller_type', 'Verified')}
          aria-label="Filter: Verified sellers only"
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <BadgeCheck className="w-4 h-4 text-primary" /> Verified Sellers Only
        </button>

        <button
          type="button"
          onClick={() => handleFilter('condition', 'New')}
          aria-label="Filter: Brand new items only"
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Brand New
        </button>

        <button
          type="button"
          onClick={() => handleFilter('posted', 'Today')}
          aria-label="Filter: Posted today"
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Posted Today
        </button>

        <select
          aria-label="Filter by location"
          onChange={(e) => {
            if (e.target.value) handleFilter('county', e.target.value);
          }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium outline-none hover:border-primary/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <option value="">Location: Anywhere</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          aria-label="Filter by maximum price"
          onChange={(e) => {
            if (e.target.value) handleFilter('maxPrice', e.target.value);
          }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium outline-none hover:border-primary/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <option value="">Price: Any</option>
          <option value="5000">Under KSh 5,000</option>
          <option value="20000">Under KSh 20,000</option>
          <option value="50000">Under KSh 50,000</option>
          <option value="100000">Under KSh 100,000</option>
          <option value="500000">Under KSh 500,000</option>
        </select>
      </div>
    </div>
  );
}
