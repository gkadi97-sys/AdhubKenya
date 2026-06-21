import { useState, useEffect } from 'react';
import {
  LAPTOP_DATA, PROCESSOR_DATA,
  CPU_SPEEDS, RAM_SIZES, RAM_TYPES,
  STORAGE_TYPES, STORAGE_SIZES,
  GPU_OPTIONS, SCREEN_SIZES, RESOLUTIONS, OS_OPTIONS
} from '@/lib/laptopPhoneData';

function Field({ label, required, children, style = {} }) {
  return (
    <div className="flex flex-col gap-1.5" style={style}>
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

function Select({ value, onChange, disabled, children, placeholder }) {
  return (
    <select
      className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder || 'Select…'}</option>
      {children}
    </select>
  );
}

export default function LaptopForm({ values = {}, onChange }) {
  const [brand,       setBrand]       = useState(values.specs?.brand       || '');
  const [series,      setSeries]      = useState(values.specs?.series      || '');
  const [model,       setModel]       = useState(values.model              || '');
  const [cpuBrand,    setCpuBrand]    = useState(values.specs?.cpuBrand    || '');
  const [cpuFamily,   setCpuFamily]   = useState(values.specs?.cpuFamily   || '');
  const [cpuGen,      setCpuGen]      = useState(values.specs?.cpuGen      || '');
  const [specs,       setSpecs]       = useState(values.specs              || {});

  // Emit merged state upward
  const emit = (overrides = {}) => {
    const merged = {
      model:  overrides.model  !== undefined ? overrides.model  : model,
      specs:  overrides.specs  !== undefined ? overrides.specs  : specs,
    };
    onChange(merged);
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  // ── Derived options ───────────────────────────────────────────────────────
  const brandData    = LAPTOP_DATA.hierarchy[brand];
  const seriesOptions = brandData?.series || [];
  const modelOptions  = (series && brandData?.models?.[series]) ? brandData.models[series] : [];

  const cpuFamilies   = cpuBrand ? (PROCESSOR_DATA[cpuBrand]?.families    || []) : [];
  const cpuGens       = cpuBrand ? (PROCESSOR_DATA[cpuBrand]?.generations || []) : [];

  // GPU groups
  const gpuGroups = Object.entries(GPU_OPTIONS);

  // ── Reset cascade ─────────────────────────────────────────────────────────
  useEffect(() => {
    setSeries(''); setModel('');
    const next = { ...specs, brand, series: '', cpuBrand: '', cpuFamily: '', cpuGen: '' };
    setCpuBrand(''); setCpuFamily(''); setCpuGen('');
    setSpecs(next);
    emit({ model: '', specs: next });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  useEffect(() => {
    setModel('');
    const next = { ...specs, series };
    setSpecs(next);
    emit({ model: '', specs: next });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series]);

  useEffect(() => {
    setCpuFamily(''); setCpuGen('');
    const next = { ...specs, cpuBrand, cpuFamily: '', cpuGen: '' };
    setSpecs(next);
    emit({ specs: next });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuBrand]);

  // ── Apple special case — no CPU pickers ───────────────────────────────────
  const isApple = brand === 'Apple';

  return (
    <div className="flex flex-col gap-8 mt-4">

      {/* ── SECTION: Device ─────────────────────────────── */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
          💻 Device Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {/* Brand */}
          <Field label="Brand" required>
            <Select value={brand} onChange={v => { setBrand(v); setSpec('brand', v); }} placeholder="Select Brand">
              {LAPTOP_DATA.brands.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
          </Field>

          {/* Series */}
          {seriesOptions.length > 0 && (
            <Field label="Series" required>
              <Select value={series} onChange={v => { setSeries(v); setSpec('series', v); }} disabled={!brand} placeholder={brand ? 'Select Series' : 'Select Brand First'}>
                {seriesOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          )}

          {/* Exact Model */}
          {brand && (
            <Field label="Exact Model">
              {modelOptions.length > 0 ? (
                <Select value={model} onChange={v => { setModel(v); emit({ model: v }); }} disabled={!series} placeholder="Select Model">
                  {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              ) : (
                <input className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  value={model}
                  onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}
                  placeholder={`e.g. ${brand === 'Apple' ? 'MacBook Air M2 13"' : 'Enter exact model'}`}
                  disabled={!brand}
                />
              )}
            </Field>
          )}
        </div>
      </div>

      {/* ── SECTION: Processor ──────────────────────────── */}
      {!isApple && brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            ⚙️ Processor
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Field label="Processor Brand">
              <Select value={cpuBrand} onChange={v => setCpuBrand(v)} placeholder="Select CPU Brand">
                {Object.keys(PROCESSOR_DATA).map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>

            {cpuFamilies.length > 0 && (
              <Field label="Processor Family">
                <Select value={cpuFamily} onChange={v => { setCpuFamily(v); setSpec('cpuFamily', v); }} disabled={!cpuBrand} placeholder="Select Family">
                  {cpuFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
            )}

            {cpuGens.length > 0 && (
              <Field label="Generation">
                <Select value={cpuGen} onChange={v => { setCpuGen(v); setSpec('cpuGen', v); }} disabled={!cpuFamily} placeholder="Select Generation">
                  {cpuGens.map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
              </Field>
            )}

            <Field label="CPU Speed">
              <Select value={specs.cpuSpeed || ''} onChange={v => setSpec('cpuSpeed', v)} placeholder="Select Speed">
                {CPU_SPEEDS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>

          </div>
        </div>
      )}

      {/* ── SECTION: Memory & Storage ───────────────────── */}
      {brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            🗄️ Memory & Storage
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Field label="RAM">
              <Select value={specs.ram || ''} onChange={v => setSpec('ram', v)} placeholder="Select RAM">
                {RAM_SIZES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>

            <Field label="RAM Type">
              <Select value={specs.ramType || ''} onChange={v => setSpec('ramType', v)} placeholder="Select RAM Type">
                {RAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>

            <Field label="Storage Type">
              <Select value={specs.storageType || ''} onChange={v => setSpec('storageType', v)} placeholder="Select Type">
                {STORAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>

            <Field label="Storage Size">
              <Select value={specs.storageSize || ''} onChange={v => setSpec('storageSize', v)} placeholder="Select Size">
                {STORAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>

          </div>
        </div>
      )}

      {/* ── SECTION: Graphics & Display ─────────────────── */}
      {brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            🖥️ Graphics & Display
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Field label="GPU">
              <select className={inputClass}
                value={specs.gpu || ''}
                onChange={e => setSpec('gpu', e.target.value)}
              >
                <option value="">Select GPU…</option>
                {gpuGroups.map(([group, gpus]) => (
                  <optgroup key={group} label={group}>
                    {gpus.map(g => <option key={g} value={g}>{g}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>

            <Field label="Screen Size">
              <Select value={specs.screenSize || ''} onChange={v => setSpec('screenSize', v)} placeholder="Select Screen Size">
                {SCREEN_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>

            <Field label="Resolution">
              <Select value={specs.resolution || ''} onChange={v => setSpec('resolution', v)} placeholder="Select Resolution">
                {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>

          </div>
        </div>
      )}

      {/* ── SECTION: OS ─────────────────────────────────── */}
      {brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            💿 Operating System
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="OS">
              <Select
                value={specs.os || ''}
                onChange={v => setSpec('os', v)}
                placeholder="Select OS"
              >
                {/* Lock Apple to macOS */}
                {isApple
                  ? <option value="macOS">macOS</option>
                  : OS_OPTIONS.filter(o => o !== 'macOS').map(o => <option key={o} value={o}>{o}</option>)
                }
              </Select>
            </Field>
          </div>
        </div>
      )}

    </div>
  );
}
