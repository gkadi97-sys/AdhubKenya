'use client';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/browse?keyword=${encodeURIComponent(search)}`);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Top announcement bar */}
      <div style={{
        background: 'var(--bg-2)', color: 'var(--text-secondary)', textAlign: 'center',
        padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600,
        letterSpacing: '0.3px', lineHeight: 1.4, borderBottom: '1px solid var(--border)'
      }}>
        <span className="breath-text">🚧 Welcome to AdHub Kenya! Our devs are still tinkering</span>
      </div>

      <nav className="navbar" style={{ top: 0 }}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">A</span>
            <span className="logo-text">
              <span><span className="ad">Ad</span><span className="hub">Hub</span></span>
              <span className="kenya">Kenya</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c8065" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Search ads..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </form>

          {/* Desktop actions */}
          <div className="navbar-actions">
            <ThemeSwitcher />
            <Link to="/post-ad" className="btn btn-accent btn-sm" style={{ fontWeight: 700, padding: '8px 20px' }}>+ Post Ad Free</Link>
            {user ? (
              <div className="navbar-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px' }}>
                <button title="Saved" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>❤️</button>
                <button title="Messages" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>💬</button>
                <button title="Notifications" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🔔</button>
                <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                <Link to="/my-ads" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }}>My Ads</Link>
                <button onClick={logout} className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm navbar-desktop-only">Login</Link>
                <Link to="/register" className="btn btn-outline btn-sm navbar-desktop-only">Register</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span style={{
                display: 'flex', flexDirection: 'column', gap: 5, width: 22,
              }}>
                <span style={{
                  display: 'block', height: 2, borderRadius: 2,
                  background: 'var(--text)',
                  transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                  transition: 'transform 0.25s ease',
                }} />
                <span style={{
                  display: 'block', height: 2, borderRadius: 2,
                  background: 'var(--text)',
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 0.15s ease',
                }} />
                <span style={{
                  display: 'block', height: 2, borderRadius: 2,
                  background: 'var(--text)',
                  transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.25s ease',
                }} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="navbar-mobile-drawer" onClick={closeMenu}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              onClick={e => e.stopPropagation()}>

              {/* Mobile search */}
              <form onSubmit={handleSearch} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '8px 14px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search ads..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text)', fontSize: '0.95rem' }}
                />
              </form>

              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

              {user ? (
                <>
                  <Link to="/my-ads" className="btn btn-ghost btn-sm" onClick={closeMenu}
                    style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                    📋 My Ads
                  </Link>
                  <button onClick={() => { logout(); closeMenu(); }}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '10px 14px', textAlign: 'left' }}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}
                    style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                    🔑 Login
                  </Link>
                  <Link to="/register" className="btn btn-accent btn-sm" onClick={closeMenu}
                    style={{ justifyContent: 'center', padding: '10px 14px' }}>
                    🎉 Create Free Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
