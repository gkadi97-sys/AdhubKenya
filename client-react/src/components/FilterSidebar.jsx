import { useSearchParams, useNavigate } from 'react-router-dom';
import { FILTER_CONFIG, UNIVERSAL_FILTERS } from '@/lib/filterConfig';
import { COUNTIES } from '@/lib/countyData';

function FilterGroup({ label, children, defaultOpen = true }) {
  return (
    <details className="filter-group" open={defaultOpen}>
      <summary className="filter-group-header">
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </summary>
      <div className="filter-group-body">{children}</div>
    </details>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="filter-radio-group">
      {options.map(opt => (
        <label key={opt} className={`filter-radio-label ${value === opt ? 'active' : ''}`}>
          <input
            type="radio"
            name={`radio-${opt}`}
            checked={value === opt}
            onChange={() => onChange(value === opt ? '' : opt)}
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
    <div className="filter-check-group">
      {options.map(opt => (
        <label key={opt} className={`filter-check-label ${selected.includes(opt) ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default function FilterSidebar({ onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || '';

  const get = (key) => searchParams.get(key) || '';
  const set = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // reset pagination
    setSearchParams(next);
  };

  const resetAll = () => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    setSearchParams(next);
  };

  const catConfig = FILTER_CONFIG[category];
  const catFilters = catConfig?.filters || [];

  // Count active filters (excluding category, keyword, location, sort, page)
  const ignoredKeys = new Set(['category', 'keyword', 'location', 'sort', 'page']);
  const activeCount = [...searchParams.keys()].filter(k => !ignoredKeys.has(k)).length;

  const countyList = Object.keys(COUNTIES || {});

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <span className="filter-sidebar-title">
          Filters {activeCount > 0 && <span className="filter-count-badge">{activeCount}</span>}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeCount > 0 && (
            <button className="filter-clear-btn" onClick={resetAll}>Clear all</button>
          )}
          {onClose && (
            <button className="filter-close-btn" onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
      </div>

      <div className="filter-sidebar-body">

        {/* ── Location ── */}
        <FilterGroup label="Location">
          <label className="filter-field-label">County</label>
          <select
            className="filter-select"
            value={get('county')}
            onChange={e => set('county', e.target.value)}
          >
            <option value="">All Kenya</option>
            {countyList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterGroup>

        {/* ── Price Range ── */}
        <FilterGroup label="Price (KES)">
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              min="0"
              value={get('minPrice')}
              onChange={e => set('minPrice', e.target.value)}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              min="0"
              value={get('maxPrice')}
              onChange={e => set('maxPrice', e.target.value)}
            />
          </div>
        </FilterGroup>

        {/* ── Category-specific filters ── */}
        {catFilters.map(f => {
          if (f.id === 'condition') return null; // handled in universal below
          return (
            <FilterGroup key={f.id} label={f.label}>
              {f.type === 'text' ? (
                <input
                  type="text"
                  className="filter-input"
                  placeholder={f.placeholder || `Any ${f.label}`}
                  value={get(f.urlParam)}
                  onChange={e => set(f.urlParam, e.target.value)}
                />
              ) : f.type === 'select' ? (
                <select
                  className="filter-select"
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

        {/* ── Condition (universal or category override) ── */}
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
