import { useState } from 'react';
import { promoteListing } from '@/lib/api';
import toast from 'react-hot-toast';
import { X, Sparkles, CheckCircle2, CreditCard } from 'lucide-react';

export default function PromoteAdModal({ listing, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(7);

  const handlePayment = async () => {
    setLoading(true);
    // Mock network request for payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const updated = await promoteListing(listing.id, selectedPlan, 'featured');
      toast.success('Ad promoted successfully!');
      setStep(3); // Success step
      setTimeout(() => onSuccess(updated), 2000);
    } catch (err) {
      toast.error('Failed to promote ad. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/10 text-gold">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg font-bold">Promote Ad</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Get up to 10x more views!</h3>
                <p className="text-sm text-muted-foreground">Premium listings appear at the top of search results and on the homepage.</p>
              </div>

              <div className="space-y-3">
                {[
                  { days: 7, price: 500, label: '7 Days Premium' },
                  { days: 14, price: 800, label: '14 Days Premium (Save 20%)' },
                  { days: 30, price: 1500, label: '30 Days Premium (Best Value)' }
                ].map(plan => (
                  <button
                    key={plan.days}
                    onClick={() => setSelectedPlan(plan.days)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedPlan === plan.days 
                        ? 'border-gold bg-gold/5 shadow-sm' 
                        : 'border-border bg-card hover:border-gold/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedPlan === plan.days ? 'border-gold bg-gold' : 'border-muted-foreground'}`}>
                        {selectedPlan === plan.days && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-foreground">{plan.label}</span>
                    </div>
                    <span className="font-black text-gold">KES {plan.price}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-gold py-3.5 font-bold text-white shadow-sm transition hover:opacity-90 mt-4"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Mock Payment Checkout</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This is a simulated checkout flow for Phase 3. In a production environment, this would integrate with M-Pesa or Stripe.
              </p>
              
              <div className="rounded-xl bg-secondary/50 p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Listing</span>
                  <span className="font-semibold truncate max-w-[200px]">{listing.title}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-border/50 pt-2 mt-2">
                  <span>Total Amount</span>
                  <span className="text-gold">KES {selectedPlan === 7 ? 500 : selectedPlan === 14 ? 800 : 1500}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-pulse">Processing Payment...</span>
                ) : (
                  <>Pay Now (Mock)</>
                )}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                disabled={loading}
                className="mt-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition disabled:opacity-50"
              >
                Back to plans
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center animate-in zoom-in duration-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">Your ad is now promoted and will appear in the Premium Picks section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
