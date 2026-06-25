/**
 * filterEngine.js
 * ===============
 * Pure utility that derives cascade filter options directly from CATEGORY_ATTRIBUTES
 * in categoryData.js. This is the single source of truth — the same data drives
 * both the posting form AND the buyer filter sidebar.
 *
 * No duplication. When categoryData.js gets a new brand/model, filters update automatically.
 */

import { CATEGORY_ATTRIBUTES, TV_SPECS, AUDIO_SPECS, VEHICLE_MAKES_BY_TYPE } from './categoryData';
import { MASTER_SPARE_PARTS, MASTER_ACCESSORIES } from './autoSparesData';
import { LAPTOP_DATA } from './laptopPhoneData';

/**
 * Helper to route electronics subcategories to their specific data structures.
 */
function getElectronicsTree(subcategory) {
  if (subcategory === 'Laptops & Computers') return LAPTOP_DATA.hierarchy;
  if (subcategory === 'Televisions') return TV_SPECS.hierarchy;
  if (subcategory === 'Audio & Music') return AUDIO_SPECS.hierarchy;
  return null;
}

export function getCascadeConfig(categorySlug, subcategory) {
  if (categorySlug === 'electronics') {
    if (subcategory === 'Laptops & Computers') return { level1: 'brand', level2: 'series', level3: 'model' };
    if (subcategory === 'Televisions') return { level1: 'brand', level2: 'series', level3: 'model' };
    if (subcategory === 'Audio & Music') return { level1: 'equipmentType', level2: 'brand', level3: 'series' };
  }
  return CASCADE_URL_PARAMS[categorySlug];
}

export function getLevel1Options(categorySlug, filters = {}, attrId = null) {
  let subcategory = null;
  if (categorySlug === 'electronics') subcategory = filters.subcategory;
  if (categorySlug === 'vehicles') subcategory = filters.bodyType;

  if (categorySlug === 'auto-spares') {
    if (attrId === 'make') return Object.keys(CATEGORY_ATTRIBUTES.vehicles.data || {});
    if (filters.listingType === 'accessory' || attrId === 'category') return Object.keys(MASTER_ACCESSORIES);
    return Object.keys(MASTER_SPARE_PARTS);
  }

  if (categorySlug === 'electronics' && subcategory) {
    const tree = getElectronicsTree(subcategory);
    if (tree) return Object.keys(tree);
  }

  if (categorySlug === 'vehicles') {
    if (subcategory && VEHICLE_MAKES_BY_TYPE[subcategory]) {
      return Object.keys(VEHICLE_MAKES_BY_TYPE[subcategory]);
    }
  }

  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];
  return Object.keys(tree.data);
}

export function getLevel2Options(categorySlug, level1Value, filters = {}, attrId = null) {
  if (!level1Value) return [];
  let subcategory = null;
  if (categorySlug === 'electronics') subcategory = filters.subcategory;
  if (categorySlug === 'vehicles') subcategory = filters.bodyType;
  
  if (categorySlug === 'auto-spares') {
    if (attrId === 'model' || (filters.make && level1Value === filters.make)) {
      return CATEGORY_ATTRIBUTES.vehicles.data?.[level1Value] || [];
    }
    if (filters.listingType === 'accessory' || attrId === 'subcategory') {
      const data = MASTER_ACCESSORIES[level1Value];
      return data ? Object.keys(data) : [];
    }
    return MASTER_SPARE_PARTS[level1Value] || [];
  }

  if (categorySlug === 'electronics' && subcategory) {
    const tree = getElectronicsTree(subcategory);
    if (!tree) return [];
    if (subcategory === 'Audio & Music') {
      // Audio: level1 is equipmentType (e.g. Soundbar), level2 is brand
      return tree[level1Value]?.brands || [];
    } else {
      // Laptops & TVs: level1 is brand, level2 is series
      return tree[level1Value]?.series || [];
    }
  }

  if (categorySlug === 'vehicles') {
    if (subcategory && VEHICLE_MAKES_BY_TYPE[subcategory]) {
      return VEHICLE_MAKES_BY_TYPE[subcategory][level1Value] || [];
    }
  }

  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];

  const level1Data = tree.data[level1Value];
  if (!level1Data) return [];

  if (Array.isArray(level1Data)) return level1Data;
  return Object.keys(level1Data);
}

export function getLevel3Options(categorySlug, level1Value, level2Value, filters = {}) {
  if (!level1Value || !level2Value) return [];
  let subcategory = null;
  if (categorySlug === 'electronics') subcategory = filters.subcategory;
  if (categorySlug === 'vehicles') subcategory = filters.bodyType;

  if (categorySlug === 'auto-spares' && filters.listingType === 'accessory') {
    const data = MASTER_ACCESSORIES[level1Value];
    if (data && data[level2Value]) {
      return data[level2Value];
    }
    return [];
  }

  if (categorySlug === 'electronics' && subcategory) {
    const tree = getElectronicsTree(subcategory);
    if (!tree) return [];
    if (subcategory === 'Audio & Music') {
      // Audio: level1 = equipmentType, level2 = brand, level3 = series
      const brandData = tree[level1Value]?.brandData?.[level2Value];
      return brandData?.series || [];
    } else {
      // Laptops & TVs: level1 = brand, level2 = series, level3 = models
      const modelsData = tree[level1Value]?.models?.[level2Value];
      if (Array.isArray(modelsData)) return modelsData;
      return [];
    }
  }

  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return [];

  const level1Data = tree.data[level1Value];
  if (!level1Data || Array.isArray(level1Data)) return [];

  const level2Data = level1Data[level2Value];
  if (!level2Data) return [];
  if (Array.isArray(level2Data)) return level2Data;
  return Object.keys(level2Data);
}

export function getCascadeLabels(categorySlug, subcategory) {
  if (categorySlug === 'electronics' && subcategory) {
    if (subcategory === 'Audio & Music') return { level1Label: 'Equipment', level2Label: 'Brand', level3Label: 'Series' };
    if (subcategory === 'Laptops & Computers') return { level1Label: 'Brand', level2Label: 'Series', level3Label: 'Model' };
    if (subcategory === 'Televisions') return { level1Label: 'Brand', level2Label: 'Series', level3Label: 'Model' };
  }
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree) return { level1Label: 'Type', level2Label: 'Model' };
  return {
    level1Label: tree.level1Label || 'Type',
    level2Label: tree.level2Label || 'Model',
    level3Label: 'Variant',
  };
}

export function hasCascadeFilters(categorySlug, subcategory) {
  if (categorySlug === 'electronics' && subcategory) {
    return !!getElectronicsTree(subcategory);
  }
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  return !!(tree && tree.data && Object.keys(tree.data).length > 0);
}

export function getCascadeDepth(categorySlug, subcategory) {
  if (categorySlug === 'electronics' && subcategory) {
    return getElectronicsTree(subcategory) ? 3 : 2;
  }
  const tree = CATEGORY_ATTRIBUTES[categorySlug];
  if (!tree || !tree.data) return 2;

  const firstKey = Object.keys(tree.data)[0];
  if (!firstKey) return 2;
  const firstValue = tree.data[firstKey];
  return (firstValue && !Array.isArray(firstValue) && typeof firstValue === 'object') ? 3 : 2;
}

export const CASCADE_URL_PARAMS = {
  vehicles:       { level1: 'make',        level2: 'model',  level3: null },
  'auto-spares':  { level1: 'partCategory',      level2: 'part',   level3: null },
  'phones-tablets': { level1: 'subcategory', level2: 'brand', level3: 'model' },
  electronics:    { level1: 'subcategory', level2: 'brand',  level3: 'model' },
  'home-furniture': { level1: 'subcategory', level2: 'model', level3: null },
  property:       { level1: 'propertyCategory', level2: 'propertyType',  level3: null },
  fashion:        { level1: 'subcategory', level2: 'model',  level3: null },
  jobs:           { level1: 'subcategory', level2: 'model',  level3: null },
  'animals-pets': { level1: 'animal_type', level2: 'model',  level3: null },
};
