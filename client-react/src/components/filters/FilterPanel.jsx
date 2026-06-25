import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListings, getFilterAggregates } from '@/lib/api';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import {
  hasCascadeFilters,
  getLevel1Options,
  getLevel2Options,
  getLevel3Options,
  getCascadeLabels,
  getCascadeDepth,
  getCascadeConfig,
} from '@/lib/filterEngine';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import LocationCascader from './LocationCascader';
import PriceFilter from './PriceFilter';
import DynamicDataFilter from './DynamicDataFilter';
import { ChevronDown, ChevronLeft, X } from 'lucide-react';

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

export default function FilterPanel({ isMobile = false, onClose }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Local state for mobile "staged" filters. On desktop, this syncs instantly.
  const [localParams, setLocalParams] = useState(new URLSearchParams(searchParams));

  // Sync with URL if changed externally (or constantly on desktop)
  useEffect(() => {
    if (!isMobile) {
      setLocalParams(new URLSearchParams(searchParams));
    }
  }, [searchParams, isMobile]);

  // Derive filters object
  const filters = {};
  for (const [k, v] of localParams.entries()) {
    filters[k] = v;
  }
  const category = filters.category || '';

  // Get live count for Mobile CTA
  const { data: countData } = useQuery({
    queryKey: ['filter-live-count', filters],
    queryFn: () => getListings(filters),
    staleTime: 1000 * 60,
    enabled: isMobile, // Only needed for the mobile CTA
  });
  const liveCount = countData?.total || 0;

  // The single update handler
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(localParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page'); // Reset pagination

    // Dependency Resets
    if (key === 'county') {
      next.delete('town');
      next.delete('area');
    }
    if (key === 'town') {
      next.delete('area');
    }
    if (key === 'category') {
      // Clear EVERYTHING except category and keyword
      const keyword = next.get('keyword');
      const keys = [...next.keys()];
      keys.forEach(k => next.delete(k));
      next.set('category', value);
      if (keyword) next.set('keyword', keyword);
    }
    
    // Dynamic Attribute Resets
    const schema = ATTRIBUTE_ENGINE[category]?.attributes || ATTRIBUTE_ENGINE.default.attributes;
    
    // Recursive function to find and delete all attributes that depend on the changed key
    const clearDependentKeys = (parentKey) => {
      schema.forEach(attr => {
        if (attr.dependsOn && attr.dependsOn.field === parentKey) {
          if (next.has(attr.id)) {
            next.delete(attr.id);
            // Recursively clear children of this attribute
            clearDependentKeys(attr.id);
          }
        }
      });
    };

    // If the value changed, trigger the cascade clear for its dependencies
    clearDependentKeys(key);

    setLocalParams(next);

    // If Desktop, push to URL immediately (with a tiny debounce in the UI via the user typing, but inputs are handled in child components)
    if (!isMobile) {
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

  // Pre-compute dynamic attributes
  const schema = ATTRIBUTE_ENGINE[category]?.attributes || ATTRIBUTE_ENGINE.default.attributes;

  // Render Subcategory / Attributes based on schema
  const renderDynamicAttributes = () => {
    if (!category) return null;

    return schema.map(attr => {
      // Check if it should be displayed in search
      if (!attr.search || !attr.search.filterable) return null;

      // Check dependencies
      if (attr.dependsOn) {
        const checkSingle = (dep) => {
          if (dep.and) {
            return dep.and.every(d => checkSingle(d));
          }
          const { field, value, notValue } = dep;
          const parentValue = filters[field];
          if (!parentValue) return false;
          
          if (Array.isArray(value)) {
            if (!value.includes(parentValue)) return false;
          } else if (value && parentValue !== value) {
            return false;
          }

          if (notValue && parentValue === notValue) return false;
          return true;
        };

        const isValid = Array.isArray(attr.dependsOn) 
          ? attr.dependsOn.some(dep => checkSingle(dep))
          : checkSingle(attr.dependsOn);

        if (!isValid) return null;
      }

      const uiType = attr.search.uiType;

      if (uiType === 'dynamic-cascade') {
        const config = getCascadeConfig(category, filters.subcategory || filters.bodyType);
        
        let options = [];
        if (attr.cascadeLevel === 1) {
          options = getLevel1Options(category, filters, attr.id);
        } else if (attr.cascadeLevel === 2) {
          const parentKey = attr.cascadeParent || (config && config.level1) || schema.find(a => a.cascadeLevel === 1)?.id;
          if (filters[parentKey]) {
            options = getLevel2Options(category, filters[parentKey], filters, attr.id);
          }
        } else if (attr.cascadeLevel === 3) {
          const l1 = attr.cascadeGrandparent || config?.level1 || schema.find(a => a.cascadeLevel === 1)?.id;
          const l2 = attr.cascadeParent || config?.level2 || schema.find(a => a.cascadeLevel === 2)?.id;
          if (filters[l1] && filters[l2]) {
            options = getLevel3Options(category, filters[l1], filters[l2], filters, attr.id);
          }
        }

        if (!options || options.length === 0) return null;

        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <RadioGroup options={options} value={filters[attr.id] || ''} onChange={(val) => updateFilter(attr.id, val)} />
            </div>
          </FilterGroup>
        );
      }

      if (uiType === 'radio') {
        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <RadioGroup options={attr.options || []} value={filters[attr.id] || ''} onChange={(val) => updateFilter(attr.id, val)} />
          </FilterGroup>
        );
      }

      if (uiType === 'multicheck') {
        return (
          <FilterGroup key={attr.id} label={attr.label}>
             <MultiCheck options={attr.options || []} value={filters[attr.id] || ''} onChange={(val) => updateFilter(attr.id, val)} />
          </FilterGroup>
        );
      }

      if (uiType === 'select') {
        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <div className="relative">
              <select 
                value={filters[attr.id] || ''} 
                onChange={(e) => updateFilter(attr.id, e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-8"
              >
                <option value="">Any</option>
                {(attr.options || []).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </FilterGroup>
        );
      }

      if (uiType === 'dynamic-select') {
        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <DynamicDataFilter
              category={category}
              urlParam={attr.id}
              filters={filters}
              value={filters[attr.id] || ''}
              onChange={(val) => updateFilter(attr.id, val)}
            />
          </FilterGroup>
        );
      }

      if (uiType === 'range') {
        const minKey = `${attr.id}_min`;
        const maxKey = `${attr.id}_max`;
        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters[minKey] || ''}
                onChange={e => updateFilter(minKey, e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-muted-foreground text-xs font-medium shrink-0">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters[maxKey] || ''}
                onChange={e => updateFilter(maxKey, e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </FilterGroup>
        );
      }

      if (uiType === 'text') {
        return (
          <FilterGroup key={attr.id} label={attr.label}>
            <input
              type="text"
              placeholder={`Any ${attr.label}...`}
              value={filters[attr.id] || ''}
              onChange={e => updateFilter(attr.id, e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </FilterGroup>
        );
      }

      return null;
    });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header (Mobile only) */}
      {isMobile && (
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Filter Content */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-0 ${!isMobile ? 'pr-4 custom-scrollbar' : ''}`}>
        
        {/* 1. Category */}
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

        {/* 3. Location */}
        <FilterGroup label="Location">
          <LocationCascader 
            county={filters.county} 
            town={filters.town} 
            area={filters.area} 
            onChange={updateFilter} 
          />
        </FilterGroup>

        {/* 4. Price */}
        <FilterGroup label="Price">
          <PriceFilter 
            min={filters.priceMin} 
            max={filters.priceMax} 
            onChange={updateFilter} 
          />
        </FilterGroup>

        {/* 5. Condition (Global Standard - exclude non-physical goods) */}
        {!['jobs', 'seeking-work', 'services', 'property', 'animals-pets', 'food-agriculture'].includes(filters.category) && (
          <FilterGroup label="Condition">
            <RadioGroup 
              options={['Brand New', 'Used', 'Refurbished', 'Ex-UK/Ex-Japan']} 
              value={filters.condition || ''} 
              onChange={(val) => updateFilter('condition', val)} 
            />
          </FilterGroup>
        )}

        {/* 6. Dynamic Attributes */}
        {renderDynamicAttributes()}
      </div>

      {/* Footer / Actions */}
      <div className={`border-t border-border bg-background p-4 flex items-center gap-3 ${isMobile ? 'sticky bottom-0 z-10' : 'mt-4'}`}>
        <button 
          onClick={handleClearAll}
          className="flex-1 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Clear All
        </button>
        {isMobile && (
          <button 
            onClick={handleApply}
            className="flex-[2] rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Show {liveCount.toLocaleString()} Results
          </button>
        )}
      </div>
    </div>
  );
}
