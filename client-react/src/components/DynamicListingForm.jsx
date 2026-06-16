import { useState, useEffect } from 'react';
import { SCHEMA_CATEGORIES, getVisibleAttributes } from '@/lib/schemaEngine';
import CATEGORY_ATTRIBUTES from '@/lib/categoryData';

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

  // If there's no dynamic schema defined yet, fallback to nothing (or we could fallback to the old forms)
  if (!schemaCat) return null;

  const [transactionType, setTransactionType] = useState(values.transactionType || '');
  const [subcategory, setSubcategory] = useState(values.subcategory || '');
  const [specs, setSpecs] = useState(values.specs || {});

  // Dependency mapping for make/model from categoryData (for vehicles)
  const [make, setMake] = useState(values.specs?.make || '');
  const [model, setModel] = useState(values.specs?.model || '');

  // When category changes, reset everything
  useEffect(() => {
    setTransactionType('');
    setSubcategory('');
    setSpecs({});
    setMake('');
    setModel('');
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
    
    // Auto-clear model if make changes
    if (key === 'make') {
      next.model = '';
      setMake(val);
      setModel('');
    }
    if (key === 'model') setModel(val);

    setSpecs(next);
    emit({ specs: next });
  };

  // Get the visible attributes from the rules engine
  const visibleAttrs = getVisibleAttributes({ category, transactionType, subcategory });
  
  // Clean up hidden specs so data doesn't get contaminated
  useEffect(() => {
    const allowedKeys = visibleAttrs.map(a => a.id);
    let cleanedSpecs = { ...specs };
    let changed = false;

    Object.keys(cleanedSpecs).forEach(k => {
      if (!allowedKeys.includes(k) && k !== 'make' && k !== 'model') {
        delete cleanedSpecs[k];
        changed = true;
      }
    });

    if (changed) {
      setSpecs(cleanedSpecs);
      emit({ specs: cleanedSpecs });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, transactionType, subcategory]); // run when context changes


  // Group attributes by section
  const sections = {};
  visibleAttrs.forEach(attr => {
    const sec = attr.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(attr);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      
      {/* ── CORE DEPENDENCY SELECTORS ────────────────────────────── */}
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

      {/* ── DYNAMIC ATTRIBUTE SECTIONS ───────────────────────────── */}
      {Object.keys(sections).map(sectionName => (
        <div key={sectionName} style={{ animation: 'fadeIn 0.3s ease' }}>
          <SectionHeader title={sectionName} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {sections[sectionName].map(attr => {
              
              // Dynamic options for Make/Model from legacy categoryData
              let options = attr.options || [];
              if (attr.id === 'make') {
                options = Object.keys(CATEGORY_ATTRIBUTES['vehicles']?.data || {});
              } else if (attr.id === 'model') {
                options = CATEGORY_ATTRIBUTES['vehicles']?.data[make] || [];
              }

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
