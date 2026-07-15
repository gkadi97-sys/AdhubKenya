// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Search, CheckCircle2, XCircle, Eye, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { timeAgo } from '@/lib/api';

export default function AdminCVs() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // fetchCVs will be defined below

  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  const fetchCVs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*, seller:profiles!seller_id(name, email)')
        .eq('category', 'seeking-work')
        .order('created_at', { ascending: false });
        
      if (statusFilter === 'verified') query = query.eq('specs->>verified', 'true');
      if (statusFilter === 'unverified') query = query.or('specs->>verified.is.null,specs->>verified.eq.false');
      
      const { data, error } = await query;
      if (error) throw error;
      setCvs(data || []);
    } catch (err) {
      toast.error('Failed to load CV profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, isVerified) => {
    try {
      // Get current specs
      const cv = cvs.find(c => c.id === id);
      const newSpecs = { ...(cv.specs || {}), verified: isVerified };
      
      const { error } = await supabase
        .from('listings')
        .update({ specs: newSpecs })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Profile ${isVerified ? 'verified' : 'unverified'} successfully`);
      setCvs(prev => prev.map(c => c.id === id ? { ...c, specs: newSpecs } : c));
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (err) {
      toast.error('Failed to update verification status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CV profile? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      toast.success('CV Profile deleted');
      setCvs(prev => prev.filter(c => c.id !== id));
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (err) {
      toast.error('Failed to delete CV');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Title', 'Industry', 'Experience', 'Location', 'Posted', 'Verified', 'Has CV'];
    const rows = filteredCvs.map(cv => {
      const s = cv.specs || {};
      return [
        cv.id,
        cv.seller?.name || 'Unknown',
        cv.title,
        s.industry || '',
        s.experienceLevel || '',
        cv.location || '',
        new Date(cv.created_at).toLocaleDateString(),
        s.verified ? 'Yes' : 'No',
        s.cvFileUrl ? 'Yes' : 'No'
      ].map(v => `"${(v||'').toString().replace(/"/g, '""')}"`).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `adhub_cv_profiles_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredCvs = cvs.filter(cv => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cv.title?.toLowerCase().includes(term) ||
      cv.seller?.name?.toLowerCase().includes(term) ||
      cv.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">CV Marketplace Admin</h1>
          <p className="text-muted-foreground text-sm">Manage candidate profiles, verify users, and monitor quality.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-1">Total Profiles</div>
          <div className="text-2xl font-bold text-foreground">{cvs.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-1">Verified Profiles</div>
          <div className="text-2xl font-bold text-emerald-600">
            {cvs.filter(c => c.specs?.verified === true || c.specs?.verified === 'true').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-1">With CV Attached</div>
          <div className="text-2xl font-bold text-primary">
            {cvs.filter(c => !!c.specs?.cvFileUrl).length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates, titles, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none font-medium"
          >
            <option value="all">All Profiles</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">Professional Details</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Posted</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Loading profiles...</td></tr>
              ) : filteredCvs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No candidate profiles found.</td></tr>
              ) : (
                filteredCvs.map(cv => {
                  const s = cv.specs || {};
                  const isVerified = s.verified === true || s.verified === 'true';
                  return (
                    <tr key={cv.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground mb-0.5">{cv.seller?.name || 'Unknown User'}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {cv.seller?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary mb-0.5">{cv.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.industry} • {s.experienceLevel} • {cv.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 w-max rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 w-max rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                              Unverified
                            </span>
                          )}
                          {s.cvFileUrl && (
                            <span className="inline-flex items-center gap-1 w-max rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                              CV Attached
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {timeAgo(cv.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => window.open(`/listing/${cv.id}`, '_blank')}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-secondary rounded-md"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleVerify(cv.id, !isVerified)}
                            className={`p-1.5 transition-colors rounded-md ${isVerified ? 'text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-muted-foreground bg-secondary hover:text-foreground'}`}
                            title={isVerified ? 'Remove Verification' : 'Verify Candidate'}
                          >
                            {isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleDelete(cv.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-secondary rounded-md"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
