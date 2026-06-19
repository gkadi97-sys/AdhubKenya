'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { verifyPhone, verifyEmail, submitBusinessVerification } from '@/lib/api';
import Link from 'next/link';

export default function VerifyPage() {
  const { user } = useAuth();
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [status, setStatus] = useState('');

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    try {
      setStatus('Verifying phone...');
      await verifyPhone(phoneCode);
      setStatus('Phone verified successfully!');
    } catch (err) { setStatus('Error: ' + err.message); }
  };

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    try {
      setStatus('Verifying email...');
      await verifyEmail(emailCode);
      setStatus('Email verified successfully!');
    } catch (err) { setStatus('Error: ' + err.message); }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('Submitting business info...');
      await submitBusinessVerification({ businessName });
      setStatus('Business submitted for review!');
    } catch (err) { setStatus('Error: ' + err.message); }
  };

  if (!user) return (
    <div className="empty-state" style={{padding:'100px 20px'}}>
      <div className="icon">🔐</div>
      <h3>Login Required</h3>
      <Link href="/login" className="btn btn-primary">Login</Link>
    </div>
  );

  return (
    <div style={{padding:'40px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:'1.8rem'}}>My Dashboard</h1>
          <div style={{display:'flex',gap:16,marginTop:16}}>
            <Link href="/my-ads" style={{color:'var(--text-muted)'}}>My Ads</Link>
            <Link href="/my-alerts" style={{color:'var(--text-muted)'}}>Saved Searches</Link>
            <Link href="/analytics" style={{color:'var(--text-muted)'}}>Analytics</Link>
            <Link href="/verify" style={{color:'var(--primary-light)',fontWeight:600,textDecoration:'underline'}}>Verify Account</Link>
          </div>
        </div>

        <div style={{maxWidth:600}}>
          {status && <div style={{padding:12,background:'var(--primary-glow)',color:'var(--primary-light)',border:'1px solid var(--primary)',marginBottom:20,borderRadius:'var(--radius)'}}>{status}</div>}

          <div className="card" style={{padding:24,marginBottom:20}}>
            <h3>Phone Verification</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:16}}>Get a verified badge by confirming your number.</p>
            <form onSubmit={handlePhoneVerify} style={{display:'flex',gap:8}}>
              <input className="form-control" placeholder="Enter SMS Code" value={phoneCode} onChange={e=>setPhoneCode(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Verify Phone</button>
            </form>
          </div>

          <div className="card" style={{padding:24,marginBottom:20}}>
            <h3>Email Verification</h3>
            <form onSubmit={handleEmailVerify} style={{display:'flex',gap:8}}>
              <input className="form-control" placeholder="Enter Email Code" value={emailCode} onChange={e=>setEmailCode(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Verify Email</button>
            </form>
          </div>

          <div className="card" style={{padding:24}}>
            <h3>Business Verification</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:16}}>For corporate accounts and official dealers.</p>
            <form onSubmit={handleBusinessSubmit} style={{display:'flex',gap:8}}>
              <input className="form-control" placeholder="Business Name" value={businessName} onChange={e=>setBusinessName(e.target.value)} required />
              <button type="submit" className="btn btn-accent">Submit for Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
