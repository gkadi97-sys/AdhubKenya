import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, ShieldOff, Trash2, Eye, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ROLE_BADGES = {
  super_admin: { label: 'Super Admin', class: 'bg-purple-500/15 text-purple-600 border-purple-500/30' },
  admin:       { label: 'Admin',       class: 'bg-primary/15 text-primary border-primary/30' },
  moderator:   { label: 'Moderator',   class: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  support:     { label: 'Support',     class: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30' },
  user:        { label: 'User',        class: 'bg-secondary text-muted-foreground border-border' },
};

const STATUS_BADGES = {
  active:    { label: 'Active',    icon: CheckCircle, class: 'bg-green-500/15 text-green-600' },
  suspended: { label: 'Suspended', icon: Clock,        class: 'bg-amber-500/15 text-amber-600' },
  banned:    { label: 'Banned',    icon: XCircle,      class: 'bg-destructive/15 text-destructive' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const LIMIT = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('id, name, email, phone, role, created_at, location', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * LIMIT, page * LIMIT - 1);

      if (search.trim()) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      setUsers(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // eslint-disable-next-line
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelectedIds(selectedIds.length === users.length ? [] : users.map(u => u.id));
  };

  const totalPages = Math.ceil(total / LIMIT);

  const exportCSV = () => {
    const rows = users.map(u => `${u.id},${u.name},${u.email || ''},${u.role || 'user'},${new Date(u.created_at).toLocaleDateString()}`);
    const csv = ['ID,Name,Email,Role,Joined', ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'adhub_users.csv';
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground">{total.toLocaleString()} registered accounts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={fetchUsers} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <span className="text-sm font-semibold text-primary">{selectedIds.length} selected</span>
          <button className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-500/20 transition">
            Suspend All
          </button>
          <button className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition">
            Ban All
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="w-12 py-4 pl-5 pr-3">
                  <input type="checkbox" checked={selectedIds.length === users.length && users.length > 0} onChange={toggleAll} className="h-4 w-4 accent-primary rounded" />
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Email</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Location</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Joined</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0 animate-pulse">
                    <td className="py-4 pl-5 pr-3"><div className="h-4 w-4 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-secondary"></div><div className="h-4 w-32 rounded bg-secondary"></div></div></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-40 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-20 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-16 rounded-full bg-secondary"></div></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 w-24 rounded bg-secondary"></div></td>
                    <td className="py-4 px-4"><div className="h-8 w-20 rounded-lg bg-secondary"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted-foreground">No users found.</td></tr>
              ) : users.map(u => {
                const roleBadge = ROLE_BADGES[u.role] || ROLE_BADGES.user;
                return (
                  <tr key={u.id} className={`border-b border-border last:border-0 transition hover:bg-secondary/30 ${selectedIds.includes(u.id) ? 'bg-primary/5' : ''}`}>
                    <td className="py-4 pl-5 pr-3">
                      <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} className="h-4 w-4 accent-primary rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-foreground text-sm">{u.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">{u.email || '—'}</td>
                    <td className="py-4 px-4 hidden lg:table-cell text-sm text-muted-foreground">{u.location || '—'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${roleBadge.class}`}>{roleBadge.label}</span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition" title="Suspend User">
                          <ShieldOff className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition" title="Delete User">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[60px] text-center text-sm font-semibold">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
