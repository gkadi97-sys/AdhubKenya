import { useState, useEffect } from 'react';
import CATEGORY_ATTRIBUTES, { PROPERTY_SPECS } from '@/lib/categoryData';

// ── Helpers ────────────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title }) => (
  <div className="mb-4 flex items-center gap-2 border-b border-border pb-3 pt-2">
    <span className="text-lg">{icon}</span>
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
  </div>
);

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-foreground">
      {label}{required && <span className="ml-1 text-destructive">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

const Select = ({ value, onChange, options, placeholder }) => (
  <select className={inputClass} value={value || ''} onChange={e => onChange(e.target.value)}>
    <option value="">{placeholder || 'Select…'}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className={inputClass}
    value={value || ''}
    placeholder={placeholder || ''}
    onChange={e => onChange(e.target.value)}
  />
);

const NumberInput = ({ value, onChange, placeholder }) => (
  <input
    type="number"
    className={inputClass}
    value={value || ''}
    placeholder={placeholder || ''}
    onChange={e => onChange(e.target.value)}
    min={0}
  />
);

const CheckboxGroup = ({ options, selected = [], onChange }) => {
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter(x => x !== opt)
      : [...selected, opt];
    onChange(next);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {options.map(opt => {
        const isSelected = selected.includes(opt);
        return (
          <label key={opt} className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all duration-150 ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30 hover:border-primary/40'}`}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggle(opt)}
              className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/40 accent-primary"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

export default function PropertyForm({ values = {}, onChange }) {
  const propertyData = CATEGORY_ATTRIBUTES['property']?.data || {};
  const categoryOptions = Object.keys(propertyData);

  const [category, setCategory] = useState(values.make || ''); // Using 'make' for top-level
  const [type, setType]         = useState(values.model || ''); // Using 'model' for sub-level
  const [specs, setSpecs]       = useState(values.specs || {});

  const typeOptions = category ? (propertyData[category] || []) : [];

  // Reset type when category changes
  useEffect(() => {
    if (category && type && !propertyData[category]?.includes(type)) {
      setType('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const emit = (overrides = {}) => {
    onChange({
      make: overrides.make !== undefined ? overrides.make : category,
      model: overrides.model !== undefined ? overrides.model : type,
      year: '', // Not used for property
      specs: overrides.specs !== undefined ? overrides.specs : specs,
    });
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const s = specs; // shorthand

  return (
    <div className="flex flex-col gap-8 mt-4">

      {/* ── 1. PROPERTY IDENTITY ────────────────────────────────── */}
      <div>
        <SectionHeader icon="🏢" title="Property Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">

          <Field label="Listing Category" required>
            <Select value={s.listingCategory} onChange={v => setSpec('listingCategory', v)}
              options={PROPERTY_SPECS.listingCategories} />
          </Field>

          <Field label="Property Category" required>
            <select className={inputClass} value={category}
              onChange={e => { setCategory(e.target.value); setType(''); emit({ make: e.target.value, model: '' }); }}>
              <option value="">Select Category…</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Property Type" required>
            <select className={inputClass} value={type}
              onChange={e => { setType(e.target.value); emit({ model: e.target.value }); }}
              disabled={!category}>
              <option value="">Select Type…</option>
              {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Currency">
            <Select value={s.currency} onChange={v => setSpec('currency', v)}
              options={PROPERTY_SPECS.currencies} />
          </Field>

          <Field label="Listing/Ref ID">
            <TextInput value={s.listingId} onChange={v => setSpec('listingId', v)} placeholder="e.g. REF-001" />
          </Field>
          
          <Field label="Availability Status">
            <Select value={s.availability} onChange={v => setSpec('availability', v)}
              options={['Available', 'Under Offer', 'Sold', 'Let']} />
          </Field>

        </div>
      </div>

      {/* ── 2. SIZE & DIMENSIONS ───────────────────────────────── */}
      <div>
        <SectionHeader icon="📐" title="Size & Dimensions" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">

          <Field label="Land Size">
            <TextInput value={s.landSize} onChange={v => setSpec('landSize', v)} placeholder="e.g. 50x100 or 0.5 Acres" />
          </Field>

          {category !== 'Land and Plots' && (
            <>
              <Field label="Built-up Area (Sq Ft / Sq M)">
                <TextInput value={s.builtArea} onChange={v => setSpec('builtArea', v)} placeholder="e.g. 2500 sq ft" />
              </Field>

              <Field label="Number of Floors / Stories">
                <NumberInput value={s.floors} onChange={v => setSpec('floors', v)} placeholder="e.g. 2" />
              </Field>
            </>
          )}

        </div>
      </div>

      {/* ── 3. RESIDENTIAL / COMMERCIAL LAYOUT ─────────────────── */}
      {['Residential Properties', 'Commercial Properties', 'Special-Purpose Properties'].includes(category) && (
        <div>
          <SectionHeader icon="🛏️" title="Layout Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">

            {category === 'Residential Properties' && (
              <>
                <Field label="Bedrooms">
                  <Select value={s.bedrooms} onChange={v => setSpec('bedrooms', v)}
                    options={['1', '2', '3', '4', '5', '6', '7+']} />
                </Field>
                <Field label="Bathrooms">
                  <Select value={s.bathrooms} onChange={v => setSpec('bathrooms', v)}
                    options={['1', '2', '3', '4', '5', '6+']} />
                </Field>
                <Field label="Living Rooms">
                  <NumberInput value={s.livingRooms} onChange={v => setSpec('livingRooms', v)} placeholder="e.g. 2" />
                </Field>
              </>
            )}

            {category === 'Commercial Properties' && (
              <Field label="Meeting Rooms">
                <NumberInput value={s.meetingRooms} onChange={v => setSpec('meetingRooms', v)} placeholder="e.g. 3" />
              </Field>
            )}

          </div>
        </div>
      )}

      {/* ── 4. RESIDENTIAL FEATURES ────────────────────────────── */}
      {category === 'Residential Properties' && (
        <div>
          <SectionHeader icon="✨" title="Residential Features" />
          <p className="mb-3 text-sm text-muted-foreground">Select all that apply</p>
          <CheckboxGroup
            options={PROPERTY_SPECS.residentialFeatures}
            selected={s.residentialFeatures || []}
            onChange={v => setSpec('residentialFeatures', v)}
          />
        </div>
      )}

      {/* ── 5. COMMERCIAL FEATURES ─────────────────────────────── */}
      {category === 'Commercial Properties' && (
        <div>
          <SectionHeader icon="💼" title="Commercial Features" />
          <p className="mb-3 text-sm text-muted-foreground">Select all that apply</p>
          <CheckboxGroup
            options={PROPERTY_SPECS.commercialFeatures}
            selected={s.commercialFeatures || []}
            onChange={v => setSpec('commercialFeatures', v)}
          />
        </div>
      )}

      {/* ── 6. AMENITIES & FACILITIES ──────────────────────────── */}
      {category !== 'Land and Plots' && (
        <div>
          <SectionHeader icon="🏊‍♂️" title="Amenities & Facilities" />
          <p className="mb-3 text-sm text-muted-foreground">Select all that apply</p>
          <CheckboxGroup
            options={PROPERTY_SPECS.amenities}
            selected={s.amenities || []}
            onChange={v => setSpec('amenities', v)}
          />
        </div>
      )}

      {/* ── 7. LEGAL & COMPLIANCE ──────────────────────────────── */}
      <div>
        <SectionHeader icon="⚖️" title="Legal & Compliance" />
        <p className="mb-3 text-sm text-muted-foreground">Select all that apply</p>
        <CheckboxGroup
          options={PROPERTY_SPECS.legalInfo}
          selected={s.legalInfo || []}
          onChange={v => setSpec('legalInfo', v)}
        />
      </div>

      {/* ── 8. AGENT/OWNER INFO ────────────────────────────────── */}
      <div>
        <SectionHeader icon="👤" title="Agent/Owner Info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Field label="Agency / Company Name">
            <TextInput value={s.agencyName} onChange={v => setSpec('agencyName', v)} placeholder="e.g. ReMax Kenya" />
          </Field>
          <Field label="Website Link">
            <TextInput value={s.website} onChange={v => setSpec('website', v)} placeholder="e.g. https://..." />
          </Field>
        </div>
      </div>

    </div>
  );
}
