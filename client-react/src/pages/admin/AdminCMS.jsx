import { useState } from 'react';
import { FileText, PlusCircle, Eye, EyeOff, Edit3 } from 'lucide-react';

const INITIAL_PAGES = [
  { id: 'about',    title: 'About Us',        status: 'published', slug: '/about' },
  { id: 'terms',    title: 'Terms of Service', status: 'published', slug: '/terms' },
  { id: 'privacy',  title: 'Privacy Policy',   status: 'published', slug: '/privacy' },
  { id: 'faq',      title: 'FAQ',              status: 'published', slug: '/faq' },
  { id: 'contact',  title: 'Contact Us',       status: 'draft',     slug: '/contact' },
];

const INITIAL_BANNERS = [
  { id: 1, title: 'Free June Posting', subtitle: 'List your ad in 60 seconds', active: true },
  { id: 2, title: 'Eid al-Adha Sale',  subtitle: 'Great deals on livestock!',  active: false },
];

export default function AdminCMS() {
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [activeTab, setActiveTab] = useState('pages');

  const togglePageStatus = (id) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p));
  };
  const toggleBanner = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">CMS & Content</h2>
          <p className="text-sm text-muted-foreground">Manage pages, banners, and announcements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-secondary/50 p-1 w-fit">
        {['pages', 'banners', 'faqs'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-bold text-foreground">Static Pages</h3>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              <PlusCircle className="h-4 w-4" /> New Page
            </button>
          </div>
          <div className="divide-y divide-border">
            {pages.map(page => (
              <div key={page.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{page.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${page.status === 'published' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {page.status}
                  </span>
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition" title="Edit">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => togglePageStatus(page.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition" title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                    {page.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Homepage Banners & Announcements</h3>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              <PlusCircle className="h-4 w-4" /> New Banner
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border shadow-sm">
            {banners.map(b => (
              <div key={b.id} className="flex items-center justify-between px-6 py-5 transition hover:bg-secondary/30">
                <div>
                  <p className="font-bold text-foreground">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleBanner(b.id)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${b.active ? 'bg-primary' : 'bg-secondary'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all duration-200 ${b.active ? 'left-5' : 'left-0.5'}`}></span>
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground">{b.active ? 'Live' : 'Off'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-bold text-foreground">FAQ Manager</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Add, edit, and reorder your frequently asked questions. Coming in the next build phase.</p>
          <button className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90">
            <PlusCircle className="h-4 w-4" /> Add FAQ Entry
          </button>
        </div>
      )}
    </div>
  );
}
