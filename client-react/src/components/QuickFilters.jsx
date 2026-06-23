import { useState } from 'react';
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
      <div className="flex items-center gap-3 w-max px-1">
        <div className="flex items-center gap-2 pr-4 border-r border-border">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Filters</span>
        </div>

        <button 
          onClick={() => handleFilter('seller_type', 'Verified')}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition"
        >
          <BadgeCheck className="w-4 h-4 text-primary" /> Verified Sellers Only
        </button>

        <button 
          onClick={() => handleFilter('condition', 'New')}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition"
        >
          Brand New
        </button>

        <button 
          onClick={() => handleFilter('posted', 'Today')}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition"
        >
          Posted Today
        </button>

        <select 
          onChange={(e) => {
            if (e.target.value) handleFilter('county', e.target.value);
          }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium outline-none hover:border-primary/40 cursor-pointer"
        >
          <option value="">Location: Anywhere</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select 
          onChange={(e) => {
            if (e.target.value) handleFilter('maxPrice', e.target.value);
          }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium outline-none hover:border-primary/40 cursor-pointer"
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
