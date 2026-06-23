import { COUNTIES, getTowns, getAreas } from '@/lib/countyData';
import { ChevronDown } from 'lucide-react';

export default function LocationCascader({ county, town, area, onChange }) {
  const towns = county ? getTowns(county) : [];
  const areas = town ? getAreas(town) : [];

  const handleCountyChange = (e) => {
    const val = e.target.value;
    onChange('county', val);
    // Clearing child values is handled by the parent FilterPanel to ensure URL updates are grouped
  };

  const handleTownChange = (e) => {
    const val = e.target.value;
    onChange('town', val);
  };

  const handleAreaChange = (e) => {
    onChange('area', e.target.value);
  };

  const selectClass = "w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-8";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <select value={county || ''} onChange={handleCountyChange} className={selectClass}>
          <option value="">All Kenya</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {county && towns.length > 0 && (
        <div className="relative animate-in fade-in duration-200">
          <select value={town || ''} onChange={handleTownChange} className={selectClass}>
            <option value="">All Towns in {county}</option>
            {towns.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      )}

      {town && areas.length > 0 && (
        <div className="relative animate-in fade-in duration-200">
          <select value={area || ''} onChange={handleAreaChange} className={selectClass}>
            <option value="">All Areas in {town}</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
