import { TrendingUp, Search, BarChart2, PieChart, Activity, Download } from 'lucide-react';

const CATEGORY_STATS = [
  { name: 'Vehicles',         ads: 3420, pct: 88 },
  { name: 'Property',         ads: 1940, pct: 63 },
  { name: 'Phones & Tablets', ads: 2180, pct: 72 },
  { name: 'Electronics',      ads: 1330, pct: 55 },
  { name: 'Fashion',          ads: 1560, pct: 60 },
  { name: 'Furniture',        ads: 870,  pct: 40 },
  { name: 'Jobs',             ads: 640,  pct: 30 },
];

const TOP_SEARCHES = [
  { term: 'Toyota Fielder',          count: 4230 },
  { term: 'iPhone 15',               count: 3110 },
  { term: 'Bedsitter Nairobi',       count: 2890 },
  { term: 'Samsung Galaxy S24',      count: 2340 },
  { term: 'Land for Sale Kitengela', count: 2100 },
  { term: 'Nissan X-Trail',          count: 1870 },
  { term: 'PlayStation 5',           count: 1560 },
];

export default function AdminAnalytics() {
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
          { label: 'Total Sessions', value: '89,431', icon: Activity, delta: '+12%' },
          { label: 'Avg. Session Duration', value: '4m 32s', icon: TrendingUp, delta: '+5%' },
          { label: 'Bounce Rate', value: '38.2%', icon: BarChart2, delta: '-3%' },
          { label: 'Avg. CTR', value: '6.7%', icon: PieChart, delta: '+9%' },
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
          <h3 className="mb-5 text-lg font-bold text-foreground">Category Performance</h3>
          <div className="space-y-4">
            {CATEGORY_STATS.map(c => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{c.name}</span>
                  <span className="font-bold text-primary">{c.ads.toLocaleString()} ads</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Searches */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-foreground">Top Search Queries</h3>
          <div className="space-y-3">
            {TOP_SEARCHES.map((s, i) => (
              <div key={s.term} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-black text-muted-foreground">{i + 1}</span>
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary/50 px-4 py-2.5">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-semibold text-foreground">{s.term}</span>
                  <span className="text-xs font-bold text-primary">{s.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device breakdown */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-foreground">Device Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { device: 'Mobile', pct: 72 },
            { device: 'Desktop', pct: 24 },
            { device: 'Tablet', pct: 4 },
          ].map(d => (
            <div key={d.device} className="rounded-xl bg-secondary/50 p-4">
              <p className="font-display text-3xl font-bold text-primary">{d.pct}%</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{d.device}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
