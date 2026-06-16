'use client';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/browse?keyword=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">A</span>
          <span className="logo-text">
            <span><span className="ad">Ad</span><span className="hub">Hub</span></span>
            <span className="kenya">Kenya</span>
          </span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c8065" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" placeholder="Search ads..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <ThemeSwitcher />
          <Link href="/post-ad" className="btn btn-accent btn-sm">
            + Post Ad
          </Link>
          {user ? (
            <>
              <Link href="/my-ads" className="btn btn-ghost btn-sm">My Ads</Link>
              <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-outline btn-sm" style={{display:'flex'}}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
