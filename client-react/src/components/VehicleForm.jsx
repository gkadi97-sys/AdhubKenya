import { useState, useEffect } from 'react';
import CATEGORY_ATTRIBUTES, { MANUFACTURE_YEARS, VEHICLE_SPECS, VEHICLE_MAKES_BY_TYPE } from '@/lib/categoryData';

// ── Helpers ────────────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    paddingTop: 8, paddingBottom: 12,
    borderBottom: '1px solid var(--border)',
    marginBottom: 4,
  }}>
    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    <span style={{
      fontSize: '0.78rem', textTransform: 'uppercase',
      letterSpacing: '0.07em', fontWeight: 700,
      color: 'var(--text-muted)',
    }}>{title}</span>
  </div>
);

const Field = ({ label, required, children }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label" style={{ fontSize: '0.82rem' }}>
      {label}{required && <span style={{ color: 'var(--primary-light)', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select className="form-control" style={{ fontSize: '0.85rem' }} value={value || ''} onChange={e => onChange(e.target.value)}>
    <option value="">{placeholder || 'Select…'}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="form-control"
    style={{ fontSize: '0.85rem' }}
    value={value || ''}
    placeholder={placeholder || ''}
    onChange={e => onChange(e.target.value)}
  />
);

const NumberInput = ({ value, onChange, placeholder }) => (
  <input
    type="number"
    className="form-control"
    style={{ fontSize: '0.85rem' }}
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 8,
    }}>
      {options.map(opt => (
        <label key={opt} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px',
          background: selected.includes(opt) ? 'var(--primary-glow)' : 'var(--surface-2)',
          border: `1px solid ${selected.includes(opt) ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          fontSize: '0.82rem',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            style={{ accentColor: 'var(--primary)', width: 14, height: 14, flexShrink: 0 }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

/**
 * VehicleForm
 * Props:
 *   values   : { make, model, year, specs:{} }
 *   onChange : callback({ make, model, year, specs:{} })
 */
export default function VehicleForm({ values = {}, onChange }) {
  const vehicleData = CATEGORY_ATTRIBUTES['vehicles']?.data || {};

  const [make, setMake]   = useState(values.make  || '');
  const [model, setModel] = useState(values.model || '');
  const [year, setYear]   = useState(values.year  || '');
  const [specs, setSpecs] = useState(values.specs || {});

  const emit = (overrides = {}) => {
    onChange({
      make: overrides.make !== undefined ? overrides.make : make,
      model: overrides.model !== undefined ? overrides.model : model,
      year: overrides.year !== undefined ? overrides.year : year,
      specs: overrides.specs !== undefined ? overrides.specs : specs,
    });
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const s = specs; // shorthand

  // ── Vehicle-type-aware Make / Model lookup ─────────────────────────────────
  const vType = s.vehicleType || '';
  const isStandardCar = VEHICLE_MAKES_BY_TYPE._useMainData.includes(vType) || vType === '';

  // Get the correct make→model map for the current vehicle type
  const activeMakeMap = isStandardCar
    ? vehicleData
    : (VEHICLE_MAKES_BY_TYPE[vType] || {});

  const makeOptions  = Object.keys(activeMakeMap);
  const modelOptions = make ? (activeMakeMap[make] || []) : [];

  // Reset make+model when vehicle type changes
  useEffect(() => {
    setMake('');
    setModel('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vType]);

  // Reset model when make changes
  useEffect(() => {
    if (make && model && !(activeMakeMap[make] || []).includes(model)) {
      setModel('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [make]);

  // ── Visibility flags (hide irrelevant sections per vehicle type) ────────────
  const hasBodyStyle = isStandardCar;
  const hasDoors     = isStandardCar;
  const hasInterior  = !['Motorcycle', 'Tuk Tuk / 3-Wheeler', 'Trailer', 'Agricultural Equipment'].includes(vType);
  const hasEngine    = vType !== 'Trailer';
  const hasDriveType = isStandardCar || ['Heavy Truck', 'Construction Equipment', 'Agricultural Equipment'].includes(vType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── 1. VEHICLE IDENTITY ────────────────────────────────── */}
      <div>
        <SectionHeader icon="🚗" title="Vehicle Identity" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Vehicle Type" required>
            <Select value={s.vehicleType} onChange={v => {
              setSpec('vehicleType', v);
              // make/model reset is handled by the useEffect watching vType
            }}
              options={VEHICLE_SPECS.vehicleTypes} />
          </Field>

          {hasBodyStyle && (
            <Field label="Body Style">
              <Select value={s.bodyStyle} onChange={v => setSpec('bodyStyle', v)}
                options={VEHICLE_SPECS.bodyStyles} />
            </Field>
          )}

          <Field label={isStandardCar ? 'Make (Brand)' : ['Bus','Heavy Truck','Construction Equipment','Agricultural Equipment','Trailer'].includes(vType) ? 'Manufacturer' : 'Make'} required>
            <select className="form-control" style={{ fontSize: '0.85rem' }} value={make}
              onChange={e => { setMake(e.target.value); setModel(''); emit({ make: e.target.value, model: '' }); }}>
              <option value="">{vType ? `Select ${vType} Brand…` : 'Select Make…'}</option>
              {makeOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          <Field label={isStandardCar ? 'Model' : 'Model / Type'} required>
            <select className="form-control" style={{ fontSize: '0.85rem' }} value={model}
              onChange={e => { setModel(e.target.value); emit({ model: e.target.value }); }}
              disabled={!make}>
              <option value="">{make ? `Select ${make} model…` : 'Select make first'}</option>
              {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          <Field label="Variant / Trim">
            <TextInput value={s.variant} onChange={v => setSpec('variant', v)} placeholder="e.g. Sport, GLS, Executive" />
          </Field>

          <Field label="Year of Manufacture" required>
            <Select value={year} onChange={v => { setYear(v); emit({ year: v }); }}
              options={MANUFACTURE_YEARS.map(String)} placeholder="Select Year…" />
          </Field>

          <Field label="Year of Registration">
            <Select value={s.regYear} onChange={v => setSpec('regYear', v)}
              options={MANUFACTURE_YEARS.map(String)} placeholder="Select Year…" />
          </Field>

          <Field label="Registration Number">
            <TextInput value={s.regNumber} onChange={v => setSpec('regNumber', v)} placeholder="e.g. KDA 123A (optional)" />
          </Field>
        </div>
      </div>

      {/* ── 2. MILEAGE & USAGE ─────────────────────────────────── */}
      <div>
        <SectionHeader icon="📍" title="Mileage & Usage" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Mileage" required>
            <NumberInput value={s.mileage} onChange={v => setSpec('mileage', v)} placeholder="e.g. 45000" />
          </Field>

          <Field label="Mileage Unit">
            <Select value={s.mileageUnit} onChange={v => setSpec('mileageUnit', v)}
              options={['KM', 'Miles']} />
          </Field>

          <Field label="Number of Previous Owners">
            <Select value={s.prevOwners} onChange={v => setSpec('prevOwners', v)}
              options={['1', '2', '3', '4', '5+']} />
          </Field>

          <Field label="Usage Type">
            <Select value={s.usageType} onChange={v => setSpec('usageType', v)}
              options={VEHICLE_SPECS.usageTypes} />
          </Field>

          <Field label="Service History">
            <Select value={s.serviceHistory} onChange={v => setSpec('serviceHistory', v)}
              options={['Full Service History', 'Partial Service History', 'No Service History']} />
          </Field>

        </div>
      </div>

      {/* ── 3. ENGINE SPECS ────────────────────────────────────── */}
      {hasEngine && (
      <div>
        <SectionHeader icon="⚙️" title="Engine Specifications" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Fuel Type" required>
            <Select value={s.fuelType} onChange={v => setSpec('fuelType', v)}
              options={VEHICLE_SPECS.fuelTypes} />
          </Field>

          <Field label="Engine Capacity (CC)">
            <NumberInput value={s.engineCC} onChange={v => setSpec('engineCC', v)} placeholder="e.g. 1800" />
          </Field>

          <Field label="Engine Size (L)">
            <TextInput value={s.engineSize} onChange={v => setSpec('engineSize', v)} placeholder="e.g. 1.8" />
          </Field>

          <Field label="Horsepower (HP)">
            <NumberInput value={s.horsepower} onChange={v => setSpec('horsepower', v)} placeholder="e.g. 150" />
          </Field>

          <Field label="Engine Cylinders">
            <Select value={s.cylinders} onChange={v => setSpec('cylinders', v)}
              options={['2', '3', '4', '5', '6', '8', '10', '12']} />
          </Field>

          <Field label="Engine Configuration">
            <Select value={s.engineConfig} onChange={v => setSpec('engineConfig', v)}
              options={['Inline', 'V', 'Boxer', 'Rotary']} />
          </Field>

          <Field label="Turbocharged">
            <Select value={s.turbocharged} onChange={v => setSpec('turbocharged', v)}
              options={['Yes', 'No']} />
          </Field>

        </div>
      </div>
      )}

      {/* ── 4. TRANSMISSION & DRIVETRAIN ───────────────────────── */}
      {hasEngine && (
      <div>
        <SectionHeader icon="🔧" title="Transmission & Drivetrain" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Transmission" required>
            <Select value={s.transmission} onChange={v => setSpec('transmission', v)}
              options={['Automatic', 'Manual', 'CVT', 'DCT', 'Semi-Auto']} />
          </Field>

          <Field label="Number of Gears">
            <Select value={s.numGears} onChange={v => setSpec('numGears', v)}
              options={['4', '5', '6', '7', '8', '9', '10']} />
          </Field>

          {hasDriveType && (
            <Field label="Drive Type" required>
              <Select value={s.driveType} onChange={v => setSpec('driveType', v)}
                options={['FWD', 'RWD', 'AWD', '4WD']} />
            </Field>
          )}

        </div>
      </div>
      )}

      {/* ── 5. EXTERIOR ────────────────────────────────────────── */}
      <div>
        <SectionHeader icon="🎨" title="Exterior" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Exterior Colour">
            <TextInput value={s.color} onChange={v => setSpec('color', v)} placeholder="e.g. Pearl White" />
          </Field>

          <Field label="Colour Type">
            <Select value={s.colorType} onChange={v => setSpec('colorType', v)}
              options={['Solid', 'Metallic', 'Matte', 'Pearl']} />
          </Field>

          {hasDoors && (
            <Field label="Number of Doors">
              <Select value={s.numDoors} onChange={v => setSpec('numDoors', v)}
                options={['2', '3', '4', '5']} />
            </Field>
          )}

          <Field label="Number of Seats">
            <Select value={s.numSeats} onChange={v => setSpec('numSeats', v)}
              options={['2', '4', '5', '6', '7', '8', '9+']} />
          </Field>

          <Field label="Wheel Size (inches)">
            <TextInput value={s.wheelSize} onChange={v => setSpec('wheelSize', v)} placeholder="e.g. 17" />
          </Field>

        </div>
      </div>

      {/* ── 6. INTERIOR ────────────────────────────────────────── */}
      {hasInterior && (
      <div>
        <SectionHeader icon="🪑" title="Interior" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Interior Colour">
            <TextInput value={s.interiorColor} onChange={v => setSpec('interiorColor', v)} placeholder="e.g. Black" />
          </Field>

          <Field label="Interior Material">
            <Select value={s.interiorMaterial} onChange={v => setSpec('interiorMaterial', v)}
              options={['Cloth', 'Leather', 'Alcantara', 'Vinyl', 'Mixed']} />
          </Field>

        </div>
      </div>
      )}

      {/* ── 7. COMFORT & CONVENIENCE — CHECKBOXES ──────────────── */}
      {hasInterior && (
      <div>
        <SectionHeader icon="❄️" title="Comfort & Convenience" />
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          Select all that apply
        </p>
        <CheckboxGroup
          options={VEHICLE_SPECS.comfortFeatures}
          selected={s.comfortFeatures || []}
          onChange={v => setSpec('comfortFeatures', v)}
        />
      </div>
      )}

      {/* ── 8. INFOTAINMENT & CONNECTIVITY — CHECKBOXES ────────── */}
      {hasInterior && (
      <div>
        <SectionHeader icon="📱" title="Infotainment & Connectivity" />
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          Select all that apply
        </p>
        <CheckboxGroup
          options={VEHICLE_SPECS.infotainmentFeatures}
          selected={s.infotainmentFeatures || []}
          onChange={v => setSpec('infotainmentFeatures', v)}
        />
      </div>
      )}

      {/* ── 9. SAFETY FEATURES — CHECKBOXES ────────────────────── */}
      <div>
        <SectionHeader icon="🛡️" title="Safety Features" />
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          Select all that apply
        </p>
        <CheckboxGroup
          options={VEHICLE_SPECS.safetyFeatures}
          selected={s.safetyFeatures || []}
          onChange={v => setSpec('safetyFeatures', v)}
        />
      </div>

      {/* ── 10. EXTERIOR FEATURES — CHECKBOXES ─────────────────── */}
      <div>
        <SectionHeader icon="✨" title="Exterior Features" />
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          Select all that apply
        </p>
        <CheckboxGroup
          options={VEHICLE_SPECS.exteriorFeatures}
          selected={s.exteriorFeatures || []}
          onChange={v => setSpec('exteriorFeatures', v)}
        />
      </div>

      {/* ── 11. VEHICLE CONDITION & DOCUMENTS ──────────────────── */}
      <div>
        <SectionHeader icon="📋" title="Vehicle Condition & Documents" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>

          <Field label="Accident History">
            <Select value={s.accidentHistory} onChange={v => setSpec('accidentHistory', v)}
              options={['No Accidents', 'Minor Accident', 'Major Accident', 'Rebuilt After Accident']} />
          </Field>

          <Field label="Overall Condition">
            <Select value={s.overallCondition} onChange={v => setSpec('overallCondition', v)}
              options={['Excellent', 'Very Good', 'Good', 'Fair', 'Needs Repair']} />
          </Field>

          <Field label="Logbook Available">
            <Select value={s.logbook} onChange={v => setSpec('logbook', v)}
              options={['Yes', 'No', 'Under Transfer']} />
          </Field>

          <Field label="Number of Keys">
            <Select value={s.numKeys} onChange={v => setSpec('numKeys', v)}
              options={['1', '2', '3+']} />
          </Field>

          <Field label="Financing Status">
            <Select value={s.financingStatus} onChange={v => setSpec('financingStatus', v)}
              options={['Fully Paid', 'Under Financing', 'Bank Loan', 'Hire Purchase']} />
          </Field>

          <Field label="Insurance Status">
            <Select value={s.insuranceStatus} onChange={v => setSpec('insuranceStatus', v)}
              options={['Comprehensive', 'Third Party', 'Expired', 'None']} />
          </Field>

        </div>

        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            Additional Condition Details (select all that apply)
          </p>
          <CheckboxGroup
            options={VEHICLE_SPECS.conditionDetails}
            selected={s.conditionDetails || []}
            onChange={v => setSpec('conditionDetails', v)}
          />
        </div>
      </div>

      {/* ── 12. SELLER INFO ────────────────────────────────────── */}
      <div>
        <SectionHeader icon="👤" title="Seller Details" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
          <Field label="Seller Type">
            <Select value={s.sellerType} onChange={v => setSpec('sellerType', v)}
              options={['Private Owner', 'Dealer', 'Broker']} />
          </Field>
          <Field label="Financing Available">
            <Select value={s.financingAvailable} onChange={v => setSpec('financingAvailable', v)}
              options={['Yes', 'No']} />
          </Field>
          <Field label="Trade-in Accepted">
            <Select value={s.tradeIn} onChange={v => setSpec('tradeIn', v)}
              options={['Yes', 'No']} />
          </Field>
          <Field label="Availability">
            <Select value={s.availability} onChange={v => setSpec('availability', v)}
              options={['Available', 'Reserved', 'Sold']} />
          </Field>
        </div>
      </div>

    </div>
  );
}
