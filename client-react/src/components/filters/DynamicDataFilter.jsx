import { useState, useEffect } from 'react';
import { getFilterAggregates } from '@/lib/api';

export default function DynamicDataFilter({ category, urlParam, filters, value, onChange }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    if (!category) return;
    
    // Omit the parameter we are currently fetching for to get its true unfiltered aggregate
    const filterParams = { ...filters };
    delete filterParams[urlParam];

    let isMounted = true;
    getFilterAggregates(category, urlParam, filterParams).then(res => {
      if (isMounted) setCounts(res);
    }).catch(err => {
      console.error("Failed to fetch aggregate for", urlParam, err);
      if (isMounted) setCounts({});
    });
    return () => { isMounted = false };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, urlParam, JSON.stringify(filters)]);

  if (!counts) return <div className="animate-pulse h-10 w-full bg-secondary/50 rounded-xl" />;
  
  const options = Object.keys(counts).filter(k => counts[k] > 0).sort();

  return (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-xl border border-border px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-8 ${options.length === 0 ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed' : 'bg-background'}`}
        disabled={options.length === 0}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        {options.length === 0 ? (
          <option value="">None available</option>
        ) : (
          <option value="">Any</option>
        )}
        {options.map(o => (
          <option key={o} value={o}>
            {o} ({counts[o]})
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  );
}
