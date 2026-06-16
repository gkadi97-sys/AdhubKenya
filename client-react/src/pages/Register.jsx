
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CountyTownSelect from '@/components/CountyTownSelect';


const COUNTIES = ['Nairobi','Mombasa','Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Garissa','Wajir','Mandera','Marsabit','Isiolo','Meru','Tharaka-Nithi','Embu','Kitui','Machakos','Makueni','Nyandarua','Nyeri','Kirinyaga',"Murang'a",'Kiambu','Turkana','West Pokot','Samburu','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia','Nakuru','Narok','Kajiado','Kericho','Bomet','Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisumu','Homa Bay','Migori','Kisii','Nyamira'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', whatsapp:'', location:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/post-ad');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'calc(100vh - 68px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',background:'radial-gradient(circle at 70% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)'}}>
      <div style={{width:'100%',maxWidth:500}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{background:'var(--primary)',color:'#fff',width:42,height:42,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.2rem'}}>A</span>
            <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.5rem'}}>
              <span style={{color:'var(--primary-light)'}}>Ad</span>Hub
              <span style={{color:'var(--accent)',fontSize:'0.65rem',letterSpacing:2,textTransform:'uppercase',marginLeft:4}}>Kenya</span>
            </span>
          </div>
          <h1 style={{fontSize:'1.6rem',marginBottom:6}}>Create your account</h1>
          <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>Start selling for free in minutes</p>
        </div>

        <div className="card" style={{padding:32}}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. John Kamau" required autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-control" name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-control" name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters" required />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-control" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="0712 345 678" required />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number</label>
                <input className="form-control" name="whatsapp" value={form.whatsapp}
                  onChange={handleChange} placeholder="0712 345 678" />
              </div>
            </div>

            <div className="form-group">
              <CountyTownSelect
                value={form.location}
                onChange={(loc) => setForm(f => ({ ...f, location: loc }))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:8}}>
              {loading ? '⏳ Creating account...' : '🚀 Create Free Account'}
            </button>

            <p style={{fontSize:'0.75rem',color:'var(--text-muted)',textAlign:'center',marginTop:16}}>
              By registering you agree to our Terms of Use and Privacy Policy
            </p>
          </form>
        </div>

        <p style={{textAlign:'center',marginTop:20,color:'var(--text-secondary)',fontSize:'0.9rem'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'var(--primary-light)',fontWeight:600}}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
