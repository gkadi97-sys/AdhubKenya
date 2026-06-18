import { useState, useEffect } from 'react';
import { JOB_CATEGORIES, JOB_FILTERS } from '@/lib/jobsData';

const GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '16px'
};

function SectionLabel({ icon, text }) {
  return (
    <h4 style={{
      marginBottom: 16, marginTop: 20, pb: 8,
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: '1rem'
    }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span> {text}
    </h4>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ fontSize: '0.82rem' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, disabled, children, placeholder }) {
  return (
    <select
      className="form-control"
      style={{ fontSize: '0.85rem' }}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder || 'Select…'}</option>
      {children}
    </select>
  );
}

function Input({ type = 'text', value, onChange, placeholder, min, max, style }) {
  return (
    <input
      type={type}
      className="form-control"
      style={{ fontSize: '0.85rem', ...style }}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
}

export default function JobForm({ values = {}, onChange }) {
  const [category, setCategory] = useState(values.make || '');
  const [role, setRole] = useState(values.model || '');
  const [specs, setSpecs] = useState(values.specs || {});

  const emit = (overrides = {}) => {
    onChange({
      make: overrides.make !== undefined ? overrides.make : category,
      model: overrides.model !== undefined ? overrides.model : role,
      year: values.year, // jobs don't use year
      specs: overrides.specs !== undefined ? overrides.specs : specs,
    });
  };

  const setSpec = (key, val) => {
    const next = { ...specs, [key]: val };
    setSpecs(next);
    emit({ specs: next });
  };

  const categories = Object.keys(JOB_CATEGORIES);
  const roles = category ? JOB_CATEGORIES[category] : [];

  const [categorySearch, setCategorySearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [roleExpanded, setRoleExpanded] = useState(false);

  const filteredCategories = categorySearch
    ? categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()))
    : categories;

  const filteredRoles = roleSearch
    ? roles.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase()))
    : roles;

  // Reset role when category changes
  useEffect(() => {
    if (category && !JOB_CATEGORIES[category]?.includes(role)) {
      setRole('');
      emit({ model: '' });
    }
  }, [category]);

  return (
    <div className="job-form" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* ── 1. JOB CLASSIFICATION ─────────────────────────────────────────── */}
      <SectionLabel icon="💼" text="Job Classification" />
      <div style={GRID}>
        <Field label="Job Category" required>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search or select category..."
            value={categorySearch}
            onChange={e => { setCategorySearch(e.target.value); setCategoryExpanded(true); }}
            onFocus={() => { setCategoryExpanded(true); setCategorySearch(''); }}
            style={{ fontSize: '0.85rem' }}
          />
          {categoryExpanded && (
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', marginTop: 4 }}
              value={category}
              onChange={e => {
                const v = e.target.value;
                setCategory(v); emit({ make: v }); setCategorySearch(v); setCategoryExpanded(false);
              }}
              size={Math.min(filteredCategories.length + 1, 7)}
              autoFocus
            >
              <option value="">-- Select Category --</option>
              {filteredCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </Field>

        {category && roles.length > 0 && (
          <Field label="Role / Position" required>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search or select role..."
              value={roleSearch}
              onChange={e => { setRoleSearch(e.target.value); setRoleExpanded(true); }}
              onFocus={() => { setRoleExpanded(true); setRoleSearch(''); }}
              style={{ fontSize: '0.85rem' }}
            />
            {roleExpanded && (
              <select
                className="form-control"
                style={{ fontSize: '0.85rem', marginTop: 4 }}
                value={role}
                onChange={e => {
                  const v = e.target.value;
                  setRole(v); emit({ model: v }); setRoleSearch(v); setRoleExpanded(false);
                }}
                size={Math.min(filteredRoles.length + 1, 7)}
                autoFocus
              >
                <option value="">-- Select Role --</option>
                {filteredRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
          </Field>
        )}
      </div>

      {/* ── 2. JOB DETAILS ────────────────────────────────────────────────── */}
      <SectionLabel icon="📝" text="Job Details" />
      <div style={GRID}>
        <Field label="Employment Type" required>
          <Sel value={specs.employmentType || ''} onChange={v => setSpec('employmentType', v)}>
            {JOB_FILTERS.employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </Sel>
        </Field>

        <Field label="Work Arrangement" required>
          <Sel value={specs.workArrangement || ''} onChange={v => setSpec('workArrangement', v)}>
            {JOB_FILTERS.workArrangements.map(t => <option key={t} value={t}>{t}</option>)}
          </Sel>
        </Field>

        <Field label="Experience Level" required>
          <Sel value={specs.experienceLevel || ''} onChange={v => setSpec('experienceLevel', v)}>
            {JOB_FILTERS.experienceLevels.map(t => <option key={t} value={t}>{t}</option>)}
          </Sel>
        </Field>

        <Field label="Education Level" required>
          <Sel value={specs.educationLevel || ''} onChange={v => setSpec('educationLevel', v)}>
            {JOB_FILTERS.educationLevels.map(t => <option key={t} value={t}>{t}</option>)}
          </Sel>
        </Field>

        <Field label="Shift Type">
          <Sel value={specs.shiftType || ''} onChange={v => setSpec('shiftType', v)}>
            {JOB_FILTERS.shiftTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </Sel>
        </Field>

        <Field label="Workplace Location" required>
          <Input 
            value={specs.workplaceLocation || ''} 
            onChange={v => setSpec('workplaceLocation', v)} 
            placeholder="e.g. Westlands, Nairobi" 
          />
        </Field>
      </div>

      {/* ── 3. COMPENSATION & DEADLINE ────────────────────────────────────── */}
      <SectionLabel icon="💰" text="Compensation & Application" />
      <div style={GRID}>
        <Field label="Minimum Salary (KES)">
          <Input 
            type="number" 
            value={specs.salaryMin || ''} 
            onChange={v => setSpec('salaryMin', v)} 
            placeholder="e.g. 50000" 
            min="0"
          />
        </Field>

        <Field label="Maximum Salary (KES)">
          <Input 
            type="number" 
            value={specs.salaryMax || ''} 
            onChange={v => setSpec('salaryMax', v)} 
            placeholder="e.g. 80000" 
            min="0"
          />
        </Field>

        <Field label="Application Deadline" required>
          <Input 
            type="date" 
            value={specs.deadline || ''} 
            onChange={v => setSpec('deadline', v)} 
          />
        </Field>
      </div>

      {/* Make sure the user knows salary range replaces 'Asking Price' */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '16px' }}>
        * Leave salary fields blank if the salary is confidential or negotiable.
      </div>
    </div>
  );
}
