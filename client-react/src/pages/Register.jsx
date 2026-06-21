import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CountyTownSelect from '@/components/CountyTownSelect';
import { useSEO } from '@/lib/useSEO';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M45.5 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.1c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.7-9.5 6.7-16.2z"/>
      <path fill="#34A853" d="M24 46c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.3-8.8 2.3-6.7 0-12.4-4.5-14.5-10.6H2.2v5.7C6.2 41.8 14.5 46 24 46z"/>
      <path fill="#FBBC05" d="M9.5 26.4c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-5.7H2.2C.8 13.9 0 18.9 0 22.5c0 3.6.8 7 2.2 10.1l7.3-6.2z"/>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.5 0 24 0 14.5 0 6.2 5.2 2.2 12.9l7.3 5.7C11.6 14 17.3 9.5 24 9.5z"/>
    </svg>
  );
}


const COUNTIES = ['Nairobi','Mombasa','Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Garissa','Wajir','Mandera','Marsabit','Isiolo','Meru','Tharaka-Nithi','Embu','Kitui','Machakos','Makueni','Nyandarua','Nyeri','Kirinyaga',"Murang'a",'Kiambu','Turkana','West Pokot','Samburu','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia','Nakuru','Narok','Kajiado','Kericho','Bomet','Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisumu','Homa Bay','Migori','Kisii','Nyamira'];

export default function RegisterPage() {
  useSEO({
    title: 'Create an Account | AdHub Kenya',
    description: 'Join AdHub Kenya for free. Create an account to post free ads, sell your items, and connect with buyers across all 47 counties in Kenya.',
    canonicalPath: '/register'
  });
  const { register, loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/post-ad';
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
      navigate(redirectTo, { replace: true });
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
          {error && <div className="alert alert-error" style={{marginBottom:20}}>{error}</div>}

          {/* ── Google Sign-Up (Primary CTA) ── */}
          <button
            id="google-register-btn"
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '13px 20px',
              background: '#fff', color: '#3c4043',
              border: '1px solid #dadce0', borderRadius: 8,
              fontWeight: 600, fontSize: '0.95rem',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              marginBottom: 20,
              opacity: googleLoading ? 0.75 : 1,
            }}
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>or create with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>
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
