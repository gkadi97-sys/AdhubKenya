import { useState, useEffect } from 'react';
import { SCHEMA_CATEGORIES, getVisibleAttributes } from '@/lib/schemaEngine';
import { CATEGORY_ATTRIBUTES, MANUFACTURE_YEARS } from '@/lib/categoryData';

// ── UI Primitives ──────────────────────────────────────────────────────────

const Field = ({ label, required, children }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label" style={{ fontSize: '0.82rem' }}>
      {label}{required && <span style={{ color: 'var(--primary-light)', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <div style={{
    paddingTop: 8, paddingBottom: 12,
    borderBottom: '1px solid var(--border)',
    marginBottom: 4,
    fontSize: '0.78rem', textTransform: 'uppercase',
    letterSpacing: '0.07em', fontWeight: 700,
    color: 'var(--text-muted)'
  }}>
    {title}
  </div>
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select className="form-control" style={{ fontSize: '0.85rem' }} value={value} onChange={e => onChange(e.target.value)}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

// ── Determine data shape ───────────────────────────────────────────────────
// Shape A: { 'Group': ['item1', 'item2'] }           → 2-level dropdown
// Shape B: { 'Group': { 'Brand': ['model1', ...] } } → 3-level dropdown

function getShape(data) {
  const firstVal = data ? Object.values(data)[0] : null;
  if (!firstVal) return null;
  if (Array.isArray(firstVal)) return 'A';
  if (typeof firstVal === 'object') return 'B';
  return null;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function DynamicListingForm({ category, values = {}, onChange }) {
  const catAttrs = CATEGORY_ATTRIBUTES[category];
  const schemaCat = SCHEMA_CATEGORIES[category];

  // Nothing at all for this category
  if (!catAttrs && !schemaCat) return null;

  const data = catAttrs?.data || null;
  const shape = getShape(data);

  // ── Cascading selections ─────────────────────────────────────────────
  const [level1, setLevel1] = useState(values.specs?.level1 || values.specs?.make || '');
  const [level2, setLevel2] = useState(values.specs?.level2 || values.specs?.model || '');
  const [level3, setLevel3] = useState(values.specs?.level3 || values.specs?.variant || '');
  const [year,   setYear]   = useState(values.specs?.year   || '');

  // ── Schema fields (mileage, fuel type, etc.) ─────────────────────────
  const [transactionType, setTransactionType] = useState(values.transactionType || '');
  const [subcategory,     setSubcategory]     = useState(values.subcategory     || '');
  const [specs,           setSpecs]           = useState(values.specs           || {});

  // Reset when category changes
  useEffect(() => {
    setLevel1(''); setLevel2(''); setLevel3(''); setYear('');
    setTransactionType(''); setSubcategory('');
    setSpecs({});
    onChange({ transactionType: '', subcategory: '', specs: {} });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // ── Emit helper ──────────────────────────────────────────────────────
  const emit = (specsOverride, txOverride, subOverride) => {
    onChange({
      transactionType: txOverride  !== undefined ? txOverride  : transactionType,
      subcategory:     subOverride !== undefined ? subOverride : subcategory,
      specs:           specsOverride !== undefined ? specsOverride : specs,
    });
  };

  // ── Cascading level handlers ─────────────────────────────────────────
  const handleLevel1 = (val) => {
    setLevel1(val); setLevel2(''); setLevel3('');
    const isveh = category === 'vehicles';
    const next = { ...specs,
      [isveh ? 'make'  : 'level1']: val,
      [isveh ? 'model' : 'level2']: '',
      [isveh ? 'variant' : 'level3']: '',
    };
    setSpecs(next); emit(next);
  };

  const handleLevel2 = (val) => {
    setLevel2(val); setLevel3('');
    const isveh = category === 'vehicles';
    const next = { ...specs,
      [isveh ? 'model'   : 'level2']: val,
      [isveh ? 'variant' : 'level3']: '',
    };
    setSpecs(next); emit(next);
  };

  const handleLevel3 = (val) => {
    setLevel3(val);
    const isveh = category === 'vehicles';
    const next = { ...specs, [isveh ? 'variant' : 'level3']: val };
    setSpecs(next); emit(next);
  };

  const handleYear = (val) => {
    setYear(val);
    const next = { ...specs, year: val };
    setSpecs(next); emit(next);
  };

  const handleSpecChange = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next); emit(next);
  };

  // ── Compute available options ────────────────────────────────────────
  let level1Options = [];
  let level2Options = [];
  let level3Options = [];

  if (data && shape === 'A') {
    // { 'Engine Parts': ['Part A', 'Part B'] }
    level1Options = Object.keys(data);
    if (level1) level2Options = data[level1] || [];
  } else if (data && shape === 'B') {
    // { 'Mobile Phones': { 'Samsung': ['Galaxy S', ...] } }
    level1Options = Object.keys(data);
    if (level1 && data[level1]) {
      level2Options = Object.keys(data[level1]);
      if (level2 && data[level1][level2]) {
        level3Options = data[level1][level2];
      }
    }
  }

  // ── Schema attributes (excluding cascading ones) ─────────────────────
  const visibleAttrs = schemaCat
    ? getVisibleAttributes({ category, transactionType, subcategory }).filter(
        a => !['make', 'model', 'variant', 'year'].includes(a.id)
      )
    : [];

  const sections = {};
  visibleAttrs.forEach(attr => {
    const sec = attr.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(attr);
  });

  // ── Labels ───────────────────────────────────────────────────────────
  const l1Label = catAttrs?.level1Label || (category === 'vehicles' ? 'Make' : 'Category');
  const l2Label = catAttrs?.level2Label || (category === 'vehicles' ? 'Model' : 'Subcategory');
  const l3Label = 'Model';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>

      {/* ── SCHEMA: Transaction Type + Subcategory (property, vehicles, jobs) ── */}
      {schemaCat && (schemaCat.transactionTypes?.length > 0 || schemaCat.subcategories?.length > 0) && (
        <div>
          <SectionHeader title="Core Information" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {schemaCat.transactionTypes?.length > 0 && (
              <Field label="Transaction Type" required>
                <Select
                  value={transactionType}
                  onChange={val => { setTransactionType(val); emit(undefined, val); }}
                  options={schemaCat.transactionTypes}
                  placeholder="Select Transaction"
                />
              </Field>
            )}
            {schemaCat.subcategories?.length > 0 && (
              <Field label="Subcategory / Type" required>
                <Select
                  value={subcategory}
                  onChange={val => { setSubcategory(val); emit(undefined, undefined, val); }}
                  options={schemaCat.subcategories.map(s => s.name)}
                  placeholder="Select Type"
                />
              </Field>
            )}
          </div>
        </div>
      )}

      {/* ── CASCADING DROPDOWNS (all categories via CATEGORY_ATTRIBUTES) ── */}
      {data && shape && (
        <div>
          <SectionHeader title={
            category === 'vehicles' ? 'Vehicle Details' :
            category === 'auto-spares' ? 'Part Details' :
            category === 'phones-tablets' ? 'Phone / Tablet Details' :
            'Item Details'
          } />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

            {/* Level 1 */}
            <Field label={l1Label} required>
              <Select value={level1} onChange={handleLevel1} options={level1Options} placeholder={`Select ${l1Label}`} />
            </Field>

            {/* Level 2 — shown when Level 1 is chosen and has options */}
            {level1 && level2Options.length > 0 && (
              <Field label={l2Label} required>
                <Select value={level2} onChange={handleLevel2} options={level2Options} placeholder={`Select ${l2Label}`} />
              </Field>
            )}

            {/* Level 3 — only for 3-level (phones) when Level 2 is chosen */}
            {shape === 'B' && level2 && level3Options.length > 0 && (
              <Field label={l3Label}>
                <Select value={level3} onChange={handleLevel3} options={level3Options} placeholder={`Select ${l3Label}`} />
              </Field>
            )}

            {/* Year (vehicles only) */}
            {catAttrs?.hasYear && (
              <Field label="Year of Manufacture" required>
                <Select value={year} onChange={handleYear} options={MANUFACTURE_YEARS.map(String)} placeholder="Select Year" />
              </Field>
            )}

          </div>
        </div>
      )}

      {/* ── SCHEMA-DRIVEN SPEC FIELDS (mileage, fuel, transmission, etc.) ── */}
      {Object.keys(sections).map(sectionName => (
        <div key={sectionName} style={{ animation: 'fadeIn 0.3s ease' }}>
          <SectionHeader title={sectionName} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {sections[sectionName].map(attr => (
              <Field key={attr.id} label={attr.label} required={attr.required}>

                {attr.type === 'select' && (
                  <select className="form-control" style={{ fontSize: '0.85rem' }}
                    value={specs[attr.id] || ''}
                    onChange={e => handleSpecChange(attr.id, e.target.value)}>
                    <option value="">Select {attr.label}</option>
                    {(attr.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}

                {(attr.type === 'text' || attr.type === 'number' || attr.type === 'date') && (
                  <input type={attr.type} className="form-control" style={{ fontSize: '0.85rem' }}
                    placeholder={attr.label}
                    value={specs[attr.id] || ''}
                    onChange={e => handleSpecChange(attr.id, e.target.value)} />
                )}

                {attr.type === 'checkbox' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                      checked={!!specs[attr.id]}
                      onChange={e => handleSpecChange(attr.id, e.target.checked)} />
                    Yes / Available
                  </label>
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
