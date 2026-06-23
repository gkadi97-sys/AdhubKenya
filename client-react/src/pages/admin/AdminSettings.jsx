import { useState } from 'react';
import { Save, Globe, Mail, Shield, Database, Paintbrush } from 'lucide-react';

const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('branding');
  const [settings, setSettings] = useState({
    siteName: 'AdHub Kenya',
    tagline: "Kenya's trusted marketplace",
    contactEmail: 'support@adhubkenya.co.ke',
    contactPhone: '+254 700 000 000',
    twitterUrl: 'https://twitter.com/adhubkenya',
    facebookUrl: 'https://facebook.com/adhubkenya',
    maintenanceMode: false,
    requireApproval: false,
    maxImagesPerAd: 8,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
  });

  const set = (k) => (e) => setSettings(prev => ({ ...prev, [k]: e.target?.value ?? e }));

  const TABS = [
    { id: 'branding',  label: 'Branding',     icon: Paintbrush },
    { id: 'contact',   label: 'Contact',      icon: Globe },
    { id: 'email',     label: 'Email Config', icon: Mail },
    { id: 'moderation',label: 'Moderation',   icon: Shield },
    { id: 'system',    label: 'System',       icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h2>
        <p className="text-sm text-muted-foreground">Configure global platform settings</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar tabs */}
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col lg:w-56 lg:shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        {/* Content Panel */}
        <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Branding & Identity</h3>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Site Name</label><input className={inputClass} value={settings.siteName} onChange={set('siteName')} /></div>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Tagline</label><input className={inputClass} value={settings.tagline} onChange={set('tagline')} /></div>
              <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border bg-secondary/30 p-4">
                <p className="text-sm font-semibold text-foreground">Logo Upload</p>
                <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-secondary">Choose File</button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Contact Information</h3>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Contact Email</label><input className={inputClass} value={settings.contactEmail} onChange={set('contactEmail')} /></div>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Phone Number</label><input className={inputClass} value={settings.contactPhone} onChange={set('contactPhone')} /></div>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Twitter / X</label><input className={inputClass} value={settings.twitterUrl} onChange={set('twitterUrl')} /></div>
              <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Facebook</label><input className={inputClass} value={settings.facebookUrl} onChange={set('facebookUrl')} /></div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Email / SMTP Configuration</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-semibold text-foreground">SMTP Host</label><input className={inputClass} value={settings.smtpHost} onChange={set('smtpHost')} /></div>
                <div><label className="mb-1.5 block text-sm font-semibold text-foreground">SMTP Port</label><input className={inputClass} value={settings.smtpPort} onChange={set('smtpPort')} /></div>
                <div><label className="mb-1.5 block text-sm font-semibold text-foreground">SMTP Username</label><input className={inputClass} placeholder="user@gmail.com" value={settings.smtpUser} onChange={set('smtpUser')} /></div>
                <div><label className="mb-1.5 block text-sm font-semibold text-foreground">SMTP Password</label><input type="password" className={inputClass} placeholder="••••••••" value={settings.smtpPass} onChange={set('smtpPass')} /></div>
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-5">
              <h3 className="font-bold text-foreground">Moderation Settings</h3>
              <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-5 py-4">
                <div>
                  <p className="font-semibold text-foreground">Require Ad Approval</p>
                  <p className="text-sm text-muted-foreground">All new ads must be reviewed before going live.</p>
                </div>
                <button onClick={() => setSettings(p => ({ ...p, requireApproval: !p.requireApproval }))}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${settings.requireApproval ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all duration-200 ${settings.requireApproval ? 'left-5' : 'left-0.5'}`}></span>
                </button>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Max Images Per Ad</label>
                <input type="number" min={1} max={20} className={inputClass} value={settings.maxImagesPerAd} onChange={set('maxImagesPerAd')} />
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-5">
              <h3 className="font-bold text-foreground">System Controls</h3>
              <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4">
                <div>
                  <p className="font-semibold text-foreground">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Show a maintenance page to all visitors.</p>
                </div>
                <button onClick={() => setSettings(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${settings.maintenanceMode ? 'bg-destructive' : 'bg-secondary border border-border'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all duration-200 ${settings.maintenanceMode ? 'left-5' : 'left-0.5'}`}></span>
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">Clear Site Cache</button>
                <button className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">Download Audit Logs</button>
                <button className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">Force Logout All Sessions</button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 border-t border-border pt-5">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90">
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
