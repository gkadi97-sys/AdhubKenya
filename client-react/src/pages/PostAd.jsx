import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createListing, checkDuplicateListing } from '@/lib/api';
import CountyTownSelect from '@/components/CountyTownSelect';
import MetadataDrivenForm from '@/components/forms/MetadataDrivenForm';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { TRUCK_CONDITIONS } from '@/lib/truckData';
import { useSEO } from '@/lib/useSEO';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import {
  Lock, Image as ImageIcon, Camera, Trash2, Rocket, Save,
  CheckCircle2, ChevronDown, MapPin, DollarSign, Eye,
  ArrowLeft, Edit2
} from 'lucide-react';

// ─── Condition option sets ───────────────────────────────────────────────────
const STANDARD_CONDITIONS   = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
const VEHICLE_CONDITIONS    = ['Brand New', 'Foreign Used', 'Locally Used', 'Accident Damaged', 'Rebuilt'];
const AUTOSPARES_CONDITIONS = ['New', 'Ex-Japan', 'Locally Used', 'OEM (Original)', 'Aftermarket', 'Refurbished'];
const AUDIO_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'];
const LAPTOP_CONDITIONS     = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];
const PHONE_CONDITIONS      = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];

// ─── Draft helpers ───────────────────────────────────────────────────────────
const DRAFT_KEY = 'adhub_post_ad_draft';
function saveDraft(data) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, _savedAt: Date.now() })); } catch {}
}
function loadDraft() {
  try { const raw = localStorage.getItem(DRAFT_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

// ─── Static Section Wrapper — matches MetadataDrivenForm section visual ──────
function StaticSection({ id, icon, title, state, isExpanded, onToggle, summary, children }) {
  const stateConfig = {
    locked:       'border-border/40 opacity-50',
    available:    'border-border',
    'in-progress':'border-primary/40 ring-1 ring-primary/10',
    completed:    'border-emerald-500/30',
  };

  return (
    <div id={id} className={`rounded-2xl border bg-card shadow-sm transition-all duration-200 overflow-hidden ${stateConfig[state] || stateConfig.available}`}>
      <button
        type="button"
        disabled={state === 'locked'}
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 ${state !== 'locked' ? 'cursor-pointer hover:bg-muted/30' : 'cursor-default'} transition-colors`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {state === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          ) : state === 'locked' ? (
            <Lock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
          ) : (
            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${state === 'in-progress' ? 'bg-primary animate-pulse' : 'bg-primary/40'}`} />
          )}
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-display text-sm font-bold text-foreground">{title}</span>
            </div>
            {state === 'completed' && !isExpanded && summary && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{summary}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {state === 'completed' && !isExpanded && (
            <span className="text-xs text-primary font-semibold hidden sm:block">Edit</span>
          )}
          {state !== 'locked' && (
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {isExpanded && state !== 'locked' && (
        <div className="border-t border-border px-5 pt-5 pb-6 sm:px-6 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Review Screen ────────────────────────────────────────────────────────────
function ReviewScreen({ formData, images, category, onEdit, onSubmit, loading }) {
  const categoryName = TOP_CATEGORIES.find(c => c.slug === formData.category)?.name || formData.category;
  const attrEntries = Object.entries(formData.attrs || {}).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Review Your Listing
          </h3>
          <button type="button" onClick={onEdit} className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted transition">
            <Edit2 className="h-3 w-3" /> Edit
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div><span className="text-muted-foreground">Category</span><p className="font-semibold">{categoryName}</p></div>
            {formData.condition && <div><span className="text-muted-foreground">Condition</span><p className="font-semibold">{formData.condition}</p></div>}
            {formData.title && <div className="col-span-2"><span className="text-muted-foreground">Title</span><p className="font-semibold">{formData.title}</p></div>}
            {formData.price && <div><span className="text-muted-foreground">Price</span><p className="font-semibold text-primary">KES {Number(formData.price).toLocaleString()}{formData.negotiable ? ' (Negotiable)' : ''}</p></div>}
            {formData.location && <div><span className="text-muted-foreground">Location</span><p className="font-semibold">{formData.location}</p></div>}
          </div>

          {attrEntries.length > 0 && (
            <>
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Details</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {attrEntries.slice(0, 10).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground capitalize">{k}</p>
                      <p className="font-semibold text-sm truncate">{Array.isArray(v) ? v.join(', ') : String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {images.length > 0 && (
            <div className="border-t border-border pt-3 mt-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{images.length} Photo{images.length !== 1 ? 's' : ''} Ready</p>
              <div className="flex gap-2 flex-wrap">
                {images.slice(0, 6).map((src, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {images.length > 6 && <div className="w-14 h-14 rounded-lg border border-border flex items-center justify-center text-xs font-bold text-muted-foreground bg-muted">+{images.length - 6}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-4 text-base font-bold text-primary-foreground shadow-elevated transition hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Posting...' : <><Rocket className="h-5 w-5" /> Publish Listing</>}
      </button>
    </div>
  );
}

// ─── Main PostAd Page ────────────────────────────────────────────────────────
export default function PostAdPage() {
  useSEO({
    title: 'Post a Free Ad | AdHub Kenya',
    description: 'Post your free classified ad on AdHub Kenya. Sell cars, property, electronics, clothes, and more to buyers across all 47 counties in Kenya.',
    canonicalPath: '/post-ad'
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit: rhfHandleSubmit, watch, control, setValue, getValues } = useForm({
    defaultValues: (() => {
      const draft = loadDraft();
      return draft ? { ...draft, _savedAt: undefined } : {
        title: '', description: '', price: '', negotiable: false,
        category: '', location: '', condition: '',
        phone: user?.phone || '', whatsapp: user?.whatsapp || '',
        attrs: {}
      };
    })()
  });

  const category = watch('category');
  const make     = watch('attrs.make');
  const title    = watch('title');
  const price    = watch('price');
  const location = watch('location');

  const [images, setImages]             = useState([]);
  const [previews, setPreviews]         = useState([]);
  const [processingImages, setProcessingImages] = useState(false);
  const [blurStatus, setBlurStatus]     = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showReview, setShowReview]     = useState(false);
  const [draftSaved, setDraftSaved]     = useState(false);

  // Section expansion state for static sections
  const [expanded, setExpanded] = useState({
    basics: true, pricing: false, location: false, media: false
  });

  // Metadata section progress
  const [metaProgress, setMetaProgress] = useState({ completed: 0, total: 0 });

  // Category-derived flags
  const isVehicle  = category === 'vehicles' || category === 'commercial-vehicles';
  const isProperty = category === 'property' || category === 'land-plots';
  const isJob      = category === 'jobs' || category === 'seeking-work';
  const isAutoSpares = category === 'auto-spares';
  const isPhone    = category === 'phones-tablets';
  const isLaptop   = category === 'electronics' && typeof make === 'string' && make.toLowerCase().includes('laptop');
  const isAudio    = category === 'electronics' && typeof make === 'string' && make.toLowerCase().includes('audio');
  const showCondition = !isVehicle && !isAutoSpares && !isPhone && !isLaptop && !isAudio && category && !isJob;

  const getConditionOptions = () => {
    if (isVehicle && TRUCK_CONDITIONS && ['Trucks', 'Buses', 'Tractors', 'Heavy Equipment', 'Trailers', 'Pickups'].includes(make)) return TRUCK_CONDITIONS;
    if (isVehicle) return VEHICLE_CONDITIONS;
    if (isAutoSpares) return AUTOSPARES_CONDITIONS;
    if (isPhone) return PHONE_CONDITIONS;
    if (isLaptop) return LAPTOP_CONDITIONS;
    if (isAudio) return AUDIO_CONDITIONS;
    if (showCondition) return STANDARD_CONDITIONS;
    return null;
  };
  const conditionOptions = getConditionOptions();

  // Determine states of static sections
  const basicsComplete = !!(title && category);
  const pricingComplete = isJob ? true : !!(price);
  const locationComplete = !!(location);
  const mediaComplete = images.length > 0;

  const getSectionState = (key, prevComplete) => {
    if (!prevComplete) return 'locked';
    const complete = { basics: basicsComplete, pricing: pricingComplete, location: locationComplete, media: mediaComplete }[key];
    if (complete) return 'completed';
    return expanded[key] ? 'in-progress' : 'available';
  };

  // Unlock/auto-expand next section when previous completes
  const prevStates = useRef({});
  useEffect(() => {
    const sections = ['basics', 'pricing', 'location', 'media'];
    const completionMap = { basics: basicsComplete, pricing: pricingComplete, location: locationComplete, media: mediaComplete };
    sections.forEach((key, i) => {
      if (!prevStates.current[key] && completionMap[key]) {
        // Collapse this, expand next
        const nextKey = sections[i + 1];
        if (nextKey) {
          setExpanded(prev => ({ ...prev, [key]: false, [nextKey]: true }));
        } else {
          setExpanded(prev => ({ ...prev, [key]: false }));
        }
      }
    });
    prevStates.current = { ...completionMap };
  }, [basicsComplete, pricingComplete, locationComplete, mediaComplete]);

  // When category changes, reset metadata sections
  useEffect(() => {
    if (category) {
      setExpanded(prev => ({ ...prev, basics: true }));
    }
  }, [category]);

  const toggleSection = (key, state) => {
    if (state === 'locked') return;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Auto-save draft
  useEffect(() => {
    const sub = watch((values) => {
      saveDraft(values);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const handleSaveDraft = () => {
    saveDraft(getValues());
    setDraftSaved(true);
    toast.success('Draft saved!');
    setTimeout(() => setDraftSaved(false), 2000);
  };

  // Image handling
  const handleImages = async (e) => {
    const maxImages = isProperty ? 15 : (isVehicle ? 10 : 5);
    const rawNewFiles = Array.from(e.target.files);
    if (rawNewFiles.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 15 * 1024 * 1024;
    const validFiles = rawNewFiles.filter(file => {
      if (!validTypes.includes(file.type)) { toast.error(`${file.name} is not a supported format.`); return false; }
      if (file.size > maxSize) { toast.error(`${file.name} is larger than 15MB.`); return false; }
      return true;
    });
    if (validFiles.length === 0) return;

    setProcessingImages(true);
    let finalNewFiles = [];
    try {
      const compressionOptions = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/webp' };
      const compressedFiles = [];
      for (let i = 0; i < validFiles.length; i++) {
        setBlurStatus(`Compressing image ${i + 1} of ${validFiles.length}...`);
        try {
          const compressed = await imageCompression(validFiles[i], compressionOptions);
          const named = new File([compressed], validFiles[i].name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
          compressedFiles.push(named);
        } catch { compressedFiles.push(validFiles[i]); }
      }

      if (isVehicle) {
        const { autoBlurLicensePlate } = await import('@/lib/imageProcessing');
        for (let i = 0; i < compressedFiles.length; i++) {
          setBlurStatus(`Scanning image ${i + 1} of ${compressedFiles.length} for number plates...`);
          const processed = await autoBlurLicensePlate(compressedFiles[i], setBlurStatus);
          finalNewFiles.push(processed);
        }
      } else {
        finalNewFiles = compressedFiles;
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process images. Please try again.');
      finalNewFiles = validFiles;
    } finally {
      setProcessingImages(false);
      setBlurStatus('');
    }

    setImages(prev => {
      const combined = [...prev, ...finalNewFiles].slice(0, maxImages);
      setPreviews(combined.map(f => URL.createObjectURL(f)));
      return combined;
    });
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previews[i]);
    setImages(imgs => imgs.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => { return () => previews.forEach(url => URL.revokeObjectURL(url)); }, [previews]);

  const getTitlePlaceholder = (cat) => {
    switch (cat) {
      case 'vehicles': case 'commercial-vehicles': return 'e.g. 2019 Toyota Harrier 2.0 Sunroof - Pearl White';
      case 'property': case 'land-plots': return 'e.g. 4 Bedroom Villa in Karen with Pool';
      case 'phones-tablets': return 'e.g. Samsung Galaxy S24 Ultra 512GB - Titanium Black';
      case 'electronics': return 'e.g. Samsung 65" QLED 4K Smart TV';
      case 'jobs': return 'e.g. Senior Software Engineer - Remote (Nairobi)';
      case 'fashion': return 'e.g. Men\'s Official Leather Shoes - Size 42';
      default: return 'Write a clear, descriptive title...';
    }
  };

  const getDescriptionPlaceholder = (cat) => {
    if (isVehicle) return 'Describe the vehicle — any extras, reason for selling, service history, etc.';
    if (isJob) return 'Describe the role, key responsibilities, requirements, and any benefits offered...';
    switch (cat) {
      case 'property': case 'land-plots': return 'Describe the property — amenities, exact location, title deed status, viewing arrangements...';
      case 'phones-tablets': return 'Describe the device — battery health, storage, included accessories, condition...';
      case 'electronics': return 'Describe the item — brand, model, condition, accessories included, reason for selling...';
      default: return 'Describe your item in detail — condition, features, reason for selling...';
    }
  };

  // Submit
  const onSubmit = async (data) => {
    setError('');
    const { attrs, ...formValues } = data;

    if (!formValues.title || !formValues.description || !formValues.category || !formValues.location || !formValues.phone) {
      setError('Please fill in all required fields'); return;
    }
    if (!isJob && !formValues.price) { setError('Please enter a price'); return; }

    setLoading(true);
    try {
      const listingData = { ...formValues };
      if (isJob) listingData.price = 0;

      if (user) {
        const isDup = await checkDuplicateListing(user.id, formValues.title, formValues.category);
        if (isDup) {
          setError('You already have an active listing with a similar title in this category.');
          setLoading(false); return;
        }
      }

      listingData.status = 'pending';
      const { make, model, year, ...restSpecs } = attrs || {};
      if (make)  listingData.make  = make;
      if (model) listingData.model = model;
      if (year)  listingData.year  = year;
      listingData.specs = restSpecs || {};

      await createListing(listingData, images);
      clearDraft();
      navigate('/post-ad/success');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground';
  const labelClass = 'text-sm font-semibold text-foreground mb-1.5 inline-block';

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

  // Overall progress across static + metadata sections
  const staticTotal = isJob ? 3 : 4; // basics, [pricing], location, media
  const staticComplete = [basicsComplete, !isJob && pricingComplete, locationComplete, mediaComplete].filter(Boolean).length;
  const totalSections = staticTotal + metaProgress.total;
  const doneSections  = staticComplete + metaProgress.completed;
  const overallPct    = totalSections > 0 ? Math.round((doneSections / totalSections) * 100) : 0;

  const basicsState   = getSectionState('basics', true);
  // Show metadata form as soon as category is selected — it provides context-specific fields
  // that inform the rest of the form (e.g. Make → Model → auto-fill engine size)
  const metadataReady = !!category;
  const pricingState  = getSectionState('pricing', basicsComplete);
  const locationState = getSectionState('location', basicsComplete);
  const mediaState    = getSectionState('media', basicsComplete);

  const maxPhotos = isProperty ? 15 : isVehicle ? 10 : 5;

  return (
    <div className="py-10 pb-24 px-4 sm:px-6 bg-background">
      <div className="mx-auto" style={{ maxWidth: (isVehicle || isProperty) ? 960 : 780 }}>

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
              {isJob ? 'Post a Job' : 'Post a Free Ad'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isJob ? 'Fill in the details to attract the right candidates' : 'Follow the steps below to list your item'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            className={`flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted flex-shrink-0 ${draftSaved ? 'text-emerald-500 border-emerald-500/40' : 'text-muted-foreground'}`}
          >
            {draftSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">{draftSaved ? 'Saved!' : 'Save Draft'}</span>
          </button>
        </div>

        {/* Overall progress bar */}
        {totalSections > 0 && (
          <div className="mb-6 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Listing progress</span>
              <span className="font-semibold text-primary">{overallPct}% complete</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        )}

        <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-3">
          {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20">{error}</div>}

          {showReview ? (
            <ReviewScreen
              formData={getValues()}
              images={previews}
              category={category}
              onEdit={() => setShowReview(false)}
              onSubmit={rhfHandleSubmit(onSubmit)}
              loading={loading}
            />
          ) : (
            <>
              {/* ── 1. Basic Information ─────────────────────────── */}
              <StaticSection
                id="section-basics"
                icon={null}
                title="Basic Information"
                state={basicsState}
                isExpanded={!!expanded.basics}
                onToggle={() => toggleSection('basics', basicsState)}
                summary={[TOP_CATEGORIES.find(c => c.slug === category)?.name, title].filter(Boolean).join(' • ')}
              >
                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select
                      className={inputClass}
                      {...register('category', { required: true })}
                      onChange={e => {
                        if (e.target.value === 'seeking-work') {
                          window.location.href = '/post-cv';
                        } else {
                          register('category').onChange(e);
                        }
                      }}
                    >
                      <option value="">Select Category</option>
                      {TOP_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>

                  {/* Condition */}
                  {conditionOptions && (
                    <div>
                      <label className={labelClass}>Condition *</label>
                      <select className={inputClass} {...register('condition', { required: true })}>
                        <option value="">Select Condition</option>
                        {conditionOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Title */}
                  {category && (
                    <div>
                      <label className={labelClass}>Title *</label>
                      <input
                        className={inputClass}
                        {...register('title', { required: true })}
                        placeholder={getTitlePlaceholder(category)}
                      />
                    </div>
                  )}

                  {/* Description */}
                  {category && (
                    <div>
                      <label className={labelClass}>Description *</label>
                      <textarea
                        className={`${inputClass} resize-y`}
                        {...register('description', { required: true })}
                        placeholder={getDescriptionPlaceholder(category)}
                        rows={5}
                      />
                    </div>
                  )}
                </div>
              </StaticSection>

              {/* ── 2. Category-Specific Details (MetadataDrivenForm) ── */}
              {metadataReady && (
                <MetadataDrivenForm
                  categorySlug={category}
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  onProgressChange={(completed, total) => setMetaProgress({ completed, total })}
                  onSectionComplete={() => {}}
                />
              )}

              {/* ── 3. Pricing ───────────────────────────────────── */}
              {!isJob && (
                <StaticSection
                  id="section-pricing"
                  icon={<DollarSign className="h-4 w-4 text-primary/70" />}
                  title="Pricing"
                  state={pricingState}
                  isExpanded={!!expanded.pricing}
                  onToggle={() => toggleSection('pricing', pricingState)}
                  summary={price ? `KES ${Number(price).toLocaleString()}${watch('negotiable') ? ' · Negotiable' : ''}` : null}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <label className={labelClass}>Asking Price (KES) *</label>
                      <input className={inputClass} type="number" {...register('price', { required: !isJob })} placeholder="e.g. 2500000" min="0" />
                    </div>
                    <div className="sm:pt-7">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground select-none">
                        <input type="checkbox" {...register('negotiable')} className="h-5 w-5 rounded border-border text-primary focus:ring-primary/40 accent-primary" />
                        Price negotiable
                      </label>
                    </div>
                  </div>
                </StaticSection>
              )}

              {/* ── 4. Location ──────────────────────────────────── */}
              <StaticSection
                id="section-location"
                icon={<MapPin className="h-4 w-4 text-primary/70" />}
                title="Location"
                state={locationState}
                isExpanded={!!expanded.location}
                onToggle={() => toggleSection('location', locationState)}
                summary={location || null}
              >
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CountyTownSelect value={value} onChange={onChange} required />
                  )}
                />
              </StaticSection>

              {/* ── 5. Photos ────────────────────────────────────── */}
              <StaticSection
                id="section-media"
                icon={<ImageIcon className="h-4 w-4 text-primary/70" />}
                title={`Photos (up to ${maxPhotos})`}
                state={mediaState}
                isExpanded={!!expanded.media}
                onToggle={() => toggleSection('media', mediaState)}
                summary={images.length > 0 ? `${images.length} photo${images.length !== 1 ? 's' : ''} added` : null}
              >
                {isVehicle && <p className="mb-3 text-sm text-muted-foreground">Include exterior, interior, engine bay, dashboard, and tyre photos for faster sales.</p>}

                <label
                  htmlFor="img-input"
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-10 text-center transition ${processingImages ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'hover:border-primary/50 hover:bg-secondary cursor-pointer'}`}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-background mb-4 shadow-sm text-primary">
                    {processingImages ? <Camera className="h-6 w-6 animate-pulse" /> : <ImageIcon className="h-6 w-6" />}
                  </div>
                  <p className="font-semibold text-foreground">{processingImages ? blurStatus || 'Processing...' : 'Tap to upload photos'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP — Max 15MB each</p>
                  <input id="img-input" type="file" accept="image/*" multiple onChange={handleImages} className="hidden" disabled={processingImages} />
                </label>

                {previews.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="group relative aspect-square w-24 overflow-hidden rounded-xl border border-border">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 shadow-sm text-destructive md:opacity-0 md:top-0 md:right-0 md:h-full md:w-full md:rounded-none md:bg-background/80 md:backdrop-blur md:group-hover:opacity-100 transition"
                          aria-label={`Remove image ${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 md:h-5 md:w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </StaticSection>

              {/* ── 6. Contact ───────────────────────────────────── */}
              <StaticSection
                id="section-contact"
                icon={null}
                title="Contact Details"
                state={basicsComplete ? 'available' : 'locked'}
                isExpanded={!!expanded.contact}
                onToggle={() => toggleSection('contact', basicsComplete ? 'available' : 'locked')}
                summary={watch('phone') || null}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input className={inputClass} {...register('phone', { required: true })} placeholder="0712 345 678" />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input className={inputClass} {...register('whatsapp')} placeholder="0712 345 678" />
                  </div>
                </div>
              </StaticSection>

              {/* ── Review & Publish CTA ─────────────────────────── */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowReview(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary text-primary bg-primary/5 px-6 py-4 text-base font-bold transition hover:bg-primary/10"
                >
                  <Eye className="h-5 w-5" /> Review Listing
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-4 text-base font-bold text-primary-foreground shadow-elevated transition hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Posting...' : <><Rocket className="h-5 w-5" /> Post Ad for Free</>}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
