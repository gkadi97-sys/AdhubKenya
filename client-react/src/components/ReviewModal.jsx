import { useState } from 'react';
import { Star, X, Loader2, MessageSquare } from 'lucide-react';
import { submitReview } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReviewModal({ sellerId, sellerName, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(sellerId, rating, comment);
      toast.success(`Review submitted for ${sellerName}!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.message?.includes('unique_reviewer_reviewee')) {
        toast.error('You have already reviewed this seller.');
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h2 className="text-lg font-bold">Review {sellerName}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">How was your experience?</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-gold text-gold'
                        : 'fill-transparent text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-xs font-bold text-gold uppercase tracking-widest mt-1">
                {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Write a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share details of your experience with ${sellerName}...`}
              className="min-h-[100px] w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-muted-foreground font-medium">
              {comment.length}/500
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
