import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { useSEO } from '@/lib/useSEO';

export default function PostAdConfirmation() {
  useSEO({
    title: 'Ad Submitted | AdHub Kenya',
    description: 'Your advertisement has been submitted successfully and is pending approval.',
  });

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-background">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 shadow-inner">
        <CheckCircle className="h-12 w-12 text-emerald-500" />
      </div>
      <h1 className="mb-4 text-3xl font-black tracking-tight text-foreground">
        Advertisement Submitted!
      </h1>
      
      <div className="mb-8 max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm text-left">
        <div className="flex items-start gap-4">
          <Clock className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-foreground text-lg mb-2">Pending Moderation Review</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Your advertisement has been submitted successfully. Our moderation team is currently reviewing it to ensure it meets our quality guidelines.
            </p>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border text-sm">
              <span className="font-semibold text-foreground">Estimated review time:</span>
              <br />
              <span className="text-muted-foreground">2–6 hours</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-8">
        You will receive a notification once your listing has been approved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          to="/my-ads" 
          className="rounded-xl gradient-emerald px-8 py-3.5 font-bold text-primary-foreground shadow-elevated transition hover:opacity-95"
        >
          View My Ads
        </Link>
        <Link 
          to="/browse" 
          className="rounded-xl border border-border bg-card px-8 py-3.5 font-bold text-foreground transition hover:bg-secondary"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}
