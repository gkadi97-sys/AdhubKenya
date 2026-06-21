import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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

export default function LoginPage() {
  useSEO({
    title: 'Sign In | AdHub Kenya',
    description: 'Sign in to your AdHub Kenya account to post ads, manage your listings, and connect with buyers and sellers across Kenya.',
    canonicalPath: '/login'
  });
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/my-ads';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const isFromListing = redirectTo.startsWith('/listing/');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Redirect handled by Supabase OAuth callback
    } catch (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 30% 50%, var(--primary-glow) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ background: 'var(--primary)', color: '#fff', width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>A</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem' }}>
              <span style={{ color: 'var(--primary-light)' }}>Ad</span>Hub
              <span style={{ color: 'var(--accent)', fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase', marginLeft: 4 }}>Kenya</span>
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Welcome to AdHub Kenya</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isFromListing ? "Sign in to view the seller's contact details" : 'Sign in to manage your ads and saved listings'}
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          {/* ── Google Sign-In (Primary CTA) ── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '13px 20px',
              background: '#fff', color: '#3c4043',
              border: '1px solid #dadce0', borderRadius: 8,
              fontWeight: 600, fontSize: '0.95rem',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.2s, background 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              opacity: googleLoading ? 0.75 : 1,
            }}
            onMouseOver={e => { if (!googleLoading) e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'; }}
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          {/* ── Divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          {/* ── Email form (toggled or always shown) ── */}
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              style={{
                width: '100%', padding: '12px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Use Email & Password
            </button>
          ) : (
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
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one free →</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          By continuing, you agree to AdHub Kenya's{' '}
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
