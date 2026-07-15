import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/api';
import UrlService from '@/lib/seo/UrlService';
import { Heart, MapPin, BadgeCheck, Briefcase, GraduationCap, Clock, Banknote, CheckCircle2 } from 'lucide-react';


// ── Availability badge colour ──────────────────────────────────────────────
const availabilityBadge = {
  'Immediately': { bg: 'bg-emerald-500/15', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  '2 Weeks Notice': { bg: 'bg-amber-500/15', text: 'text-amber-600', dot: 'bg-amber-500' },
  '1 Month Notice': { bg: 'bg-orange-500/15', text: 'text-orange-600', dot: 'bg-orange-500' },
  'Negotiable': { bg: 'bg-sky-500/15', text: 'text-sky-600', dot: 'bg-sky-500' },
};

// ── Local-storage save helpers ─────────────────────────────────────────────
function getSaved() {
  try { return JSON.parse(localStorage.getItem('adhub_saved_candidates') || '[]'); }
  catch { return []; }
}
function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
  localStorage.setItem('adhub_saved_candidates', JSON.stringify(next));
  return next.includes(id);
}

// ── Format salary expectation ──────────────────────────────────────────────
function formatSalary(min, max, period) {
  if (!min && !max) return null;
  const fmt = (n) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
  const p = period === 'Annual' ? '/yr' : '/mo';
  if (min && max) return `KES ${fmt(min)}–${fmt(max)}${p}`;
  if (min) return `KES ${fmt(min)}+${p}`;
  if (max) return `Up to KES ${fmt(max)}${p}`;
}

// ── Initials avatar ────────────────────────────────────────────────────────
function Avatar({ name, size = 14 }) {
  const initials = (name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function CandidateCard({ listing }) {
  const [saved, setSaved] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
  useEffect(() => { setSaved(getSaved().includes(listing.id)); }, [listing.id]);

  const s = listing.specs || {};
  const availability = s.availability;
  const avBadge = availabilityBadge[availability] || availabilityBadge['Negotiable'];

  // Parse skills (stored as comma-separated string or array)
  const skillsRaw = s.skills || '';
  const skills = typeof skillsRaw === 'string'
    ? skillsRaw.split(',').map(sk => sk.trim()).filter(Boolean)
    : (Array.isArray(skillsRaw) ? skillsRaw : []);

  const salary = formatSalary(s.salaryMin, s.salaryMax, s.salaryPeriod);
  const isVerified = s.verified === true || s.verified === 'true';
  const hasCv = !!s.cvFileUrl;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleSaved(listing.id));
  };

  return (
    <Link to={UrlService.listing(listing)} className="block group" aria-label={`View profile: ${listing.title}`}>
      <article className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated flex flex-col h-full">

        {/* ── Top accent bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

        <div className="p-5 flex flex-col flex-1 gap-3">

          {/* ── Header: Avatar + Name + Badges ── */}
          <div className="flex items-start gap-3">
            <Avatar name={listing.seller?.name || listing.title} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base text-foreground line-clamp-1 leading-snug">
                  {listing.title}
                </h3>
                {isVerified && (
                  <BadgeCheck className="h-4 w-4 text-primary shrink-0" title="Verified Candidate" />
                )}
              </div>
              {/* Subcategory + Location */}
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                {s.subcategory && <span className="font-medium text-foreground/70 truncate">{s.subcategory}</span>}
                {s.subcategory && listing.location && <span>·</span>}
                {listing.location && (
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {listing.location.split(',')[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className={`shrink-0 grid h-8 w-8 place-items-center rounded-full transition-colors ${saved ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
              title={saved ? 'Unsave candidate' : 'Save candidate'}
            >
              <Heart className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* ── Stat row: Experience + Education ── */}
          <div className="flex flex-wrap gap-2 text-xs">
            {s.experienceLevel && (
              <span className="flex items-center gap-1 bg-secondary/60 rounded-md px-2 py-1 font-medium text-muted-foreground">
                <Briefcase className="h-3 w-3" /> {s.experienceLevel}
              </span>
            )}
            {s.educationLevel && (
              <span className="flex items-center gap-1 bg-secondary/60 rounded-md px-2 py-1 font-medium text-muted-foreground">
                <GraduationCap className="h-3 w-3" /> {s.educationLevel}
              </span>
            )}
            {s.industry && (
              <span className="flex items-center gap-1 bg-secondary/60 rounded-md px-2 py-1 font-medium text-muted-foreground truncate max-w-[140px]">
                {s.industry}
              </span>
            )}
          </div>

          {/* ── Skills preview ── */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((sk, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-primary/8 border border-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {sk}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* ── Salary + Availability ── */}
          <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-1">
            {salary ? (
              <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Banknote className="h-3.5 w-3.5 text-primary" />
                {salary}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Salary negotiable</span>
            )}
            {availability && (
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${avBadge.bg} ${avBadge.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${avBadge.dot}`} />
                {availability}
              </span>
            )}
          </div>

          {/* ── Footer: Last active + CV badge + Work arrangement ── */}
          <div className="pt-3 mt-1 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo(listing.created_at)}
            </span>
            <div className="flex items-center gap-2">
              {hasCv && (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> CV attached
                </span>
              )}
              {s.workArrangement && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                  {s.workArrangement}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── CTA buttons ── */}
        <div className="px-5 pb-5 flex gap-2">
          <Link
            to={UrlService.listing(listing)}
            className="flex-1 rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-2.5 text-center hover:opacity-90 transition-opacity"
            onClick={e => e.stopPropagation()}
          >
            View Profile
          </Link>
          {listing.whatsapp && (
            <a
              href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I found your CV on AdHub Kenya for "${listing.title}". I'd like to discuss an opportunity with you.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-background text-foreground text-sm font-semibold py-2.5 px-3 hover:bg-secondary transition-colors"
              onClick={e => e.stopPropagation()}
              title="Contact via WhatsApp"
            >
              💬
            </a>
          )}
        </div>
      </article>
    </Link>
  );
}
