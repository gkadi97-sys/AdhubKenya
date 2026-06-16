'use client';
import { useState, useEffect } from 'react';
import { COUNTIES, getTowns } from '@/lib/countyData';

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
  const towns = getTowns(county);

  // Parse incoming value on mount / when value changes externally
  useEffect(() => {
    if (value && value.includes(',')) {
      const parts = value.split(',');
      setTown(parts[0].trim());
      setCounty(parts[1].trim());
    } else if (value) {
      setCounty(value);
      setTown('');
    }
  }, []);

  const handleCountyChange = (e) => {
    const newCounty = e.target.value;
    setCounty(newCounty);
    setTown('');
    onChange(newCounty); // emit county only until town is selected
  };

  const handleTownChange = (e) => {
    const newTown = e.target.value;
    setTown(newTown);
    onChange(newTown ? `${newTown}, ${county}` : county);
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
          {showLabel && <label className="form-label">Town / Area</label>}
          <select
            className="form-control"
            value={town}
            onChange={handleTownChange}
          >
            <option value="">Select Town / Area</option>
            {towns.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {town && (
            <div style={{
              marginTop: 8, fontSize: '0.8rem', color: 'var(--primary-light)',
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              📍 <strong>{town}, {county}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
