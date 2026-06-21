import { useState, useEffect } from 'react';
import {
  PHONE_DATA, PHONE_STORAGE, PHONE_RAM, PHONE_NETWORKS
} from '@/lib/laptopPhoneData';

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

function Select({ value, onChange, disabled, placeholder, children }) {
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

export default function PhoneForm({ values = {}, onChange }) {
  const [brand,   setBrand]   = useState(values.specs?.brand  || '');
  const [series,  setSeries]  = useState(values.specs?.series || '');
  const [model,   setModel]   = useState(values.model         || '');
  const [specs,   setSpecs]   = useState(values.specs         || {});

  // Emit upward
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

  // ── Derived options ───────────────────────────────────────────────────────
  const brandData     = PHONE_DATA.hierarchy[brand];
  const seriesOptions = brandData?.series || [];
  const modelOptions  = (series && brandData?.models?.[series]) ? brandData.models[series] : [];

  // Chipsets — brand-specific or fallback
  const chipsetOptions = PHONE_DATA.chipsets[brand] || PHONE_DATA.chipsets['Default'];

  // ── Reset cascade ─────────────────────────────────────────────────────────
  useEffect(() => {
    setSeries(''); setModel('');
    const next = { ...specs, brand, series: '', chipset: '' };
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

  return (
    <div className="flex flex-col gap-8 mt-4">

      {/* ── SECTION: Device ─────────────────────────────── */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
          📱 Device Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {/* Brand */}
          <Field label="Brand" required>
            <Select value={brand} onChange={v => { setBrand(v); setSpec('brand', v); }} placeholder="Select Brand">
              {PHONE_DATA.brands.map(b => <option key={b} value={b}>{b}</option>)}
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
                  placeholder="Enter exact model"
                  disabled={!brand}
                />
              )}
            </Field>
          )}

        </div>
      </div>

      {/* ── SECTION: Storage & Memory ───────────────────── */}
      {brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            💾 Storage & Memory
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Field label="Storage">
              <Select value={specs.storage || ''} onChange={v => setSpec('storage', v)} placeholder="Select Storage">
                {PHONE_STORAGE.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>

            <Field label="RAM">
              <Select value={specs.ram || ''} onChange={v => setSpec('ram', v)} placeholder="Select RAM">
                {PHONE_RAM.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>

          </div>
        </div>
      )}

      {/* ── SECTION: Chipset & Network ──────────────────── */}
      {brand && (
        <div>
          <p className="mb-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            ⚙️ Chipset & Network
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Field label="Chipset">
              <Select value={specs.chipset || ''} onChange={v => setSpec('chipset', v)} placeholder="Select Chipset">
                {chipsetOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>

            <Field label="Network">
              <Select value={specs.network || ''} onChange={v => setSpec('network', v)} placeholder="Select Network">
                {PHONE_NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
              </Select>
            </Field>

          </div>
        </div>
      )}

    </div>
  );
}
