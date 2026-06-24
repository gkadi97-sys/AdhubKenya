import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import toast from 'react-hot-toast';
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
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    control
  } = useForm({
    defaultValues: {
      title: '', description: '', price: '', negotiable: false,
      category: '', location: '', condition: '', phone: user?.phone || '', whatsapp: user?.whatsapp || '',
      attrs: { make: '', model: '', year: '', specs: {} }
    }
  });

  const category = watch('category');
  const make = watch('attrs.make');
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

  const isVehicle = category === 'vehicles' || category === 'commercial-vehicles';
  const isProperty = category === 'property' || category === 'land-plots';
  const isJob = category === 'jobs' || category === 'seeking-work';
  const isAutoSpares = category === 'auto-spares';
  const isPhone = category === 'phones-tablets';
  const isLaptop = category === 'electronics' && make === 'Laptops & Computers';
  const isAudio = category === 'electronics' && make === 'Audio & Music';
  const showStandardCondition = !isVehicle && !isAutoSpares && !isPhone && !isLaptop && !isAudio && category && !isJob;
  const isHeavyTruck = isVehicle && ['Trucks', 'Buses', 'Tractors', 'Heavy Equipment', 'Trailers'].includes(make);
  const isPickupTruck = isVehicle && make === 'Pickups';

  const handleImages = async (e) => {
    const maxImages = isProperty ? 15 : (isVehicle ? 10 : 5);
    const rawNewFiles = Array.from(e.target.files);
    
    if (rawNewFiles.length === 0) return;

    let finalNewFiles = rawNewFiles;

    if (isVehicle) {
      setProcessingImages(true);
      try {
        const { autoBlurLicensePlate } = await import('@/lib/imageProcessing');
        finalNewFiles = [];
        for (let i = 0; i < rawNewFiles.length; i++) {
          setBlurStatus(`Processing image ${i + 1} of ${rawNewFiles.length}...`);
          const processed = await autoBlurLicensePlate(rawNewFiles[i], setBlurStatus);
          finalNewFiles.push(processed);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to process one or more images. Please try again.');
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
    URL.revokeObjectURL(previews[i]);
    const newImages = images.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);


  const getTitlePlaceholder = (cat) => {
    const attrs = watch("attrs") || {};
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

  const onSubmit = async (data) => {
    setError('');
    const { attrs, ...formValues } = data;
    
    if (!formValues.title || !formValues.description || (!isJob && !formValues.price) || !formValues.category || !formValues.location || !formValues.phone) {
      setError('Please fill in all required fields'); return;
    }
    if (isVehicle && !formValues.condition) {
      setError('Please select vehicle condition'); return;
    }
    setLoading(true);
    try {
      const listingData = { ...formValues };
      if (isJob) listingData.price = 0;
      if (!showStandardCondition && !isVehicle && !isAutoSpares && !isPhone && !isLaptop && !isAudio) delete listingData.condition;

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
            {category === 'jobs' ? 'Post a Job' : category === 'seeking-work' ? 'Post Your CV / Profile' : 'Post a Free Ad'}
          </h1>
          <p className="text-muted-foreground">
            {category === 'jobs' ? 'Fill in the job details below to attract the right candidates' : category === 'seeking-work' ? 'Share your skills and experience to connect with employers' : 'Fill in the details below to list your item for sale'}
          </p>
        </div>

        <form onSubmit={rhfHandleSubmit(onSubmit)}>
          {error && <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20">{error}</div>}

          {/* ── Basic Info ───────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📋 Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Category *</label>
                <select className={inputClass} {...register("category", { required: true })}>
                  <option value="">Select Category</option>
                  {TOP_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {isVehicle && !isHeavyTruck && !isPickupTruck && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {VEHICLE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isAutoSpares && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {AUTOSPARES_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isAudio && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {AUDIO_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isPhone && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {PHONE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {isLaptop && !isPhone && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {LAPTOP_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {(isHeavyTruck || isPickupTruck) && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {TRUCK_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {showStandardCondition && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {STANDARD_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className={labelClass}>Ad Title *</label>
              <input className={inputClass} {...register("title", { required: true })} placeholder={getTitlePlaceholder(category)} maxLength={100} />
              <div className="mt-1.5 text-xs font-medium text-muted-foreground text-right">{(watch("title") || "").length}/100 characters</div>
            </div>

            {/* Smart Forms */}
            {isHeavyTruck && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <TruckForm truckMode="heavy" values={value} onChange={onChange} />} /></div>}
            {isVehicle && !isHeavyTruck && !isPickupTruck && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <VehicleForm values={value} onChange={onChange} />} /></div>}
            {isPickupTruck && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <TruckForm truckMode="pickup" values={value} onChange={onChange} />} /></div>}
            {isProperty && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <PropertyForm values={value} onChange={onChange} />} /></div>}
            {isAutoSpares && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <AutoSparesForm values={value} onChange={onChange} />} /></div>}
            {isPhone && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <PhoneForm values={value} onChange={onChange} />} /></div>}
            {isJob && <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <JobForm values={value} onChange={onChange} />} /></div>}
            {!isVehicle && !isProperty && !isAutoSpares && !isPhone && !isJob && category && (
              <div className="mt-5 pt-5 border-t border-border"><Controller name="attrs" control={control} render={({ field: { value, onChange } }) => <ItemAttributesSelect category={category} values={value} onChange={onChange} />} /></div>
            )}

            <div className="mt-5">
              <label className={labelClass}>Description *</label>
              <textarea className={`${inputClass} resize-y`} {...register("description", { required: true })} placeholder={getDescriptionPlaceholder(category)} rows={5} />
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────── */}
          {!isJob && (
            <div className={cardClass}>
              <h3 className={cardHeaderClass}>💰 Pricing</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Asking Price (KES) *</label>
                  <input className={inputClass} type="number" {...register("price", { required: true })} placeholder="e.g. 2500000" min="0" />
                </div>
                <div className="sm:pt-7">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground select-none">
                    <input type="checkbox" {...register("negotiable")} className="h-5 w-5 rounded border-border text-primary focus:ring-primary/40 accent-primary" />
                    Price negotiable
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Location ───────────────────────────────────────── */}
          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📍 Location</h3>
            <Controller name="location" control={control} rules={{ required: true }} render={({ field: { value, onChange } }) => <CountyTownSelect value={value} onChange={onChange} required />} />
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
                <input className={inputClass} {...register("phone", { required: true })} placeholder="0712 345 678" />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input className={inputClass} {...register("whatsapp")} placeholder="0712 345 678" />
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
