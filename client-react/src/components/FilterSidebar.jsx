import { useSearchParams } from 'react-router-dom';
import { FILTER_CONFIG, UNIVERSAL_FILTERS } from '@/lib/filterConfig';
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
import { ChevronDown, GitBranch } from 'lucide-react';

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

// ─── Cascade Filter Group ────────────────────────────────────────────────────
// This component is the heart of the "filter parity" feature.
// It reads cascade options from filterEngine.js (which reads from categoryData.js)
// and renders dependent dropdowns. Selecting a parent auto-clears child params.

function CascadeFilterGroup({ categorySlug, searchParams, setParam }) {
  if (!hasCascadeFilters(categorySlug)) return null;

  const depth = getCascadeDepth(categorySlug);
  const labels = getCascadeLabels(categorySlug);
  const params = CASCADE_URL_PARAMS[categorySlug];
  if (!params) return null;

  const level1Value = searchParams.get(params.level1) || '';
  const level2Value = searchParams.get(params.level2) || '';

  const level1Options = getLevel1Options(categorySlug);
  const level2Options = getLevel2Options(categorySlug, level1Value);
  const level3Options = depth >= 3 ? getLevel3Options(categorySlug, level1Value, level2Value) : [];

  const handleLevel1Change = (val) => {
    // Clear level2 and level3 when level1 changes
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
        {/* Level 1 */}
        {level1Options.length > 0 && (
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
              {level1Options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}

        {/* Level 2 — only shown when level1 is selected */}
        {level1Value && level2Options.length > 0 && (
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
              {level2Options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}

        {/* Level 3 — only shown for 3-level categories when level2 is selected */}
        {depth >= 3 && level2Value && level3Options.length > 0 && (
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
              {level3Options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}

        {/* Helper text when level1 is selected but no level2 options (flat list already at level2) */}
        {level1Value && level2Options.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">
            No sub-options for "{level1Value}"
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

  const catConfig = FILTER_CONFIG[category];
  const catFilters = catConfig?.filters || [];

  const ignoredKeys = new Set(['category', 'keyword', 'location', 'sort', 'page']);
  const activeCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;
  const countyList = COUNTIES || [];

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

        {/* ── Dynamic Cascade Filters (Brand → Model → Variant) ─────────── */}
        {/* This is the core of filter parity: derives options from categoryData.js */}
        {category && (
          <CascadeFilterGroup
            categorySlug={category}
            searchParams={searchParams}
            setParam={setParam}
          />
        )}

        {/* ── Category-specific flat filters ── */}
        {catFilters.map(f => {
          if (f.id === 'condition') return null; // handled separately below
          return (
            <FilterGroup key={f.id} label={f.label}>
              {f.type === 'text' ? (
                <input
                  type="text"
                  className={inputClass}
                  placeholder={f.placeholder || `Any ${f.label}`}
                  value={get(f.urlParam)}
                  onChange={e => set(f.urlParam, e.target.value)}
                />
              ) : f.type === 'select' ? (
                <select
                  className={inputClass}
                  value={get(f.urlParam)}
                  onChange={e => set(f.urlParam, e.target.value)}
                >
                  <option value="">Any {f.label}</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'radio' ? (
                <RadioGroup
                  options={f.options}
                  value={get(f.urlParam)}
                  onChange={v => set(f.urlParam, v)}
                />
              ) : f.type === 'multicheck' ? (
                <MultiCheck
                  options={f.options}
                  value={get(f.urlParam)}
                  onChange={v => set(f.urlParam, v)}
                />
              ) : null}
            </FilterGroup>
          );
        })}

        {/* ── Condition ── */}
        {(() => {
          const condFilter =
            catFilters.find(f => f.id === 'condition') ||
            UNIVERSAL_FILTERS.find(f => f.id === 'condition');
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
    </aside>
  );
}
