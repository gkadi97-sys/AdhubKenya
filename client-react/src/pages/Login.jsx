
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/my-ads');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'calc(100vh - 68px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',background:'radial-gradient(circle at 30% 50%, rgba(0,165,80,0.05) 0%, transparent 60%)'}}>
      <div style={{width:'100%',maxWidth:440}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{background:'var(--primary)',color:'#fff',width:42,height:42,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.2rem'}}>A</span>
            <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.5rem'}}>
              <span style={{color:'var(--primary-light)'}}>Ad</span>Hub
              <span style={{color:'var(--accent)',fontSize:'0.65rem',letterSpacing:2,textTransform:'uppercase',marginLeft:4}}>Kenya</span>
            </span>
          </div>
          <h1 style={{fontSize:'1.6rem',marginBottom:6}}>Welcome back</h1>
          <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>Sign in to manage your ads</p>
        </div>

        <div className="card" style={{padding:32}}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Your password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:8}}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{textAlign:'center',marginTop:20,color:'var(--text-secondary)',fontSize:'0.9rem'}}>
          Don't have an account?{' '}
          <Link to="/register" style={{color:'var(--primary-light)',fontWeight:600}}>Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
