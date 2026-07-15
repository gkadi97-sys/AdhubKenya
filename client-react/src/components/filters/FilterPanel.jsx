import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListings, getLookupValues, getVehicleMakes } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useMetadataCache } from '@/lib/useMetadataCache';
import LocationCascader from './LocationCascader';
import PriceFilter from './PriceFilter';
import { ChevronDown, X, Loader2 } from 'lucide-react';

function FilterGroup({ label, children, defaultOpen = true }) {
  return (
    <details className="group border-b border-border py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground outline-none marker:content-none">
        <span className="text-sm">{label}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-4 flex flex-col gap-3 animate-in fade-in duration-200">
        {children}
      </div>
    </details>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${value === opt ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
          <input type="radio" checked={value === opt} onChange={() => onChange(value === opt ? '' : opt)} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  );
}

function MultiCheck({ options, value = '', onChange }) {
  const selected = value ? value.split(',') : [];
  const toggle = (opt) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next.join(','));
  };
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${selected.includes(opt) ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  );
}

function DebouncedInput({ value: initialValue, onChange, ...props }) {
  const [value, setValue] = useState(initialValue);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
  useEffect(() => { setValue(initialValue || ''); }, [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => { onChange(value); }, 400);
    return () => clearTimeout(timeout);
  }, [value, onChange]);
  return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
}

// ── Dynamic Field Renderer ──
function DynamicFilterField({ attr, value, onChange, filters, parentLookupId }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (attr.is_lookup && attr.lookup_type) {
      // For vehicle_model, we need the parent make's DB id, not just the name string.
      // parentLookupId is pre-resolved and passed in from DynamicFilterField's parent.
      if (attr.lookup_type === 'vehicle_model' && !parentLookupId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
        setOptions([]);
        return;
      }
      setLoading(true);
      getLookupValues(attr.lookup_type, parentLookupId || null).then(data => {
        setOptions(data.map(d => d.value));
        setLoading(false);
      });
    } else if (attr.options) {
      try {
        setOptions(typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options);
      // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
      } catch (e) {
        setOptions([]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally run only on initial mount
  }, [attr.lookup_type, attr.options, parentLookupId]);

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  }

  if (attr.field_type === 'select') {
    return (
      <div className="relative">
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-8"
        >
          <option value="">Any</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  }

  if (attr.field_type === 'multiselect') {
    return (
      <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        <MultiCheck options={options} value={value || ''} onChange={onChange} />
      </div>
    );
  }

  if (attr.field_type === 'radio') {
    return (
      <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        <RadioGroup options={options} value={value || ''} onChange={onChange} />
      </div>
    );
  }

  if (attr.field_type === 'number') {
    // Render min/max if it's a typical number filter
    const minKey = `${attr.name}_min`;
    const maxKey = `${attr.name}_max`;
    return (
      <div className="flex items-center gap-2">
        <DebouncedInput
          type="number"
          placeholder="Min"
          value={filters[minKey] || ''}
          onChange={val => onChange(val, minKey)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-muted-foreground text-xs font-medium shrink-0">to</span>
        <DebouncedInput
          type="number"
          placeholder="Max"
          value={filters[maxKey] || ''}
          onChange={val => onChange(val, maxKey)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    );
  }

  if (attr.field_type === 'text') {
    return (
      <DebouncedInput
        type="text"
        placeholder={`Any ${attr.label}...`}
        value={value || ''}
        onChange={onChange}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
      />
    );
  }

  return null;
}


// ── FilterPanel ──
export default function FilterPanel({ isMobile = false, onClose }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [localParams, setLocalParams] = useState(new URLSearchParams(searchParams));

  useEffect(() => {
    if (!isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
      setLocalParams(new URLSearchParams(searchParams));
    }
  }, [searchParams, isMobile]);

  const filters = useMemo(() => {
    const obj = {};
    for (const [k, v] of localParams.entries()) obj[k] = v;
    return obj;
  }, [localParams]);

  const category = filters.category || '';
  const metadata = useMetadataCache(category);

  // Resolve make name -> vehicle_makes DB id so Model can cascade
  const [vehicleMakeMap, setVehicleMakeMap] = useState({});
  useEffect(() => {
    if (category && category.includes('vehicle') || category === 'vehicles' || category === 'cars' || category === 'motorcycles' || category === 'trucks' || category === 'agriculture' || category === 'construction') {
      getVehicleMakes().then(makes => {
        const m = {};
        makes.forEach(mk => { m[mk.name] = mk.id; });
        setVehicleMakeMap(m);
      });
    }
  }, [category]);

  const { data: countData } = useQuery({
    queryKey: ['filter-live-count', filters],
    queryFn: () => getListings(filters),
    staleTime: 1000 * 60,
    enabled: isMobile,
  });
  const liveCount = countData?.total || 0;

  const updateFilter = (key, value, explicitKey = null) => {
    const next = new URLSearchParams(localParams);
    const targetKey = explicitKey || key;
    
    if (value) {
      next.set(targetKey, value);
    } else {
      next.delete(targetKey);
    }
    next.delete('page');

    if (key === 'county') {
      next.delete('town');
      next.delete('area');
    }
    if (key === 'town') {
      next.delete('area');
    }
    if (key === 'category') {
      const keyword = next.get('keyword');
      const keys = [...next.keys()];
      keys.forEach(k => next.delete(k));
      next.set('category', value);
      if (keyword) next.set('keyword', keyword);
    }

    // Dynamic Dependency Clears
    if (metadata?.dependencies && metadata?.attributes) {
      const clearDependentKeys = (parentName) => {
        const parentAttr = metadata.attributes.find(a => a.name === parentName);
        if (!parentAttr) return;

        const deps = metadata.dependencies.filter(d => d.depends_on_attribute_id === parentAttr.id);
        deps.forEach(dep => {
          const childAttr = metadata.attributes.find(a => a.id === dep.attribute_id);
          if (childAttr && next.has(childAttr.name)) {
            next.delete(childAttr.name);
            clearDependentKeys(childAttr.name);
          }
        });
      };
      clearDependentKeys(key);
    }

    setLocalParams(next);

    if (!isMobile && category !== 'seeking-work') {
      navigate(`/browse?${next.toString()}`, { replace: true });
    }
  };

  const handleClearAll = () => {
    const next = new URLSearchParams();
    if (filters.category) next.set('category', filters.category);
    if (filters.keyword) next.set('keyword', filters.keyword);
    
    setLocalParams(next);
    if (!isMobile) navigate(`/browse?${next.toString()}`);
  };

  const handleApply = () => {
    navigate(`/browse?${localParams.toString()}`);
    if (onClose) onClose();
  };

  // Evaluate if an attribute should be shown
  const isAttrVisible = (attr) => {
    if (!attr.is_filterable) return false;
    if (!metadata?.dependencies) return true;
    
    const attrDeps = metadata.dependencies.filter(d => d.attribute_id === attr.id);
    if (attrDeps.length === 0) return true;

    const showDeps = attrDeps.filter(d => d.effect === 'show');
    const hideDeps = attrDeps.filter(d => d.effect === 'hide');

    const evalCondition = (dep) => {
      const parentAttr = metadata.attributes.find(a => a.id === dep.depends_on_attribute_id);
      if (!parentAttr) return false;
      
      const fieldValue = filters[parentAttr.name];
      const depVal = dep.dependency_value;

      switch (dep.operator) {
        case 'equals':     return fieldValue === depVal;
        case 'not_equals': return fieldValue !== depVal;
        case 'exists':     return !!fieldValue;
        case 'not_exists': return !fieldValue;
        case 'contains':   return String(fieldValue || '').toLowerCase().includes(String(depVal || '').toLowerCase());
        default:           return false;
      }
    };

    if (showDeps.length > 0) {
      return showDeps.every(evalCondition);
    } else if (hideDeps.length > 0) {
      return !hideDeps.every(evalCondition);
    }
    return true;
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {isMobile && (
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto p-4 md:p-0 ${!isMobile ? 'pr-4 custom-scrollbar' : ''}`}>
        
        <FilterGroup label="Category">
          <div className="relative">
            <select 
              value={category} 
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-8 font-medium text-primary"
            >
              <option value="">All Categories</option>
              {CATEGORY_ICONS.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FilterGroup>

        <FilterGroup label="Location">
          <LocationCascader 
            county={filters.county} 
            town={filters.town} 
            area={filters.area} 
            onChange={updateFilter} 
          />
        </FilterGroup>

        {!['jobs', 'seeking-work'].includes(filters.category) && (
          <FilterGroup label="Price">
            <PriceFilter 
              min={filters.priceMin} 
              max={filters.priceMax} 
              onChange={updateFilter} 
            />
          </FilterGroup>
        )}

        {/* Global Standard Condition fallback, could be driven by metadata but kept for standard backward compat */}
        {!['jobs', 'seeking-work', 'services', 'property', 'animals-pets', 'food-agriculture'].includes(filters.category) && (
          <FilterGroup label="Condition">
            <RadioGroup 
              options={['Brand New', 'Used', 'Refurbished', 'Ex-UK/Ex-Japan']} 
              value={filters.condition || ''} 
              onChange={(val) => updateFilter('condition', val)} 
            />
          </FilterGroup>
        )}

        {/* ── Dynamic Metadata Filters ── */}
        {metadata?.attributes && metadata.attributes
          .filter(isAttrVisible)
          .sort((a, b) => a.display_order - b.display_order)
          .map((attr, index) => {
            // For vehicle_model fields, resolve the parent make's DB id
            let parentLookupId = null;
            if (attr.lookup_type === 'vehicle_model') {
              const makeAttr = metadata.attributes.find(a => a.lookup_type === 'vehicle_make');
              if (makeAttr) {
                const selectedMakeName = filters[makeAttr.name];
                parentLookupId = vehicleMakeMap[selectedMakeName] || null;
              }
            }
            return (
              <FilterGroup key={attr.id} label={attr.label} defaultOpen={index < 3 || !!filters[attr.name]}>
                <DynamicFilterField
                  attr={attr}
                  value={filters[attr.name]}
                  filters={filters}
                  parentLookupId={parentLookupId}
                  onChange={(val, explicitKey) => updateFilter(attr.name, val, explicitKey)}
                />
              </FilterGroup>
            );
          })}
      </div>

      <div className={`border-t border-border bg-background p-4 flex items-center gap-3 ${isMobile ? 'sticky bottom-0 z-10' : 'mt-4 sticky bottom-0 z-10 pb-6'}`}>
        <button 
          onClick={handleClearAll}
          className="flex-1 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Clear All
        </button>
        {(isMobile || filters.category === 'seeking-work') && (
          <button 
            onClick={handleApply}
            className="flex-[2] rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            {isMobile ? `Show ${liveCount.toLocaleString()} Results` : 'Apply Filters'}
          </button>
        )}
      </div>
    </div>
  );
}
