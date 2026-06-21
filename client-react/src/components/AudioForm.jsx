import { useState, useEffect } from 'react';
import { AUDIO_SPECS } from '@/lib/categoryData';

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function AudioForm({ values = {}, onChange }) {
  const [brand, setBrand] = useState(values.specs?.brand || '');
  const [model, setModel] = useState(values.model || '');
  const [specs, setSpecs] = useState(values.specs || {});

  const emit = (overrides = {}) => {
    onChange({
      model: overrides.model !== undefined ? overrides.model : model,
      specs: overrides.specs !== undefined ? overrides.specs : specs,
    });
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const s = specs; // shorthand

  // Hierarchy mapping
  const typeHierarchy = AUDIO_SPECS.hierarchy[s.equipmentType];
  const brandHierarchy = typeHierarchy?.brandData?.[brand];

  // Options
  const equipmentOptions = AUDIO_SPECS.equipmentTypes;
  const brandOptions = typeHierarchy?.brands || [];
  const seriesOptions = brandHierarchy?.series || [];
  const modelOptions = brandHierarchy?.models?.[s.series] || [];

  // Reset logic: Type -> Brand -> Series -> Model
  useEffect(() => {
    if (s.equipmentType && !AUDIO_SPECS.hierarchy[s.equipmentType]?.brands?.includes(brand)) {
      setBrand('');
      setSpec('series', '');
      setModel('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.equipmentType]);

  useEffect(() => {
    setSpec('series', '');
    setModel('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  useEffect(() => {
    setModel('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.series]);

  // Derived properties from Model selection (auto-populate Channels & Connectivity)
  useEffect(() => {
    if (s.equipmentType === 'Soundbar' && model) {
      if (model.includes('Bar 5.0')) {
        setSpec('channels', '5.0');
        setSpec('connectivity', 'Bluetooth, Wi-Fi, HDMI, HDMI ARC');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      
      <Field label="Equipment Type" required>
        <select className={inputClass} value={s.equipmentType || ''}
          onChange={e => {
            const val = e.target.value;
            const next = { ...specs, equipmentType: val, brand: '', series: '', channels: '', connectivity: '' };
            setBrand('');
            setModel('');
            setSpecs(next);
            emit({ model: '', specs: next });
          }}>
          <option value="">Select Type…</option>
          {equipmentOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      {brandOptions.length > 0 && (
        <Field label="Brand" required>
          <select className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} value={brand} disabled={!s.equipmentType}
            onChange={e => { 
              const val = e.target.value;
              setBrand(val); 
              const next = { ...specs, brand: val, series: '' };
              setSpecs(next);
              setModel('');
              emit({ model: '', specs: next });
            }}>
            <option value="">{s.equipmentType ? 'Select Brand…' : 'Select Type First'}</option>
            {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      )}

      {seriesOptions.length > 0 && (
        <Field label="Series" required>
          <select className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} value={s.series || ''} disabled={!brand}
            onChange={e => setSpec('series', e.target.value)}>
            <option value="">Select Series…</option>
            {seriesOptions.map(sr => <option key={sr} value={sr}>{sr}</option>)}
          </select>
        </Field>
      )}

      {(brandOptions.length > 0 || seriesOptions.length > 0) && (
        <Field label="Exact Model" required>
          {modelOptions.length > 0 ? (
            <select className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} value={model} disabled={!s.series && seriesOptions.length > 0}
              onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}>
              <option value="">Select Model…</option>
              {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          ) : (
            <input className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              value={model} onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}
              placeholder={s.equipmentType === 'Soundbar' && brand === 'Bose' ? 'e.g. Smart Soundbar 900' : 'e.g. Enter model'} 
              disabled={!brand} />
          )}
        </Field>
      )}

      <Field label="Channels">
        <select className={inputClass} value={s.channels || ''}
          onChange={e => setSpec('channels', e.target.value)}>
          <option value="">Select Channels (Optional)</option>
          {AUDIO_SPECS.channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Connectivity">
        <select className={inputClass} value={s.connectivity || ''}
          onChange={e => setSpec('connectivity', e.target.value)}>
          <option value="">Select Connectivity (Optional)</option>
          {AUDIO_SPECS.connectivity.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Condition" required>
        <select className={inputClass} value={s.condition || ''}
          onChange={e => setSpec('condition', e.target.value)}>
          <option value="">Select Condition…</option>
          {AUDIO_SPECS.conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

    </div>
  );
}
