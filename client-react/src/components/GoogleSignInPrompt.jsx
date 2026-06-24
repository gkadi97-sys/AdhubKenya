import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M45.5 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.1c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.7-9.5 6.7-16.2z"/>
      <path fill="#34A853" d="M24 46c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.3-8.8 2.3-6.7 0-12.4-4.5-14.5-10.6H2.2v5.7C6.2 41.8 14.5 46 24 46z"/>
      <path fill="#FBBC05" d="M9.5 26.4c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9v-5.7H2.2C.8 13.9 0 18.9 0 22.5c0 3.6.8 7 2.2 10.1l7.3-6.2z"/>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.5 0 24 0 14.5 0 6.2 5.2 2.2 12.9l7.3 5.7C11.6 14 17.3 9.5 24 9.5z"/>
    </svg>
  );
}

const STORAGE_KEY = 'adhub_google_prompt_dismissed';

export default function GoogleSignInPrompt() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait until auth has resolved — prevents showing the modal to logged-in users
    // before their session is loaded (user is `undefined` during hydration).
    if (authLoading) return;
    if (user) return;
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Show after 4 seconds on first visit
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [authLoading, user]);

  const dismiss = () => {
    setExiting(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 350);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      setLoading(false);
    }
  };

  if (!visible || user) return null;

  return (
    <>
      {/* Backdrop - clicking it dismisses */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999,
          animation: exiting ? 'fadeOut 0.3s ease forwards' : 'fadeIn 0.3s ease',
        }}
      />

      {/* Slide-up card */}
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '100%', maxWidth: 460,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          padding: '32px 28px 40px',
          zIndex: 1000,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
          animation: exiting
            ? 'slideDown 0.35s cubic-bezier(0.4,0,1,1) forwards'
            : 'slideUp 0.4s cubic-bezier(0,0,0.2,1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--bg-2)', border: 'none',
            width: 32, height: 32, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1,
          }}
        >×</button>

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 9999, margin: '0 auto 24px' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🛒</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>
            Join Kenya's #1 Marketplace
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Sign in to save listings, contact sellers, and post your ads for free.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {[
            { icon: '💬', text: 'Message sellers directly' },
            { icon: '❤️', text: 'Save your favourite listings' },
            { icon: '📢', text: 'Post unlimited free ads' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Google CTA */}
        <button
          id="home-google-signin-btn"
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: '14px 20px',
            background: '#fff', color: '#3c4043',
            border: '1px solid #dadce0', borderRadius: 10,
            fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'box-shadow 0.2s',
            marginBottom: 12,
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
          onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
        >
          <GoogleIcon />
          {loading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <Link
          to="/login"
          onClick={dismiss}
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            padding: '12px',
            border: '1px solid var(--border)', borderRadius: 10,
            color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--surface-hover)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
        >
          Use Email & Password
        </Link>

        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          By continuing you agree to our{' '}
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }} onClick={dismiss}>Terms</Link>
          {' '}&amp;{' '}
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }} onClick={dismiss}>Privacy Policy</Link>.
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(0); }
          to   { transform: translateX(-50%) translateY(110%); }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </>
  );
}
