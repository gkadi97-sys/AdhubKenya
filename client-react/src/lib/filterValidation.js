/**
 * filterValidation.js
 * ===================
 * Core engine for dependent filter validation. 
 * Reads the current filter state and looks up allowed configurations from MODEL_SPECS.
 */

import { MODEL_SPECS } from './modelSpecs';
import { getCascadeConfig } from './filterEngine';

/**
 * Helper to determine the level 1 and level 2 values based on current filters and category.
 * In our modelSpecs.js, Level 1 is always the Brand/Make, and Level 2 is always the Model.
 */
function getActiveLevels(categorySlug, filters) {
  const l1Value = filters.brand || filters.make;
  const l2Value = filters.model;
  
  return { l1: l1Value, l2: l2Value };
}

/**
 * Returns an array of valid string options for a given attribute, 
 * OR null if there are no constraints (meaning all options are valid).
 * 
 * @param {string} categorySlug - e.g., 'phones-tablets'
 * @param {object} filters - the current active filter state
 * @param {string} attrId - the attribute being queried (e.g., 'ram', 'os')
 * @returns {string[] | null}
 */
export function getValidOptions(categorySlug, filters, attrId) {
  const specTree = MODEL_SPECS[categorySlug];
  if (!specTree) return null;

  const { l1, l2 } = getActiveLevels(categorySlug, filters);
  if (!l1 || !l2) return null; // We need at least Brand and Model selected to enforce constraints

  const level1Node = specTree[l1];
  if (!level1Node) return null;

  const modelSpecs = level1Node[l2];
  if (!modelSpecs) return null;

  const allowedValues = modelSpecs[attrId];
  if (!allowedValues || !Array.isArray(allowedValues)) return null;

  return allowedValues;
}

/**
 * Iterates through all current filters and removes any that violate the MODEL_SPECS constraints.
 * 
 * @param {string} categorySlug 
 * @param {object} filters 
 * @returns {object} - A new cleaned filters object and a boolean indicating if changes were made.
 */
export function cleanInvalidFilters(categorySlug, filters) {
  const cleaned = { ...filters };
  let changed = false;

  const { l1, l2 } = getActiveLevels(categorySlug, filters);
  // Only clean if both parent and child (e.g. Brand and Model) are present.
  // If user only selected Brand, we don't enforce model-level strictness yet.
  if (!l1 || !l2) return { cleaned, changed };

  const specTree = MODEL_SPECS[categorySlug];
  if (!specTree) return { cleaned, changed };

  const modelSpecs = specTree[l1]?.[l2];
  if (!modelSpecs) return { cleaned, changed };

  // Check every filter key that isn't part of the cascade hierarchy itself
  const config = getCascadeConfig(categorySlug, filters.subcategory || filters.bodyType);
  const cascadeKeys = [config?.level1, config?.level2, config?.level3, 'subcategory', 'bodyType'];

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || cascadeKeys.includes(key)) return; // Skip empty and cascade structural keys

    const allowedValues = modelSpecs[key];
    
    // If there is an allowed list for this attribute and the current value is NOT in it:
    if (allowedValues && Array.isArray(allowedValues)) {
      if (!allowedValues.includes(value)) {
        delete cleaned[key];
        changed = true;
      }
    }
  });

  return { cleaned, changed };
}
