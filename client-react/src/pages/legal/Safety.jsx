import { useSEO } from '@/lib/useSEO';
import { Shield, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export default function SafetyPage() {
  useSEO({
    title: 'Safety Tips | AdHub Kenya',
    description: 'Learn how to stay safe while buying and selling on AdHub Kenya.',
    canonicalPath: '/safety'
  });

  const tips = [
    {
      title: 'Meet in Public Places',
      description: 'Always meet the buyer or seller in a safe, public place, preferably during daylight hours.',
      icon: Eye
    },
    {
      title: 'Never Pay in Advance',
      description: 'Do not pay for items before you have inspected them and are satisfied with their condition.',
      icon: AlertTriangle
    },
    {
      title: 'Verify the Item',
      description: 'Take your time to thoroughly inspect the item. For electronics, turn them on and test them. For vehicles, verify documents.',
      icon: CheckCircle
    },
    {
      title: 'Protect Personal Info',
      description: 'Do not share unnecessary personal or financial information (like your ID number or bank details) with strangers.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Safety on AdHub</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your safety is our top priority. Follow these guidelines to ensure a secure and successful trading experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <tip.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
              <p className="text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-secondary/30 border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Suspect a Scam?</h2>
          <p className="text-muted-foreground mb-6">
            If you encounter a suspicious listing or user, please report them immediately using the "Report this listing" button on the ad page.
          </p>
          <a href="/contact" className="inline-flex bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 transition">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
