import { useState } from 'react';
import { ShieldAlert, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const REASONS = [
  { id: 'scam', label: 'Scam or Fraud' },
  { id: 'duplicate', label: 'Duplicate Listing' },
  { id: 'offensive', label: 'Offensive Content' },
  { id: 'sold', label: 'Item Already Sold' },
  { id: 'wrong_category', label: 'Wrong Category' },
  { id: 'other', label: 'Other' },
];

export default function ReportModal({ isOpen, onClose, listingId, listingTitle }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return setError('Please select a reason');
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const reporter_id = session?.user?.id || null;

      const { error: insertError } = await supabase.from('reports').insert({
        listing_id: listingId,
        reporter_id,
        reason,
        details,
        status: 'pending'
      });

      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95">
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-600 ring-8 ring-green-500/5">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">Report Submitted</h3>
            <p className="mt-2 text-sm text-muted-foreground">Thank you. Our moderation team will review this listing shortly.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Report Listing</h3>
                <p className="text-sm text-muted-foreground truncate max-w-[250px]">{listingTitle}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Reason for reporting</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {REASONS.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReason(r.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${reason === r.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Additional Details (optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide any other relevant information..."
                  className="h-24 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || !reason}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
