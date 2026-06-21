'use client';
import { useState, useEffect } from 'react';
import { COUNTIES, getTowns, getAreas } from '@/lib/countyData';

/**
 * CountyTownSelect — cascading county → town selector
 *
 * Props:
 *   value       : current location string e.g. "Athi River, Machakos"
 *   onChange    : callback(locationString) called when county or town changes
 *   required    : bool
 *   showLabel   : bool (default true)
 */
export default function CountyTownSelect({ value = '', onChange, required = false, showLabel = true }) {
  const [county, setCounty] = useState('');
  const [town, setTown] = useState('');
  const [area, setArea] = useState('');

  const towns = getTowns(county);
  const areas = getAreas(county, town);

  // Parse incoming value on mount / when value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split(',').map(s => s.trim());
      if (parts.length === 3) {
        setArea(parts[0]);
        setTown(parts[1]);
        setCounty(parts[2]);
      } else if (parts.length === 2) {
        setArea('');
        setTown(parts[0]);
        setCounty(parts[1]);
      } else {
        setArea('');
        setTown('');
        setCounty(parts[0]);
      }
    } else {
      setCounty('');
      setTown('');
      setArea('');
    }
  }, [value]);

  const handleCountyChange = (e) => {
    const newCounty = e.target.value;
    setCounty(newCounty);
    setTown('');
    setArea('');
    onChange(newCounty); // emit county only until town is selected
  };

  const handleTownChange = (e) => {
    const newTown = e.target.value;
    setTown(newTown);
    setArea('');
    onChange(newTown ? `${newTown}, ${county}` : county);
  };

  const handleAreaChange = (e) => {
    const newArea = e.target.value;
    setArea(newArea);
    if (newArea) {
      onChange(`${newArea}, ${town}, ${county}`);
    } else {
      onChange(`${town}, ${county}`);
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block";

  return (
    <div className="flex flex-col gap-4">
      {/* County Select */}
      <div>
        {showLabel && <label className={labelClass}>County *</label>}
        <select
          className={inputClass}
          value={county}
          onChange={handleCountyChange}
          required={required}
        >
          <option value="">Select County</option>
          {COUNTIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Town Select — only shown once a county is picked */}
      {county && (
        <div className="animate-in fade-in duration-300">
          {showLabel && <label className={labelClass}>Town / City</label>}
          <select
            className={inputClass}
            value={town}
            onChange={handleTownChange}
            required={required}
          >
            <option value="">Select Town / City</option>
            {towns.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      {/* Area Select — only shown once a town is picked AND it has areas */}
      {town && areas.length > 0 && (
        <div className="animate-in fade-in duration-300">
          {showLabel && <label className={labelClass}>Area / Estate</label>}
          <select
            className={inputClass}
            value={area}
            onChange={handleAreaChange}
          >
            <option value="">Select Area / Estate (Optional)</option>
            {areas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      )}

      {/* Dynamic Location Pin Feedback */}
      {(town || county) && (
        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
          📍 <span>{area ? `${area}, ` : ''}{town ? `${town}, ` : ''}{county}</span>
        </div>
      )}
    </div>
  );
}
