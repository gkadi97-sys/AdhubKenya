import { Link } from 'react-router-dom';
import { timeAgo, imageUrl, logCvEvent } from '@/lib/api';
import { MapPin, Briefcase, GraduationCap, Clock, CheckCircle2, Languages, Phone, Link as LinkIcon, Download, Send, AlertCircle, Share2, Flag } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from '@/components/Image';

export default function CandidateProfile({ listing }) {
  const s = listing.specs || {};
  
  // Handlers
  const handleDownloadCv = () => {
    if (s.cvFileUrl) {
      logCvEvent(listing.id, 'cv_download');
      window.open(s.cvFileUrl, '_blank');
    }
  };

  const handleContact = () => {
    logCvEvent(listing.id, 'contact_reveal');
    const waNumber = listing.whatsapp?.replace(/\D/g, '') || listing.phone?.replace(/\D/g, '');
    if (waNumber) {
      const msg = encodeURIComponent(`Hi, I saw your CV profile on AdHub Kenya for "${listing.title}". I would like to discuss an opportunity with you.`);
      window.open(`https://wa.me/${waNumber.startsWith('0') ? '254' + waNumber.slice(1) : waNumber}?text=${msg}`, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // Salary formatting
  const formatSalary = (min, max, period) => {
    if (!min && !max) return 'Negotiable';
    const fmt = (n) => parseInt(n).toLocaleString();
    if (min && max) return `KES ${fmt(min)} – ${fmt(max)} / ${period === 'Annual' ? 'yr' : 'mo'}`;
    if (min) return `From KES ${fmt(min)} / ${period === 'Annual' ? 'yr' : 'mo'}`;
    if (max) return `Up to KES ${fmt(max)} / ${period === 'Annual' ? 'yr' : 'mo'}`;
    return 'Negotiable';
  };

  // Skills
  const skillsRaw = s.skills || '';
  const skills = typeof skillsRaw === 'string'
    ? skillsRaw.split(',').map(sk => sk.trim()).filter(Boolean)
    : (Array.isArray(skillsRaw) ? skillsRaw : []);

  const hasCv = !!s.cvFileUrl;
  const isVerified = s.verified === true || s.verified === 'true';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto pb-2 whitespace-nowrap custom-scrollbar">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/browse?category=seeking-work" className="hover:text-foreground transition-colors">Candidates</Link>
        {s.subcategory && (
          <>
            <span>/</span>
            <Link to={`/browse?category=seeking-work&subcategory=${encodeURIComponent(s.subcategory)}`} className="hover:text-foreground transition-colors">{s.subcategory}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">{listing.title}</span>
      </nav>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ── LEFT COLUMN (Profile Details) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-secondary shrink-0 border border-border overflow-hidden shadow-sm relative">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={imageUrl(listing.images[0])}
                    alt="Profile"
                    className="w-full h-full"
                    fallbackIconSize={24}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-display font-bold text-4xl">
                    {(listing.seller?.name || listing.title).charAt(0).toUpperCase()}
                  </div>
                )}
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>

              {/* Title & Key Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                    {listing.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                  {listing.location && (
                    <span className="flex items-center gap-1.5 text-foreground/80 font-medium">
                      <MapPin className="w-4 h-4 shrink-0" /> {listing.location}
                    </span>
                  )}
                  {s.experienceLevel && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 shrink-0" /> {s.experienceLevel}
                    </span>
                  )}
                  {s.educationLevel && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 shrink-0" /> {s.educationLevel}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {s.availability && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 px-3 py-1 text-xs font-bold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {s.availability}
                    </span>
                  )}
                  {hasCv && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold border border-primary/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CV Attached
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileTextIcon className="w-4 h-4" />
              </span>
              Professional Summary
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>
          </div>

          {/* Skills & Expertise */}
          {skills.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <StarIcon className="w-4 h-4" />
                </span>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk, i) => (
                  <span key={i} className="inline-flex items-center rounded-xl bg-secondary border border-border px-3.5 py-1.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors cursor-default">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details Grid */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ListIcon className="w-4 h-4" />
              </span>
              Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              
              <DetailItem label="Industry" value={s.industry} />
              <DetailItem label="Subcategory" value={s.subcategory} />
              <DetailItem label="Employment Status" value={s.employmentStatus} />
              <DetailItem label="Work Arrangement" value={s.workArrangement} />
              
              {s.employmentType && (
                <DetailItem 
                  label="Seeking" 
                  value={Array.isArray(s.employmentType) ? s.employmentType.join(', ') : s.employmentType} 
                />
              )}

              {s.languages && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Languages</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Languages className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {Array.isArray(s.languages) ? s.languages.join(', ') : s.languages}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Action Sidebar) ── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Action Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
            
            {/* Expected Salary */}
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Expected Salary</p>
              <p className="text-xl font-display font-bold text-primary">
                {formatSalary(s.salaryMin, s.salaryMax, s.salaryPeriod)}
              </p>
            </div>

            <div className="space-y-3">
              {/* Contact Button */}
              <button 
                onClick={handleContact}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                Contact Candidate
              </button>

              {/* Download CV Button */}
              {hasCv ? (
                <button 
                  onClick={handleDownloadCv}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-secondary hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </button>
              ) : (
                <div className="w-full flex items-start gap-2 rounded-xl border border-dashed border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>This candidate has not attached a downloadable CV document.</span>
                </div>
              )}
            </div>

            {/* Portfolio Links */}
            {s.portfolioLinks && s.portfolioLinks.length > 0 && s.portfolioLinks[0] && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">Links & Portfolio</p>
                <div className="space-y-2">
                  {s.portfolioLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.startsWith('http') ? link : `https://${link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-primary/5 p-2.5 rounded-lg border border-primary/10"
                    >
                      <LinkIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Meta Info */}
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3 text-xs text-muted-foreground font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Posted</span>
                <span>{timeAgo(listing.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Views</span>
                <span>{listing.views || 0}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex items-center gap-2">
              <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors text-destructive/80 hover:text-destructive">
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents for icons
function FileTextIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
}
function StarIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ListIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
