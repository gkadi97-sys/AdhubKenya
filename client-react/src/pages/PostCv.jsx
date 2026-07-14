import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createListing, uploadCvDocument } from '@/lib/api';
import CountyTownSelect from '@/components/CountyTownSelect';
import { ATTRIBUTE_ENGINE } from '@/lib/attributeEngine';
import { useSEO } from '@/lib/useSEO';
import toast from 'react-hot-toast';
import { Lock, FileText, CheckCircle2, AlertCircle, Trash2, Link as LinkIcon, Camera } from 'lucide-react';
import QuickChips from '@/components/QuickChips';

const cvSchema = ATTRIBUTE_ENGINE['seeking-work'].attributes;

const STEPS = [
  { id: 'basics', title: 'Basic Info' },
  { id: 'professional', title: 'Professional Details' },
  { id: 'education', title: 'Education & Skills' },
  { id: 'documents', title: 'Documents & Portfolio' },
  { id: 'review', title: 'Review' }
];

export default function PostCvPage() {
  useSEO({
    title: 'Post Your CV / Profile | AdHub Kenya',
    description: 'Create a professional candidate profile on AdHub Kenya and get discovered by top employers.',
    canonicalPath: '/post-cv'
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Load auto-save draft
  const savedDraft = JSON.parse(localStorage.getItem('adhub_cv_draft') || '{}');

  // eslint-disable-next-line no-unused-vars
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: savedDraft.title || '',
      description: savedDraft.description || '',
      category: 'seeking-work',
      location: savedDraft.location || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      // CV Attributes mapping
      attrs: savedDraft.attrs || {
        subcategory: '',
        industry: '',
        availability: '',
        employmentStatus: '',
        workArrangement: '',
        experienceLevel: '',
        educationLevel: '',
        employmentType: [],
        languages: [],
        skills: '',
        salaryMin: '',
        salaryMax: '',
        salaryPeriod: 'Monthly'
      },
      portfolioLinks: savedDraft.portfolioLinks || ['']
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(savedDraft.photoPreview || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save form data on change
  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();
  useEffect(() => {
    const draftToSave = { ...formValues, photoPreview };
    localStorage.setItem('adhub_cv_draft', JSON.stringify(draftToSave));
  }, [formValues, photoPreview]);

  // Auth Guard
  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary/60 mb-6">
        <Lock className="h-8 w-8" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">Login Required</h3>
      <p className="text-muted-foreground mb-8">You need to be logged in to post a CV profile</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/login" className="rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:opacity-95">Login</Link>
        <Link to="/register" className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted">Create Account</Link>
      </div>
    </div>
  );

  const handleNext = async () => {
    // Basic validation per step before proceeding
    if (currentStep === 0) {
      if (!formValues.title || !formValues.attrs.subcategory || !formValues.description || !formValues.location) {
        toast.error('Please fill in all required basic info and location.');
        return;
      }
    } else if (currentStep === 1) {
      if (!formValues.attrs.industry || !formValues.attrs.experienceLevel || !formValues.attrs.employmentStatus) {
        toast.error('Please complete professional details.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formValues.attrs.educationLevel || !formValues.attrs.skills) {
        toast.error('Please complete education and provide key skills.');
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev - 1);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be less than 5MB"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Upload CV document if exists
      let cvFileUrl = null;
      if (cvFile) {
        cvFileUrl = await uploadCvDocument(cvFile, user.id);
        if (!cvFileUrl) {
          toast.error("Failed to upload CV document. You can try submitting without it.");
          setIsSubmitting(false);
          return;
        }
      }

      // Clean portfolio links
      const cleanLinks = data.portfolioLinks.filter(l => l.trim() !== '');

      // 2. Prepare listing payload
      const listingData = {
        title: data.title,
        description: data.description,
        price: 0, // Jobs/CVs don't use the standard price column
        category: 'seeking-work',
        location: data.location,
        phone: data.phone,
        whatsapp: data.whatsapp,
        specs: {
          ...data.attrs,
          portfolioLinks: cleanLinks,
          cvFileUrl: cvFileUrl,
          verified: false // defaults to false
        }
      };

      // 3. Create listing with photo as primary image
      const images = photoFile ? [photoFile] : [];
      const listing = await createListing(listingData, images);
      
      // Clear draft
      localStorage.removeItem('adhub_cv_draft');
      toast.success('CV Profile published successfully!');
      navigate(`/listing/${listing.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block";

  // Helpers to get schema options
  const getOptions = (id) => cvSchema.find(a => a.id === id)?.options || [];

  return (
    <div className="min-h-screen bg-background py-8 pb-24 md:pb-8">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Post Your CV Profile</h1>
          <p className="text-muted-foreground mt-2">Get discovered by top employers. A complete profile ranks higher.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full -z-10 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} 
              />
            </div>
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= idx ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border-2 border-background shadow-sm'}`}>
                  {currentStep > idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-foreground hidden sm:block bg-background px-1">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8">
            {/* STEP 1: Basic Info */}
            <div className={currentStep === 0 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Professional Title *</label>
                  <input {...register('title', { required: true })} className={inputClass} placeholder="e.g. Senior Software Engineer, Experienced Driver Class BCE" />
                </div>
                <div>
                  <label className={labelClass}>Profession / Field *</label>
                  <select {...register('attrs.subcategory', { required: true })} className={inputClass}>
                    <option value="">Select your main profession...</option>
                    <option value="IT & Technology">IT & Technology</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Healthcare & Medical">Healthcare & Medical</option>
                    <option value="Education & Teaching">Education & Teaching</option>
                    <option value="Transport & Logistics">Transport & Logistics</option>
                    <option value="Skilled Trades">Skilled Trades</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Admin & Management">Admin & Management</option>
                    <option value="Casual & Domestic">Casual & Domestic</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location (County & Town) *</label>
                  <Controller
                    control={control}
                    name="location"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CountyTownSelect value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>Professional Summary *</label>
                  <textarea {...register('description', { required: true })} className={`${inputClass} min-h-[120px] resize-y`} placeholder="Describe your experience, key strengths, and what you bring to a role..." />
                  <p className="text-xs text-muted-foreground mt-2">Write a compelling summary. Employers read this first.</p>
                </div>
              </div>
            </div>

            {/* STEP 2: Professional Details */}
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6">Professional Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Industry *</label>
                    <select {...register('attrs.industry', { required: true })} className={inputClass}>
                      <option value="">Select industry...</option>
                      {getOptions('industry').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Experience Level *</label>
                    <select {...register('attrs.experienceLevel', { required: true })} className={inputClass}>
                      <option value="">Select experience...</option>
                      {getOptions('experienceLevel').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Current Employment Status *</label>
                    <select {...register('attrs.employmentStatus', { required: true })} className={inputClass}>
                      <option value="">Select status...</option>
                      {getOptions('employmentStatus').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Availability / Notice Period *</label>
                    <select {...register('attrs.availability', { required: true })} className={inputClass}>
                      <option value="">Select availability...</option>
                      {getOptions('availability').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Work Arrangement *</label>
                    <select {...register('attrs.workArrangement', { required: true })} className={inputClass}>
                      <option value="">Select arrangement...</option>
                      {getOptions('workArrangement').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>Employment Type Sought</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getOptions('employmentType').map(o => (
                      <label key={o} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-secondary transition-colors">
                        <input type="checkbox" value={o} {...register('attrs.employmentType')} className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">{o}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* STEP 3: Education & Skills */}
            <div className={currentStep === 2 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6">Education & Skills</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Highest Education Level *</label>
                  <select {...register('attrs.educationLevel', { required: true })} className={inputClass}>
                    <option value="">Select education...</option>
                    {getOptions('educationLevel').map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className={labelClass}>Key Skills * (Comma separated)</label>
                  <input {...register('attrs.skills', { required: true })} className={inputClass} placeholder="e.g. React, Node.js, Project Management, Excel" />
                  <div className="mt-2">
                    <QuickChips 
                      items={['Customer Service', 'Data Entry', 'Microsoft Office', 'Team Leadership', 'Digital Marketing']} 
                      onSelect={(skill) => {
                        const current = formValues.attrs.skills;
                        setValue('attrs.skills', current ? `${current}, ${skill}` : skill);
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Spoken Languages</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getOptions('languages').map(o => (
                      <label key={o} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-secondary transition-colors">
                        <input type="checkbox" value={o} {...register('attrs.languages')} className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">{o}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                  <h3 className="font-semibold text-sm mb-3">Salary Expectations (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Period</label>
                      <select {...register('attrs.salaryPeriod')} className={inputClass}>
                        <option value="Monthly">Monthly</option>
                        <option value="Annual">Annual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Minimum (KES)</label>
                      <input type="number" {...register('attrs.salaryMin')} className={inputClass} placeholder="e.g. 50000" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Maximum (KES)</label>
                      <input type="number" {...register('attrs.salaryMax')} className={inputClass} placeholder="e.g. 100000" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* STEP 4: Documents & Portfolio */}
            <div className={currentStep === 3 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6">Documents & Profile Photo</h2>
              <div className="space-y-6">
                
                {/* Photo Upload */}
                <div className="p-4 border border-border rounded-xl">
                  <label className={labelClass}>Profile Photo</label>
                  <p className="text-xs text-muted-foreground mb-4">A professional headshot increases your chances of getting hired.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      <label htmlFor="photo-upload" className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold cursor-pointer hover:bg-secondary inline-block">
                        Upload Photo
                      </label>
                      {photoPreview && (
                        <button type="button" className="ml-2 text-sm text-destructive hover:underline" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>Remove</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="p-4 border border-border rounded-xl bg-primary/5 border-primary/20">
                  <label className={labelClass}>Upload CV Document (PDF / DOC)</label>
                  <p className="text-xs text-muted-foreground mb-4">Upload your full CV so employers can review your detailed history.</p>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors bg-background">
                      <FileText className="w-8 h-8 text-primary/60 mb-2" />
                      <span className="text-sm font-medium text-foreground">{cvFile ? cvFile.name : 'Click to select CV document'}</span>
                      <span className="text-xs text-muted-foreground mt-1">PDF or Word Doc (Max 5MB)</span>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size > 5 * 1024 * 1024) toast.error("File must be less than 5MB");
                        else setCvFile(file);
                      }} />
                    </label>
                  </div>
                </div>

                {/* Portfolio Links */}
                <div>
                  <label className={labelClass}>Portfolio / LinkedIn Links</label>
                  {formValues.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="url" 
                          {...register(`portfolioLinks.${index}`)} 
                          className={`${inputClass} pl-9`} 
                          placeholder="https://linkedin.com/in/yourprofile" 
                        />
                      </div>
                      {index === formValues.portfolioLinks.length - 1 ? (
                        <button type="button" onClick={() => setValue('portfolioLinks', [...formValues.portfolioLinks, ''])} className="px-4 py-2 bg-secondary text-foreground font-semibold text-sm rounded-xl">Add</button>
                      ) : (
                        <button type="button" onClick={() => setValue('portfolioLinks', formValues.portfolioLinks.filter((_, i) => i !== index))} className="px-4 py-2 bg-destructive/10 text-destructive font-semibold text-sm rounded-xl"><Trash2 className="w-4 h-4"/></button>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* STEP 5: Review */}
            <div className={currentStep === 4 ? 'block' : 'hidden'}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Ready to publish!</h2>
                <p className="text-muted-foreground mt-2">Review your details before submitting to the candidate marketplace.</p>
              </div>

              <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-secondary rounded-full border border-border overflow-hidden shrink-0 flex items-center justify-center">
                    {photoPreview ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{formValues.title || 'Untitled Profile'}</h3>
                    <p className="text-sm text-muted-foreground">{formValues.attrs?.subcategory} • {formValues.attrs?.experienceLevel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground block text-xs">Location</span><span className="font-semibold">{formValues.location || '-'}</span></div>
                  <div><span className="text-muted-foreground block text-xs">Industry</span><span className="font-semibold">{formValues.attrs?.industry || '-'}</span></div>
                  <div><span className="text-muted-foreground block text-xs">Availability</span><span className="font-semibold">{formValues.attrs?.availability || '-'}</span></div>
                  <div><span className="text-muted-foreground block text-xs">Education</span><span className="font-semibold">{formValues.attrs?.educationLevel || '-'}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground block text-xs">Skills</span><span className="font-semibold">{formValues.attrs?.skills || '-'}</span></div>
                </div>

                {!cvFile && (
                  <div className="mt-6 flex items-start gap-2 p-3 bg-amber-500/10 text-amber-600 rounded-lg text-sm border border-amber-500/20">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>You haven't uploaded a CV document. Profiles with attached CVs get 3x more employer contacts.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                 <label className={labelClass}>Contact Details</label>
                 <div className="grid grid-cols-2 gap-4">
                    <input {...register('phone', { required: true })} className={inputClass} placeholder="Phone Number" />
                    <input {...register('whatsapp')} className={inputClass} placeholder="WhatsApp Number" />
                 </div>
              </div>
            </div>

          </div>

          {/* Footer Navigation */}
          <div className="bg-secondary/20 p-6 border-t border-border flex items-center justify-between">
            <button 
              type="button" 
              onClick={currentStep === 0 ? () => navigate(-1) : handleBack}
              className="px-6 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-secondary transition-colors"
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Profile'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
