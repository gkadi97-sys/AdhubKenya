import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, AlertTriangle, Eye, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, timeAgo, moderateListing } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  active:   { label: 'Active',   class: 'bg-green-500/15 text-green-600 border-green-500/20' },
  pending:  { label: 'Pending',  class: 'bg-amber-500/15 text-amber-600 border-amber-500/20' },
  needs_revision:  { label: 'Needs Revision',  class: 'bg-orange-500/15 text-orange-600 border-orange-500/20' },
  rejected: { label: 'Rejected', class: 'bg-destructive/15 text-destructive border-destructive/20' },
  suspended: { label: 'Suspended', class: 'bg-gray-500/15 text-gray-600 border-gray-500/20' },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { label: status, class: 'bg-secondary text-muted-foreground' };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-widest ${s.class}`}>{s.label}</span>
  );
}

export default function AdminModeration() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Moderation Metrics
  const [metrics, setMetrics] = useState({ pending: 0, rejected: 0, needs_revision: 0 });
  
  // Action Modal State
  const [actionModal, setActionModal] = useState({ isOpen: false, listingId: null, action: null });
  const [reason, setReason] = useState('');

  const LIMIT = 15;

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('id, title, category, price, location, created_at, status, revision_count, updated_after_review, seller:profiles!seller_id(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * LIMIT, page * LIMIT - 1);

      if (search.trim()) query = query.ilike('title', `%${search}%`);
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      } else {
        query = query.in('status', ['pending', 'rejected', 'needs_revision', 'suspended']);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      setAds(data || []);
      setTotal(count || 0);

      // Fetch Metrics (Pending, Rejected, Needs Revision counts)
      const fetchCount = async (status) => {
        const { count: statusCount } = await supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', status);
        return statusCount || 0;
      };
      
      setMetrics({
        pending: await fetchCount('pending'),
        rejected: await fetchCount('rejected'),
        needs_revision: await fetchCount('needs_revision')
      });

    } catch (err) {
      console.error(err);
      toast.error('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const handleApprove = async (id, currentStatus) => {
    try {
      await moderateListing(id, currentStatus, 'active', { approved_at: new Date().toISOString() }, 'Approved by moderator');
      toast.success('Listing approved');
      fetchAds();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Approve ${selectedIds.length} listings?`)) return;
    try {
      await Promise.all(selectedIds.map(id => moderateListing(id, 'pending', 'active', { approved_at: new Date().toISOString() }, 'Bulk approval')));
      toast.success('Listings approved');
      setSelectedIds([]);
      fetchAds();
    } catch (err) {
      toast.error('Failed to approve some listings');
    }
  };

  const submitActionWithReason = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    const { listingId, action, currentStatus } = actionModal;
    
    try {
      const updates = { 
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
        updated_after_review: false
      };
      
      const newStatus = action === 'reject' ? 'rejected' : action === 'needs_revision' ? 'needs_revision' : 'suspended';
      
      await moderateListing(listingId, currentStatus, newStatus, updates, reason);
      toast.success(`Listing marked as ${newStatus}`);
      setActionModal({ isOpen: false, listingId: null, action: null });
      setReason('');
      fetchAds();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === ads.length ? [] : ads.map(a => a.id));
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
          <p className="text-3xl font-black text-amber-500 mt-2">{metrics.pending}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Needs Revision</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{metrics.needs_revision}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Rejected</p>
          <p className="text-3xl font-black text-destructive mt-2">{metrics.rejected}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Listing Moderation Queue</h2>
          <p className="text-sm text-muted-foreground">Review, approve, or reject new submissions.</p>
        </div>
        <button onClick={fetchAds} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'needs_revision', 'rejected', 'suspended'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${statusFilter === s ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <span className="text-sm font-semibold text-primary">{selectedIds.length} selected</span>
          <button onClick={handleBulkApprove} className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-500/20 transition">Approve Selected</button>
        </div>
      )}

      {/* Ads Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="w-12 py-4 pl-5 pr-3">
                  <input type="checkbox" checked={selectedIds.length === ads.length && ads.length > 0} onChange={toggleAll} className="h-4 w-4 accent-primary rounded" />
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Listing Details</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Seller</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Status & Age</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center text-muted-foreground">Loading queue...</td></tr>
              ) : ads.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-muted-foreground">Queue is empty. Great job!</td></tr>
              ) : ads.map(ad => (
                <tr key={ad.id} className={`border-b border-border last:border-0 transition hover:bg-secondary/30 ${selectedIds.includes(ad.id) ? 'bg-primary/5' : ''}`}>
                  <td className="py-4 pl-5 pr-3">
                    <input type="checkbox" checked={selectedIds.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="h-4 w-4 accent-primary rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm truncate max-w-[250px]">{ad.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">{ad.category} • {formatPrice(ad.price)}</span>
                      {ad.updated_after_review && <span className="text-[10px] text-blue-500 font-bold uppercase mt-1">Edited by seller</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <User className="h-4 w-4 text-muted-foreground" /> {ad.seller?.name || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={ad.status} />
                      <span className="text-xs text-muted-foreground">Submitted {timeAgo(ad.created_at)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/listing/${ad.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition">
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </a>
                      {ad.status !== 'active' && (
                        <button onClick={() => handleApprove(ad.id, ad.status)} className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-500/20 transition">
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                      )}
                      <button onClick={() => setActionModal({ isOpen: true, listingId: ad.id, action: 'needs_revision', currentStatus: ad.status })} className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-500/20 transition">
                        <AlertTriangle className="h-3.5 w-3.5" /> Revise
                      </button>
                      {ad.status !== 'rejected' && (
                        <button onClick={() => setActionModal({ isOpen: true, listingId: ad.id, action: 'reject', currentStatus: ad.status })} className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[60px] text-center text-sm font-semibold">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Modal (Reject / Revise) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {actionModal.action === 'reject' ? 'Reject Listing' : 'Request Revision'}
              </h3>
              <button onClick={() => { setActionModal({ isOpen: false }); setReason(''); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a clear reason. The seller will see this note.
            </p>
            <textarea
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 mb-4"
              rows={4}
              placeholder={actionModal.action === 'reject' ? "e.g. This item is prohibited..." : "e.g. Please upload clearer photos..."}
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setActionModal({ isOpen: false }); setReason(''); }} className="rounded-xl px-4 py-2 text-sm font-semibold border border-border hover:bg-secondary">
                Cancel
              </button>
              <button onClick={submitActionWithReason} className="rounded-xl px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:opacity-90">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
