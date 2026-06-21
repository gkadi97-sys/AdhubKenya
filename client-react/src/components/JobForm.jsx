import { useState, useEffect } from 'react';
import { JOB_CATEGORIES, JOB_FILTERS } from '@/lib/jobsData';

function SectionLabel({ icon, text }) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-2 border-b border-border pb-3 pt-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{text}</span>
    </div>
  );
}

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

function Sel({ value, onChange, disabled, children, placeholder }) {
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

function Input({ type = 'text', value, onChange, placeholder, min, max, style }) {
  return (
    <input
      type={type}
      className={inputClass}
      style={style}
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

  // Reset role when category changes
  useEffect(() => {
    if (category && !JOB_CATEGORIES[category]?.includes(role)) {
      setRole('');
      emit({ model: '' });
    }
  }, [category]);

  return (
    <div className="flex flex-col gap-8 mt-4">
      
      {/* ── 1. JOB CLASSIFICATION ─────────────────────────────────────────── */}
      <div>
        <SectionLabel icon="💼" text="Job Classification" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Field label="Job Category" required>
            <Sel value={category} onChange={v => { setCategory(v); emit({ make: v }); }} placeholder="-- Select Category --">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Sel>
          </Field>

          {category && roles.length > 0 && (
            <Field label="Role / Position" required>
              <Sel value={role} onChange={v => { setRole(v); emit({ model: v }); }} placeholder="-- Select Role --">
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </Sel>
            </Field>
          )}
        </div>
      </div>

      {/* ── 2. JOB DETAILS ────────────────────────────────────────────────── */}
      <div>
        <SectionLabel icon="📝" text="Job Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
      </div>

      {/* ── 3. COMPENSATION & DEADLINE ────────────────────────────────────── */}
      <div>
        <SectionLabel icon="💰" text="Compensation & Application" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
        <div className="mt-3 text-xs text-muted-foreground">
          * Leave salary fields blank if the salary is confidential or negotiable.
        </div>
      </div>
    </div>
  );
}
