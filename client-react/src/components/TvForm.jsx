import { useState, useEffect } from 'react';
import { TV_SPECS } from '@/lib/categoryData';

function Field({ label, required, children }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label} {required && '*'}</label>
      {children}
    </div>
  );
}

export default function TvForm({ values = {}, onChange }) {
  // values.make is 'Televisions' (from ItemAttributesSelect)
  // We store the TV Brand in specs.brand
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
  const hierarchy = TV_SPECS.hierarchy[brand];

  // Valid sizes
  const sizeOptions = hierarchy?.sizes || TV_SPECS.sizes;

  // Valid Techs
  const techOptions = hierarchy?.techs?.[s.screenSize] 
    ? hierarchy.techs[s.screenSize] 
    : TV_SPECS.techs;

  // Valid Series
  const seriesOptions = hierarchy?.series?.[s.displayTech] 
    ? hierarchy.series[s.displayTech] 
    : [];

  // Reset dependent fields when brand changes
  useEffect(() => {
    if (brand !== values.specs?.brand) {
      setSpec('screenSize', '');
      setSpec('displayTech', '');
      setSpec('series', '');
      setModel('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  // Reset when size changes
  useEffect(() => {
    setSpec('displayTech', '');
    setSpec('series', '');
    setModel('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.screenSize]);

  // Reset when tech changes
  useEffect(() => {
    setSpec('series', '');
    setModel('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.displayTech]);

  // Compute model examples
  const generateModelExample = () => {
    if (!brand || !s.screenSize || !s.displayTech || !s.series) return [];
    const size = s.screenSize.replace('"', '');
    const series = s.series;
    
    if (brand === 'Samsung') {
      if (s.displayTech === 'QLED') return [`QA${size}${series}`];
      if (s.displayTech === 'Crystal UHD') return [`UA${size}${series}`];
      if (s.displayTech === 'Neo QLED' || s.displayTech === 'OLED') return [`QA${size}${series}`];
      return [`${size}${series}`];
    }
    if (brand === 'LG') {
      if (s.displayTech === 'OLED' && !series.startsWith('OLED')) return [`OLED${size}${series}`];
      return [series];
    }
    if (brand === 'Sony') {
      return [`${size}${series}`];
    }
    return [`${size}${series}`, series];
  };

  const modelExamples = generateModelExample();

  const is32OrSmaller = s.screenSize && parseInt(s.screenSize) <= 32;
  const resolutionOptions = TV_SPECS.resolutions.filter(r => {
    if (is32OrSmaller && (r === '4K UHD' || r === '8K')) return false;
    return true;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 16 }}>
      
      <Field label="Brand" required>
        <select className="form-control" style={{ fontSize: '0.85rem' }} value={brand}
          onChange={e => { 
            const val = e.target.value;
            setBrand(val); 
            // Setting brand via setSpec won't immediately reflect in 'brand' state without sync
            const next = { ...specs, brand: val, screenSize: '', displayTech: '', series: '' };
            setSpecs(next);
            setModel('');
            emit({ model: '', specs: next });
          }}>
          <option value="">Select Brand…</option>
          {TV_SPECS.brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>

      <Field label="Screen Size" required>
        <select className="form-control" style={{ fontSize: '0.85rem' }} value={s.screenSize || ''}
          onChange={e => setSpec('screenSize', e.target.value)} disabled={!brand}>
          <option value="">{brand ? 'Select Size…' : 'Select Brand First'}</option>
          {sizeOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}
        </select>
      </Field>

      <Field label="Display Technology" required>
        <select className="form-control" style={{ fontSize: '0.85rem' }} value={s.displayTech || ''}
          onChange={e => setSpec('displayTech', e.target.value)} disabled={!s.screenSize}>
          <option value="">{s.screenSize ? 'Select Tech…' : 'Select Size First'}</option>
          {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      {seriesOptions.length > 0 && (
        <Field label="Series" required>
          <select className="form-control" style={{ fontSize: '0.85rem' }} value={s.series || ''}
            onChange={e => setSpec('series', e.target.value)} disabled={!s.displayTech}>
            <option value="">Select Series…</option>
            {seriesOptions.map(sr => <option key={sr} value={sr}>{sr}</option>)}
          </select>
        </Field>
      )}

      <Field label="Exact Model" required>
        <input className="form-control" style={{ fontSize: '0.85rem' }} list="tv-models"
          value={model} onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}
          placeholder={modelExamples.length > 0 ? `e.g. ${modelExamples[0]}` : 'e.g. 55U8G'} disabled={!brand} />
        <datalist id="tv-models">
          {modelExamples.map(m => <option key={m} value={m} />)}
        </datalist>
      </Field>

      <Field label="Resolution" required>
        <select className="form-control" style={{ fontSize: '0.85rem' }} value={s.resolution || ''}
          onChange={e => setSpec('resolution', e.target.value)}>
          <option value="">Select Resolution…</option>
          {resolutionOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>

      <Field label="Smart Platform" required>
        <select className="form-control" style={{ fontSize: '0.85rem' }} value={s.smartPlatform || ''}
          onChange={e => setSpec('smartPlatform', e.target.value)}>
          <option value="">Select Platform…</option>
          {TV_SPECS.os.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>

    </div>
  );
}
