import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getUserReviews, timeAgo, canUserReviewSeller } from '@/lib/api';
// eslint-disable-next-line no-unused-vars
import { MapPin, Calendar, Star, ShieldCheck, Mail, Phone, ChevronLeft } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import StarRating from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeListings, setActiveListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const [canReview, setCanReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch Profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        setProfile(prof);

        // Fetch Active Listings
        const { data: list } = await supabase
          .from('listings')
          .select('*')
          .eq('seller_id', id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        setActiveListings(list || []);

        // Fetch Reviews
        const revs = await getUserReviews(id);
        setReviews(revs || []);

        // Check if user can review
        const canRev = await canUserReviewSeller(id);
        setCanReview(canRev);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">This user may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <Link to={-1} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="relative mx-auto w-24 h-24 mb-4">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                  {(profile.full_name || profile.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {profile.full_name || profile.name}
            </h1>
            <div className="mt-2 flex flex-col items-center justify-center gap-1">
              <StarRating rating={profile.average_rating || 0} count={profile.review_count || 0} size="md" />
              <span className="text-xs text-muted-foreground">({profile.review_count || 0} reviews)</span>
            </div>
            
            {canReview && (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <Star className="w-4 h-4" /> Rate Seller
              </button>
            )}
            
            <div className="mt-6 flex flex-col gap-3 text-sm text-left">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Joined {new Date(profile.created_at).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div className="flex border-b border-border mb-6">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'listings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Active Listings ({activeListings.length})
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeListings.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No active listings available.
                </div>
              ) : (
                activeListings.map(l => (
                  <ListingCard key={l.id} listing={l} />
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No reviews yet.
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {r.reviewer?.avatar_url ? (
                          <img src={r.reviewer.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(r.reviewer?.full_name || r.reviewer?.name || '?').charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {r.reviewer?.full_name || r.reviewer?.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</p>
                        </div>
                      </div>
                      <StarRating rating={r.rating} showCount={false} size="sm" />
                    </div>
                    {r.comment && (
                      <p className="mt-3 text-sm text-foreground leading-relaxed">
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          sellerId={id}
          sellerName={profile.full_name || profile.name}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            getUserReviews(id).then(r => setReviews(r || []));
            // Trigger a reload of the profile to update the rating display
            supabase.from('profiles').select('*').eq('id', id).single().then(({data}) => setProfile(data));
          }}
        />
      )}
    </div>
  );
}
