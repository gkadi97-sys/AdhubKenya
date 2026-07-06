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

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWatch, Controller } from 'react-hook-form';
import { getCategoryMetadata, getLookupValues } from '@/lib/api';
import { ChevronDown, Loader2 } from 'lucide-react';

// ─── Dependency Evaluation Engine ───────────────────────────────────────────
function evaluateDependencies(attribute, dependencies, allValues) {
  const attrDeps = dependencies.filter(d => d.attribute_id === attribute.id);
  if (attrDeps.length === 0) return { visible: true, required: attribute.is_required };

  let visible = false;
  let required = false;

  // Group by effect
  const showDeps = attrDeps.filter(d => d.effect === 'show');
  const hideDeps = attrDeps.filter(d => d.effect === 'hide');
  const requireDeps = attrDeps.filter(d => d.effect === 'require');

  // Evaluate a single dependency condition
  const evalCondition = (dep) => {
    const { depends_on_attribute_id, operator, dependency_value } = dep;
    const fieldValue = allValues?.attrs?.[depends_on_attribute_id] ?? allValues?.[depends_on_attribute_id];
    const depVal = dependency_value;

    switch (operator) {
      case 'equals':     return fieldValue === depVal;
      case 'not_equals': return fieldValue !== depVal;
      case 'exists':     return !!fieldValue;
      case 'not_exists': return !fieldValue;
      case 'contains':   return String(fieldValue || '').toLowerCase().includes(String(depVal || '').toLowerCase());
      case 'in':         return Array.isArray(depVal) ? depVal.includes(fieldValue) : false;
      case 'not_in':     return Array.isArray(depVal) ? !depVal.includes(fieldValue) : true;
      case 'greater_than': return Number(fieldValue) > Number(depVal);
      case 'less_than':  return Number(fieldValue) < Number(depVal);
      default:           return false;
    }
  };

  // If there are show deps, ALL must pass for visibility
  if (showDeps.length > 0) {
    visible = showDeps.every(evalCondition);
  } else {
    visible = hideDeps.length > 0 ? !hideDeps.every(evalCondition) : true;
  }

  // Check require deps — field becomes required if at least one 'require' dep matches
  if (requireDeps.length > 0) {
    required = requireDeps.some(evalCondition);
  } else {
    required = attribute.is_required;
  }

  return { visible, required };
}

// ─── Individual Field Renderer ───────────────────────────────────────────────
function FieldRenderer({ attribute, required, register, control, allValues, lookupCache, fetchLookup }) {
  const fieldName = `attrs.${attribute.id}`;
  const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground';
  const labelClass = 'text-sm font-semibold text-foreground mb-1.5 inline-flex items-center gap-1';

  // Determine options for this field
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (!attribute.lookup_type) return;

    // For dependent lookups (e.g. Models depend on Make), find the parent attribute id
    // The parent value is stored in allValues.attrs[parentAttributeId]
    // We detect this by looking at attribute name patterns
    const parentVal = attribute.name === 'model' ? (allValues?.attrs?.make_attr_id || null) : null;

    setLoadingOptions(true);
    fetchLookup(attribute.lookup_type, null).then(data => {
      setOptions(data.map(d => d.value));
      setLoadingOptions(false);
    });
  }, [attribute.lookup_type, attribute.id]);

  // If attribute has static options stored as JSON
  const staticOptions = useMemo(() => {
    if (attribute.lookup_type) return options;
    if (attribute.options) {
      try {
        return typeof attribute.options === 'string'
          ? JSON.parse(attribute.options)
          : attribute.options;
      } catch { return []; }
    }
    return [];
  }, [attribute.options, options, attribute.lookup_type]);

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
              placeholder={attribute.placeholder || `Select ${attribute.label}`}
              {...register(fieldName, validationRules)}
            >
              <option value="">{attribute.placeholder || `Select ${attribute.label}`}</option>
              {staticOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
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
              {staticOptions.map(opt => {
                const isSelected = Array.isArray(field.value) && field.value.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(field.value) ? field.value : [];
                      field.onChange(isSelected ? current.filter(i => i !== opt) : [...current, opt]);
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {opt}
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
              {staticOptions.map(opt => {
                const isSelected = field.value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => field.onChange(isSelected ? '' : opt)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {opt}
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
          placeholder={attribute.placeholder || attribute.min_value != null ? `Min: ${attribute.min_value}` : `Enter ${attribute.label.toLowerCase()}`}
          min={attribute.min_value ?? undefined}
          max={attribute.max_value ?? undefined}
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
  const [lookupCache, setLookupCache] = useState({});

  // Reactive watch on all form values for dependency evaluation
  const allValues = useWatch({ control });

  // Fetch lookup values with caching
  const fetchLookup = useCallback(async (lookupType, parentId = null) => {
    const cacheKey = `${lookupType}::${parentId || 'root'}`;
    if (lookupCache[cacheKey]) return lookupCache[cacheKey];

    const data = await getLookupValues(lookupType, parentId);
    setLookupCache(prev => ({ ...prev, [cacheKey]: data }));
    return data;
  }, [lookupCache]);

  // Fetch metadata from Supabase when category changes
  useEffect(() => {
    if (!categorySlug) {
      setMetadata(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getCategoryMetadata(categorySlug).then(data => {
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

  // Group visible attributes by their group
  const groupedAttributes = useMemo(() => {
    if (!metadata) return [];
    return metadata.groups.map(group => ({
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
            lookupCache={lookupCache}
            fetchLookup={fetchLookup}
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
