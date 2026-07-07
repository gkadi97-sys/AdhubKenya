import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getListing, updateListing } from '@/lib/api';
import CountyTownSelect from '@/components/CountyTownSelect';
import MetadataDrivenForm from '@/components/forms/MetadataDrivenForm';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { TRUCK_CONDITIONS } from '@/lib/truckData';
import { useSEO } from '@/lib/useSEO';
import toast from 'react-hot-toast';
import { Lock, Save } from 'lucide-react';

const STANDARD_CONDITIONS   = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
const VEHICLE_CONDITIONS    = ['Brand New', 'Foreign Used', 'Locally Used', 'Accident Damaged', 'Rebuilt'];
const AUTOSPARES_CONDITIONS = ['New', 'Ex-Japan', 'Locally Used', 'OEM (Original)', 'Aftermarket', 'Refurbished'];
const AUDIO_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'];
const LAPTOP_CONDITIONS     = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];
const PHONE_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];

export default function EditAdPage() {
  const { id } = useParams();
  useSEO({
    title: 'Edit Ad | AdHub Kenya',
    description: 'Edit your classified ad on AdHub Kenya.',
    canonicalPath: `/edit-ad/${id}`
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit: rhfHandleSubmit, watch, control, setValue, reset } = useForm();

  const [loadingListing, setLoadingListing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [listing, setListing] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchAd = async () => {
      try {
        const data = await getListing(id);
        if (data.seller_id !== user.id) {
          toast.error("You don't have permission to edit this ad.");
          navigate('/my-ads');
          return;
        }
        setListing(data);
        
        // Reconstruct attrs for DynamicListingForm
        const attrs = {
          make: data.make,
          model: data.model,
          year: data.year,
          ...data.specs
        };

        reset({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          negotiable: data.negotiable || false,
          category: data.category || '',
          location: data.location || '',
          condition: data.condition || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          attrs
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load ad details.');
        navigate('/my-ads');
      } finally {
        setLoadingListing(false);
      }
    };
    fetchAd();
  }, [id, user, navigate, reset]);

  const category = watch('category');
  const make = watch('attrs.make');

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary/60 mb-6">
        <Lock className="h-8 w-8" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">Login Required</h3>
      <p className="text-muted-foreground mb-8">You need to be logged in to edit an ad</p>
      <Link to="/login" className="rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated">Login</Link>
    </div>
  );

  if (loadingListing) return <div className="text-center py-20">Loading...</div>;

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

  const getConditionOptions = () => {
    if (isHeavyTruck || isPickupTruck) return TRUCK_CONDITIONS;
    if (isVehicle) return VEHICLE_CONDITIONS;
    if (isAutoSpares) return AUTOSPARES_CONDITIONS;
    if (isPhone) return PHONE_CONDITIONS;
    if (isLaptop) return LAPTOP_CONDITIONS;
    if (isAudio) return AUDIO_CONDITIONS;
    if (showStandardCondition) return STANDARD_CONDITIONS;
    return null;
  };
  const conditionOptions = getConditionOptions();

  const onSubmit = async (data) => {
    setError('');
    const { attrs, ...formValues } = data;
    
    if (!formValues.title || !formValues.description || (!isJob && !formValues.price) || !formValues.category || !formValues.location || !formValues.phone) {
      setError('Please fill in all required fields'); return;
    }
    setSaving(true);
    try {
      const listingData = { ...formValues };
      if (isJob) listingData.price = 0;
      if (!showStandardCondition && !isVehicle && !isAutoSpares && !isPhone && !isLaptop && !isAudio) delete listingData.condition;

      const { make, model, year, ...restSpecs } = attrs || {};
      if (make)  listingData.make  = make;
      if (model) listingData.model = model;
      if (year)  listingData.year  = year;
      listingData.specs = restSpecs || {};
      
      await updateListing(id, { ...listingData, status: 'pending' });
      toast.success('Ad updated and submitted for review!');
      navigate(`/my-ads`);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block";
  const cardClass = "mb-6 rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm";
  const cardHeaderClass = "mb-5 flex items-center gap-2 border-b border-border pb-4 font-display text-lg font-bold text-foreground";

  return (
    <div className="py-10 pb-24 px-4 sm:px-6 bg-background">
      <div className="mx-auto" style={{ maxWidth: (isVehicle || isProperty) ? 960 : 780 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Edit Ad</h1>
            <p className="text-muted-foreground">Update the details of your listing</p>
          </div>
        </div>

        <form onSubmit={rhfHandleSubmit(onSubmit)}>
          {error && <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20">{error}</div>}

          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📋 Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Category *</label>
                <select className={inputClass} {...register("category", { required: true })} disabled>
                  {TOP_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Category cannot be changed.</p>
              </div>

              {conditionOptions && (
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select className={inputClass} {...register("condition", { required: true })}>
                    <option value="">Select Condition</option>
                    {conditionOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className={labelClass}>Ad Title *</label>
              <input className={inputClass} {...register("title", { required: true })} maxLength={100} />
            </div>

            {category && (
              <div className="mt-5 pt-5 border-t border-border">
                <MetadataDrivenForm
                  categorySlug={category}
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  onProgressChange={() => {}}
                  onSectionComplete={() => {}}
                />
              </div>
            )}

            <div className="mt-5">
              <label className={labelClass}>Description *</label>
              <textarea className={`${inputClass} resize-y`} {...register("description", { required: true })} rows={5} />
            </div>
          </div>

          {!isJob && (
            <div className={cardClass}>
              <h3 className={cardHeaderClass}>💰 Pricing</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Asking Price (KES) *</label>
                  <input className={inputClass} type="number" {...register("price", { required: true })} min="0" />
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

          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📍 Location</h3>
            <Controller name="location" control={control} rules={{ required: true }} render={({ field: { value, onChange } }) => <CountyTownSelect value={value} onChange={onChange} required />} />
          </div>

          {/* Photo Editing could go here later. For now, disabled text */}
          <div className={cardClass}>
             <h3 className={cardHeaderClass}>🖼️ Photos</h3>
             <p className="text-muted-foreground text-sm">To change photos, please delete and repost this ad for now.</p>
             <div className="mt-4 flex flex-wrap gap-3 opacity-50">
                {(listing?.images || []).map((src, i) => (
                  <div key={i} className="aspect-square w-24 overflow-hidden rounded-xl border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
          </div>

          <div className={cardClass}>
            <h3 className={cardHeaderClass}>📱 Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input className={inputClass} {...register("phone", { required: true })} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input className={inputClass} {...register("whatsapp")} />
              </div>
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-4 text-base font-bold text-primary-foreground shadow-elevated transition hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed" disabled={saving}>
            {saving ? '⏳ Saving...' : <><Save className="h-5 w-5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
