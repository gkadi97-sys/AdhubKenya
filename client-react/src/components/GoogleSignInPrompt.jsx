import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M45.5 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.1c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.7-9.5 6.7-16.2z"/>
      <path fill="#34A853" d="M24 46c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.3-8.8 2.3-6.7 0-12.4-4.5-14.5-10.6H2.2v5.7C6.2 41.8 14.5 46 24 46z"/>
      <path fill="#FBBC05" d="M9.5 26.4c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-5.7H2.2C.8 13.9 0 18.9 0 22.5c0 3.6.8 7 2.2 10.1l7.3-6.2z"/>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.5 0 24 0 14.5 0 6.2 5.2 2.2 12.9l7.3 5.7C11.6 14 17.3 9.5 24 9.5z"/>
    </svg>
  );
}

const STORAGE_KEY = 'adhub_signin_bar_dismissed_v2';

export default function GoogleSignInPrompt() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Wait for auth to fully resolve before deciding to show
    if (authLoading) return;
    if (user) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 4500);
    return () => clearTimeout(timer);
  }, [authLoading, user]);

  const dismiss = () => {
    setClosing(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 400);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      setGoogleLoading(false);
    }
  };

  if (!visible || user) return null;

  return (
    <>
      {/* ── Slim bottom bar — non-blocking, no dark overlay ── */}
      <div
        role="complementary"
        aria-label="Sign in prompt"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          border-t border-border bg-card shadow-elevated
          transition-transform duration-400 ease-out
          ${closing ? 'translate-y-full' : 'translate-y-0'}
        `}
        style={{
          animation: closing ? undefined : 'gsipSlideUp 0.45s cubic-bezier(0,0,0.2,1) both',
        }}
      >
        {/* Thin accent stripe at the top */}
        <div className="h-[3px] w-full gradient-emerald" />

        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">

          {/* Icon + copy */}
          <div className="hidden shrink-0 sm:flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">
              Get more from AdHub Kenya
            </p>
            <p className="hidden sm:block text-xs text-muted-foreground mt-0.5 leading-snug">
              Save listings, message sellers &amp; post free ads in seconds.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Google button */}
            <button
              id="bar-google-signin-btn"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground shadow-sm transition hover:bg-secondary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {googleLoading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                : <GoogleIcon />
              }
              <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
            </button>

            {/* Email fallback — text link on mobile, button on desktop */}
            <Link
              to="/login"
              onClick={dismiss}
              className="hidden sm:flex items-center rounded-xl border border-border bg-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              Sign in
            </Link>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss sign-in prompt"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gsipSlideUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
