import { useState, useEffect } from 'react';
import {
  HEAVY_TRUCK_DATA, PICKUP_DATA,
  TRUCK_BODY_TYPES, TRUCK_DRIVE_TYPES,
  TRUCK_FUELS, TRUCK_TRANSMISSIONS,
} from '@/lib/truckData';
import { MANUFACTURE_YEARS as YEARS, VEHICLE_SPECS } from '@/lib/categoryData';

// ── Sub-components ─────────────────────────────────────────────────────────────

const SectionLabel = ({ icon, text }) => (
  <p style={{
    fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: 'var(--text-muted)',
    margin: '18px 0 10px', display: 'flex', alignItems: 'center', gap: 6
  }}>
    <span>{icon}</span>{text}
  </p>
);

const Field = ({ label, required, children }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label" style={{ fontSize: '0.82rem' }}>
      {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const Sel = ({ value, onChange, disabled, placeholder, children }) => (
  <select
    className="form-control"
    style={{ fontSize: '0.85rem' }}
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    disabled={!!disabled}
  >
    <option value="">{placeholder || 'Select…'}</option>
    {children}
  </select>
);

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 14 };

// ── Main Component ─────────────────────────────────────────────────────────────

/**
 * TruckForm
 * Handles two modes:
 *   truckMode = 'heavy'  → Brand → Series → Exact Model → Body Type → Drive Type → Fuel → Transmission
 *   truckMode = 'pickup' → Brand → Series → Exact Model → Body Type → Drive Type → Fuel
 *
 * Props:
 *   truckMode : 'heavy' | 'pickup'
 *   values    : { make, model, year, specs:{} }
 *   onChange  : callback({ make, model, year, specs:{} })
 */
export default function TruckForm({ truckMode = 'heavy', values = {}, onChange }) {
  const DATA = truckMode === 'heavy' ? HEAVY_TRUCK_DATA : PICKUP_DATA;

  const [brand,  setBrand]  = useState(values.make          || '');
  const [series, setSeries] = useState(values.specs?.series || '');
  const [model,  setModel]  = useState(values.model         || '');
  const [year,   setYear]   = useState(values.year          || '');
  const [specs,  setSpecs]  = useState(values.specs         || {});

  const emit = (overrides = {}) => {
    onChange({
      make:  overrides.make  !== undefined ? overrides.make  : brand,
      model: overrides.model !== undefined ? overrides.model : model,
      year:  overrides.year  !== undefined ? overrides.year  : year,
      specs: overrides.specs !== undefined ? overrides.specs : specs,
    });
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  // ── Derived options ─────────────────────────────────────────────────────────
  const brandData    = DATA.hierarchy[brand];
  const seriesOpts   = brandData?.series || [];
  const modelOpts    = (series && brandData?.models?.[series]) ? brandData.models[series] : [];

  // ── Reset cascade ───────────────────────────────────────────────────────────
  useEffect(() => {
    setSeries(''); setModel('');
    const next = { ...specs, series: '', bodyType: '', driveType: '' };
    setSpecs(next);
    emit({ make: brand, model: '', specs: next });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  useEffect(() => {
    setModel('');
    const next = { ...specs, series };
    setSpecs(next);
    emit({ model: '', specs: next });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series]);

  return (
    <div style={{ marginTop: 16 }}>

      {/* ── 1. IDENTITY ─────────────────────────────────────────── */}
      <SectionLabel icon={truckMode === 'heavy' ? '🚛' : '🛻'} text={truckMode === 'heavy' ? 'Truck Details' : 'Pickup Truck Details'} />
      <div style={GRID}>

        {/* Vehicle Type (always visible so user can switch type without refreshing) */}
        <Field label="Vehicle Type" required>
          <Sel value={specs.vehicleType || (truckMode === 'pickup' ? 'Pickup / Truck' : 'Heavy Truck')} onChange={v => {
            setSpec('vehicleType', v);
          }} placeholder="Select Vehicle Type">
            {VEHICLE_SPECS.vehicleTypes.map(vt => <option key={vt} value={vt}>{vt}</option>)}
          </Sel>
        </Field>

        {/* Brand */}
        <Field label="Brand" required>
          <Sel value={brand} onChange={v => { setBrand(v); emit({ make: v }); }} placeholder="Select Brand">
            {DATA.brands.map(b => <option key={b} value={b}>{b}</option>)}
          </Sel>
        </Field>

        {/* Series */}
        {brand && seriesOpts.length > 0 && (
          <Field label="Series / Range" required>
            <Sel value={series} onChange={v => { setSeries(v); setSpec('series', v); }} disabled={!brand} placeholder="Select Series">
              {seriesOpts.map(s => <option key={s} value={s}>{s}</option>)}
            </Sel>
          </Field>
        )}

        {/* Exact Model */}
        {series && (
          <Field label="Exact Model" required>
            {modelOpts.length > 0 ? (
              <Sel value={model} onChange={v => { setModel(v); emit({ model: v }); }} placeholder="Select Model">
                {modelOpts.map(m => <option key={m} value={m}>{m}</option>)}
              </Sel>
            ) : (
              <input className="form-control" style={{ fontSize: '0.85rem' }}
                value={model}
                onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}
                placeholder="Enter exact model"
              />
            )}
          </Field>
        )}

        {/* Year */}
        <Field label="Year of Manufacture" required>
          <Sel value={year} onChange={v => { setYear(v); emit({ year: v }); }} placeholder="Select Year">
            {(YEARS || []).map(y => <option key={y} value={String(y)}>{y}</option>)}
          </Sel>
        </Field>

        {/* Year of Registration */}
        <Field label="Year of Registration">
          <Sel value={specs.regYear} onChange={v => setSpec('regYear', v)} placeholder="Select Year">
            {(YEARS || []).map(y => <option key={y} value={String(y)}>{y}</option>)}
          </Sel>
        </Field>

      </div>

      {/* ── 2. BODY & CONFIGURATION ────────────────────────────── */}
      {brand && (
        <>
          <SectionLabel icon="📦" text="Body & Configuration" />
          <div style={GRID}>

            <Field label="Body Type">
              <select
                className="form-control"
                style={{ fontSize: '0.85rem' }}
                value={specs.bodyType || ''}
                onChange={e => setSpec('bodyType', e.target.value)}
              >
                <option value="">Select Body Type…</option>
                {Object.entries(TRUCK_BODY_TYPES).map(([group, types]) => (
                  <optgroup key={group} label={group}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>

            <Field label="Drive / Axle Configuration">
              <Sel value={specs.driveType} onChange={v => setSpec('driveType', v)} placeholder="Select Drive Type">
                {TRUCK_DRIVE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </Sel>
            </Field>

          </div>
        </>
      )}

      {/* ── 3. POWERTRAIN ──────────────────────────────────────── */}
      {brand && (
        <>
          <SectionLabel icon="⚙️" text="Powertrain" />
          <div style={GRID}>

            <Field label="Fuel Type">
              <Sel value={specs.fuel} onChange={v => setSpec('fuel', v)} placeholder="Select Fuel">
                {TRUCK_FUELS.map(f => <option key={f} value={f}>{f}</option>)}
              </Sel>
            </Field>

            <Field label="Transmission">
              <Sel value={specs.transmission} onChange={v => setSpec('transmission', v)} placeholder="Select Transmission">
                {TRUCK_TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </Sel>
            </Field>

            <Field label="Engine Capacity (cc/L)">
              <input className="form-control" style={{ fontSize: '0.85rem' }}
                value={specs.engineCapacity || ''}
                onChange={e => setSpec('engineCapacity', e.target.value)}
                placeholder="e.g. 7800cc or 7.8L"
              />
            </Field>

            <Field label="Horsepower (HP)">
              <input className="form-control" style={{ fontSize: '0.85rem' }}
                value={specs.horsepower || ''}
                onChange={e => setSpec('horsepower', e.target.value)}
                placeholder="e.g. 420"
              />
            </Field>

          </div>
        </>
      )}

      {/* ── 4. USAGE & MILEAGE ─────────────────────────────────── */}
      {brand && (
        <>
          <SectionLabel icon="📍" text="Mileage & Usage" />
          <div style={GRID}>

            <Field label="Mileage">
              <input className="form-control" style={{ fontSize: '0.85rem' }}
                value={specs.mileage || ''}
                onChange={e => setSpec('mileage', e.target.value)}
                placeholder="e.g. 150000"
              />
            </Field>

            <Field label="Mileage Unit">
              <Sel value={specs.mileageUnit} onChange={v => setSpec('mileageUnit', v)} placeholder="Select Unit">
                {['KM', 'Miles'].map(u => <option key={u} value={u}>{u}</option>)}
              </Sel>
            </Field>

            <Field label="Number of Previous Owners">
              <Sel value={specs.prevOwners} onChange={v => setSpec('prevOwners', v)} placeholder="Select">
                {['1', '2', '3', '4', '5+'].map(n => <option key={n} value={n}>{n}</option>)}
              </Sel>
            </Field>

          </div>
        </>
      )}

    </div>
  );
}
