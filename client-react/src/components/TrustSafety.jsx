import { ShieldCheck, UserCheck, MessageSquare, AlertOctagon } from 'lucide-react';

export default function TrustSafety() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Marketplace',
      desc: 'We monitor ads 24/7 to keep scammers away.',
    },
    {
      icon: UserCheck,
      title: 'Verified Sellers',
      desc: 'Look for the badge to deal with trusted businesses.',
    },
    {
      icon: MessageSquare,
      title: 'Safe In-App Chat',
      desc: 'Negotiate securely without sharing your number.',
    },
    {
      icon: AlertOctagon,
      title: 'Report Anything',
      desc: 'Found a suspicious ad? Let our moderation team know instantly.',
    },
  ];

  return (
    <section className="mb-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-6 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Your Safety First</span>
        <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Trade with confidence</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
