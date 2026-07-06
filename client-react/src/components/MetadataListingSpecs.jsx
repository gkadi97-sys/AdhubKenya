import { useMemo, useState } from 'react';
import { useMetadataCache } from '@/lib/useMetadataCache';

export default function MetadataListingSpecs({ listing }) {
  const metadata = useMetadataCache(listing.category);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Parse legacy arrays in specs for multiselect rendering
  const getDisplayValue = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
  };

  const { groups, ungrouped } = useMemo(() => {
    if (!metadata || !metadata.attributes || !listing) return { groups: [], ungrouped: [] };

    // Find all populated attributes in the listing
    const populatedAttributes = metadata.attributes.filter(attr => {
      if (attr.is_hidden) return false;
      
      const val = listing[attr.name] !== undefined ? listing[attr.name] : (listing.specs && listing.specs[attr.name]);
      if (val === undefined || val === null || val === '' || String(val).toLowerCase() === 'n/a') return false;
      return true;
    });

    const groupsMap = new Map();
    metadata.groups.forEach(g => groupsMap.set(g.id, { ...g, fields: [] }));

    const ungroupedFields = [];

    populatedAttributes.forEach(attr => {
      const val = listing[attr.name] !== undefined ? listing[attr.name] : listing.specs[attr.name];
      const displayData = {
        id: attr.id,
        label: attr.label,
        value: getDisplayValue(val),
        isBoolean: attr.field_type === 'boolean' || val === true || val === 'Yes'
      };

      if (attr.group_id && groupsMap.has(attr.group_id)) {
        groupsMap.get(attr.group_id).fields.push(displayData);
      } else {
        ungroupedFields.push(displayData);
      }
    });

    const activeGroups = Array.from(groupsMap.values())
      .filter(g => g.fields.length > 0)
      .sort((a, b) => a.order_index - b.order_index);

    return { groups: activeGroups, ungrouped: ungroupedFields };
  }, [metadata, listing]);

  if (!metadata) {
    // Loading skeleton
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 animate-pulse h-48" />
    );
  }

  if (groups.length === 0 && ungrouped.length === 0) return null;

  const renderGroup = (title, fields, keyPrefix) => {
    const booleans = fields.filter(f => f.isBoolean);
    const keyValues = fields.filter(f => !f.isBoolean);

    return (
      <div key={keyPrefix} className="rounded-2xl border border-border bg-card p-5 sm:p-7 mb-6">
        {title && (
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-primary">📋</span> {title}
          </h3>
        )}

        {/* Key-Value Grid */}
        {keyValues.length > 0 && (
          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border mb-4">
            {(showAllSpecs ? keyValues : keyValues.slice(0, 12)).map(item => (
              <div key={item.id} className="bg-background px-4 py-2 flex flex-col justify-center min-h-[44px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</span>
                <span className="font-semibold text-sm text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Boolean Features Grid (Chips) */}
        {booleans.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {booleans.map(f => (
              <span key={f.id} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary text-foreground">
                ✓ {f.label}
              </span>
            ))}
          </div>
        )}

        {keyValues.length > 12 && (
          <button 
            onClick={() => setShowAllSpecs(!showAllSpecs)}
            className="mt-3 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            {showAllSpecs ? 'Hide full specifications' : `View all ${keyValues.length} specifications`}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {groups.map(g => renderGroup(g.name, g.fields, g.id))}
      {ungrouped.length > 0 && renderGroup('Other Details', ungrouped, 'ungrouped')}
    </>
  );
}
