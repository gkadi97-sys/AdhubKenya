/**
 * filterEngine.js
 * ===============
 * Pure utility that derives cascade filter options directly from CATEGORY_ATTRIBUTES
 * in categoryData.js. This is the single source of truth — the same data drives
 * both the posting form AND the buyer filter sidebar.
 *
 * No duplication. When categoryData.js gets a new brand/model, filters update automatically.
 */

import { CATEGORY_ATTRIBUTES } from './categoryData';

/**
 * Get Level-1 options (e.g. subcategory / system / make depending on category)
 * @param {string} categorySlug  e.g. 'phones-tablets', 'vehicles', 'electronics'
 * @returns {string[]}
 */
export function getLevel1Options(categorySlug) {
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];
  return Object.keys(tree.data);
}

/**
 * Get Level-2 options, dependent on the selected level-1 value.
 * For flat categories (where level-2 data is a plain string[]) returns []
 * since the models are at level-3.
 * @param {string} categorySlug
 * @param {string} level1Value  — selected level-1 option
 * @returns {string[]}
 */
export function getLevel2Options(categorySlug, level1Value) {
  if (!level1Value) return [];
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];

  const level1Data = tree.data[level1Value];
  if (!level1Data) return [];

  // level1Data can be:
  //   string[]  → direct models (vehicles: make → [models])
  //   object    → sub-brands/types (phones: subcategory → {brand: [models]})
  if (Array.isArray(level1Data)) return level1Data;
  return Object.keys(level1Data);
}

/**
 * Get Level-3 options, dependent on level-1 AND level-2 values.
 * Only meaningful for 3-level hierarchies (phones-tablets: subcategory → brand → models).
 * @param {string} categorySlug
 * @param {string} level1Value
 * @param {string} level2Value
 * @returns {string[]}
 */
export function getLevel3Options(categorySlug, level1Value, level2Value) {
  if (!level1Value || !level2Value) return [];
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];

  const level1Data = tree.data[level1Value];
  if (!level1Data || Array.isArray(level1Data)) return [];

  const level2Data = level1Data[level2Value];
  if (!level2Data) return [];
  if (Array.isArray(level2Data)) return level2Data;
  return Object.keys(level2Data);
}

/**
 * Returns human-readable labels for a category's cascade levels.
 * Used to label each cascade dropdown in the sidebar.
 * @param {string} categorySlug
 * @returns {{ level1Label: string, level2Label: string }}
 */
export function getCascadeLabels(categorySlug) {
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree) return { level1Label: 'Type', level2Label: 'Model' };
  return {
    level1Label: tree.level1Label || 'Type',
    level2Label: tree.level2Label || 'Model',
    level3Label: 'Variant',
  };
}

/**
 * Returns true if a given category has cascade filters defined in CATEGORY_ATTRIBUTES.
 * @param {string} categorySlug
 * @returns {boolean}
 */
export function hasCascadeFilters(categorySlug) {
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  return !!(tree && tree.data && Object.keys(tree.data).length > 0);
}

/**
 * Determines the depth of the cascade hierarchy for a given category.
 * depth 2 → level1 + level2 (e.g. vehicles: make + model)
 * depth 3 → level1 + level2 + level3 (e.g. phones: subcategory + brand + model)
 * @param {string} categorySlug
 * @returns {2|3}
 */
export function getCascadeDepth(categorySlug) {
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return 2;

  // Check if any level1 value maps to an object (not array) → depth 3
  const firstKey = Object.keys(tree.data)[0];
  if (!firstKey) return 2;
  const firstValue = tree.data[firstKey];
  return (firstValue && !Array.isArray(firstValue) && typeof firstValue === 'object') ? 3 : 2;
}

/**
 * URL param names used for each cascade level, per category.
 * Matches the param names already used across the app.
 */
export const CASCADE_URL_PARAMS = {
  vehicles:       { level1: 'make',        level2: 'model',  level3: null },
  'auto-spares':  { level1: 'system',      level2: 'part',   level3: null },
  'phones-tablets': { level1: 'subcategory', level2: 'make', level3: 'model' },
  electronics:    { level1: 'subcategory', level2: 'model',  level3: null },
  'home-furniture': { level1: 'subcategory', level2: 'model', level3: null },
  property:       { level1: 'subcategory', level2: 'model',  level3: null },
  fashion:        { level1: 'subcategory', level2: 'model',  level3: null },
  jobs:           { level1: 'subcategory', level2: 'model',  level3: null },
  'animals-pets': { level1: 'animal_type', level2: 'model',  level3: null },
};
