import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';

const COMMONLY_SELECTED = {
  'Apartment': ['Balcony', 'Parking', 'Lift', 'Security', 'CCTV', 'Fibre Internet'],
  'Office': ['Parking', 'Security', 'CCTV', 'Fibre Internet', 'Lift', 'Generator'],
  'House': ['Garden', 'Parking', 'Security', 'Servant Quarter', 'Fibre Internet'],
  'Bedsitter': ['Security', 'Water 24/7', 'Fibre Internet'],
  // Default fallbacks
  'default': ['Security', 'Parking', 'Fibre Internet', 'CCTV', 'Water 24/7']
};

export default function AmenitiesSearchPicker({ 
  options = [], 
  value = [], 
  onChange, 
  propertyType = '' 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Determine common amenities based on property type
  const commonKeys = COMMONLY_SELECTED[propertyType] || COMMONLY_SELECTED['default'];
  
  // Filter options
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter(opt => opt.value.toLowerCase().includes(lowerSearch));
  }, [options, searchTerm]);

  // Split options into common vs others when not searching
  const { common, others } = useMemo(() => {
    if (searchTerm) return { common: [], others: filteredOptions };
    
    const c = [];
    const o = [];
    options.forEach(opt => {
      if (commonKeys.includes(opt.value)) c.push(opt);
      else o.push(opt);
    });
    return { common: c, others: o };
  }, [options, commonKeys, searchTerm, filteredOptions]);

  const toggleAmenity = (val) => {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(val)) {
      onChange(current.filter(v => v !== val));
    } else {
      onChange([...current, val]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Chips */}
      {Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(val => (
            <div key={val} className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
              <span>{val}</span>
              <button 
                type="button" 
                onClick={() => toggleAmenity(val)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          placeholder="Search amenities (e.g. Pool, Gym, Solar)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Options List */}
      <div className="max-h-60 overflow-y-auto space-y-4 rounded-xl border border-border p-3 bg-muted/20">
        {!searchTerm && common.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Commonly Selected for {propertyType || 'Properties'}</p>
            <div className="flex flex-wrap gap-2">
              {common.map(opt => {
                const isSelected = Array.isArray(value) && value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleAmenity(opt.value)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border bg-background text-foreground hover:border-primary/50'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          {!searchTerm && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">All Amenities</p>}
          <div className="flex flex-wrap gap-2">
            {others.map(opt => {
              const isSelected = Array.isArray(value) && value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleAmenity(opt.value)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {opt.value}
                </button>
              );
            })}
            {others.length === 0 && searchTerm && (
              <p className="text-sm text-muted-foreground p-2">No amenities found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
