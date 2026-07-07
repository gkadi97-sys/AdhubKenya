/**
 * MetadataDrivenForm
 * ==================
 * The Platform-Wide Metadata Form Engine for AdHub Kenya.
 *
 * Reads categories, attributes, groups, dependencies, and lookup values
 * directly from the Supabase database. Renders a fully dynamic, progressively
 * disclosed form with grouped sections and conditional field validation.
 *
 * Powers: Post Ad, Edit Listing, and is the foundation for search filter generation.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useWatch, Controller } from 'react-hook-form';
import { getCategoryMetadata, getLookupValues } from '@/lib/api';
import { ChevronDown, Loader2, AlertCircle } from 'lucide-react';

// ─── Metadata Validation Engine ─────────────────────────────────────────────
function validateMetadata(metadata) {
  const errors = [];
  if (!metadata.attributes || metadata.attributes.length === 0) {
    errors.push("No attributes defined for this category.");
  }
  
  // Check for orphaned dependencies
  metadata.dependencies?.forEach(dep => {
    const hasSource = metadata.attributes.some(a => a.id === dep.attribute_id);
    const hasTarget = metadata.attributes.some(a => a.id === dep.depends_on_attribute_id);
    if (!hasSource || !hasTarget) {
      errors.push("Orphaned dependency detected.");
    }
  });

  return errors;
}

// ─── Dependency Evaluation Engine ───────────────────────────────────────────
function evaluateDependencies(attribute, dependencies, allValues) {
  const attrDeps = dependencies.filter(d => d.attribute_id === attribute.id);
  if (attrDeps.length === 0) return { visible: true, required: attribute.is_required };

  let visible = false;
  let required = false;

  const showDeps    = attrDeps.filter(d => d.effect === 'show');
  const hideDeps    = attrDeps.filter(d => d.effect === 'hide');
  const requireDeps = attrDeps.filter(d => d.effect === 'require');

  const evalCondition = (dep) => {
    const { depends_on_attribute_id, operator, dependency_value } = dep;
    // Support both attrs.{id} and attrs.{name} lookups
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

  if (showDeps.length > 0) {
    visible = showDeps.every(evalCondition);
  } else {
    visible = hideDeps.length > 0 ? !hideDeps.every(evalCondition) : true;
  }

  if (requireDeps.length > 0) {
    required = requireDeps.some(evalCondition);
  } else {
    required = visible ? attribute.is_required : false;
  }

  return { visible, required };
}

// ─── Global lookup cache (module-level, survives re-renders) ────────────────
const LOOKUP_CACHE = {};

async function cachedGetLookupValues(lookupType, parentId = null) {
  // Always fetch fresh data to avoid Vite HMR caching issues during development
  return await getLookupValues(lookupType, parentId);
}

// ─── Individual Field Renderer ───────────────────────────────────────────────
function FieldRenderer({ attribute, required, register, control, allValues, setValue, attributes, dependencies }) {
  const fieldName = `attrs.${attribute.id}`;
  const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground';
  const labelClass = 'text-sm font-semibold text-foreground mb-1.5 inline-flex items-center gap-1';

  // ── Determine dependencies for this field ────────────────────────────────
  // 'cascade' dep: this field's options are filtered by parent's lookup UUID
  // 'show' dep:    this field is only visible when parent has a value, but options are NOT filtered
  const cascadeDepAttrId = useMemo(() => {
    const dep = dependencies.find(
      d => d.attribute_id === attribute.id && d.effect === 'cascade' && d.operator === 'exists'
    );
    return dep ? dep.depends_on_attribute_id : null;
  }, [dependencies, attribute.id]);

  // Also track 'show' dependency so we know if we need parent value to display options
  const showDepAttrId = useMemo(() => {
    const dep = dependencies.find(
      d => d.attribute_id === attribute.id && d.effect === 'show' && d.operator === 'exists'
    );
    return dep ? dep.depends_on_attribute_id : null;
  }, [dependencies, attribute.id]);

  // The controlling parent attr id (cascade takes priority)
  const parentAttrId = cascadeDepAttrId || showDepAttrId;

  // Get parent attribute's current form value
  const parentValue = useMemo(() => {
    if (!parentAttrId) return null;
    return allValues?.attrs?.[parentAttrId] ?? null;
  }, [parentAttrId, allValues]);

  // For CASCADE deps only: resolve the parent value to its UUID in lookup_values
  const [parentLookupId, setParentLookupId] = useState(null);
  const parentAttr = useMemo(() => attributes.find(a => a.id === cascadeDepAttrId), [attributes, cascadeDepAttrId]);

  useEffect(() => {
    if (!cascadeDepAttrId || !parentAttr?.lookup_type || !parentValue) {
      setParentLookupId(null);
      return;
    }
    // Find the UUID of the selected parent option in lookup_values
    cachedGetLookupValues(parentAttr.lookup_type, 'any').then(rows => {
      const match = rows.find(r => r.value === parentValue);
      setParentLookupId(match?.id ?? null);
    });
  }, [cascadeDepAttrId, parentAttr, parentValue]);

  // ── Options state for select/multiselect/radio fields ───────────────────
  const [options, setOptions] = useState([]); // Array of { value, metadata }
  const [loadingOptions, setLoadingOptions] = useState(false);

  const needsLookup = !!attribute.lookup_type;
  // For cascading selects, only load options once we have the parent's ID resolved
  // (or immediately if there's no parent dependency)
  const shouldLoad = needsLookup && (!parentAttrId || parentLookupId !== null || !parentValue);

  useEffect(() => {
    if (!needsLookup) return;

    // If this field has ANY parent dependency, wait until parent has a value
    if (parentAttrId && !parentValue) {
      setOptions([]);
      return;
    }

    // For CASCADE deps: wait until we have resolved the parent's UUID
    if (cascadeDepAttrId && parentValue && parentLookupId === null) {
      setOptions([]);
      return;
    }

    // For CASCADE deps use the parent UUID as filter; for SHOW deps use null (no filter)
    const resolvedParentId = cascadeDepAttrId && parentValue ? parentLookupId : null;

    setLoadingOptions(true);
    cachedGetLookupValues(attribute.lookup_type, resolvedParentId).then(data => {
      setOptions(data.map(d => ({ value: d.value, metadata: d.metadata })));
      setLoadingOptions(false);
    });
  }, [attribute.lookup_type, attribute.id, cascadeDepAttrId, parentLookupId, parentValue, parentAttrId, needsLookup]);

  // Handle Select Change & Auto-Population
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    
    // Auto-populate based on metadata
    const selectedOption = options.find(o => o.value === selectedValue);
    if (selectedOption?.metadata?.auto_fill) {
      const autoFill = selectedOption.metadata.auto_fill;
      Object.entries(autoFill).forEach(([key, val]) => {
        // Find the attribute id corresponding to the name key (e.g. 'os')
        const targetAttr = attributes.find(a => a.name === key);
        if (targetAttr) {
          setValue(`attrs.${targetAttr.id}`, val, { shouldValidate: true, shouldDirty: true });
        }
      });
    }
  };

  // Reset this field when parent changes
  const prevParentVal = useRef(parentValue);
  useEffect(() => {
    if (prevParentVal.current !== parentValue && parentAttrId) {
      prevParentVal.current = parentValue;
    }
  }, [parentValue, parentAttrId]);

  const validationRules = {
    required: required ? `${attribute.label} is required` : false,
    ...(attribute.min_value != null && { min: { value: attribute.min_value, message: `Minimum value is ${attribute.min_value}` } }),
    ...(attribute.max_value != null && { max: { value: attribute.max_value, message: `Maximum value is ${attribute.max_value}` } }),
    ...(attribute.validation_rules === 'email' && { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Enter a valid email address' } }),
    ...(attribute.validation_rules === 'phone' && { pattern: { value: /^(\+254|0)[0-9]{9}$/, message: 'Enter a valid Kenyan phone number' } }),
  };

  const unitLabel = attribute.unit ? (
    <span className="ml-1 text-xs font-normal text-muted-foreground">({attribute.unit})</span>
  ) : null;

  const helpText = attribute.help_text ? (
    <p className="mt-1 text-xs text-muted-foreground">{attribute.help_text}</p>
  ) : null;

  const displayOptions = options;

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
            <select
              className={`${inputClass} appearance-none pr-8`}
              {...register(fieldName, validationRules)}
              onChange={(e) => {
                register(fieldName).onChange(e); // Let react-hook-form handle it
                handleSelectChange(e); // Trigger auto-fill
              }}
            >
              <option value="">{attribute.placeholder || `Select ${attribute.label}`}</option>
              {displayOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          )}
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {helpText}
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
                displayOptions.map(opt => {
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

  // RADIO (small option sets — uses pill buttons)
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
              {displayOptions.map(opt => {
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

  // BOOLEAN (toggle)
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
        <input
          type="date"
          className={inputClass}
          {...register(fieldName, validationRules)}
        />
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
          className={inputClass}
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
        className={inputClass}
        placeholder={attribute.placeholder || `Enter ${attribute.label.toLowerCase()}`}
        {...register(fieldName, validationRules)}
      />
      {helpText}
    </div>
  );
}

// ─── Main MetadataDrivenForm Component ──────────────────────────────────────
export default function MetadataDrivenForm({ categorySlug, register, control, watch, setValue }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // Reactive watch on all form values for dependency evaluation
  const allValues = useWatch({ control });

  // Fetch metadata from Supabase when category changes
  useEffect(() => {
    if (!categorySlug) {
      setMetadata(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setValidationErrors([]);
    getCategoryMetadata(categorySlug).then(data => {
      const errors = validateMetadata(data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setLoading(false);
        return;
      }
      setMetadata(data);
      setLoading(false);
    }).catch(() => {
      setMetadata(null);
      setLoading(false);
    });
  }, [categorySlug]);

  // Evaluate which attributes are visible and whether they're required
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

  // Group visible attributes by their group (with deduplication)
  const groupedAttributes = useMemo(() => {
    if (!metadata) return [];
    
    // Deduplicate groups by name in case the DB has duplicates
    const uniqueGroups = metadata.groups.reduce((acc, group) => {
      if (!acc.some(g => g.name === group.name)) {
        acc.push(group);
      }
      return acc;
    }, []);

    return uniqueGroups.map(group => ({
      ...group,
      fields: evaluatedAttributes.filter(attr => attr.group_id === group.id),
    })).filter(g => g.fields.length > 0);
  }, [metadata, evaluatedAttributes]);

  // Attributes with no group get a catch-all group
  const ungroupedAttributes = useMemo(() => {
    if (!metadata) return [];
    return evaluatedAttributes.filter(attr => !attr.group_id);
  }, [metadata, evaluatedAttributes]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-secondary/50" />
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
        <p className="text-sm mb-3 text-destructive/80">The form engine detected invalid metadata configuration for this category. Please contact an administrator.</p>
        <ul className="list-disc pl-5 text-xs">
          {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      </div>
    );
  }

  if (!metadata || (groupedAttributes.length === 0 && ungroupedAttributes.length === 0)) {
    return null;
  }

  const renderGroup = (group, fields) => (
    <div key={group.id} className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      {group.name && (
        <h3 className="mb-5 flex items-center gap-2 border-b border-border pb-4 font-display text-base font-bold text-foreground">
          {group.name}
        </h3>
      )}
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
            attributes={metadata.attributes}
            dependencies={metadata.dependencies}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {groupedAttributes.map(g => renderGroup(g, g.fields))}
      {ungroupedAttributes.length > 0 && renderGroup({ id: 'ungrouped', name: '' }, ungroupedAttributes)}
    </div>
  );
}
