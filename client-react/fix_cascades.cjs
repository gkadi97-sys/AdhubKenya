const fs = require('fs');

let content = fs.readFileSync('src/lib/attributeEngine.js', 'utf8');

// Property
content = content.replace(
    /id: 'propertyCategory',\s*label: 'Property Category',\s*type: 'dynamic-select',/g,
    "id: 'propertyCategory',\n        label: 'Property Category',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,"
);
content = content.replace(
    /id: 'propertyType',\s*label: 'Property Type',\s*type: 'dynamic-select',/g,
    "id: 'propertyType',\n        label: 'Property Type',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'propertyCategory',"
);

// Phones-Tablets
content = content.replace(
    /id: 'brand',\s*label: 'Brand',\s*type: 'dynamic-select',/g,
    "id: 'brand',\n        label: 'Brand',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,"
);
content = content.replace(
    /id: 'series',\s*label: 'Series',\s*type: 'dynamic-select',/g,
    "id: 'series',\n        label: 'Series',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'brand',"
);
content = content.replace(
    /id: 'model',\s*label: 'Model',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'series' \},/g,
    "id: 'model',\n        label: 'Model',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'series',\n        dependsOn: { field: 'series' },"
);

// Electronics
content = content.replace(
    /id: 'subcategory',\s*label: 'Category',\s*type: 'dynamic-select',/g,
    "id: 'subcategory',\n        label: 'Category',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,"
);
content = content.replace(
    /id: 'brand',\s*label: 'Brand',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'subcategory'(.*?)\}/g,
    "id: 'brand',\n        label: 'Brand',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'subcategory',\n        dependsOn: { field: 'subcategory'$1}"
);
content = content.replace(
    /id: 'series',\s*label: 'Series',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'brand' \},/g,
    "id: 'series',\n        label: 'Series',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'brand',\n        dependsOn: { field: 'brand' },"
);
content = content.replace(
    /id: 'model',\s*label: 'Model',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'brand' \},/g,
    "id: 'model',\n        label: 'Model',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'brand',\n        dependsOn: { field: 'brand' },"
);
content = content.replace(
    /id: 'equipmentType',\s*label: 'Equipment Type',\s*type: 'dynamic-select',/g,
    "id: 'equipmentType',\n        label: 'Equipment Type',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'subcategory',"
);

// Finally replace all uiType: 'dynamic-select' with uiType: 'dynamic-cascade'
content = content.replace(/uiType: 'dynamic-select'/g, "uiType: 'dynamic-cascade'");

fs.writeFileSync('src/lib/attributeEngine.js', content);
console.log('Done!');
