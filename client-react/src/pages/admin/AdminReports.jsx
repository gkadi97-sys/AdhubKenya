import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { timeAgo } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const STATUSES = {
  pending:      { label: 'Pending',       class: 'bg-amber-500/15 text-amber-600 border-amber-500/20' },
  reviewed:     { label: 'Reviewed',      class: 'bg-blue-500/15 text-blue-600 border-blue-500/20' },
  action_taken: { label: 'Action Taken',  class: 'bg-green-500/15 text-green-600 border-green-500/20' },
  dismissed:    { label: 'Dismissed',     class: 'bg-secondary text-muted-foreground border-border' },
};

function StatusBadge({ status }) {
  const s = STATUSES[status] || STATUSES.pending;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${s.class}`}>{s.label}</span>;
}

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id, reason, details, status, created_at,
          listing_id, listing:listings(title),
          reporter_id, reporter:profiles!reporter_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Reports & Moderation Center</h2>
        <p className="text-sm text-muted-foreground">Review flagged content and manage user reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {['pending', 'reviewed', 'action_taken', 'dismissed'].map(s => (
          <div key={s} className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-bold text-foreground">{reports.filter(r => r.status === s).length}</p>
            <p className="mt-1 text-xs font-semibold capitalize text-muted-foreground">{STATUSES[s].label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'reviewed', 'action_taken', 'dismissed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${filter === s ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}>
            {s === 'all' ? 'All' : STATUSES[s].label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Report ID</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Listing</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Reason</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Reported</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center text-muted-foreground animate-pulse">Loading reports...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No reports found.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 transition hover:bg-secondary/30">
                  <td className="py-4 px-6 text-sm font-mono font-semibold text-primary" title={r.id}>
                    {r.id.split('-')[0]}
                  </td>
                  <td className="py-4 px-4">
                    <span className="max-w-[180px] truncate text-sm font-semibold text-foreground block">{r.listing?.title || 'Unknown Listing'}</span>
                    <span className="text-xs text-muted-foreground">by {r.reporter?.name || 'Anonymous'}</span>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground capitalize">
                      <ShieldAlert className="h-3 w-3 text-destructive" /> {r.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4"><StatusBadge status={r.status} /></td>
                  <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">{timeAgo(r.created_at)}</td>
                  <td className="py-4 px-4">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:border-primary/50"
                    >
                      {Object.keys(STATUSES).map(s => <option key={s} value={s}>{STATUSES[s].label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
