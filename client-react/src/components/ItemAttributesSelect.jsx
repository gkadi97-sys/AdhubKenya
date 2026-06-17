'use client';
import { useState, useEffect } from 'react';
import CATEGORY_ATTRIBUTES, { MANUFACTURE_YEARS, getSpecs } from '@/lib/categoryData';
import TvForm from './TvForm';

/**
 * ItemAttributesSelect
 * Props:
 *   category  : top-level slug  (e.g. 'vehicles', 'electronics')
 *   values    : { make, model, year, specs:{} }
 *   onChange  : callback({ make, model, year, specs:{} })
 */
export default function ItemAttributesSelect({ category, values = {}, onChange }) {
  const attrs = CATEGORY_ATTRIBUTES[category];

  const [make,  setMake]  = useState(values.make  || '');
  const [brand, setBrand] = useState(values.specs?.brand || ''); // For nested level 2
  const [model, setModel] = useState(values.model || '');
  const [year,  setYear]  = useState(values.year  || '');
  const [specs, setSpecs] = useState(values.specs || {});

  // Compatible Vehicles state (Auto Spares)
  const [compMake, setCompMake] = useState('');
  const [compModel, setCompModel] = useState('');

  // Reset everything when category changes
  useEffect(() => {
    setMake(''); setBrand(''); setModel(''); setYear(''); setSpecs({});
    onChange({ make:'', model:'', year:'', specs:{} });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (!attrs) return null;

  const level1Options = Object.keys(attrs.data);
  const l1Data = make ? attrs.data[make] : null;
  const isNested = l1Data && !Array.isArray(l1Data) && typeof l1Data === 'object';
  
  const level2Options = isNested ? Object.keys(l1Data) : (l1Data || []);
  const level3Options = (isNested && brand) ? (l1Data[brand] || []) : [];

  const specFields = getSpecs(category, make, isNested ? brand : model); // extra spec dropdowns

  const emit = (overrides) => {
    const nextSpecs = { ...specs };
    if (isNested) {
      nextSpecs.brand = overrides.brand !== undefined ? overrides.brand : brand;
    }
    const finalOverrides = { ...overrides };
    delete finalOverrides.brand; // don't emit brand as top-level
    onChange({ make, model, year, specs: nextSpecs, ...finalOverrides });
  };

  const handleMakeChange = (e) => {
    const val = e.target.value;
    setMake(val); setBrand(''); setModel(''); setSpecs({});
    onChange({ make: val, model:'', year, specs:{} });
  };

  const handleBrandChange = (e) => {
    const val = e.target.value;
    setBrand(val); setModel('');
    emit({ brand: val, model: '' });
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    emit({ model: val });
  };

  const handleYearChange = (e) => {
    const val = e.target.value;
    setYear(val);
    emit({ year: val });
  };

  const handleSpecChange = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const addCompatibleVehicle = () => {
    if (!compMake || !compModel) return;
    const currentList = specs.compatibleVehicles || [];
    const exists = currentList.find(v => v.make === compMake && v.model === compModel);
    if (!exists) {
      const nextList = [...currentList, {make: compMake, model: compModel}];
      const nextSpecs = { ...specs, compatibleVehicles: nextList };
      setSpecs(nextSpecs);
      emit({ specs: nextSpecs });
    }
    setCompMake('');
    setCompModel('');
  };

  const removeCompatibleVehicle = (idx) => {
    const currentList = [...(specs.compatibleVehicles || [])];
    currentList.splice(idx, 1);
    const nextSpecs = { ...specs, compatibleVehicles: currentList };
    setSpecs(nextSpecs);
    emit({ specs: nextSpecs });
  };

  const compVehiclesData = CATEGORY_ATTRIBUTES['vehicles']?.data || {};
  const compMakeOptions = Object.keys(compVehiclesData);
  const compModelOptions = compMake ? (compVehiclesData[compMake] || []) : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* ── Level 1: Make / Type ─────────────────────────────── */}
      <div className="form-group" style={{marginBottom:0}}>
        <label className="form-label">{attrs.level1Label}</label>
        <select className="form-control" value={make} onChange={handleMakeChange}>
          <option value="">Select {attrs.level1Label}</option>
          {level1Options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {make === 'Televisions' ? (
        <TvForm values={values} onChange={emit} />
      ) : (
        <>
          {/* ── Level 2: Brand / Item (or Model if not nested) ──── */}
          {make && (
        <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
          <label className="form-label">{isNested ? 'Brand' : attrs.level2Label}</label>
          <select className="form-control" value={isNested ? brand : model} onChange={isNested ? handleBrandChange : handleModelChange}>
            <option value="">Select {isNested ? 'Brand' : attrs.level2Label}</option>
            {level2Options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Level 3: Model (Only if nested) ──────────────────── */}
      {isNested && brand && (
        <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
          <label className="form-label">Model</label>
          <select className="form-control" value={model} onChange={handleModelChange}>
            <option value="">Select Model</option>
            {level3Options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Year of Manufacture (vehicles only) ──────────────── */}
      {attrs.hasYear && make && (
        <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
          <label className="form-label">Year of Manufacture</label>
          <select className="form-control" value={year} onChange={handleYearChange}>
            <option value="">Select Year</option>
            {MANUFACTURE_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Compatible Vehicles (Auto Spares only) ───────────── */}
      {category === 'auto-spares' && make && (
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
          <label className="form-label" style={{marginBottom: 8}}>Compatible Vehicles</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <select className="form-control" style={{flex: 1, fontSize:'0.85rem'}} value={compMake} onChange={e => {setCompMake(e.target.value); setCompModel('');}}>
              <option value="">Make</option>
              {compMakeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select className="form-control" style={{flex: 1, fontSize:'0.85rem'}} value={compModel} onChange={e => setCompModel(e.target.value)} disabled={!compMake}>
              <option value="">Model</option>
              {compModelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button type="button" onClick={addCompatibleVehicle} disabled={!compMake || !compModel} style={{
              background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 'var(--radius)', padding: '0 16px', cursor: 'pointer', fontWeight: 600
            }}>Add</button>
          </div>
          
          {(specs.compatibleVehicles || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {specs.compatibleVehicles.map((v, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', padding: '4px 8px', borderRadius: 20, fontSize: '0.75rem', border: '1px solid var(--border)'
                }}>
                  {v.make} {v.model}
                  <button type="button" onClick={() => removeCompatibleVehicle(idx)} style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.9rem', lineHeight: 1
                  }}>&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Extra Spec Fields ────────────────────────────────── */}
      {make && specFields.length > 0 && (
        <>
          <div style={{
            paddingTop:12, borderTop:'1px solid var(--border)',
            fontSize:'0.78rem', color:'var(--text-muted)',
            textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600,
          }}>
            Additional Specifications
          </div>

          {/* Render 2-column grid for specs */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',
            gap:14,
          }}>
            {specFields.map(spec => (
              <div key={spec.key} className="form-group" style={{marginBottom:0}}>
                <label className="form-label" style={{fontSize:'0.8rem'}}>{spec.label}</label>
                {spec.type === 'text' ? (
                  <input
                    type="text"
                    className="form-control"
                    style={{fontSize:'0.85rem'}}
                    placeholder={`Enter ${spec.label}`}
                    value={specs[spec.key] || ''}
                    onChange={e => handleSpecChange(spec.key, e.target.value)}
                  />
                ) : (
                  <select
                    className="form-control"
                    style={{fontSize:'0.85rem'}}
                    value={specs[spec.key] || ''}
                    onChange={e => handleSpecChange(spec.key, e.target.value)}
                  >
                    <option value="">Select {spec.label}</option>
                    {spec.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      </>
      )}

      {/* ── Summary pill ─────────────────────────────────────── */}
      {(make || brand || model || year) && (
        <div style={{
          display:'flex', flexWrap:'wrap', gap:8,
          padding:'10px 14px', background:'var(--primary-glow)',
          border:'1px solid var(--primary)', borderRadius:'var(--radius)',
          fontSize:'0.82rem', color:'var(--primary-light)',
        }}>
          {make  && <span>🏷️ <strong>{make}</strong></span>}
          {brand && <span>› <strong>{brand}</strong></span>}
          {model && <span>› <strong>{model}</strong></span>}
          {year  && <span>› <strong>{year}</strong></span>}
          {Object.entries(specs).filter(([k,v])=> v && k !== 'brand').map(([k,v])=>(
            <span key={k} style={{background:'rgba(255,255,255,0.06)',padding:'2px 8px',borderRadius:20}}>
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
