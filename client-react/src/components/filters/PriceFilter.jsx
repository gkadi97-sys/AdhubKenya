import { useState, useEffect } from 'react';

const PRESETS = [
  { label: 'Under 10k', min: '', max: '10000' },
  { label: '10k - 50k', min: '10000', max: '50000' },
  { label: '50k - 100k', min: '50000', max: '100000' },
  { label: '100k - 500k', min: '100000', max: '500000' },
  { label: '500k+', min: '500000', max: '' },
];

export default function PriceFilter({ min = '', max = '', onChange }) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  // Sync with external resets
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
    setLocalMin(min);
    setLocalMax(max);
  }, [min, max]);

  const handleBlur = () => {
    let cleanMin = localMin ? parseInt(localMin.replace(/\D/g, ''), 10) : '';
    let cleanMax = localMax ? parseInt(localMax.replace(/\D/g, ''), 10) : '';

    // Validation min <= max
    if (cleanMin && cleanMax && cleanMin > cleanMax) {
      // Swap if user put them backwards
      const temp = cleanMin;
      cleanMin = cleanMax;
      cleanMax = temp;
      setLocalMin(cleanMin.toString());
      setLocalMax(cleanMax.toString());
    }

    onChange('minPrice', cleanMin ? cleanMin.toString() : '');
    onChange('maxPrice', cleanMax ? cleanMax.toString() : '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const applyPreset = (preset) => {
    setLocalMin(preset.min);
    setLocalMax(preset.max);
    onChange('minPrice', preset.min);
    onChange('maxPrice', preset.max);
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">KSh</span>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${inputClass} pl-10`}
          />
        </div>
        <span className="text-muted-foreground">—</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">KSh</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const isActive = min === p.min && max === p.max;
          return (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
