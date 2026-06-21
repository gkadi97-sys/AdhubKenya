import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { getListings } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    revenue: 0,
    users: 0
  });

  useEffect(() => {
    // Mocking admin stats fetch since there's no actual admin API yet
    getListings({ limit: 1 }).then(res => {
      setStats({
        totalAds: res.total || 0,
        activeAds: Math.floor((res.total || 0) * 0.8),
        pendingAds: Math.floor((res.total || 0) * 0.1),
        revenue: 450000, // Mock KES
        users: 12450
      });
    }).catch(console.error);
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
        {/* Recent Activity Mock */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">New Ad posted: Toyota Fielder {2015 + i}</p>
                  <p className="text-xs text-muted-foreground">{i * 12} minutes ago by User #{1000 + i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              Review Pending Ads
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              Broadcast Message
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              Manage Categories
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground">
              System Logs
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
