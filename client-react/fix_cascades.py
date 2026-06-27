import re

with open('src/lib/attributeEngine.js', 'r') as f:
    content = f.read()

# Property
content = re.sub(
    r"id: 'propertyCategory',\s*label: 'Property Category',\s*type: 'dynamic-select',",
    r"id: 'propertyCategory',\n        label: 'Property Category',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,",
    content
)
content = re.sub(
    r"id: 'propertyType',\s*label: 'Property Type',\s*type: 'dynamic-select',",
    r"id: 'propertyType',\n        label: 'Property Type',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'propertyCategory',",
    content
)

# Phones-Tablets
content = re.sub(
    r"id: 'brand',\s*label: 'Brand',\s*type: 'dynamic-select',",
    r"id: 'brand',\n        label: 'Brand',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,",
    content
)
content = re.sub(
    r"id: 'series',\s*label: 'Series',\s*type: 'dynamic-select',",
    r"id: 'series',\n        label: 'Series',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'brand',",
    content
)
content = re.sub(
    r"id: 'model',\s*label: 'Model',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'series' \},",
    r"id: 'model',\n        label: 'Model',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'series',\n        dependsOn: { field: 'series' },",
    content
)

# Electronics
content = re.sub(
    r"id: 'subcategory',\s*label: 'Category',\s*type: 'dynamic-select',",
    r"id: 'subcategory',\n        label: 'Category',\n        type: 'dynamic-cascade',\n        cascadeLevel: 1,",
    content
)
# For electronics, the brand depends on subcategory but it's really cascadeLevel 2 from subcategory
content = re.sub(
    r"id: 'brand',\s*label: 'Brand',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'subcategory'",
    r"id: 'brand',\n        label: 'Brand',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'subcategory',\n        dependsOn: { field: 'subcategory'",
    content
)
content = re.sub(
    r"id: 'series',\s*label: 'Series',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'brand' \},",
    r"id: 'series',\n        label: 'Series',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'brand',\n        dependsOn: { field: 'brand' },",
    content
)
# Electronics Model (e.g. for Laptops)
content = re.sub(
    r"id: 'model',\s*label: 'Model',\s*type: 'dynamic-select',\s*dependsOn: \{ field: 'brand' \},",
    r"id: 'model',\n        label: 'Model',\n        type: 'dynamic-cascade',\n        cascadeLevel: 3,\n        cascadeParent: 'brand',\n        dependsOn: { field: 'brand' },",
    content
)
content = re.sub(
    r"id: 'equipmentType',\s*label: 'Equipment Type',\s*type: 'dynamic-select',",
    r"id: 'equipmentType',\n        label: 'Equipment Type',\n        type: 'dynamic-cascade',\n        cascadeLevel: 2,\n        cascadeParent: 'subcategory',",
    content
)

# Finally replace all uiType: 'dynamic-select' with uiType: 'dynamic-cascade'
content = content.replace("uiType: 'dynamic-select'", "uiType: 'dynamic-cascade'")

with open('src/lib/attributeEngine.js', 'w') as f:
    f.write(content)

