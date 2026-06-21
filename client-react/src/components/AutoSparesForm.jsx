import { useState } from 'react';
import SparePartForm from './SparePartForm';
import VehicleAccessoriesForm from './VehicleAccessoriesForm';

export default function AutoSparesForm({ values = {}, onChange }) {
  const [listingType, setListingType] = useState(values.listingType || 'spare-part');

  const handleTypeChange = (type) => {
    setListingType(type);
    onChange({ listingType: type });
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* TOGGLE */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">What are you listing?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
            <input 
              type="radio" 
              name="listingType" 
              value="spare-part" 
              checked={listingType === 'spare-part'} 
              onChange={() => handleTypeChange('spare-part')}
              className="h-4 w-4 rounded-full border-border text-primary focus:ring-primary/40 accent-primary"
            />
            Auto Spare Part
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
            <input 
              type="radio" 
              name="listingType" 
              value="accessory" 
              checked={listingType === 'accessory'} 
              onChange={() => handleTypeChange('accessory')}
              className="h-4 w-4 rounded-full border-border text-primary focus:ring-primary/40 accent-primary"
            />
            Vehicle Accessory
          </label>
        </div>
      </div>

      {listingType === 'spare-part' ? (
        <SparePartForm values={values} onChange={onChange} />
      ) : (
        <VehicleAccessoriesForm values={values} onChange={onChange} />
      )}

    </div>
  );
}
