import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListings, getLookupValues } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import { useMetadataCache } from '@/lib/useMetadataCache';
import { getCascadeChain } from '@/lib/categoryContextMap';
import { getTaxonomyRules } from '@/lib/taxonomyEngine';
import LocationCascader from './LocationCascader';
import PriceFilter from './PriceFilter';
import { ChevronDown, X, Loader2, Search } from 'lucide-react';

const sortAttributes = (a, b) => {
  const orderA = a.display_order || 0;
  const orderB = b.display_order || 0;
  if (orderA !== orderB) return orderA - orderB;
  
  const commonOrder = ['make', 'model', 'year', 'mileage', 'condition', 'transmission', 'fuel_type', 'engine_size', 'drive_type'];
  const idxA = commonOrder.indexOf(a.name.toLowerCase());
  const idxB = commonOrder.indexOf(b.name.toLowerCase());
  
  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;
  
  return 0;
};

function FilterGroup({ label, children, defaultOpen = true, onClear, hasValue }) {
  return (
    <details className="group border-b border-border py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground outline-none marker:content-none">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-3">
          {hasValue && onClear && (
            <button 
              onClick={(e) => { e.preventDefault(); onClear(); }}
              className="text-xs font-normal text-muted-foreground hover:text-primary hover:underline"
            >
              Clear
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>
      <div className="mt-4 flex flex-col gap-3 animate-in fade-in duration-200">
        {children}
      </div>
    </details>
  );
}

function SectionGroup({ title, children }) {
  // Check if children is empty (falsy, empty array, or array of falsy values)
  const hasChildren = React.Children.toArray(children).some(child => !!child);
  if (!hasChildren) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1">{title}</h3>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

function RadioGroup({ options, value, onChange, groupAlphabetically = false }) {
  const [search, setSearch] = useState('');
  const filtered = options.filter(o => String(o).toLowerCase().includes(search.toLowerCase()));
  const showSearch = options.length > 8;

  const grouped = useMemo(() => {
    if (!groupAlphabetically) return null;
    const map = {};
    filtered.forEach(opt => {
      const char = String(opt).charAt(0).toUpperCase();
      const groupKey = /[A-Z]/.test(char) ? char : '#';
      if (!map[groupKey]) map[groupKey] = [];
      map[groupKey].push(opt);
    });
    return Object.keys(map).sort().map(key => ({ letter: key, options: map[key] }));
  }, [filtered, groupAlphabetically]);

  return (
    <div className="flex flex-col">
      {showSearch && (
        <div className="relative mb-2 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary/30 py-1.5 pl-8 pr-3 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {groupAlphabetically && grouped ? (
          grouped.map(group => (
            <div key={group.letter} className="mb-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1 opacity-60">
                {group.letter}
              </div>
              {group.options.map(opt => (
                <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${value === opt ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
                  <input type="radio" checked={value === opt} onChange={() => onChange(value === opt ? '' : opt)} className="h-4 w-4 accent-primary shrink-0" />
                  <span className="truncate">{opt}</span>
                </label>
              ))}
            </div>
          ))
        ) : (
          filtered.map(opt => (
            <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${value === opt ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
              <input type="radio" checked={value === opt} onChange={() => onChange(value === opt ? '' : opt)} className="h-4 w-4 accent-primary shrink-0" />
              <span className="truncate">{opt}</span>
            </label>
          ))
        )}
        {filtered.length === 0 && <span className="text-xs text-muted-foreground px-2 py-1">No options match.</span>}
      </div>
    </div>
  );
}

function MultiCheck({ options, value = '', onChange }) {
  const [search, setSearch] = useState('');
  const selected = value ? value.split(',') : [];
  
  const filtered = options.filter(o => String(o).toLowerCase().includes(search.toLowerCase()));
  const showSearch = options.length > 8;

  const toggle = (opt) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next.join(','));
  };

  return (
    <div className="flex flex-col">
      {showSearch && (
        <div className="relative mb-2 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary/30 py-1.5 pl-8 pr-3 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(opt => (
          <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${selected.includes(opt) ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary shrink-0" />
            <span className="truncate">{opt}</span>
          </label>
        ))}
        {filtered.length === 0 && <span className="text-xs text-muted-foreground px-2 py-1">No options match.</span>}
      </div>
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
// Generically resolves parentLookupId for any cascade dependency chain
// (vehicles, laptops, phones, fashion, etc.) by looking at the
// attribute_dependencies table and the current filter state.
function DynamicFilterField({ attr, value, onChange, filters, categorySlug, metadata }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolvedParentId, setResolvedParentId] = useState(null);

  // Find the cascade dependency for this attribute (parent must be selected first)
  const cascadeDep = useMemo(() => {
    if (!metadata?.dependencies) return null;
    return metadata.dependencies.find(
      d => d.attribute_id === attr.id && d.effect === 'cascade'
    ) || null;
  }, [metadata, attr.id]);

  // Resolve parent attr name + current value from filters
  const parentAttr = useMemo(() => {
    if (!cascadeDep || !metadata?.attributes) return null;
    return metadata.attributes.find(a => a.id === cascadeDep.depends_on_attribute_id) || null;
  }, [cascadeDep, metadata]);

  const parentValue = parentAttr ? (filters[parentAttr.name] || '') : '';
  const parentAttrLabel = parentAttr?.label || null;
  const needsParentFirst = !!cascadeDep && !parentValue;

  // When parent selection changes, resolve its DB row ID for child option filtering.
  // Use 'any' as parentId so we search all rows in the parent lookup regardless of nesting.
  useEffect(() => {
    if (!cascadeDep || !parentAttr?.lookup_type || !parentValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
      setResolvedParentId(null);
      return;
    }
    getLookupValues(parentAttr.lookup_type, 'any', parentValue, categorySlug || '').then(rows => {
      const match = rows.find(r => r.value.toLowerCase() === parentValue.toLowerCase());
      setResolvedParentId(match?.id ?? null);
    });
  }, [cascadeDep, parentAttr, parentValue, categorySlug]);

  useEffect(() => {
    if (!attr.lookup_type && !attr.options) return;

    if (attr.lookup_type) {
      // Don't fetch if parent not yet selected
      if (needsParentFirst) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
        setOptions([]);
        return;
      }
      // If cascade dep exists with a selected parent, wait until its DB id is resolved.
      // Without this guard the fetch fires with parentId=null and returns wrong/empty results.
      if (cascadeDep && parentValue && !resolvedParentId) return;

      setLoading(true);
      getLookupValues(attr.lookup_type, resolvedParentId || null, '', categorySlug || '').then(data => {
        const sorted = [...data].sort((a, b) => a.value.localeCompare(b.value));
        setOptions(sorted.map(d => d.value));
        setLoading(false);
      });
    } else if (attr.options) {
      try {
        const raw = typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options;
        setOptions(raw);
      // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
      } catch (e) {
        setOptions([]);
      }
    }
  }, [attr.lookup_type, attr.options, resolvedParentId, categorySlug, needsParentFirst, cascadeDep, parentValue]);

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  }

  // Show a helpful nudge when parent has not been selected yet
  if (needsParentFirst) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
        <Search className="h-3.5 w-3.5 opacity-50 shrink-0" />
        Select {parentAttrLabel || 'the previous field'} first
      </div>
    );
  }

  // Convert large 'select' fields into searchable 'radio' lists for better UX
  if (attr.field_type === 'select') {
    if (options.length > 8) {
      return <RadioGroup options={options} value={value || ''} onChange={onChange} />;
    }
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

  if (attr.field_type === 'multiselect' || attr.field_type === 'multicheck') {
    return <MultiCheck options={options} value={value || ''} onChange={onChange} />;
  }

  if (attr.field_type === 'radio') {
    const isMake = attr.name.toLowerCase() === 'make';
    return <RadioGroup options={options} value={value || ''} onChange={onChange} groupAlphabetically={isMake} />;
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
export default function FilterPanel({ categorySlug = '', isMobile = false, embedded = false, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const category = embedded ? (categorySlug || filters.category || '') : (filters.category || categorySlug || '');
  const metadata = useMetadataCache(category);

  // Derive taxonomy rules for the active category
  const activeSubSlug = category.split('/')[1] || category;
  const taxonomyRules = useMemo(() => getTaxonomyRules(activeSubSlug), [activeSubSlug]);

  // Combine URL filters with implied taxonomy values for dependency evaluation
  const computedFilters = useMemo(() => {
    return { ...filters, ...(taxonomyRules.implied || {}) };
  }, [filters, taxonomyRules]);

  // vehicleMakeMap removed — cascade resolution is now generic inside DynamicFilterField

  const { data: countData } = useQuery({
    queryKey: ['filter-live-count', filters],
    queryFn: () => getListings(filters),
    staleTime: 1000 * 60,
    enabled: isMobile,
  });
  const liveCount = countData?.total || 0;

  const handleRouting = (nextParams) => {
    if (embedded) {
      setSearchParams(nextParams, { replace: true });
    } else if (location.pathname === '/browse' || location.pathname === '/') {
      navigate(`/browse?${nextParams.toString()}`, { replace: true });
    } else {
      setSearchParams(nextParams, { replace: true });
    }
  };

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

    // ── Phase 2: Cascade Chain Auto-Clear ────────────────────────────────────
    // Use the categoryContextMap cascade chain to clear all downstream children
    // when any parent in the chain is changed. E.g. changing Make clears Model.
    const chain = getCascadeChain(category);
    const chainIdx = chain.indexOf(key);
    if (chainIdx !== -1) {
      // Clear all attributes AFTER this one in the chain
      chain.slice(chainIdx + 1).forEach(childKey => next.delete(childKey));
    }

    // ── Also clear children via DB attribute_dependencies (existing logic) ─
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
      handleRouting(next);
    }
  };

  const handleClearAll = () => {
    const next = new URLSearchParams();
    if (filters.category) next.set('category', filters.category);
    if (searchParams.has('keyword')) next.set('keyword', searchParams.get('keyword'));
    
    setLocalParams(next);
    if (!isMobile) {
      handleRouting(next);
    }
  };

  const handleApply = () => {
    handleRouting(localParams);
    if (onClose) onClose();
  };

  // Evaluate if an attribute should be shown
  const isAttrVisible = (attr) => {
    // Taxonomy engine forced hide
    if (taxonomyRules.hide?.includes(attr.name)) return false;

    // Force oemNumber to be visible even if is_filterable is false in DB
    if (attr.name === 'oemNumber') return true;
    
    // Force make to always be visible, bypassing the vehicleClass dependency
    if (attr.name === 'make') return true;

    if (!attr.is_filterable) return false;
    
    // Force visibility if the attribute is currently selected in the URL
    // so the user can see and unselect it even if dependencies are missing.
    if (computedFilters[attr.name]) return true;

    if (!metadata?.dependencies) return true;
    
    const attrDeps = metadata.dependencies.filter(d => d.attribute_id === attr.id);
    if (attrDeps.length === 0) return true;

    const showDeps = attrDeps.filter(d => d.effect === 'show');
    const hideDeps = attrDeps.filter(d => d.effect === 'hide');
    const cascadeDeps = attrDeps.filter(d => d.effect === 'cascade');

    const evalCondition = (dep) => {
      const parentAttr = metadata.attributes.find(a => a.id === dep.depends_on_attribute_id);
      if (!parentAttr) return false;
      
      const fieldValue = computedFilters[parentAttr.name];
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
    } else if (cascadeDeps.length > 0) {
      // If an attribute's options cascade based on a parent, hide it until the parent has a value
      return cascadeDeps.every(evalCondition);
    }
    return true;
  };

  const renderDynamicAttr = (attr, defaultOpen = false) => {
    // Auto-expand if the attr has a value, or if its cascade parent has a value
    const cascadeDep = metadata?.dependencies?.find(
      d => d.attribute_id === attr.id && d.effect === 'cascade'
    );
    const parentAttr = cascadeDep && metadata?.attributes?.find(a => a.id === cascadeDep.depends_on_attribute_id);
    const parentHasValue = parentAttr ? !!filters[parentAttr.name] : false;

    const hasVal = !!filters[attr.name];
    const isOpen = defaultOpen || hasVal || parentHasValue;

    return (
      <FilterGroup 
        key={attr.id} 
        label={attr.label} 
        defaultOpen={isOpen}
        hasValue={hasVal}
        onClear={() => updateFilter(attr.name, '')}
      >
        <DynamicFilterField
          attr={attr}
          value={filters[attr.name]}
          filters={filters}
          categorySlug={category}
          metadata={metadata}
          onChange={(val, explicitKey) => updateFilter(attr.name, val, explicitKey)}
        />
      </FilterGroup>
    );
  };

  return (
    <div className={`flex flex-col bg-background ${embedded ? '' : 'h-full'}`}>
      {isMobile ? (
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">Filters</h2>
            {Object.keys(filters).length > 0 && (
              <button onClick={handleClearAll} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Clear All</button>
            )}
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-border p-4 md:px-1 md:pt-1 md:pb-4 mb-2">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button onClick={handleClearAll} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            Clear All
          </button>
        </div>
      )}

      <div className={`p-4 md:p-0 ${embedded ? '' : 'flex-1 overflow-y-auto'} ${!isMobile && !embedded ? 'pr-4 custom-scrollbar' : ''}`}>
        
        {/* ── Basic Filters ── */}
        <SectionGroup title="Basic Filters">
          {!embedded && (
            <FilterGroup label="Category" defaultOpen={true}>
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
          )}

          {/* OEM Number forced to top */}
          {metadata?.attributes && metadata.attributes
            .filter(a => a.name === 'oemNumber')
            .map((attr) => renderDynamicAttr(attr, true))}

          {/* Dynamic Basic Attributes — includes series/model for cascading electronics/fashion/laptops */}
          {metadata?.attributes && metadata.attributes
            .filter(isAttrVisible)
            .filter(a => ['condition', 'make', 'model', 'series', 'category', 'subcategory', 'type', 'brand', 'vehicleclass', 'listingtype', 'partcategory', 'part'].includes(a.name.toLowerCase()))
            .sort(sortAttributes)
            .map((attr) => renderDynamicAttr(attr, true))}

          {/* Global Standard Condition fallback */}
          {!metadata?.attributes?.some(a => a.name.toLowerCase() === 'condition') && !['jobs', 'seeking-work', 'services', 'property', 'animals-pets', 'food-agriculture'].includes(category.split('/')[0]) && (
            <FilterGroup label="Condition" defaultOpen={true}>
              <RadioGroup 
                options={(() => {
                  const hasCategory = (slug) => metadata?.categories?.some(c => c.slug === slug);
                  const isVehicle = hasCategory('vehicles') || hasCategory('commercial-vehicles');
                  const isAutoSpares = hasCategory('auto-spares');
                  const isPhone = hasCategory('phones-tablets');
                  const isElectronics = hasCategory('electronics');
                  const isHeavyTruck = isVehicle && ['Trucks', 'Buses', 'Tractors', 'Heavy Equipment', 'Trailers'].includes(filters.make);
                  const isPickupTruck = isVehicle && filters.make === 'Pickups';
                  
                  if (isHeavyTruck || isPickupTruck) return ['Brand New', 'Ex-Japan', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'];
                  if (isVehicle) return ['Brand New', 'Foreign Used', 'Locally Used', 'Accident Damaged', 'Rebuilt'];
                  if (isAutoSpares) return ['New', 'Ex-Japan', 'Locally Used', 'OEM (Original)', 'Aftermarket', 'Refurbished'];
                  if (isPhone || isElectronics) return ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];
                  return ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
                })()} 
                value={filters.condition || ''} 
                onChange={(val) => updateFilter('condition', val)} 
              />
            </FilterGroup>
          )}
        </SectionGroup>

        {/* ── Price & Location ── */}
        <SectionGroup title="Price & Location">
          <FilterGroup label="Location" defaultOpen={true}>
            <LocationCascader 
              county={filters.county} 
              town={filters.town} 
              area={filters.area} 
              onChange={updateFilter} 
            />
          </FilterGroup>

          {!['jobs', 'seeking-work'].includes(filters.category) && (
            <FilterGroup label="Price" defaultOpen={true}>
              <PriceFilter 
                min={filters.minPrice} 
                max={filters.maxPrice} 
                onChange={updateFilter} 
              />
            </FilterGroup>
          )}

          {/* Dynamic Price/Mileage Attributes */}
          {metadata?.attributes && metadata.attributes
            .filter(isAttrVisible)
            .filter(a => ['year', 'mileage'].includes(a.name.toLowerCase()))
            .sort(sortAttributes)
            .map((attr) => renderDynamicAttr(attr, true))}
        </SectionGroup>

        {/* ── Specifications ── */}
        <SectionGroup title="Specifications">
          {metadata?.attributes && metadata.attributes
            .filter(isAttrVisible)
            .filter(a => !['condition', 'make', 'model', 'series', 'category', 'subcategory', 'type', 'brand', 'vehicleclass', 'listingtype', 'partcategory', 'part', 'year', 'mileage', 'oemnumber'].includes(a.name.toLowerCase()))
            .sort(sortAttributes)
            .map((attr) => renderDynamicAttr(attr, false))}
        </SectionGroup>
      </div>

      <div className={`border-t border-border bg-background p-4 flex items-center justify-center ${isMobile ? 'sticky bottom-0 z-10' : 'mt-4 sticky bottom-0 z-10 pb-6'}`}>
        {(isMobile || filters.category === 'seeking-work') ? (
          <button 
            onClick={handleApply}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            {isMobile ? `Show ${liveCount.toLocaleString()} Results` : 'Apply Filters'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
