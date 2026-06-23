import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createListing } from '@/lib/api';
import CountyTownSelect from '@/components/CountyTownSelect';
import ItemAttributesSelect from '@/components/ItemAttributesSelect';
import AutoSparesForm from '@/components/AutoSparesForm';
import VehicleForm from '@/components/VehicleForm';
import TruckForm from '@/components/TruckForm';
import PropertyForm from '@/components/PropertyForm';
import PhoneForm from '@/components/PhoneForm';
import JobForm from '@/components/JobForm';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { TRUCK_CONDITIONS } from '@/lib/truckData';
import { useSEO } from '@/lib/useSEO';
import { Lock, Image as ImageIcon, Camera, Trash2, Rocket } from 'lucide-react';

const STANDARD_CONDITIONS   = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
const VEHICLE_CONDITIONS    = ['Brand New', 'Foreign Used', 'Locally Used', 'Accident Damaged', 'Rebuilt'];
const AUTOSPARES_CONDITIONS = ['New', 'Ex-Japan', 'Locally Used', 'OEM (Original)', 'Aftermarket', 'Refurbished'];
const AUDIO_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'];
const LAPTOP_CONDITIONS     = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];
const PHONE_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];

export default function PostAdPage() {
  useSEO({
    title: 'Post a Free Ad | AdHub Kenya',
    description: 'Post your free classified ad on AdHub Kenya. Sell cars, property, electronics, clothes, and more to buyers across all 47 counties in Kenya.',
    canonicalPath: '/post-ad'
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', negotiable: false,
    category: '', location: '', condition: '', phone: user?.phone || '', whatsapp: user?.whatsapp || ''
  });
  const [attrs, setAttrs] = useState({ make: '', model: '', year: '', specs: {} });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [processingImages, setProcessingImages] = useState(false);
  const [blurStatus, setBlurStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary/60 mb-6">
        <Lock className="h-8 w-8" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">Login Required</h3>
      <p className="text-muted-foreground mb-8">You need to be logged in to post an ad</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/login" className="rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:opacity-95">Login</Link>
        <Link to="/register" className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted">Create Account</Link>
      </div>
    </div>
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = async (e) => {
    const isVehicle = form.category === 'vehicles' || form.category === 'commercial-vehicles';
    const isProperty = form.category === 'property' || form.category === 'land-plots';
    const maxImages = isProperty ? 15 : (isVehicle ? 10 : 5);
    const rawNewFiles = Array.from(e.target.files);
    
    if (rawNewFiles.length === 0) return;

    let finalNewFiles = rawNewFiles;

    if (isVehicle) {
      setProcessingImages(true);
      try {
        const { autoBlurLicensePlate } = await import('@/lib/imageProcessing');
        finalNewFiles = await Promise.all(rawNewFiles.map(file => 
          autoBlurLicensePlate(file, setBlurStatus)
        ));
      } catch (err) {
        console.error(err);
      } finally {
        setProcessingImages(false);
        setBlurStatus('');
      }
    }

    setImages(prev => {
      const combined = [...prev, ...finalNewFiles].slice(0, maxImages);
      setPreviews(combined.map(f => URL.createObjectURL(f)));
      return combined;
    });
  };

  const removeImage = (i) => {
    const newImages = images.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const isVehicle    = form.category === 'vehicles' || form.category === 'commercial-vehicles';
  const isProperty   = form.category === 'property' || form.category === 'land-plots';
  const isAutoSpares = form.category === 'auto-spares';
  const isAudio      = attrs.make === 'Audio & Music';
  const HEAVY_TRUCK_TYPES = ['Heavy Truck', 'Bus', 'Construction Equipment', 'Agricultural Equipment', 'Trailer'];
  const isHeavyTruck = form.category === 'commercial-vehicles' || (form.category === 'vehicles' && HEAVY_TRUCK_TYPES.includes(attrs.specs?.vehicleType));
  const isPickupTruck = form.category === 'vehicles' && attrs.specs?.vehicleType === 'Pickup / Truck';
  const isLaptop     = attrs.specs?.deviceType === 'laptop' ||
                       (form.category === 'electronics' && attrs.specs?.brand && ['HP','Dell','Lenovo','Apple','Asus','Acer','Microsoft','MSI','Razer','Samsung','Huawei','LG'].includes(attrs.specs?.brand));
  const isPhone      = form.category === 'phones-tablets';
  const isJob        = form.category === 'jobs';
  const CONDITION_CATEGORIES = ['phones-tablets', 'electronics', 'home-furniture', 'fashion', 'repair-construction', 'commercial-equipment', 'leisure', 'babies-kids', 'auto-spares'];
  const showStandardCondition = CONDITION_CATEGORIES.includes(form.category) && !isProperty && !isAutoSpares && !isAudio && !isPhone;

  const getTitlePlaceholder = (cat) => {
    switch (cat) {
      case 'vehicles':
      case 'commercial-vehicles': return isHeavyTruck ? 'e.g. Isuzu NQR – 4×2 Dropside – 2020' : 'e.g. 2019 Toyota Harrier 2.0 Sunroof - Pearl White';
      case 'property':
      case 'land-plots': return 'e.g. 4 Bedroom Villa in Karen with Pool';
      case 'auto-spares': return 'e.g. Toyota Fielder NZE141 Front Bumper';
      case 'phones-tablets': return 'e.g. Samsung Galaxy S24 Ultra 512GB - Titanium Black';
      case 'electronics': return attrs.specs?.brand && ['HP','Dell','Lenovo','Apple','Asus','Acer','Microsoft'].includes(attrs.specs.brand) ? `e.g. ${attrs.specs.brand} ${attrs.model || 'Laptop'} - ${attrs.specs.ram || ''} ${attrs.specs.storageSize || ''}`.trim() : 'e.g. Samsung 65" QLED 4K Smart TV';
      case 'home-furniture': return 'e.g. 6-Seater Mahogany Dining Table Set';
      case 'jobs': return 'e.g. Senior Software Engineer - Remote';
      case 'fashion': return 'e.g. Men\'s Official Leather Shoes - Size 42';
      case 'beauty': return 'e.g. Bath & Body Works Vanilla Bean Lotion';
      case 'services': return 'e.g. Professional Plumbing & Pipe Repair Services';
      case 'repair-construction': return 'e.g. 50kg Bamburi Portland Cement';
      case 'commercial-equipment': return 'e.g. 2-Door Commercial Display Fridge';
      case 'leisure': return 'e.g. Yamaha Acoustic Guitar - Like New';
      case 'babies-kids': return 'e.g. Baby Cot with Mattress and Mosquito Net';
      case 'food-agriculture': return 'e.g. 90kg Bag of Fresh Nyandarua Potatoes';
      case 'animals-pets': return 'e.g. 2-Month-Old Purebred German Shepherd Puppy';
      case 'seeking-work': return 'e.g. Experienced Driver with Class B, C, E License';
      default: return '';
    }
  };

  const getDescriptionPlaceholder = (cat) => {
    if (isVehicle) return 'Describe the vehicle — any extras, reason for selling, service history, etc.';
    if (isJob) return 'Describe the role, key responsibilities, requirements, and any benefits offered...';
    switch (cat) {
      case 'property':
      case 'land-plots': return 'Describe the property — amenities, exact location details, title deed status, viewing arrangements...';
      case 'auto-spares': return 'Describe the spare part — compatibility, condition, brand, reason for selling...';
      case 'phones-tablets': return 'Describe the device — battery health, storage, included accessories, condition...';
      case 'electronics': return 'Describe the item — brand, model, condition, accessories included, reason for selling...';
      case 'home-furniture': return 'Describe the item — material, dimensions, condition, reason for selling...';
      case 'fashion': return 'Describe the item — size, material, brand, condition...';
      case 'beauty': return 'Describe the product — brand, quantity/volume, skin/hair type, condition...';
      case 'services': return 'Describe the service — your expertise, what\'s included, coverage area, pricing structure...';
      case 'repair-construction': return 'Describe the materials or tools — quantity, condition, brand...';
      case 'commercial-equipment': return 'Describe the equipment — capacity, condition, brand, power requirements...';
      case 'leisure': return 'Describe the item — condition, accessories included, brand...';
      case 'babies-kids': return 'Describe the item — age range, condition, safety features...';
      case 'food-agriculture': return 'Describe the produce/product — quantity, freshness, origin, delivery options...';
      case 'animals-pets': return 'Describe the pet/animal — breed, age, vaccination status, temperament...';
      case 'seeking-work': return 'Describe your skills, experience, and what kind of work you are looking for...';
      default: return 'Describe your item in detail — condition, features, reason for selling...';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || (!isJob && !form.price) || !form.category || !form.location || !form.phone) {
      setError('Please fill in all required fields'); return;
    }
    if (isVehicle && !form.condition) {
      setError('Please select vehicle condition'); return;
    }
    setLoading(true);
    try {
      const listingData = { ...form };
      if (isJob) listingData.price = 0;
      if (!showStandardCondition && !isVehicle) delete listingData.condition;

      if (attrs.make)  listingData.make  = attrs.make;
      if (attrs.model) listingData.model = attrs.model;
      if (attrs.year)  listingData.year  = attrs.year;

      if (attrs.specs && Object.keys(attrs.specs).length) {
        listingData.specs = attrs.specs;
      } else {
        listingData.specs = {};
      }
      
      const listing = await createListing(listingData, images);
      navigate(`/listing/${listing.id}`);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block";
  const cardClass = "mb-6 rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm";
  const cardHeaderClass = "mb-5 flex items-center gap-2 border-b border-border pb-4 font-display text-lg font-bold text-foreground";

  return (
    <div className="py-10 pb-24 px-4 sm:px-6 bg-background">
      <div className="mx-auto" style={{ maxWidth: (isVehicle || isProperty) ? 960 : 780 }}>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            {form.category === 'jobs' ? 'Post a Job' : form.category === 'seeking-work' ? 'Post Your CV / Profile' : 'Post a Free Ad'}
          </h1>
          <p className="text-muted-foreground">
            {form.category === 'jobs' ? 'Fill in the job details below to attract the right candidates' : form.category === 'seeking-work' ? 'Share your skills and experience to connect with employers' : 'Fill in the details below to list your item for sale'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20">{error}</div>}

          {/* ── Basic Info ───────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📋 Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Category *</label>
                <select className={inputClass} name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {TOP_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {isVehicle && !isHeavyTruck && !isPickupTruck && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {VEHICLE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isAutoSpares && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {AUTOSPARES_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isAudio && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {AUDIO_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isPhone && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {PHONE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isLaptop && !isPhone && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {LAPTOP_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {(isHeavyTruck || isPickupTruck) && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {TRUCK_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {showStandardCondition && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} name="condition" value={form.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    {STANDARD_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className={labelClass}>Ad Title *</label>
              <input className={inputClass} name="title" value={form.title} onChange={handleChange} placeholder={getTitlePlaceholder(form.category)} maxLength={100} required />
              <div className="mt-1.5 text-xs font-medium text-muted-foreground text-right">{form.title.length}/100 characters</div>
            </div>

            {/* Smart Forms */}
            {isHeavyTruck && <div className="mt-5 pt-5 border-t border-border"><TruckForm truckMode="heavy" values={attrs} onChange={setAttrs} /></div>}
            {isVehicle && !isHeavyTruck && !isPickupTruck && <div className="mt-5 pt-5 border-t border-border"><VehicleForm values={attrs} onChange={setAttrs} /></div>}
            {isPickupTruck && <div className="mt-5 pt-5 border-t border-border"><TruckForm truckMode="pickup" values={attrs} onChange={setAttrs} /></div>}
            {isProperty && <div className="mt-5 pt-5 border-t border-border"><PropertyForm values={attrs} onChange={setAttrs} /></div>}
            {isAutoSpares && <div className="mt-5 pt-5 border-t border-border"><AutoSparesForm values={attrs} onChange={setAttrs} /></div>}
            {isPhone && <div className="mt-5 pt-5 border-t border-border"><PhoneForm values={attrs} onChange={setAttrs} /></div>}
            {isJob && <div className="mt-5 pt-5 border-t border-border"><JobForm values={attrs} onChange={setAttrs} /></div>}
            {!isVehicle && !isProperty && !isAutoSpares && !isPhone && !isJob && form.category && (
              <div className="mt-5 pt-5 border-t border-border"><ItemAttributesSelect category={form.category} values={attrs} onChange={setAttrs} /></div>
            )}

            <div className="mt-5">
              <label className={labelClass}>Description *</label>
              <textarea className={`${inputClass} resize-y`} name="description" value={form.description} onChange={handleChange} placeholder={getDescriptionPlaceholder(form.category)} required rows={5} />
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────── */}
          {!isJob && (
            <div className={cardClass}>
              <h3 className={cardHeaderClass}>💰 Pricing</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Asking Price (KES) *</label>
                  <input className={inputClass} name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 2500000" min="0" required />
                </div>
                <div className="sm:pt-7">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground select-none">
                    <input type="checkbox" name="negotiable" checked={form.negotiable} onChange={handleChange} className="h-5 w-5 rounded border-border text-primary focus:ring-primary/40 accent-primary" />
                    Price negotiable
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Location ───────────────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📍 Location</h3>
            <CountyTownSelect value={form.location} onChange={(loc) => setForm(f => ({ ...f, location: loc }))} required />
          </div>

          {/* ── Photos ─────────────────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>🖼️ Photos {isVehicle ? '(up to 10)' : '(up to 5)'}</h3>
            {isVehicle && <p className="mb-3 text-sm text-muted-foreground">Include exterior, interior, engine bay, dashboard, and tyre photos for faster sales.</p>}
            
            <div 
              onClick={() => !processingImages && document.getElementById('img-input').click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-10 text-center transition ${processingImages ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-secondary cursor-pointer'}`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-background mb-4 shadow-sm text-primary">
                {processingImages ? <Camera className="h-6 w-6 animate-pulse" /> : <ImageIcon className="h-6 w-6" />}
              </div>
              <p className="font-semibold text-foreground">{processingImages ? blurStatus || 'Scanning for number plates...' : 'Click to upload photos'}</p>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP — Max 5MB each</p>
              <input id="img-input" type="file" accept="image/*" multiple onChange={handleImages} className="hidden" disabled={processingImages} />
            </div>

            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="group relative aspect-square w-24 overflow-hidden rounded-xl border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 grid place-items-center bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Contact ────────────────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📱 Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input className={inputClass} name="phone" value={form.phone} onChange={handleChange} placeholder="0712 345 678" required />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input className={inputClass} name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="0712 345 678" />
              </div>
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-4 text-base font-bold text-primary-foreground shadow-elevated transition hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? '⏳ Posting...' : <><Rocket className="h-5 w-5" /> Post Ad for Free</>}
          </button>
        </form>
      </div>
    </div>
  );
}
