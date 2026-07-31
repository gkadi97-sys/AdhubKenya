import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useMetadataCache } from '@/lib/useMetadataCache';

export default function FilterChips({ categorySlug }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const metadata = useMetadataCache(categorySlug || searchParams.get('category') || '');

  const activeFilters = [];
  
  // Parse active filters from URL
  for (const [key, value] of searchParams.entries()) {
    if (['category', 'sort', 'page', 'keyword'].includes(key)) continue; // ignore system/routing params

    // Try to find the human-readable label for the attribute
    let label = key;
    const attr = metadata?.attributes?.find(a => a.name === key);
    if (attr) {
      label = attr.label || key;
    }

    activeFilters.push({
      key,
      label,
      value
    });
  }

  if (activeFilters.length === 0) return null;

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAll = () => {
    const newParams = new URLSearchParams();
    if (searchParams.has('category')) {
      newParams.set('category', searchParams.get('category'));
    }
    if (searchParams.has('keyword')) {
      newParams.set('keyword', searchParams.get('keyword'));
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeFilters.map(filter => (
        <div key={filter.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          <span className="opacity-70 mr-1">{filter.label}:</span>
          <span>{filter.value}</span>
          <button 
            onClick={() => removeFilter(filter.key)}
            className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            title={`Remove ${filter.label}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button 
        onClick={clearAll}
        className="text-sm text-muted-foreground hover:text-primary hover:underline ml-2 transition-colors font-medium"
      >
        Clear All
      </button>
    </div>
  );
}
