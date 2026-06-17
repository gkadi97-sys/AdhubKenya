import { useState, useEffect } from 'react';
import { SCHEMA_CATEGORIES, getVisibleAttributes } from '@/lib/schemaEngine';
import CATEGORY_ATTRIBUTES_DEFAULT, { CATEGORY_ATTRIBUTES, MANUFACTURE_YEARS } from '@/lib/categoryData';

// Reusable UI components
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

export default function DynamicListingForm({ category, values = {}, onChange }) {
  const schemaCat = SCHEMA_CATEGORIES[category];
  const catAttrs = CATEGORY_ATTRIBUTES[category];

  // ── Schema-based state (property, vehicles, jobs) ──────────
  const [transactionType, setTransactionType] = useState(values.transactionType || '');
  const [subcategory, setSubcategory] = useState(values.subcategory || '');
  const [specs, setSpecs] = useState(values.specs || {});

  // ── Cascading dropdown state (all categories via CATEGORY_ATTRIBUTES) ──
  const [level1, setLevel1] = useState(values.specs?.make || values.specs?.level1 || '');
  const [level2, setLevel2] = useState(values.specs?.model || values.specs?.level2 || '');
  const [level3, setLevel3] = useState(values.specs?.variant || values.specs?.level3 || '');
  const [year, setYear] = useState(values.specs?.year || '');

  // Reset everything when category changes
  useEffect(() => {
    setTransactionType('');
    setSubcategory('');
    setSpecs({});
    setLevel1('');
    setLevel2('');
    setLevel3('');
    setYear('');
    onChange({ transactionType: '', subcategory: '', specs: {} });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const emit = (overrides) => {
    onChange({
      transactionType: overrides.transactionType !== undefined ? overrides.transactionType : transactionType,
      subcategory: overrides.subcategory !== undefined ? overrides.subcategory : subcategory,
      specs: overrides.specs !== undefined ? overrides.specs : specs
    });
  };

  const handleSpecChange = (key, val) => {
    const next = { ...specs, [key]: val };
    if (key === 'make') { next.model = ''; next.variant = ''; }
    if (key === 'model') { next.variant = ''; }
    setSpecs(next);
    emit({ specs: next });
  };

  // ── Cascading dropdown helpers ─────────────────────────────
  if (!catAttrs && !schemaCat) return null; // No data for this category at all

  // Determine the structure of CATEGORY_ATTRIBUTES data
  // Structure A (vehicles): data = { 'Toyota': ['Allion', ...] }
  // Structure B (phones):   data = { 'Mobile Phones': { 'Samsung': ['Galaxy S', ...] } }
  let dataStructure = null;
  let level1Options = [];
  let level2Options = [];
  let level3Options = [];

  if (catAttrs) {
    const data = catAttrs.data;
    if (data) {
      const firstVal = Object.values(data)[0];
      if (Array.isArray(firstVal)) {
        // Structure A: { Make: [Model, Model, ...] }
        dataStructure = 'A';
        level1Options = Object.keys(data);
        if (level1) {
          level2Options = data[level1] || [];
        }
      } else if (typeof firstVal === 'object') {
        // Structure B: { Category: { Brand: [Model, ...] } }
        dataStructure = 'B';
        level1Options = Object.keys(data);
        if (level1 && data[level1]) {
          level2Options = Object.keys(data[level1]);
          if (level2 && data[level1][level2]) {
            level3Options = data[level1][level2];
          }
        }
      }
    }
  }

  // ── Schema-based attribute rendering ──────────────────────
  const visibleAttrs = schemaCat ? getVisibleAttributes({ category, transactionType, subcategory }) : [];
  const sections = {};
  visibleAttrs.forEach(attr => {
    // Skip make/model/year — handled by cascading dropdowns above
    if (['make', 'model', 'variant', 'year'].includes(attr.id)) return;
    const sec = attr.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(attr);
  });

  const handleCascadeLevel1 = (val) => {
    setLevel1(val);
    setLevel2('');
    setLevel3('');
    const key1 = category === 'vehicles' ? 'make' : 'level1';
    const next = { ...specs, [key1]: val, model: '', variant: '', level2: '', level3: '' };
    setSpecs(next);
    emit({ specs: next });
  };

  const handleCascadeLevel2 = (val) => {
    setLevel2(val);
    setLevel3('');
    const key2 = category === 'vehicles' ? 'model' : 'level2';
    const next = { ...specs, [key2]: val, variant: '', level3: '' };
    setSpecs(next);
    emit({ specs: next });
  };

  const handleCascadeLevel3 = (val) => {
    setLevel3(val);
    const key3 = category === 'vehicles' ? 'variant' : 'level3';
    const next = { ...specs, [key3]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const handleYear = (val) => {
    setYear(val);
    const next = { ...specs, year: val };
    setSpecs(next);
    emit({ specs: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>

      {/* ── SCHEMA CORE (Transaction Type + Subcategory) ─── */}
      {schemaCat && (
        <div>
          <SectionHeader title="Core Information" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {schemaCat.transactionTypes && schemaCat.transactionTypes.length > 0 && (
              <Field label="Transaction Type" required>
                <select className="form-control" style={{ fontSize: '0.85rem' }} value={transactionType}
                  onChange={e => { setTransactionType(e.target.value); emit({ transactionType: e.target.value }); }}>
                  <option value="">Select Transaction</option>
                  {schemaCat.transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            )}
            {schemaCat.subcategories && schemaCat.subcategories.length > 0 && (
              <Field label="Subcategory / Type" required>
                <select className="form-control" style={{ fontSize: '0.85rem' }} value={subcategory}
                  onChange={e => { setSubcategory(e.target.value); emit({ subcategory: e.target.value }); }}>
                  <option value="">Select Type</option>
                  {schemaCat.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
            )}
          </div>
        </div>
      )}

      {/* ── CASCADING DROPDOWNS (Make/Brand/Category → Model → Variant) ── */}
      {catAttrs && dataStructure && (
        <div>
          <SectionHeader title={category === 'vehicles' ? 'Vehicle Details' : 'Item Details'} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

            {/* Level 1: Make / Category */}
            <Field label={catAttrs.level1Label || 'Make'} required>
              <select className="form-control" style={{ fontSize: '0.85rem' }} value={level1}
                onChange={e => handleCascadeLevel1(e.target.value)}>
                <option value="">Select {catAttrs.level1Label || 'Make'}</option>
                {level1Options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {/* Level 2: Model / Brand — only shown when level1 selected */}
            {level1 && level2Options.length > 0 && (
              <Field label={catAttrs.level2Label || 'Model'} required>
                <select className="form-control" style={{ fontSize: '0.85rem' }} value={level2}
                  onChange={e => handleCascadeLevel2(e.target.value)}>
                  <option value="">Select {catAttrs.level2Label || 'Model'}</option>
                  {level2Options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            )}

            {/* Level 3: Sub-model — only shown for structure B (e.g. phones) when level2 selected */}
            {dataStructure === 'B' && level2 && level3Options.length > 0 && (
              <Field label="Model">
                <select className="form-control" style={{ fontSize: '0.85rem' }} value={level3}
                  onChange={e => handleCascadeLevel3(e.target.value)}>
                  <option value="">Select Model</option>
                  {level3Options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            )}

            {/* Year of Manufacture (vehicles only) */}
            {catAttrs.hasYear && (
              <Field label="Year of Manufacture" required>
                <select className="form-control" style={{ fontSize: '0.85rem' }} value={year}
                  onChange={e => handleYear(e.target.value)}>
                  <option value="">Select Year</option>
                  {MANUFACTURE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
            )}

          </div>
        </div>
      )}

      {/* ── SCHEMA-BASED ATTRIBUTE SECTIONS (mileage, fuel type, etc.) ── */}
      {Object.keys(sections).map(sectionName => (
        <div key={sectionName} style={{ animation: 'fadeIn 0.3s ease' }}>
          <SectionHeader title={sectionName} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {sections[sectionName].map(attr => {
              const options = attr.options || [];
              return (
                <Field key={attr.id} label={attr.label} required={attr.required}>
                  {attr.type === 'select' && (
                    <select className="form-control" style={{ fontSize: '0.85rem' }} value={specs[attr.id] || ''}
                      onChange={e => handleSpecChange(attr.id, e.target.value)}>
                      <option value="">Select {attr.label}</option>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
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
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}
