import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      // Check admin role in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) throw new Error('Could not verify your admin role.');

      const adminRoles = ['super_admin', 'admin', 'moderator', 'support', 'finance', 'content_reviewer', 'analytics_viewer'];
      if (!adminRoles.includes(profile.role)) {
        await supabase.auth.signOut();
        throw new Error('Access denied. You do not have admin privileges.');
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/20 px-4">
      <div className="w-full max-w-md">
        
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <ShieldAlert className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">AdHub Kenya Secure Access</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-foreground">Sign In</h2>

          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@adhubkenya.co.ke"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</> : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">
              ← Back to AdHub Kenya
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          🔒 Secured with end-to-end encryption. All sessions are monitored.
        </p>
      </div>
    </div>
  );
}
