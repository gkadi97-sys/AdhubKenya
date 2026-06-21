import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CountyTownSelect from '@/components/CountyTownSelect';
import { useSEO } from '@/lib/useSEO';
import { Loader2 } from 'lucide-react';

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

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function RegisterPage() {
  useSEO({
    title: 'Create an Account | AdHub Kenya',
    description: 'Join AdHub Kenya for free. Create an account to post free ads, sell your items, and connect with buyers across all 47 counties in Kenya.',
    canonicalPath: '/register'
  });
  const { register, loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/post-ad';
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', whatsapp:'', location:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="flex min-h-[calc(100vh-68px)] items-center justify-center p-6 bg-background py-12">
      <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-black text-primary-foreground shadow-sm">
              A
            </span>
            <span className="font-display text-2xl font-black text-foreground">
              <span className="text-primary">Ad</span>Hub
              <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kenya</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Create your account</h1>
          <p className="text-sm text-muted-foreground">Start selling for free in minutes</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/* ── Google Sign-Up (Primary CTA) ── */}
          <button
            id="google-register-btn"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-secondary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 mb-6"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
            {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or create with email</span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Full Name <span className="text-destructive">*</span></label>
              <input 
                className={inputClass} 
                name="name" 
                value={form.name} 
                onChange={handleChange}
                placeholder="e.g. John Kamau" 
                required 
                autoFocus 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Email Address <span className="text-destructive">*</span></label>
              <input 
                className={inputClass} 
                name="email" 
                type="email" 
                value={form.email}
                onChange={handleChange} 
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Password <span className="text-destructive">*</span></label>
              <input 
                className={inputClass} 
                name="password" 
                type="password" 
                value={form.password}
                onChange={handleChange} 
                placeholder="Min. 6 characters" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Phone Number <span className="text-destructive">*</span></label>
                <input 
                  className={inputClass} 
                  name="phone" 
                  value={form.phone}
                  onChange={handleChange} 
                  placeholder="0712 345 678" 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">WhatsApp Number</label>
                <input 
                  className={inputClass} 
                  name="whatsapp" 
                  value={form.whatsapp}
                  onChange={handleChange} 
                  placeholder="0712 345 678" 
                />
              </div>
            </div>

            <div className="mt-1">
              <CountyTownSelect
                value={form.location}
                onChange={(loc) => setForm(f => ({ ...f, location: loc }))}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'Creating account...' : '🚀 Create Free Account'}
            </button>

            <p className="mt-2 text-center text-xs text-muted-foreground/80">
              By registering you agree to our Terms of Use and Privacy Policy
            </p>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">Sign in &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
