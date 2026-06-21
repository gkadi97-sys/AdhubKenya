import { DollarSign, TrendingUp, CreditCard, RefreshCw, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', user: 'James Mwangi', type: 'Featured Ad', amount: 500, status: 'completed', date: '2026-06-21', gateway: 'M-Pesa', ref: 'QJKX7A2' },
  { id: 'TXN-002', user: 'Aisha Omondi', type: 'Premium Boost', amount: 1200, status: 'completed', date: '2026-06-21', gateway: 'Stripe', ref: 'pi_3ABX' },
  { id: 'TXN-003', user: 'Kevin Mutua', type: 'Featured Ad', amount: 500, status: 'pending',   date: '2026-06-20', gateway: 'M-Pesa', ref: 'QJW2PA3' },
  { id: 'TXN-004', user: 'Grace Njeri', type: 'Premium Boost', amount: 1200, status: 'failed',   date: '2026-06-20', gateway: 'Stripe', ref: 'pi_9ZYX' },
  { id: 'TXN-005', user: 'David Kiptoo', type: 'Featured Ad', amount: 500, status: 'completed', date: '2026-06-19', gateway: 'M-Pesa', ref: 'QJK4MN9' },
];

const STATUS = {
  completed: { icon: CheckCircle, class: 'text-green-600 bg-green-500/10' },
  pending:   { icon: Clock,        class: 'text-amber-600 bg-amber-500/10' },
  failed:    { icon: XCircle,      class: 'text-destructive bg-destructive/10' },
};

export default function AdminPayments() {
  const totalRevenue = MOCK_TRANSACTIONS.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const rows = MOCK_TRANSACTIONS.map(t => `${t.id},${t.user},${t.type},${t.amount},${t.status},${t.date},${t.gateway},${t.ref}`);
    const csv = ['ID,User,Type,Amount,Status,Date,Gateway,Ref', ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'adhub_transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Payments & Revenue</h2>
          <p className="text-sm text-muted-foreground">Transaction history and revenue tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="font-display text-2xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Featured Ads Sold</p>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {MOCK_TRANSACTIONS.filter(t => t.type === 'Featured Ad' && t.status === 'completed').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month Growth</p>
              <h3 className="font-display text-2xl font-bold text-foreground">+24%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Transaction ID</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">User</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Gateway</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Reference</th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map(t => {
                const s = STATUS[t.status];
                return (
                  <tr key={t.id} className="border-b border-border last:border-0 transition hover:bg-secondary/30">
                    <td className="py-4 px-6 text-sm font-mono font-semibold text-primary">{t.id}</td>
                    <td className="py-4 px-4 hidden sm:table-cell text-sm font-semibold text-foreground">{t.user}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{t.type}</td>
                    <td className="py-4 px-4 text-sm font-bold text-foreground">KES {t.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.class}`}>
                        <s.icon className="h-3 w-3" /> {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">{t.gateway}</td>
                    <td className="py-4 px-4 hidden lg:table-cell text-sm font-mono text-muted-foreground">{t.ref}</td>
                    <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
