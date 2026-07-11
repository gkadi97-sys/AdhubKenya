import { useState } from 'react';
import { VEHICLE_ACCESSORIES_DATA } from '@/lib/vehicleAccessoriesData';
import { CATEGORY_ATTRIBUTES } from '@/lib/categoryData';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

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
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-bold text-primary">✨ Accessory Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">Accessory Category <span className="text-destructive">*</span></label>
          <select className={inputClass} value={category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {category && (
          <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
            <label className="text-sm font-semibold text-foreground">Subcategory <span className="text-destructive">*</span></label>
            <select className={inputClass} value={subcategory} onChange={handleSubcategoryChange} required>
              <option value="">Select Subcategory</option>
              {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {subcategory && (
          <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
            <label className="text-sm font-semibold text-foreground">Accessory Item <span className="text-destructive">*</span></label>
            <select className={inputClass} value={item} onChange={handleItemChange} required>
              <option value="">Select Item</option>
              {items.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* COMPATIBILITY SECTION */}
      {item && (
        <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-4 animate-in fade-in duration-300">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <span>🔗</span> Vehicle Compatibility
          </h4>
          
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <input type="radio" name="universal" checked={universal === true} onChange={() => handleUniversalChange(true)} className="h-4 w-4 accent-primary" />
              Universal (Fits all / most vehicles)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <input type="radio" name="universal" checked={universal === false} onChange={() => handleUniversalChange(false)} className="h-4 w-4 accent-primary" />
              Specific Vehicle Only
            </label>
          </div>

          {!universal && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Vehicle Type</label>
                <select className={inputClass} value={vehicleType} onChange={e => { setVehicleType(e.target.value); emit({vehicleType: e.target.value}); }}>
                  <option value="">Any Type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup / Truck">Pickup / Truck</option>
                  <option value="Van">Van / Minivan</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Vehicle Make</label>
                <select className={inputClass} value={make} onChange={handleMakeChange}>
                  <option value="">Any Make</option>
                  {makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {make && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Vehicle Model</label>
                  <select className={inputClass} value={model} onChange={e => { setModel(e.target.value); emit({model: e.target.value}); }}>
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
