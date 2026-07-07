export function validateMetadata(metadata) {
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

export function evaluateDependencies(attribute, dependencies, allValues) {
  const attrDeps = dependencies.filter(d => d.attribute_id === attribute.id);
  if (attrDeps.length === 0) return { visible: true, required: attribute.is_required };

  let visible = false;
  let required = false;

  const showDeps    = attrDeps.filter(d => d.effect === 'show' || d.effect === 'cascade'); // Cascade acts as show
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
