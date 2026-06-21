'use client';
import { useState, useEffect } from 'react';
import CATEGORY_ATTRIBUTES, { MANUFACTURE_YEARS, getSpecs } from '@/lib/categoryData';
import TvForm from './TvForm';
import AudioForm from './AudioForm';
import LaptopForm from './LaptopForm';

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

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block";

  return (
    <div className="flex flex-col gap-4">

      {/* ── Level 1: Make / Type ─────────────────────────────── */}
      <div>
        <label className={labelClass}>{attrs.level1Label}</label>
        <select className={inputClass} value={make} onChange={handleMakeChange}>
          <option value="">Select {attrs.level1Label}</option>
          {level1Options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {make === 'Televisions' ? (
        <TvForm values={values} onChange={emit} />
      ) : make === 'Audio & Music' ? (
        <AudioForm values={values} onChange={emit} />
      ) : make === 'Laptops & Computers' ? (
        <LaptopForm values={values} onChange={emit} />
      ) : (
        <div className="flex flex-col gap-4">
          {/* ── Level 2: Brand / Item (or Model if not nested) ──── */}
          {make && (
            <div className="animate-in fade-in duration-300">
              <label className={labelClass}>{isNested ? 'Brand' : attrs.level2Label}</label>
              <select className={inputClass} value={isNested ? brand : model} onChange={isNested ? handleBrandChange : handleModelChange}>
                <option value="">Select {isNested ? 'Brand' : attrs.level2Label}</option>
                {level2Options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Level 3: Model (Only if nested) ──────────────────── */}
          {isNested && brand && (
            <div className="animate-in fade-in duration-300">
              <label className={labelClass}>Model</label>
              <select className={inputClass} value={model} onChange={handleModelChange}>
                <option value="">Select Model</option>
                {level3Options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Year of Manufacture (vehicles only) ──────────────── */}
          {attrs.hasYear && make && (
            <div className="animate-in fade-in duration-300">
              <label className={labelClass}>Year of Manufacture</label>
              <select className={inputClass} value={year} onChange={handleYearChange}>
                <option value="">Select Year</option>
                {MANUFACTURE_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Compatible Vehicles (Auto Spares only) ───────────── */}
          {category === 'auto-spares' && make && (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4">
              <label className={labelClass}>Compatible Vehicles</label>
              <div className="flex gap-2 mb-3">
                <select className={`${inputClass} flex-1 text-xs`} value={compMake} onChange={e => {setCompMake(e.target.value); setCompModel('');}}>
                  <option value="">Make</option>
                  {compMakeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className={`${inputClass} flex-1 text-xs`} value={compModel} onChange={e => setCompModel(e.target.value)} disabled={!compMake}>
                  <option value="">Model</option>
                  {compModelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button type="button" onClick={addCompatibleVehicle} disabled={!compMake || !compModel} className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  Add
                </button>
              </div>
              
              {(specs.compatibleVehicles || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specs.compatibleVehicles.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                      {v.make} {v.model}
                      <button type="button" onClick={() => removeCompatibleVehicle(idx)} className="text-muted-foreground hover:text-destructive">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Extra Spec Fields ────────────────────────────────── */}
          {make && specFields.length > 0 && (
            <div className="animate-in fade-in duration-300">
              <div className="mt-2 mb-3 border-t border-border pt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Additional Specifications
              </div>

              {/* Render 2-column grid for specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specFields.map(spec => (
                  <div key={spec.key}>
                    <label className={labelClass}>{spec.label}</label>
                    {spec.type === 'text' ? (
                      <input
                        type="text"
                        className={inputClass}
                        placeholder={`Enter ${spec.label}`}
                        value={specs[spec.key] || ''}
                        onChange={e => handleSpecChange(spec.key, e.target.value)}
                      />
                    ) : (
                      <select
                        className={inputClass}
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
            </div>
          )}
        </div>
      )}

      {/* ── Summary pill ─────────────────────────────────────── */}
      {(make || brand || model || year) && (
        <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {make  && <span>🏷️ <strong className="font-semibold">{make}</strong></span>}
          {brand && <span>› <strong className="font-semibold">{brand}</strong></span>}
          {model && <span>› <strong className="font-semibold">{model}</strong></span>}
          {year  && <span>› <strong className="font-semibold">{year}</strong></span>}
          {Object.entries(specs).filter(([k,v])=> v && k !== 'brand').map(([k,v])=>(
            <span key={k} className="rounded-full bg-background/50 px-2 py-0.5 text-xs font-medium border border-primary/10">
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
