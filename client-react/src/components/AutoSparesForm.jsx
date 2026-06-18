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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* TOGGLE */}
      <div style={{ padding: 16, background: 'var(--bg-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>What are you listing?</h3>
        <div style={{ display: 'flex', gap: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="listingType" 
              value="spare-part" 
              checked={listingType === 'spare-part'} 
              onChange={() => handleTypeChange('spare-part')} 
            />
            Auto Spare Part
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="listingType" 
              value="accessory" 
              checked={listingType === 'accessory'} 
              onChange={() => handleTypeChange('accessory')} 
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
