import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, Star, Archive, Trash2, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, timeAgo } from '@/lib/api';

const STATUS_CONFIG = {
  active:         { label: 'Active',         class: 'bg-green-500/15 text-green-600 border-green-500/20' },
  pending:        { label: 'Pending',        class: 'bg-amber-500/15 text-amber-600 border-amber-500/20' },
  rejected:       { label: 'Rejected',       class: 'bg-destructive/15 text-destructive border-destructive/20' },
  archived:       { label: 'Archived',       class: 'bg-secondary text-muted-foreground border-border' },
  featured:       { label: 'Featured',       class: 'bg-purple-500/15 text-purple-600 border-purple-500/20' },
  expired:        { label: 'Closed',         class: 'bg-gray-500/15 text-gray-600 border-gray-500/20' },
  sold:           { label: 'Sold',           class: 'bg-blue-500/15 text-blue-600 border-blue-500/20' },
  draft:          { label: 'Draft',          class: 'bg-slate-500/15 text-slate-600 border-slate-500/20' },
  needs_revision: { label: 'Needs Revision', class: 'bg-red-500/15 text-red-600 border-red-500/20' },
  suspended:      { label: 'Suspended',      class: 'bg-red-700/15 text-red-700 border-red-700/20' }
};

function StatusBadge({ status = 'active' }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${s.class}`}>{s.label}</span>
  );
}

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const LIMIT = 15;

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('id, title, category, price, location, created_at, views, status, is_featured, seller_id, seller:profiles!seller_id(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * LIMIT, page * LIMIT - 1);

      if (search.trim()) query = query.ilike('title', `%${search}%`);
      if (statusFilter !== 'all') {
        if (statusFilter === 'featured') query = query.eq('is_featured', true);
        else query = query.eq('status', statusFilter);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      setAds(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  // eslint-disable-next-line
  useEffect(() => { fetchAds(); }, [fetchAds]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'delete') {
        if (!confirm('Permanently delete this ad?')) return;
        await supabase.from('listings').delete().eq('id', id);
      } else if (action === 'feature') {
        await supabase.from('listings').update({ is_featured: true }).eq('id', id);
      } else if (action === 'approve') {
        await supabase.from('listings').update({ status: 'active' }).eq('id', id);
      } else if (action === 'reject') {
        await supabase.from('listings').update({ status: 'rejected' }).eq('id', id);
      } else if (action === 'archive') {
        await supabase.from('listings').update({ status: 'archived' }).eq('id', id);
      }
      fetchAds();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Apply "${action}" to ${selectedIds.length} ads?`)) return;
    try {
      if (action === 'approve') await supabase.from('listings').update({ status: 'active' }).in('id', selectedIds);
      else if (action === 'reject') await supabase.from('listings').update({ status: 'rejected' }).in('id', selectedIds);
      else if (action === 'archive') await supabase.from('listings').update({ status: 'archived' }).in('id', selectedIds);
      setSelectedIds([]);
      fetchAds();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === ads.length ? [] : ads.map(a => a.id));
  const totalPages = Math.ceil(total / LIMIT);

  const exportCSV = () => {
    const rows = ads.map(a => `${a.id},"${a.title}",${a.category},${a.price},${a.location},${a.status},${new Date(a.created_at).toLocaleDateString()}`);
    const csv = ['ID,Title,Category,Price,Location,Status,Date', ...rows].join('\n');
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    anchor.download = 'adhub_ads.csv';
    anchor.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Ad Management</h2>
          <p className="text-sm text-muted-foreground">{total.toLocaleString()} total listings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={fetchAds} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'pending', 'rejected', 'archived', 'featured'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${statusFilter === s ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search ads by title..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <span className="text-sm font-semibold text-primary">{selectedIds.length} selected</span>
          <button onClick={() => handleBulkAction('approve')} className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-500/20 transition">Approve All</button>
          <button onClick={() => handleBulkAction('reject')} className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition">Reject All</button>
          <button onClick={() => handleBulkAction('archive')} className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition">Archive All</button>
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
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Title</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Seller</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Posted</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0 animate-pulse">
                    <td className="py-4 pl-5 pr-3"><div className="h-4 w-4 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-48 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 w-24 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-28 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-16 rounded-full bg-secondary"></div></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-20 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-8 w-28 rounded-lg bg-secondary"></div></td>
                  </tr>
                ))
              ) : ads.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-muted-foreground">No ads found.</td></tr>
              ) : ads.map(ad => (
                <tr key={ad.id} className={`border-b border-border last:border-0 transition hover:bg-secondary/30 ${selectedIds.includes(ad.id) ? 'bg-primary/5' : ''}`}>
                  <td className="py-4 pl-5 pr-3">
                    <input type="checkbox" checked={selectedIds.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="h-4 w-4 accent-primary rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {ad.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                      <span className="max-w-[200px] truncate text-sm font-semibold text-foreground">{ad.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell text-sm text-muted-foreground capitalize">{ad.category}</td>
                  <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">{ad.seller?.name || '—'}</td>
                  <td className="py-4 px-4 text-sm font-bold text-primary">{formatPrice(ad.price)}</td>
                  <td className="py-4 px-4"><StatusBadge status={ad.status} /></td>
                  <td className="py-4 px-4 hidden lg:table-cell text-sm text-muted-foreground">{timeAgo(ad.created_at)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <a href={`/listing/${ad.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition" title="View Listing">
                        <Eye className="h-4 w-4" />
                      </a>
                      <button onClick={() => handleAction(ad.id, 'approve')} className="rounded-lg p-2 text-muted-foreground hover:bg-green-500/10 hover:text-green-600 transition" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(ad.id, 'reject')} className="rounded-lg p-2 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(ad.id, 'feature')} className="rounded-lg p-2 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-600 transition" title="Feature">
                        <Star className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(ad.id, 'archive')} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition" title="Archive">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(ad.id, 'delete')} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
    </div>
  );
}
