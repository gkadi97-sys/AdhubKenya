import { useState, useEffect } from 'react';
import { MASTER_SPARE_PARTS, MOCK_VEHICLE_HIERARCHY, POSITIONS } from '@/lib/autoSparesData';
import CATEGORY_ATTRIBUTES from '@/lib/categoryData';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function SparePartForm({ values = {}, onChange }) {
  const [category, setCategory] = useState(values.category || '');
  const [part, setPart] = useState(values.part || '');
  const [make, setMake] = useState(values.make || '');
  const [model, setModel] = useState(values.model || '');
  const [generation, setGeneration] = useState(values.generation || '');
  const [engine, setEngine] = useState(values.engine || '');
  const [year, setYear] = useState(values.year || '');
  const [position, setPosition] = useState(values.position || '');
  const [oemNumber, setOemNumber] = useState(values.oemNumber || '');

  // Emit data with make/model at top level (for search), and everything
  // else properly nested inside specs JSONB for structured filtering.
  const emit = (overrides = {}) => {
    const merged = { category, part, make, model, generation, engine, year, position, oemNumber, ...overrides };
    onChange({
      make: merged.make,
      model: merged.model,
      specs: {
        part: merged.part,
        partCategory: merged.category,
        generation: merged.generation,
        engine: merged.engine,
        compatibleYear: merged.year,
        position: merged.position,
        oemNumber: merged.oemNumber,
      }
    });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val); setPart('');
    emit({ category: val, part: '' });
  };

  const handlePartChange = (e) => {
    const val = e.target.value;
    setPart(val);
    emit({ part: val });
  };

  const handleMakeChange = (e) => {
    const val = e.target.value;
    setMake(val); setModel(''); setGeneration(''); setEngine(''); setYear('');
    emit({ make: val, model: '', generation: '', engine: '', year: '' });
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val); setGeneration(''); setEngine(''); setYear('');
    emit({ model: val, generation: '', engine: '', year: '' });
  };

  const handleGenerationChange = (e) => {
    const val = e.target.value;
    setGeneration(val); setEngine(''); setYear('');
    emit({ generation: val, engine: '', year: '' });
  };

  const handleEngineChange = (e) => {
    const val = e.target.value;
    setEngine(val); setYear('');
    emit({ engine: val, year: '' });
  };

  const handleYearChange = (e) => {
    const val = e.target.value;
    setYear(val);
    emit({ year: val });
  };

  const categories = Object.keys(MASTER_SPARE_PARTS);
  const partsList = category ? MASTER_SPARE_PARTS[category] : [];
  
  const vehicleData = CATEGORY_ATTRIBUTES.vehicles.data;
  const makes = Object.keys(vehicleData);
  const models = make ? (vehicleData[make] || []) : [];
  
  const hierarchyModel = MOCK_VEHICLE_HIERARCHY[make]?.[model];
  const generations = hierarchyModel ? Object.keys(hierarchyModel) : [];
  const engines = (hierarchyModel && generation) ? Object.keys(hierarchyModel[generation] || {}) : [];
  
  const standardYears = Array.from({length: 36}, (_, i) => (new Date().getFullYear() + 1 - i).toString());
  const years = (hierarchyModel && generation && engine && hierarchyModel[generation][engine]) 
    ? hierarchyModel[generation][engine] 
    : standardYears;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* ── 1. PART DETAILS ───────────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4">⚙️ Part Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Part Category <span className="text-destructive">*</span></label>
            <select className={inputClass} value={category} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {category && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <label className="text-sm font-semibold text-foreground">Spare Part <span className="text-destructive">*</span></label>
              <select className={inputClass} value={part} onChange={handlePartChange} required>
                <option value="">Select Part</option>
                {partsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. COMPATIBLE VEHICLE ─────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4 border-t border-border pt-6">🚗 Compatible Vehicle</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Vehicle Make</label>
            <select className={inputClass} value={make} onChange={handleMakeChange}>
              <option value="">Select Make</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {make && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <label className="text-sm font-semibold text-foreground">Model</label>
              <select className={inputClass} value={model} onChange={handleModelChange}>
                <option value="">Select Model</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {model && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <label className="text-sm font-semibold text-foreground">Generation / Chassis <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              {generations.length > 0 ? (
                <select className={inputClass} value={generation} onChange={handleGenerationChange}>
                  <option value="">Select Generation</option>
                  {generations.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              ) : (
                <input className={inputClass} value={generation} onChange={(e) => {
                  setGeneration(e.target.value);
                  emit({ generation: e.target.value });
                }} placeholder="e.g. XV50" />
              )}
            </div>
          )}

          {(model) && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <label className="text-sm font-semibold text-foreground">Engine <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              {engines.length > 0 ? (
                <select className={inputClass} value={engine} onChange={handleEngineChange}>
                  <option value="">Select Engine</option>
                  {engines.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : (
                <input className={inputClass} value={engine} onChange={(e) => {
                  setEngine(e.target.value);
                  emit({ engine: e.target.value });
                }} placeholder="e.g. 1AZ" />
              )}
            </div>
          )}

          {(model) && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <label className="text-sm font-semibold text-foreground">Year <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <select className={inputClass} value={year} onChange={handleYearChange}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. PART SPECIFICATIONS ────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4 border-t border-border pt-6">🏷️ Part Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Position <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
            <select className={inputClass} value={position} onChange={(e) => {
              setPosition(e.target.value);
              emit({ position: e.target.value });
            }}>
              <option value="">Select Position</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">OEM Part Number <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
            <input className={inputClass} value={oemNumber} onChange={(e) => {
              setOemNumber(e.target.value);
              emit({ oemNumber: e.target.value });
            }} placeholder="e.g. 45046-09270" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
