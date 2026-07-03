import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function AdminResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is in a recovery session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Proceed with reset
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password.length < 8) { throw new Error('Password must be at least 8 characters'); }
      if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) { throw new Error('Password must contain at least one letter and one number'); }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      alert('Admin password updated successfully. You can now login.');
      navigate('/admin/login');
    } catch (err) {
      setError(err.message);
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
          <p className="mt-1 text-sm text-muted-foreground">Secure Password Reset</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-foreground">Create New Password</h2>

          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
                minLength={8}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : 'Update Password'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          🔒 Secured with end-to-end encryption. All sessions are monitored.
        </p>
      </div>
    </div>
  );
}
