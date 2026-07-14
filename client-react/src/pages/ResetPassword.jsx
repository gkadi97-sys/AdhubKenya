import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSEO } from '@/lib/useSEO';
import { Loader2 } from 'lucide-react';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

export default function ResetPasswordPage() {
  useSEO({
    title: 'Reset Password | AdHub Kenya',
    description: 'Set a new password for your AdHub Kenya account.',
  });

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is in a recovery session
    // eslint-disable-next-line no-unused-vars
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
      
      alert('Password updated successfully. You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-68px)] items-center justify-center p-6 bg-background">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">New Password</label>
            <input 
              className={inputClass} 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter new password" 
              required 
              autoFocus 
              minLength={8}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || password.length < 8} 
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
