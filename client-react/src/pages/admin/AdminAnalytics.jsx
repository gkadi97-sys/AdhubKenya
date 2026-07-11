import { useState, useEffect } from 'react';
import { TrendingUp, Search, BarChart2, PieChart, Activity, Download, Loader2 } from 'lucide-react';
import { fetchAdminAnalytics } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const result = await fetchAdminAnalytics();
        setData(result);
      } catch (err) {
        toast.error('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const { metrics, category_stats, top_searches, device_breakdown } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Platform performance and engagement insights</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary w-fit">
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Sessions', value: metrics.total_sessions?.toLocaleString() || '0', icon: Activity, delta: '+12%' },
          { label: 'Avg. Session Duration', value: metrics.avg_session_duration || '0s', icon: TrendingUp, delta: '+5%' },
          { label: 'Bounce Rate', value: metrics.bounce_rate || '0%', icon: BarChart2, delta: '-3%' },
          { label: 'Avg. CTR', value: metrics.avg_ctr || '0%', icon: PieChart, delta: '+9%' },
        ].map((m, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <m.icon className="h-5 w-5 text-primary" />
              <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${m.delta.startsWith('+') ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>{m.delta}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">Category Performance (Active Ads)</h3>
          <div className="space-y-4">
            {category_stats?.length > 0 ? category_stats.map(c => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{c.name}</span>
                  <span className="font-bold text-primary">{c.ads.toLocaleString()} ads</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.max(c.pct || 0, 1)}%` }} />
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No active listings data</div>
            )}
          </div>
        </div>

        {/* Top Searches */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">Top Search Queries</h3>
          <div className="space-y-3">
            {top_searches?.length > 0 ? top_searches.map((s, i) => (
              <div key={s.term} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-black text-muted-foreground">{i + 1}</span>
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/50 px-4 py-2.5">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-semibold text-foreground capitalize">{s.term}</span>
                  <span className="text-xs font-bold text-primary">{s.count.toLocaleString()}</span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No search data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Device breakdown */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-foreground">Device Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {device_breakdown?.length > 0 ? device_breakdown.map(d => (
            <div key={d.device} className="rounded-xl bg-secondary/50 p-4">
              <p className="font-display text-3xl font-bold text-primary">{d.pct}%</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{d.device}</p>
            </div>
          )) : (
            <div className="col-span-full text-sm text-muted-foreground text-center py-4">No device data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
