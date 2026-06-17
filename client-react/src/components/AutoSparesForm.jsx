import { useState, useEffect } from 'react';
import { MASTER_SPARE_PARTS, MOCK_VEHICLE_HIERARCHY, POSITIONS } from '@/lib/autoSparesData';

export default function AutoSparesForm({ values = {}, onChange }) {
  const [category, setCategory] = useState(values.category || '');
  const [part, setPart] = useState(values.part || '');
  const [make, setMake] = useState(values.make || '');
  const [model, setModel] = useState(values.model || '');
  const [generation, setGeneration] = useState(values.generation || '');
  const [engine, setEngine] = useState(values.engine || '');
  const [year, setYear] = useState(values.year || '');
  const [position, setPosition] = useState(values.position || '');
  const [oemNumber, setOemNumber] = useState(values.oemNumber || '');

  const emit = (overrides) => {
    onChange({
      category, part, make, model, generation, engine, year, position, oemNumber,
      ...overrides
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
  
  const makes = Object.keys(MOCK_VEHICLE_HIERARCHY);
  const models = make ? Object.keys(MOCK_VEHICLE_HIERARCHY[make] || {}) : [];
  const generations = model ? Object.keys(MOCK_VEHICLE_HIERARCHY[make][model] || {}) : [];
  const engines = generation ? Object.keys(MOCK_VEHICLE_HIERARCHY[make][model][generation] || {}) : [];
  const years = engine ? (MOCK_VEHICLE_HIERARCHY[make][model][generation][engine] || []) : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--primary)' }}>⚙️ Part Details</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Part Category *</label>
          <select className="form-control" value={category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {category && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Spare Part *</label>
            <select className="form-control" value={part} onChange={handlePartChange} required>
              <option value="">Select Part</option>
              {partsList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1.1rem', marginTop: 16, marginBottom: 8, color: 'var(--primary)' }}>🚗 Compatible Vehicle</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Vehicle Make</label>
          <select className="form-control" value={make} onChange={handleMakeChange}>
            <option value="">Select Make</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {make && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Model</label>
            <select className="form-control" value={model} onChange={handleModelChange}>
              <option value="">Select Model</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {model && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Generation / Chassis</label>
            <select className="form-control" value={generation} onChange={handleGenerationChange}>
              <option value="">Select Generation</option>
              {generations.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        )}

        {generation && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Engine</label>
            <select className="form-control" value={engine} onChange={handleEngineChange}>
              <option value="">Select Engine</option>
              {engines.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        )}

        {engine && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Year</label>
            <select className="form-control" value={year} onChange={handleYearChange}>
              <option value="">Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1.1rem', marginTop: 16, marginBottom: 8, color: 'var(--primary)' }}>🏷️ Part Specifications</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Position (Optional)</label>
          <select className="form-control" value={position} onChange={(e) => {
            setPosition(e.target.value);
            emit({ position: e.target.value });
          }}>
            <option value="">Select Position</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">OEM Part Number (Optional)</label>
          <input className="form-control" value={oemNumber} onChange={(e) => {
            setOemNumber(e.target.value);
            emit({ oemNumber: e.target.value });
          }} placeholder="e.g. 45046-09270" />
        </div>
      </div>
    </div>
  );
}
