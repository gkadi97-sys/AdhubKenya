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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* County Select */}
      <div>
        {showLabel && <label className="form-label">County *</label>}
        <select
          className="form-control"
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
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {showLabel && <label className="form-label">Town / City</label>}
          <select
            className="form-control"
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
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {showLabel && <label className="form-label">Area / Estate</label>}
          <select
            className="form-control"
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
        <div style={{
          marginTop: 4, fontSize: '0.8rem', color: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          📍 <strong>{area ? `${area}, ` : ''}{town ? `${town}, ` : ''}{county}</strong>
        </div>
      )}
    </div>
  );
}
