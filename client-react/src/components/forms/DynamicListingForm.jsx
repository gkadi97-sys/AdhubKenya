import { useMemo, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { getDynamicOptions } from '@/lib/categoryData'; // We will create this

export default function DynamicListingForm({ category, register, control, watch, setValue }) {
  const schema = ATTRIBUTE_ENGINE[category] || ATTRIBUTE_ENGINE.default;
  const { groups, attributes } = schema;

  const checkSingleDependency = (dep) => {
    if (dep.and) {
      return dep.and.every(d => checkSingleDependency(d));
    }
    const { field, value, notValue } = dep;
    const parentValue = watch(`attrs.${field}`);
    
    if (!parentValue) return false;
    
    if (Array.isArray(value)) {
      if (!value.includes(parentValue)) return false;
    } else if (value && parentValue !== value) {
      return false;
    }

    if (notValue && parentValue === notValue) return false;
    
    return true;
  };

  // Helper to evaluate cascading dependencies
  const checkDependencies = (dependsOn) => {
    if (!dependsOn) return true;
    if (Array.isArray(dependsOn)) {
      return dependsOn.some(dep => checkSingleDependency(dep));
    }
    return checkSingleDependency(dependsOn);
  };

  const visibleAttributes = useMemo(() => {
    return attributes.filter(attr => {
      if (!attr.postAd) return false;
      // Use postAd-specific dependency if defined (e.g. make field varies between posting and discovery)
      const dep = attr.postAd.dependsOn !== undefined ? attr.postAd.dependsOn : attr.dependsOn;
      return checkDependencies(dep);
    });
  }, [attributes, watch()]); 

  // Group the visible attributes
  const attributesByGroup = useMemo(() => {
    const grouped = {};
    groups.forEach(g => { grouped[g.id] = []; });
    
    visibleAttributes.forEach(attr => {
      if (attr.postAd && attr.postAd.group) {
        if (!grouped[attr.postAd.group]) grouped[attr.postAd.group] = [];
        grouped[attr.postAd.group].push(attr);
      }
    });
    
    return grouped;
  }, [visibleAttributes, groups]);

  if (!groups || groups.length === 0) return null;

  return (
    <div className="space-y-8">
      {groups.map(group => {
        const groupFields = attributesByGroup[group.id];
        if (!groupFields || groupFields.length === 0) return null;

        return (
          <div key={group.id} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold">{group.title}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {groupFields.map(attr => {
                
                // Fetch dynamic options if needed
                let options = attr.options;
                if (attr.type === 'dynamic-select' || attr.type === 'dynamic-cascade') {
                    // For dynamic-cascade, the data parent is cascadeParent.
                    // For dynamic-select, it might be dependsOn.field.
                    const parentField = attr.cascadeParent || (attr.dependsOn && attr.dependsOn.field);
                    const parentValue = parentField ? watch(`attrs.${parentField}`) : null;
                    options = getDynamicOptions(category, attr.id, parentValue);
                    
                    if (!options || options.length === 0) {
                        return null; // Hide the field entirely if there are no dynamic options applicable
                    }
                }

                return (
                  <div key={attr.id} className="space-y-2">
                    <label className="text-sm font-medium">
                      {attr.label} {attr.postAd.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {attr.postAd.uiType === 'select' && (
                      <select
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        {...register(`attrs.${attr.id}`, { required: attr.postAd.required ? 'This field is required' : false })}
                      >
                        <option value="">Select {attr.label}</option>
                        {options?.map(opt => (
                          <option key={opt} value={opt}>
                            {attr.optionLabels?.[opt] || opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {attr.postAd.uiType === 'radio' && options && (
                      <div className="flex flex-wrap gap-3">
                        {options.map(opt => (
                          <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm hover:bg-muted focus-within:border-primary">
                            <input
                              type="radio"
                              value={opt}
                              className="accent-primary"
                              {...register(`attrs.${attr.id}`, { required: attr.postAd.required ? 'This field is required' : false })}
                            />
                            {attr.optionLabels?.[opt] || opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {attr.postAd.uiType === 'multicheck' && options && (
                      <Controller
                        name={`attrs.${attr.id}`}
                        control={control}
                        rules={{ required: attr.postAd.required ? 'Select at least one' : false }}
                        render={({ field }) => (
                          <div className="flex flex-wrap gap-3">
                            {options.map(opt => {
                              const isSelected = Array.isArray(field.value) && field.value.includes(opt);
                              return (
                                <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted'}`}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const current = Array.isArray(field.value) ? field.value : [];
                                      const next = e.target.checked 
                                        ? [...current, opt]
                                        : current.filter(item => item !== opt);
                                      field.onChange(next);
                                    }}
                                    className="accent-primary"
                                  />
                                  {opt}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      />
                    )}

                    {attr.postAd.uiType === 'number' && (
                      <input
                        type="number"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder={`Enter ${attr.label.toLowerCase()}`}
                        {...register(`attrs.${attr.id}`, { required: attr.postAd.required ? 'This field is required' : false })}
                      />
                    )}

                    {attr.postAd.uiType === 'text' && (
                      <input
                        type="text"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder={`Enter ${attr.label.toLowerCase()}`}
                        {...register(`attrs.${attr.id}`, { required: attr.postAd.required ? 'This field is required' : false })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
