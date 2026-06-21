import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFilterAggregates, getCategoryCounts } from '@/lib/api';
import { FILTER_CONFIG, UNIVERSAL_FILTERS } from '@/lib/filterConfig';
import { CATEGORY_ICONS } from '@/lib/categoryData';
import {
  hasCascadeFilters,
  getLevel1Options,
  getLevel2Options,
  getLevel3Options,
  getCascadeLabels,
  getCascadeDepth,
  CASCADE_URL_PARAMS,
} from '@/lib/filterEngine';
import { COUNTIES } from '@/lib/countyData';
import { ChevronDown, GitBranch, ChevronLeft } from 'lucide-react';

// ─── Primitives ──────────────────────────────────────────────────────────────

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
          <input
            type="radio"
            name={`radio-${opt}`}
            checked={value === opt}
            onChange={() => onChange(value === opt ? '' : opt)}
            className="h-4 w-4 accent-primary"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function MultiCheck({ options, value = '', onChange }) {
  const selected = value ? value.split(',') : [];
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter(s => s !== opt)
      : [...selected, opt];
    onChange(next.join(','));
  };
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/50 ${selected.includes(opt) ? 'font-medium text-primary' : 'text-muted-foreground text-sm'}`}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

// ─── Dynamic Data Filter ─────────────────────────────────────────────────────

export function DynamicDataFilter({ category, urlParam, searchParams, onChange }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    if (!category) return;
    
    const filters = {};
    for (const [k, v] of searchParams.entries()) {
      if (k !== 'category' && k !== 'keyword' && k !== 'sort' && k !== 'page') {
        filters[k] = v;
      }
    }

    let isMounted = true;
    getFilterAggregates(category, urlParam, filters).then(res => {
      if (isMounted) setCounts(res);
    }).catch(err => {
      console.error("Failed to fetch aggregate for", urlParam, err);
      if (isMounted) setCounts({});
    });
    return () => { isMounted = false };
  }, [category, urlParam, searchParams]);

  if (!counts) return <div className="animate-pulse h-10 w-full bg-secondary/50 rounded-xl" />;
  
  const options = Object.keys(counts).filter(k => counts[k] > 0).sort();
  if (options.length === 0) {
    // If we have no data, we can't show a dropdown because we don't have static options.
    return null;
  }

  const labelMap = {
    brand: 'Brand',
    series: 'Series',
    model: 'Model',
    equipmentType: 'Equipment Type',
    tv_size: 'TV Size',
    tv_tech: 'Screen Tech'
  };

  return (
    <select
      className={inputClass}
      value={searchParams.get(urlParam) || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Any {labelMap[urlParam] || 'Option'}</option>
      {options.map(o => (
        <option key={o} value={o}>
          {o} ({counts[o]})
        </option>
      ))}
    </select>
  );
}

// ─── Cascade Filter Group ────────────────────────────────────────────────────

function CascadeFilterGroup({ categorySlug, searchParams, setParam }) {
  const [counts1, setCounts1] = useState(null);
  const [counts2, setCounts2] = useState(null);
  const [counts3, setCounts3] = useState(null);

  if (!hasCascadeFilters(categorySlug)) return null;

  const depth = getCascadeDepth(categorySlug);
  const labels = getCascadeLabels(categorySlug);
  const params = CASCADE_URL_PARAMS[categorySlug];
  if (!params) return null;

  const level1Value = searchParams.get(params.level1) || '';
  const level2Value = searchParams.get(params.level2) || '';

  const staticLevel1 = getLevel1Options(categorySlug);
  const staticLevel2 = getLevel2Options(categorySlug, level1Value);
  const staticLevel3 = depth >= 3 ? getLevel3Options(categorySlug, level1Value, level2Value) : [];

  useEffect(() => {
    const currentFilters = Object.fromEntries(searchParams.entries());
    
    const filters1 = { ...currentFilters };
    delete filters1[params.level1];
    delete filters1[params.level2];
    if (params.level3) delete filters1[params.level3];
    getFilterAggregates(categorySlug, params.level1, filters1).then(setCounts1);

    if (level1Value) {
      const filters2 = { ...currentFilters };
      delete filters2[params.level2];
      if (params.level3) delete filters2[params.level3];
      getFilterAggregates(categorySlug, params.level2, filters2).then(setCounts2);
    }

    if (depth >= 3 && level2Value && params.level3) {
      const filters3 = { ...currentFilters };
      delete filters3[params.level3];
      getFilterAggregates(categorySlug, params.level3, filters3).then(setCounts3);
    }
  }, [categorySlug, searchParams, params.level1, params.level2, params.level3, depth, level1Value, level2Value]);

  const renderOptions = (staticOpts, countsMap) => {
    if (!countsMap || Object.keys(countsMap).length === 0) {
      return staticOpts.map(o => <option key={o} value={o}>{o}</option>);
    }
    return staticOpts
      .filter(o => countsMap[o] > 0)
      .map(o => <option key={o} value={o}>{o} ({countsMap[o]})</option>);
  };

  const handleLevel1Change = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(params.level1, val); else next.delete(params.level1);
    next.delete(params.level2);
    if (params.level3) next.delete(params.level3);
    next.delete('page');
    setParam(next);
  };

  const handleLevel2Change = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(params.level2, val); else next.delete(params.level2);
    if (params.level3) next.delete(params.level3);
    next.delete('page');
    setParam(next);
  };

  const handleLevel3Change = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(params.level3, val); else next.delete(params.level3);
    next.delete('page');
    setParam(next);
  };

  const hasLiveLevel1 = !counts1 || Object.keys(counts1).length === 0 || staticLevel1.some(o => counts1[o] > 0);
  const hasLiveLevel2 = level1Value && (!counts2 || Object.keys(counts2).length === 0 || staticLevel2.some(o => counts2[o] > 0));
  const hasLiveLevel3 = depth >= 3 && level2Value && (!counts3 || Object.keys(counts3).length === 0 || staticLevel3.some(o => counts3[o] > 0));

  return (
    <details className="group border-b border-border py-4" open>
      <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground outline-none marker:content-none">
        <span className="flex items-center gap-2 text-sm">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
          {labels.level1Label} / {labels.level2Label}
          {depth >= 3 && ` / ${labels.level3Label || 'Variant'}`}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="mt-4 flex flex-col gap-3 animate-in fade-in duration-200">
        {staticLevel1.length > 0 && hasLiveLevel1 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              {labels.level1Label}
            </label>
            <select
              className={inputClass}
              value={level1Value}
              onChange={e => handleLevel1Change(e.target.value)}
            >
              <option value="">Any {labels.level1Label}</option>
              {renderOptions(staticLevel1, counts1)}
            </select>
          </div>
        )}

        {level1Value && staticLevel2.length > 0 && hasLiveLevel2 && (
          <div className="flex flex-col gap-1 animate-in slide-in-from-top-1 duration-200">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              {labels.level2Label}
            </label>
            <select
              className={inputClass}
              value={level2Value}
              onChange={e => handleLevel2Change(e.target.value)}
            >
              <option value="">Any {labels.level2Label}</option>
              {renderOptions(staticLevel2, counts2)}
            </select>
          </div>
        )}

        {depth >= 3 && level2Value && staticLevel3.length > 0 && hasLiveLevel3 && (
          <div className="flex flex-col gap-1 animate-in slide-in-from-top-1 duration-200">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              {labels.level3Label || 'Model'}
            </label>
            <select
              className={inputClass}
              value={searchParams.get(params.level3) || ''}
              onChange={e => handleLevel3Change(e.target.value)}
            >
              <option value="">Any Model</option>
              {renderOptions(staticLevel3, counts3)}
            </select>
          </div>
        )}

        {level1Value && !hasLiveLevel2 && (
          <p className="text-xs text-muted-foreground italic px-1">
            No sub-options currently available
          </p>
        )}
      </div>
    </details>
  );
}

// ─── Main FilterSidebar ───────────────────────────────────────────────────────

export default function FilterSidebar({ onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [catCounts, setCatCounts] = useState({});

  useEffect(() => {
    getCategoryCounts().then(setCatCounts).catch(console.error);
  }, []);

  const get = (key) => searchParams.get(key) || '';

  // Single setter used by both flat filters and CascadeFilterGroup
  const setParam = (nextParams) => {
    setSearchParams(nextParams);
  };

  const set = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const resetAll = () => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    setSearchParams(next);
  };

  const handleCategorySelect = (slug) => {
    const next = new URLSearchParams();
    if (slug) next.set('category', slug);
    setSearchParams(next);
  };

  const catConfig = FILTER_CONFIG[category];
  const catFilters = catConfig?.filters || [];

  const cascadeConfig = CASCADE_URL_PARAMS[category];
  const primarySubParam = cascadeConfig ? cascadeConfig.level1 : (catFilters.length > 0 ? catFilters[0].urlParam : null);
  const primarySubValue = searchParams.get(primarySubParam);
  const isFocusMode = !!category;
  const showAdvanced = isFocusMode && !!primarySubValue;

  const subcategoryFlatFilter = !cascadeConfig && catFilters.length > 0 ? catFilters[0] : null;
  const advancedFlatFilters = catFilters.filter(f => f.id !== 'condition' && f.urlParam !== primarySubParam);

  const ignoredKeys = new Set(['category', 'keyword', 'location', 'sort', 'page']);
  const activeCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;
  const countyList = COUNTIES || [];

  const renderFlatFilter = (f) => {
    if (f.type === 'text') {
      return (
        <input
          type="text"
          className={inputClass}
          placeholder={f.placeholder || `Any ${f.label}`}
          value={get(f.urlParam)}
          onChange={e => set(f.urlParam, e.target.value)}
        />
      );
    } else if (f.type === 'dynamic-select') {
      return (
        <DynamicDataFilter
          category={category}
          urlParam={f.urlParam}
          searchParams={searchParams}
          onChange={v => set(f.urlParam, v)}
        />
      );
    } else if (f.type === 'select') {
      return (
        <select
          className={inputClass}
          value={get(f.urlParam)}
          onChange={e => set(f.urlParam, e.target.value)}
        >
          <option value="">Any {f.label}</option>
          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    } else if (f.type === 'radio') {
      return (
        <RadioGroup
          options={f.options}
          value={get(f.urlParam)}
          onChange={v => set(f.urlParam, v)}
        />
      );
    } else if (f.type === 'multicheck') {
      return (
        <MultiCheck
          options={f.options}
          value={get(f.urlParam)}
          onChange={v => set(f.urlParam, v)}
        />
      );
    }
    return null;
  };

  return (
    <aside className="flex flex-col w-full h-full bg-background md:bg-transparent">
      {/* Mobile header */}
      <div className="flex items-center justify-between pb-4 border-b border-border md:hidden">
        <span className="font-bold text-lg text-foreground">
          Filters {activeCount > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{activeCount}</span>}
        </span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button className="text-sm font-semibold text-muted-foreground hover:text-foreground" onClick={resetAll}>Clear all</button>
          )}
          {onClose && (
            <button className="rounded-full p-2 hover:bg-secondary text-foreground" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between pb-2">
        <span className="font-bold text-lg text-foreground">
          Filters {activeCount > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{activeCount}</span>}
        </span>
        {activeCount > 0 && (
          <button className="text-xs font-semibold text-muted-foreground hover:text-foreground" onClick={resetAll}>Clear all</button>
        )}
      </div>

      <div className="flex flex-col pb-20 md:pb-0 overflow-y-auto">

        {/* ── Category Selection Mode ── */}
        {!isFocusMode && (
          <div className="flex flex-col gap-1 mt-2">
            <h3 className="font-bold text-foreground mb-3 px-2 text-lg">All Categories</h3>
            {CATEGORY_ICONS.map(c => (
              <button
                key={c.slug}
                onClick={() => handleCategorySelect(c.slug)}
                className="flex items-center justify-between gap-2 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary/50 text-foreground group"
              >
                <span className="flex items-center gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <span className="font-medium text-[15px]">{c.name}</span>
                </span>
                {catCounts[c.slug] > 0 && (
                  <span className="rounded-full bg-secondary/80 group-hover:bg-primary/10 px-3 py-1 text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {catCounts[c.slug]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Focus Mode ── */}
        {isFocusMode && (
          <>
            <div className="mb-6 px-2 mt-2">
              <button
                onClick={() => handleCategorySelect('')}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Categories
              </button>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="text-3xl">{CATEGORY_ICONS.find(c => c.slug === category)?.icon}</span>
                {CATEGORY_ICONS.find(c => c.slug === category)?.name}
              </h2>
            </div>

            {/* Primary Subcategory (Cascade Level 1) */}
            {hasCascadeFilters(category) && (
              <CascadeFilterGroup
                categorySlug={category}
                searchParams={searchParams}
                setParam={setParam}
              />
            )}

            {/* Primary Subcategory (Flat Filter, e.g., Jobs) */}
            {subcategoryFlatFilter && (
              <FilterGroup key={subcategoryFlatFilter.id} label={subcategoryFlatFilter.label}>
                {renderFlatFilter(subcategoryFlatFilter)}
              </FilterGroup>
            )}

            {!showAdvanced && (
              <div className="mt-8 p-6 rounded-xl bg-secondary/20 border border-border/50 text-center flex flex-col items-center gap-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground mb-1">
                  <GitBranch className="w-6 h-6" />
                </div>
                <p className="text-[15px] font-medium text-foreground">
                  Select a subcategory
                </p>
                <p className="text-sm text-muted-foreground">
                  Choose an option above to unlock advanced filters and specific details.
                </p>
              </div>
            )}

            {showAdvanced && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                {/* ── Location ── */}
                <FilterGroup label="Location">
                  <select
                    className={inputClass}
                    value={get('county')}
                    onChange={e => set('county', e.target.value)}
                  >
                    <option value="">All Kenya</option>
                    {countyList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FilterGroup>

                {/* ── Price Range ── */}
                <FilterGroup label="Price (KES)">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="Min"
                      min="0"
                      value={get('minPrice')}
                      onChange={e => set('minPrice', e.target.value)}
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="Max"
                      min="0"
                      value={get('maxPrice')}
                      onChange={e => set('maxPrice', e.target.value)}
                    />
                  </div>
                </FilterGroup>

                {/* ── Advanced Category-specific flat filters ── */}
                {advancedFlatFilters.map(f => (
                  <FilterGroup key={f.id} label={f.label}>
                    {renderFlatFilter(f)}
                  </FilterGroup>
                ))}

                {/* ── Condition (Universal) ── */}
                {(() => {
                  const condFilter = catFilters.find(f => f.id === 'condition') || UNIVERSAL_FILTERS.find(f => f.id === 'condition');
                  if (!condFilter) return null;
                  return (
                    <FilterGroup label="Condition" defaultOpen={false}>
                      <RadioGroup
                        options={condFilter.options}
                        value={get('condition')}
                        onChange={v => set('condition', v)}
                      />
                    </FilterGroup>
                  );
                })()}

                {/* ── Sort ── */}
                <FilterGroup label="Sort By" defaultOpen={false}>
                  <RadioGroup
                    options={['Newest','Price: Low → High','Price: High → Low']}
                    value={
                      get('sort') === 'price_asc' ? 'Price: Low → High'
                      : get('sort') === 'price_desc' ? 'Price: High → Low'
                      : 'Newest'
                    }
                    onChange={v => set('sort',
                      v === 'Price: Low → High' ? 'price_asc'
                      : v === 'Price: High → Low' ? 'price_desc'
                      : 'createdAt'
                    )}
                  />
                </FilterGroup>

                {/* ── Date Posted ── */}
                <FilterGroup label="Date Posted" defaultOpen={false}>
                  <RadioGroup
                    options={['Today','Last 7 days','Last 30 days']}
                    value={get('posted')}
                    onChange={v => set('posted', v)}
                  />
                </FilterGroup>

                {/* ── Seller Type ── */}
                <FilterGroup label="Seller Type" defaultOpen={false}>
                  <RadioGroup
                    options={['Individual','Dealer']}
                    value={get('seller_type')}
                    onChange={v => set('seller_type', v)}
                  />
                </FilterGroup>

              </div>
            )}
          </>
        )}

      </div>
    </aside>
  );
}
