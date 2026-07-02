import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { getAdminStats, timeAgo } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    revenue: 0,
    users: 0
  });
  const [recentAds, setRecentAds] = useState([]);

  useEffect(() => {
    getAdminStats().then(res => {
      setStats(res);
    }).catch(console.error);

    supabase.from('listings')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setRecentAds(data || []))
      .catch(console.error);
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.users.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Ads', value: stats.totalAds.toLocaleString(), icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Ads', value: stats.activeAds.toLocaleString(), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending Moderation', value: stats.pendingAds.toLocaleString(), icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Revenue (KES)', value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to the AdHub Kenya Admin Control Panel.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <h3 className="font-display text-2xl font-bold text-foreground">{s.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {recentAds.length > 0 ? recentAds.map((ad, i) => (
              <div key={ad.id} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                <div className={`mt-0.5 h-2 w-2 rounded-full ${ad.status === 'active' ? 'bg-green-500 ring-green-500/20' : 'bg-primary ring-primary/20'} ring-4`}></div>
                <div>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">{ad.title}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(ad.created_at)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/ads?status=pending" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              Review Pending Ads
            </Link>
            <Link to="/admin/reports" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              View Reports
            </Link>
            <Link to="/admin/users" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              Manage Users
            </Link>
            <Link to="/admin/settings" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              System Settings
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
