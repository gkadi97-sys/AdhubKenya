
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createListing } from '@/lib/api';
import CountyTownSelect from '@/components/CountyTownSelect';
import ItemAttributesSelect from '@/components/ItemAttributesSelect';
import AutoSparesForm from '@/components/AutoSparesForm';
import VehicleForm from '@/components/VehicleForm';
import PropertyForm from '@/components/PropertyForm';
import { TOP_CATEGORIES } from '@/lib/categoryData';
import { Link } from 'react-router-dom';

const STANDARD_CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
const VEHICLE_CONDITIONS = ['Brand New', 'Foreign Used', 'Locally Used', 'Accident Damaged', 'Rebuilt'];

export default function PostAdPage() {
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
    <div className="empty-state" style={{ padding: '100px 20px' }}>
      <div className="icon">🔐</div>
      <h3>Login Required</h3>
      <p>You need to be logged in to post an ad</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-outline">Create Account</Link>
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
    const isAutoSpares = form.category === 'auto-spares';
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

  const isVehicle = form.category === 'vehicles' || form.category === 'commercial-vehicles';
  const isProperty = form.category === 'property' || form.category === 'land-plots';
  const isAutoSpares = form.category === 'auto-spares';
  const CONDITION_CATEGORIES = ['phones-tablets', 'electronics', 'home-furniture', 'fashion', 'repair-construction', 'commercial-equipment', 'leisure', 'babies-kids', 'auto-spares'];
  const showStandardCondition = CONDITION_CATEGORIES.includes(form.category) && !isProperty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.price || !form.category || !form.location || !form.phone) {
      setError('Please fill in all required fields'); return;
    }
    if (isVehicle && !form.condition) {
      setError('Please select vehicle condition'); return;
    }
    setLoading(true);
    try {
      const listingData = { ...form };
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

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: (isVehicle || isProperty) ? 960 : 780 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Post a Free Ad</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to list your item for sale</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          {/* ── Category & Title ───────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>📋 Basic Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {TOP_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                  </select>
                </div>

                {/* Condition for vehicles */}
                {isVehicle && (
                  <div className="form-group">
                    <label className="form-label">Condition *</label>
                    <select className="form-control" name="condition" value={form.condition} onChange={handleChange} required>
                      <option value="">Select Condition</option>
                      {VEHICLE_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                {/* Condition for non-vehicle categories */}
                {showStandardCondition && (
                  <div className="form-group">
                    <label className="form-label">Condition *</label>
                    <select className="form-control" name="condition" value={form.condition} onChange={handleChange} required>
                      <option value="">Select Condition</option>
                      {STANDARD_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Ad Title *</label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange}
                  placeholder={isVehicle ? 'e.g. 2019 Toyota Harrier 2.0 Sunroof - Pearl White' : (isProperty ? 'e.g. 4 Bedroom Villa in Karen with Pool' : 'e.g. iPhone 13 Pro Max - 256GB')}
                  maxLength={100} required />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{form.title.length}/100 characters</div>
              </div>

              {/* Vehicle-specific comprehensive form */}
              {isVehicle && (
                <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <VehicleForm values={attrs} onChange={setAttrs} />
                </div>
              )}

              {/* Property-specific comprehensive form */}
              {isProperty && (
                <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <PropertyForm values={attrs} onChange={setAttrs} />
                </div>
              )}

              {/* Auto Spares comprehensive form */}
              {isAutoSpares && (
                <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <AutoSparesForm values={attrs} onChange={setAttrs} />
                </div>
              )}

              {/* Non-vehicle attributes */}
              {!isVehicle && !isProperty && !isAutoSpares && form.category && (
                <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <ItemAttributesSelect category={form.category} values={attrs} onChange={setAttrs} />
                </div>
              )}

              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Description *</label>
                <textarea className="form-control" name="description" value={form.description} onChange={handleChange}
                  placeholder={isVehicle
                    ? 'Describe the vehicle — any extras, reason for selling, service history, etc.'
                    : 'Describe your item in detail — condition, features, reason for selling...'
                  }
                  required rows={5} />
              </div>
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>💰 Pricing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Asking Price (KES) *</label>
                  <input className="form-control" name="price" type="number" value={form.price} onChange={handleChange}
                    placeholder="e.g. 2500000" min="0" required />
                </div>
                <div style={{ paddingTop: 30 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" name="negotiable" checked={form.negotiable} onChange={handleChange}
                      style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                    Price negotiable
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ── Location ───────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>📍 Location</h3>
              <CountyTownSelect
                value={form.location}
                onChange={(loc) => setForm(f => ({ ...f, location: loc }))}
                required
              />
            </div>
          </div>

          {/* ── Photos ─────────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 8, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                🖼️ Photos {isVehicle ? '(up to 10)' : '(up to 5)'}
              </h3>
              {isVehicle && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Include exterior, interior, engine bay, dashboard, and tyre photos for faster sales.
                </p>
              )}
              <div className="upload-area" onClick={() => !processingImages && document.getElementById('img-input').click()} style={{ opacity: processingImages ? 0.6 : 1, cursor: processingImages ? 'not-allowed' : 'pointer' }}>
                <div className="icon">{processingImages ? '🔍' : '📷'}</div>
                <p>{processingImages ? blurStatus || 'Scanning for number plates...' : 'Click to upload photos'}</p>
                <p style={{ fontSize: '0.78rem', marginTop: 4 }}>JPG, PNG, WEBP — Max 5MB each</p>
                <input id="img-input" type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} disabled={processingImages} />
              </div>
              {previews.length > 0 && (
                <div className="upload-previews">
                  {previews.map((src, i) => (
                    <div key={i} className="upload-preview">
                      <img src={src} alt="" />
                      <div className="remove" onClick={() => removeImage(i)}>✕</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Contact ────────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: 32 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>📱 Contact Details</h3>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="0712 345 678" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">WhatsApp Number</label>
                  <input className="form-control" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="0712 345 678" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-accent btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Posting...' : '🚀 Post Ad for Free'}
          </button>
        </form>
      </div>
    </div>
  );
}
