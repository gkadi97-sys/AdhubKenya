/**
 * MetadataDrivenForm — Workflow-Driven Listing Engine
 * ====================================================
 * Transforms any category into a guided, progressive workflow.
 *
 * Each attribute_group becomes a Section with 4 states:
 *   locked → available → in-progress → completed
 *
 * Sections:
 *  - Only render when all prior required sections are complete
 *  - Auto-collapse when completed (with a metadata-driven summary)
 *  - Conditionally hide when all their fields are hidden by dependencies
 *
 * The frontend renders whatever the metadata describes. No hardcoded behavior.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useWatch, Controller } from 'react-hook-form';
import { getCategoryMetadata, getLookupValues } from '@/lib/api';
import {
  ChevronDown, ChevronRight, Loader2, AlertCircle,
  CheckCircle2, Lock, Car, Smartphone, Home, Briefcase,
  Cpu, HardDrive, Camera, List, Info, Wrench, Package,
  ShoppingBag, Leaf, PawPrint, Zap, Shirt, BookOpen,
  GraduationCap, Laptop, Wifi, Battery, Monitor, Tag,
} from 'lucide-react';

// ─── SearchableSelect ────────────────────────────────────────────────────────
function SearchableSelect({ options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(o => o.toLowerCase().includes(q));
  }, [options, search]);

  const openDropdown = () => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDropPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setOpen(true);
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!triggerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={triggerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0.75rem',
          border: `1px solid ${open ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border)'}`,
          backgroundColor: 'hsl(var(--background))',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: open ? '0 0 0 2px hsl(var(--primary) / 0.2)' : 'none',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <span style={{ color: value ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
          {value && (
            <span
              role="button"
              tabIndex={-1}
              onMouseDown={clear}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1rem', height: '1rem', borderRadius: '9999px', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              ✕
            </span>
          )}
          <ChevronDown style={{ width: '1rem', height: '1rem', color: 'hsl(var(--muted-foreground))', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </span>
      </button>

      {open && createPortal(
        <div
          style={{
            position: 'absolute',
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
            zIndex: 99999,
            borderRadius: '0.75rem',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--background))',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div style={{ padding: '0.5rem', borderBottom: '1px solid hsl(var(--border))' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: '100%',
                borderRadius: '0.5rem',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--background))',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none',
                color: 'hsl(var(--foreground))',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: '13rem', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>No results</p>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onMouseDown={() => select(opt)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.625rem 1rem',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: opt === value ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                    color: opt === value ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    fontWeight: opt === value ? '600' : '400',
                    display: 'block',
                  }}
                  onMouseEnter={e => { if (opt !== value) e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'; }}
                  onMouseLeave={e => { if (opt !== value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


// ─── Icon Map (maps icon name strings from DB to Lucide components) ──────────
const ICON_MAP = {
  car: Car, smartphone: Smartphone, home: Home, briefcase: Briefcase,
  cpu: Cpu, 'hard-drive': HardDrive, camera: Camera, list: List,
  info: Info, wrench: Wrench, package: Package, 'shopping-bag': ShoppingBag,
  leaf: Leaf, 'paw-print': PawPrint, zap: Zap, shirt: Shirt,
  'book-open': BookOpen, 'graduation-cap': GraduationCap, laptop: Laptop,
  wifi: Wifi, battery: Battery, monitor: Monitor, tag: Tag,
};

function SectionIcon({ name, className = 'h-4 w-4' }) {
  const Comp = ICON_MAP[name] || Info;
  return <Comp className={className} />;
}

// ─── Dependency Evaluation Engine ───────────────────────────────────────────
function evaluateDependencies(attribute, dependencies, allValues) {
  const attrDeps = dependencies.filter(d => d.attribute_id === attribute.id);
  if (attrDeps.length === 0) return { visible: true, required: attribute.is_required };

  const showDeps    = attrDeps.filter(d => d.effect === 'show' || d.effect === 'cascade');
  const hideDeps    = attrDeps.filter(d => d.effect === 'hide');
  const requireDeps = attrDeps.filter(d => d.effect === 'require');

  const evalCondition = (dep) => {
    const { depends_on_attribute_id, operator, dependency_value } = dep;
    const fieldValue =
      allValues?.attrs?.[depends_on_attribute_id] ??
      allValues?.[depends_on_attribute_id];
    const depVal = dependency_value;

    switch (operator) {
      case 'equals':       return String(fieldValue ?? '') === String(depVal ?? '');
      case 'not_equals':   return String(fieldValue ?? '') !== String(depVal ?? '');
      case 'exists':       return !!fieldValue && fieldValue !== '';
      case 'not_exists':   return !fieldValue || fieldValue === '';
      case 'contains':     return String(fieldValue || '').toLowerCase().includes(String(depVal || '').toLowerCase());
      case 'in':           return Array.isArray(depVal) ? depVal.includes(fieldValue) : false;
      case 'not_in':       return Array.isArray(depVal) ? !depVal.includes(fieldValue) : true;
      case 'greater_than': return Number(fieldValue) > Number(depVal);
      case 'less_than':    return Number(fieldValue) < Number(depVal);
      default:             return false;
    }
  };

  let visible = false;
  if (showDeps.length > 0) {
    visible = showDeps.every(evalCondition);
  } else {
    visible = hideDeps.length > 0 ? !hideDeps.every(evalCondition) : true;
  }

  let required = false;
  if (requireDeps.length > 0) {
    required = requireDeps.some(evalCondition);
  } else {
    required = visible ? attribute.is_required : false;
  }

  return { visible, required };
}

// ─── Lookup Cache ─────────────────────────────────────────────────────────────
const LOOKUP_CACHE = {};
async function cachedGetLookupValues(lookupType, parentId = null) {
  const key = `${lookupType}:${parentId}`;
  if (LOOKUP_CACHE[key]) return LOOKUP_CACHE[key];
  const result = await getLookupValues(lookupType, parentId);
  LOOKUP_CACHE[key] = result;
  return result;
}

// ─── FieldRenderer ────────────────────────────────────────────────────────────
function FieldRenderer({ attribute, required, register, control, allValues, setValue, attributes, dependencies, isGroupAvailable }) {
  const fieldName = `attrs.${attribute.id}`;

  const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed';
  const labelClass = 'text-sm font-semibold text-foreground mb-1.5 inline-flex items-center gap-1';

  // Cascade dependency (options filtered by parent)
  const cascadeDepAttrId = useMemo(() => {
    const dep = dependencies.find(
      d => d.attribute_id === attribute.id && d.effect === 'cascade' && d.operator === 'exists'
    );
    return dep ? dep.depends_on_attribute_id : null;
  }, [dependencies, attribute.id]);

  // Show dependency (visible when parent has value)
  const showDepAttrId = useMemo(() => {
    const dep = dependencies.find(
      d => d.attribute_id === attribute.id && d.effect === 'show' && d.operator === 'exists'
    );
    return dep ? dep.depends_on_attribute_id : null;
  }, [dependencies, attribute.id]);

  const parentAttrId = cascadeDepAttrId || showDepAttrId;

  const parentValue = useMemo(() => {
    if (!parentAttrId) return null;
    return allValues?.attrs?.[parentAttrId] ?? null;
  }, [parentAttrId, allValues]);

  // Resolve parent label for empty state
  const parentAttrLabel = useMemo(() => {
    if (!parentAttrId) return null;
    const pa = attributes.find(a => a.id === parentAttrId);
    return pa?.label || 'the previous field';
  }, [parentAttrId, attributes]);

  const [parentLookupId, setParentLookupId] = useState(null);
  const parentAttr = useMemo(() => attributes.find(a => a.id === cascadeDepAttrId), [attributes, cascadeDepAttrId]);

  useEffect(() => {
    if (!cascadeDepAttrId || !parentAttr?.lookup_type || !parentValue) {
      setParentLookupId(null);
      return;
    }
    cachedGetLookupValues(parentAttr.lookup_type, 'any').then(rows => {
      const match = rows.find(r => r.value === parentValue);
      setParentLookupId(match?.id ?? null);
    });
  }, [cascadeDepAttrId, parentAttr, parentValue]);

  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const needsLookup = !!attribute.lookup_type;
  const isParentEmpty = parentAttrId && !parentValue;

  useEffect(() => {
    if (!needsLookup) return;
    if (parentAttrId && !parentValue) { setOptions([]); return; }
    if (cascadeDepAttrId && parentValue && parentLookupId === null) { setOptions([]); return; }

    const resolvedParentId = cascadeDepAttrId && parentValue ? parentLookupId : null;
    setLoadingOptions(true);
    cachedGetLookupValues(attribute.lookup_type, resolvedParentId).then(data => {
      const sorted = [...data].sort((a, b) => a.value.localeCompare(b.value));
      setOptions(sorted.map(d => ({ value: d.value, metadata: d.metadata })));
      setLoadingOptions(false);
    });
  }, [attribute.lookup_type, attribute.id, cascadeDepAttrId, parentLookupId, parentValue, parentAttrId, needsLookup]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(o => o.value === selectedValue);
    if (selectedOption?.metadata?.auto_fill) {
      const autoFill = selectedOption.metadata.auto_fill;
      Object.entries(autoFill).forEach(([key, val]) => {
        const targetAttr = attributes.find(a => a.name === key);
        if (targetAttr) {
          setValue(`attrs.${targetAttr.id}`, val, { shouldValidate: true, shouldDirty: true });
          setAutoFilled(true);
          setTimeout(() => setAutoFilled(false), 1500);
        }
      });
    }
  };

  const validationRules = {
    required: required ? `${attribute.label} is required` : false,
    ...(attribute.min_value != null && { min: { value: attribute.min_value, message: `Minimum is ${attribute.min_value}` } }),
    ...(attribute.max_value != null && { max: { value: attribute.max_value, message: `Maximum is ${attribute.max_value}` } }),
    ...(attribute.validation_rules === 'email' && { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Enter a valid email' } }),
    ...(attribute.validation_rules === 'phone' && { pattern: { value: /^(\+254|0)[0-9]{9}$/, message: 'Enter a valid Kenyan phone number' } }),
  };

  const unitLabel = attribute.unit ? (
    <span className="ml-1 text-xs font-normal text-muted-foreground">({attribute.unit})</span>
  ) : null;

  const helpText = attribute.help_text ? (
    <p className="mt-1 text-xs text-muted-foreground">{attribute.help_text}</p>
  ) : null;

  // Empty state for parent-dependent fields
  const emptyStatePlaceholder = isParentEmpty
    ? `Select ${parentAttrLabel} first`
    : (attribute.placeholder || `Select ${attribute.label}`);

  // Auto-fill highlight class
  const autoFillClass = autoFilled ? 'ring-2 ring-emerald-400/60 border-emerald-400' : '';

  // SELECT
  if (attribute.field_type === 'select') {
    return (
      <div>
        <label className={labelClass}>
          {attribute.label}{unitLabel} {required && <span className="text-destructive">*</span>}
        </label>
        <div className="relative">
          {loadingOptions ? (
            <div className="flex h-12 items-center justify-center rounded-xl border border-border bg-background">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Controller
              name={fieldName}
              control={control}
              rules={validationRules}
              render={({ field }) => (
                <SearchableSelect
                  options={options.map(o => o.value)}
                  value={field.value || ''}
                  onChange={(val) => {
                    field.onChange(val);
                    handleSelectChange({ target: { value: val } });
                  }}
                  disabled={isParentEmpty}
                  placeholder={emptyStatePlaceholder}
                />
              )}
            />
          )}
        </div>
        {isParentEmpty && (
          <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
            <Info className="h-3 w-3" /> Select {parentAttrLabel} to unlock this field
          </p>
        )}
        {!isParentEmpty && helpText}
      </div>
    );
  }

  // MULTISELECT
  if (attribute.field_type === 'multiselect') {
    return (
      <div className="md:col-span-2">
        <label className={labelClass}>
          {attribute.label} {required && <span className="text-destructive">*</span>}
        </label>
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: required ? `Select at least one ${attribute.label}` : false }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 mt-1">
              {loadingOptions ? (
                <div className="flex h-10 items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading options...
                </div>
              ) : (
                options.map(opt => {
                  const isSelected = Array.isArray(field.value) && field.value.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(field.value) ? field.value : [];
                        field.onChange(isSelected ? current.filter(i => i !== opt.value) : [...current, opt.value]);
                      }}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      {opt.value}
                    </button>
                  );
                })
              )}
            </div>
          )}
        />
        {helpText}
      </div>
    );
  }

  // RADIO
  if (attribute.field_type === 'radio') {
    return (
      <div className="md:col-span-2">
        <label className={labelClass}>
          {attribute.label} {required && <span className="text-destructive">*</span>}
        </label>
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: required ? `${attribute.label} is required` : false }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 mt-1">
              {options.map(opt => {
                const isSelected = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(isSelected ? '' : opt.value)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {opt.value}
                  </button>
                );
              })}
            </div>
          )}
        />
        {helpText}
      </div>
    );
  }

  // MULTICHECK — chip grid (options stored in validation_rules.options)
  if (attribute.field_type === 'multicheck') {
    const checkOptions = (() => {
      try {
        if (typeof attribute.validation_rules === 'object' && Array.isArray(attribute.validation_rules?.options)) {
          return attribute.validation_rules.options;
        }
        if (typeof attribute.validation_rules === 'string') {
          const parsed = JSON.parse(attribute.validation_rules);
          return parsed.options || [];
        }
      } catch { /* ignore */ }
      return [];
    })();

    return (
      <div className="md:col-span-2">
        <label className={labelClass}>
          {attribute.label} {required && <span className="text-destructive">*</span>}
        </label>
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: required ? `${attribute.label} is required` : false }}
          render={({ field }) => {
            const selected = Array.isArray(field.value) ? field.value : [];
            const toggle = (opt) => {
              const next = selected.includes(opt)
                ? selected.filter(v => v !== opt)
                : [...selected, opt];
              field.onChange(next);
            };
            return (
              <div className="flex flex-wrap gap-2 mt-1.5">
                {checkOptions.map(opt => {
                  const active = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggle(opt)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all select-none ${
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                      }`}
                    >
                      {active && <span className="mr-1.5 text-xs">✓</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
        {helpText}
      </div>
    );
  }

  // BOOLEAN
  if (attribute.field_type === 'boolean') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
        <label className="text-sm font-semibold text-foreground cursor-pointer select-none">
          {attribute.label}
          {helpText}
        </label>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.value ? 'bg-primary' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          )}
        />
      </div>
    );
  }

  // DATE
  if (attribute.field_type === 'date') {
    return (
      <div>
        <label className={labelClass}>
          {attribute.label} {required && <span className="text-destructive">*</span>}
        </label>
        <input type="date" className={inputClass} {...register(fieldName, validationRules)} />
        {helpText}
      </div>
    );
  }

  // NUMBER
  if (attribute.field_type === 'number') {
    return (
      <div>
        <label className={labelClass}>
          {attribute.label}{unitLabel} {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="number"
          className={`${inputClass} ${autoFillClass}`}
          placeholder={attribute.placeholder || (attribute.min_value != null ? `Min: ${attribute.min_value}` : `Enter ${attribute.label.toLowerCase()}`)}
          min={attribute.min_value ?? undefined}
          max={attribute.max_value ?? undefined}
          {...register(fieldName, validationRules)}
        />
        {helpText}
      </div>
    );
  }

  // TEXTAREA
  if (attribute.field_type === 'textarea') {
    return (
      <div className="md:col-span-2">
        <label className={labelClass}>
          {attribute.label} {required && <span className="text-destructive">*</span>}
        </label>
        <textarea
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder={attribute.placeholder || `Enter ${attribute.label.toLowerCase()}`}
          {...register(fieldName, validationRules)}
        />
        {helpText}
      </div>
    );
  }

  // TEXT (default)
  return (
    <div>
      <label className={labelClass}>
        {attribute.label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="text"
        className={`${inputClass} ${autoFillClass}`}
        placeholder={attribute.placeholder || `Enter ${attribute.label.toLowerCase()}`}
        {...register(fieldName, validationRules)}
      />
      {helpText}
    </div>
  );
}

// ─── Section Summary Generator ────────────────────────────────────────────────
function generateSummary(group, allValues, attributes) {
  const summaryFieldNames = group.summary_fields || [];
  if (!summaryFieldNames.length) return null;

  const parts = summaryFieldNames.map(name => {
    const attr = attributes.find(a => a.name === name || a.label.toLowerCase() === name.toLowerCase());
    if (!attr) return null;
    const val = allValues?.attrs?.[attr.id];
    return val && val !== '' ? String(val) : null;
  }).filter(Boolean);

  return parts.length > 0 ? parts.join(' • ') : null;
}

// ─── Section Component ────────────────────────────────────────────────────────
function WorkflowSection({
  group, fields, state, isExpanded, onToggle,
  register, control, allValues, setValue, attributes, dependencies,
}) {
  // State classes
  const stateConfig = {
    locked:     { ring: 'border-border/40 opacity-50', headerBg: 'bg-card', dot: 'bg-muted-foreground/30' },
    available:  { ring: 'border-border', headerBg: 'bg-card', dot: 'bg-primary/40' },
    'in-progress': { ring: 'border-primary/40 ring-1 ring-primary/10', headerBg: 'bg-card', dot: 'bg-primary animate-pulse' },
    completed:  { ring: 'border-emerald-500/30', headerBg: 'bg-card', dot: 'bg-emerald-500' },
  };
  const cfg = stateConfig[state] || stateConfig.available;

  const summary = useMemo(() =>
    generateSummary(group, allValues, attributes),
    [group, allValues, attributes]
  );

  return (
    <div className={`rounded-2xl border ${cfg.ring} bg-card shadow-sm transition-all duration-200 overflow-hidden`}>
      {/* Header */}
      <button
        type="button"
        disabled={state === 'locked'}
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 ${state !== 'locked' ? 'cursor-pointer hover:bg-muted/30' : 'cursor-default'} transition-colors`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Status indicator */}
          {state === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          ) : state === 'locked' ? (
            <Lock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
          ) : (
            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-0.5 ${cfg.dot}`} />
          )}

          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              {group.icon && <SectionIcon name={group.icon} className="h-4 w-4 text-primary/70" />}
              <span className="font-display text-sm font-bold text-foreground">{group.name}</span>
            </div>
            {/* Summary line when collapsed */}
            {state === 'completed' && !isExpanded && summary && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{summary}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {state === 'completed' && !isExpanded && (
            <span className="text-xs text-primary font-semibold hidden sm:block">Edit</span>
          )}
          {state !== 'locked' && (
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
          {state === 'locked' && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          )}
        </div>
      </button>

      {/* Fields — only rendered when expanded */}
      {isExpanded && state !== 'locked' && (
        <div className="border-t border-border px-5 pt-5 pb-6 sm:px-6 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(attr => (
              <FieldRenderer
                key={attr.id}
                attribute={attr}
                required={attr._required}
                register={register}
                control={control}
                allValues={allValues}
                setValue={setValue}
                attributes={attributes}
                dependencies={dependencies}
                isGroupAvailable={state !== 'locked'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function WorkflowProgress({ completedCount, totalCount }) {
  if (totalCount === 0) return null;
  const pct = Math.round((completedCount / totalCount) * 100);
  return (
    <div className="mb-6 space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completedCount} of {totalCount} sections complete</span>
        <span className="font-semibold text-primary">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main MetadataDrivenForm Component ───────────────────────────────────────
export default function MetadataDrivenForm({
  categorySlug, register, control, watch, setValue,
  onProgressChange,   // callback: (completedGroups, totalGroups) => void
  onSectionComplete,  // callback: (groupId) => void
  onMetadataLoaded,   // callback: (metadata) => void
  isLocked = false,
}) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // Track which sections are manually expanded/collapsed
  const [expandedGroups, setExpandedGroups] = useState({});

  // Reactive watch on all form values for dependency evaluation
  const allValues = useWatch({ control });

  // Fetch metadata
  useEffect(() => {
    if (!categorySlug) { setMetadata(null); setLoading(false); return; }
    setLoading(true);
    setValidationErrors([]);
    setExpandedGroups({});

    getCategoryMetadata(categorySlug).then(data => {
      if (!data.attributes || data.attributes.length === 0) {
        setValidationErrors(['No attributes defined for this category.']);
        setLoading(false);
        return;
      }
      setMetadata(data);
      if (onMetadataLoaded) onMetadataLoaded(data);
      setLoading(false);
    }).catch(() => {
      setMetadata(null);
      setLoading(false);
    });
  }, [categorySlug]);

  // Evaluate visible attributes
  const evaluatedAttributes = useMemo(() => {
    if (!metadata) return [];
    return metadata.attributes
      .filter(attr => !attr.is_hidden && !attr.is_admin_only)
      .map(attr => {
        const { visible, required } = evaluateDependencies(attr, metadata.dependencies, allValues);
        return { ...attr, _visible: visible, _required: required };
      })
      .filter(attr => attr._visible);
  }, [metadata, allValues]);

  // Build visible groups (deduplicated, only those with ≥1 visible field)
  const visibleGroups = useMemo(() => {
    if (!metadata) return [];

    const uniqueGroups = metadata.groups.reduce((acc, group) => {
      if (!acc.some(g => g.name === group.name)) acc.push(group);
      return acc;
    }, []);

    return uniqueGroups
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(group => ({
        ...group,
        fields: evaluatedAttributes.filter(attr => attr.group_id === group.id),
      }))
      .filter(g => g.fields.length > 0);
  }, [metadata, evaluatedAttributes]);

  // Ungrouped fields
  const ungroupedFields = useMemo(() => {
    if (!metadata) return [];
    return evaluatedAttributes.filter(attr => !attr.group_id);
  }, [metadata, evaluatedAttributes]);

  // Determine section completion: a group is "done" if all its _required fields have values
  const groupCompletionMap = useMemo(() => {
    const map = {};
    visibleGroups.forEach(group => {
      const requiredFields = group.fields.filter(f => f._required);
      if (requiredFields.length === 0) {
        // No required fields — completed if any field has a value
        const anyFilled = group.fields.some(f => {
          const val = allValues?.attrs?.[f.id];
          return val != null && val !== '' && !(Array.isArray(val) && val.length === 0);
        });
        map[group.id] = anyFilled;
      } else {
        map[group.id] = requiredFields.every(f => {
          const val = allValues?.attrs?.[f.id];
          return val != null && val !== '' && !(Array.isArray(val) && val.length === 0);
        });
      }
    });
    return map;
  }, [visibleGroups, allValues]);

  // Compute states for each group
  const groupStateMap = useMemo(() => {
    const map = {};
    let previousComplete = true;
    visibleGroups.forEach(group => {
      if (isLocked) {
        map[group.id] = 'locked';
        return;
      }
      const isDone = groupCompletionMap[group.id];
      if (isDone) {
        map[group.id] = 'completed';
      } else if (previousComplete) {
        map[group.id] = expandedGroups[group.id] ? 'in-progress' : 'available';
      } else {
        map[group.id] = 'locked';
      }
      // For locking: only lock subsequent if this group has required fields that aren't filled
      const hasRequired = group.fields.some(f => f._required);
      if (hasRequired && !isDone) previousComplete = false;
    });
    return map;
  }, [visibleGroups, groupCompletionMap, expandedGroups, isLocked]);

  // Auto-expand the first non-completed available section
  useEffect(() => {
    if (!visibleGroups.length || isLocked) return;
    const firstAvailable = visibleGroups.find(g =>
      groupStateMap[g.id] === 'available' || groupStateMap[g.id] === 'in-progress'
    );
    if (firstAvailable && expandedGroups[firstAvailable.id] === undefined) {
      setExpandedGroups(prev => ({ ...prev, [firstAvailable.id]: true }));
    }
  }, [visibleGroups, groupStateMap, isLocked]);

  // Auto-collapse completed sections & expand next
  const prevCompletionRef = useRef({});
  useEffect(() => {
    visibleGroups.forEach((group, idx) => {
      const wasDone = prevCompletionRef.current[group.id];
      const isDone = groupCompletionMap[group.id];
      if (!wasDone && isDone) {
        // Auto-expand next available without collapsing the current one
        const nextGroup = visibleGroups[idx + 1];
        if (nextGroup && groupStateMap[nextGroup.id] !== 'locked') {
          setTimeout(() => {
            setExpandedGroups(prev => ({ ...prev, [nextGroup.id]: true }));
          }, 200);
        }
        onSectionComplete?.(group.id);
      }
    });
    prevCompletionRef.current = { ...groupCompletionMap };
  }, [groupCompletionMap, visibleGroups]);

  // Progress reporting
  const progressCompletedCount = useMemo(() => {
    return visibleGroups.filter(group => {
      const requiredFields = group.fields.filter(f => f._required);
      if (requiredFields.length === 0) return true; // Optional groups always count towards 100% progress
      return groupCompletionMap[group.id];
    }).length;
  }, [visibleGroups, groupCompletionMap]);

  useEffect(() => {
    onProgressChange?.(progressCompletedCount, visibleGroups.length);
  }, [progressCompletedCount, visibleGroups.length]);

  const toggleGroup = (groupId) => {
    const state = groupStateMap[groupId];
    if (state === 'locked') return;
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-secondary/50" />
        ))}
      </div>
    );
  }

  if (validationErrors.length > 0) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-destructive">
        <div className="flex items-center gap-2 font-bold mb-2">
          <AlertCircle className="h-5 w-5" />
          <span>Metadata Configuration Error</span>
        </div>
        <ul className="list-disc pl-5 text-xs">
          {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      </div>
    );
  }

  if (!metadata || (visibleGroups.length === 0 && ungroupedFields.length === 0)) return null;

  return (
    <div className="space-y-3">
      {/* Internal progress bar removed because PostAd provides a global one */}

      {visibleGroups.map(group => (
        <WorkflowSection
          key={group.id}
          group={group}
          fields={group.fields}
          state={groupStateMap[group.id] || 'available'}
          isExpanded={!!expandedGroups[group.id]}
          onToggle={() => toggleGroup(group.id)}
          register={register}
          control={control}
          allValues={allValues}
          setValue={setValue}
          attributes={metadata.attributes}
          dependencies={metadata.dependencies}
        />
      ))}

      {/* Ungrouped fields fallback */}
      {ungroupedFields.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ungroupedFields.map(attr => (
              <FieldRenderer
                key={attr.id}
                attribute={attr}
                required={attr._required}
                register={register}
                control={control}
                allValues={allValues}
                setValue={setValue}
                attributes={metadata.attributes}
                dependencies={metadata.dependencies}
                isGroupAvailable={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
