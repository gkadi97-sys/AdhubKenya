import { CATEGORY_ATTRIBUTES } from './src/lib/categoryData.js';

function getLevel3Options(categorySlug, level1Value, level2Value, filters = {}) {
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

console.log(getLevel3Options('phones-tablets', 'Mobile Phones', 'Samsung'));
