import { useState, useEffect } from 'react';
import { VEHICLE_ACCESSORIES_DATA } from '@/lib/vehicleAccessoriesData';
import { CATEGORY_ATTRIBUTES } from '@/lib/categoryData';

export default function VehicleAccessoriesForm({ values = {}, onChange }) {
  const [category, setCategory] = useState(values.category || '');
  const [subcategory, setSubcategory] = useState(values.subcategory || '');
  const [item, setItem] = useState(values.item || '');
  const [universal, setUniversal] = useState(values.universal ?? true);
  const [make, setMake] = useState(values.make || '');
  const [model, setModel] = useState(values.model || '');
  const [vehicleType, setVehicleType] = useState(values.vehicleType || '');

  const emit = (overrides) => {
    onChange({
      category, subcategory, item, universal, make, model, vehicleType,
      ...overrides
    });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val); setSubcategory(''); setItem('');
    emit({ category: val, subcategory: '', item: '' });
  };

  const handleSubcategoryChange = (e) => {
    const val = e.target.value;
    setSubcategory(val); setItem('');
    emit({ subcategory: val, item: '' });
  };

  const handleItemChange = (e) => {
    const val = e.target.value;
    setItem(val);
    emit({ item: val });
  };

  const handleUniversalChange = (val) => {
    setUniversal(val);
    if (val) {
      setMake(''); setModel(''); setVehicleType('');
      emit({ universal: val, make: '', model: '', vehicleType: '' });
    } else {
      emit({ universal: val });
    }
  };

  const handleMakeChange = (e) => {
    const val = e.target.value;
    setMake(val); setModel('');
    emit({ make: val, model: '' });
  };

  const categories = Object.keys(VEHICLE_ACCESSORIES_DATA);
  const subcategories = category ? Object.keys(VEHICLE_ACCESSORIES_DATA[category]) : [];
  const items = subcategory ? VEHICLE_ACCESSORIES_DATA[category][subcategory] : [];
  
  const vehicleData = CATEGORY_ATTRIBUTES.vehicles.data;
  const makes = Object.keys(vehicleData);
  const models = make ? (vehicleData[make] || []) : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--primary)' }}>✨ Accessory Details</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Accessory Category *</label>
          <select className="form-control" value={category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {category && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Subcategory *</label>
            <select className="form-control" value={subcategory} onChange={handleSubcategoryChange} required>
              <option value="">Select Subcategory</option>
              {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {subcategory && (
          <div className="form-group" style={{marginBottom:0, animation:'fadeIn 0.2s ease'}}>
            <label className="form-label">Accessory Item *</label>
            <select className="form-control" value={item} onChange={handleItemChange} required>
              <option value="">Select Item</option>
              {items.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* COMPATIBILITY SECTION */}
      {item && (
        <div style={{ marginTop: 12, padding: 16, background: 'var(--bg-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', animation:'fadeIn 0.3s ease' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔗</span> Vehicle Compatibility
          </h4>
          
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="radio" name="universal" checked={universal === true} onChange={() => handleUniversalChange(true)} />
              Universal (Fits all / most vehicles)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="radio" name="universal" checked={universal === false} onChange={() => handleUniversalChange(false)} />
              Specific Vehicle Only
            </label>
          </div>

          {!universal && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeIn 0.2s ease' }}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Vehicle Type</label>
                <select className="form-control" value={vehicleType} onChange={e => { setVehicleType(e.target.value); emit({vehicleType: e.target.value}); }}>
                  <option value="">Any Type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup / Truck">Pickup / Truck</option>
                  <option value="Van">Van / Minivan</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>

              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Vehicle Make</label>
                <select className="form-control" value={make} onChange={handleMakeChange}>
                  <option value="">Any Make</option>
                  {makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {make && (
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">Vehicle Model</label>
                  <select className="form-control" value={model} onChange={e => { setModel(e.target.value); emit({model: e.target.value}); }}>
                    <option value="">Any Model</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
