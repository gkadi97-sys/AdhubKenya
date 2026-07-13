import { CheckCircle2, MapPin, Tag, Eye, Image as ImageIcon } from 'lucide-react';
import { useWatch } from 'react-hook-form';

export default function ListingPreviewCard({ control, category, images }) {
  const formData = useWatch({ control }) || {};
  const isVehicle = category === 'vehicles' || category === 'commercial-vehicles';
  const isProperty = category === 'property' || category === 'land-plots';
  const isJob = category === 'jobs';

  const title = formData.title || 'Untitled Listing';
  const price = formData.price ? `KES ${Number(formData.price).toLocaleString()}` : (isJob ? 'Salary Undisclosed' : 'Enter price');
  const location = formData.location || 'Location not set';
  const coverImage = images && images.length > 0 ? images[0] : null;

  // Render specific property details
  const renderPropertyDetails = () => {
    if (!isProperty) return null;
    const { propertyType, bedrooms, bathrooms, size, sizeUnit, furnishing, amenities } = formData.attrs || {};
    
    return (
      <div className="space-y-3 mt-3">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {propertyType && <span className="bg-muted px-2 py-1 rounded-md">{propertyType}</span>}
          {bedrooms && !['Land', 'Office', 'Warehouse'].includes(propertyType) && <span className="bg-muted px-2 py-1 rounded-md">{bedrooms} Bed</span>}
          {bathrooms && !['Land', 'Office', 'Warehouse'].includes(propertyType) && <span className="bg-muted px-2 py-1 rounded-md">{bathrooms} Bath</span>}
          {size && sizeUnit && <span className="bg-muted px-2 py-1 rounded-md">{size} {sizeUnit}</span>}
          {furnishing && <span className="bg-muted px-2 py-1 rounded-md">{furnishing}</span>}
        </div>
        
        {Array.isArray(amenities) && amenities.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 5).map(am => (
                <span key={am} className="text-[10px] flex items-center gap-0.5 text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3" /> {am}
                </span>
              ))}
              {amenities.length > 5 && <span className="text-[10px] text-muted-foreground">+{amenities.length - 5} more</span>}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render specific vehicle details
  const renderVehicleDetails = () => {
    if (!isVehicle) return null;
    const { make, model, year, transmission, fuel_type, mileage } = formData.attrs || {};
    
    return (
      <div className="space-y-3 mt-3">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {year && <span className="bg-muted px-2 py-1 rounded-md">{year}</span>}
          {make && model && <span className="bg-muted px-2 py-1 rounded-md">{make} {model}</span>}
          {transmission && <span className="bg-muted px-2 py-1 rounded-md">{transmission}</span>}
          {fuel_type && <span className="bg-muted px-2 py-1 rounded-md">{fuel_type}</span>}
          {mileage && <span className="bg-muted px-2 py-1 rounded-md">{Number(mileage).toLocaleString()} km</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="bg-muted/30 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" /> Live Preview
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">This is how your ad will appear to buyers.</p>
      </div>
      
      <div className="p-4">
        {/* Cover Image Placeholder */}
        <div className="aspect-[4/3] rounded-xl bg-muted overflow-hidden mb-4 relative">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-xs font-medium">No photos added</span>
            </div>
          )}
          {images && images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
              1/{images.length}
            </div>
          )}
        </div>
        
        {/* Title */}
        <h4 className="font-display font-bold text-base leading-snug line-clamp-2 mb-2 break-words">
          {title}
        </h4>
        
        {/* Price */}
        <div className="flex items-center gap-1.5 text-primary font-bold text-lg mb-2">
          <Tag className="h-4 w-4" />
          {price}
          {formData.negotiable && <span className="text-[10px] font-normal uppercase text-muted-foreground ml-1">(Neg)</span>}
          {formData.attrs?.pricePeriod && <span className="text-xs font-normal text-muted-foreground ml-1">/{formData.attrs.pricePeriod.replace('Per ', '')}</span>}
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        {/* Category Specific Details */}
        {renderPropertyDetails()}
        {renderVehicleDetails()}
      </div>
    </div>
  );
}
