import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSellerListings, deleteListing, formatPrice, timeAgo, imageUrl , updateListing } from '@/lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import UrlService from '@/lib/seo/UrlService';
// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import { PlusCircle, MapPin, Eye, Clock, Trash2, ExternalLink, PackageOpen, Lock, Sparkles, Edit } from 'lucide-react';
import PromoteAdModal from '@/components/PromoteAdModal';
import Image from '@/components/Image';

export default function MyAdsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [promoteModalOpen, setPromoteModalOpen] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getSellerListings(user.id).then(setListings).catch(()=>setListings([])).finally(()=>setLoading(false));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
    } else { setLoading(false); }
     
  }, [user]);

  
  const handleStatusChange = async (id, newStatus, currentTitle) => {
    let message = `Change status to ${newStatus}?`;
    if (newStatus === 'sold') message = `Mark "${currentTitle}" as Sold? It will remain visible but marked as SOLD.`;
    if (newStatus === 'expired') message = `Close "${currentTitle}"? It will be hidden from public search.`;
    if (newStatus === 'active') message = `Reactivate "${currentTitle}"?`;
    if (newStatus === 'pending') message = `Submit "${currentTitle}" for review?`;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              // Reactivation moderation logic
              let finalStatus = newStatus;
              if (newStatus === 'active' || newStatus === 'pending') {
                finalStatus = 'pending'; // assume moderation_required=true for now, or fetch from config
              }
              await updateListing(id, { status: finalStatus });
              setListings(prev => prev.map(x => x.id === id ? { ...x, status: finalStatus } : x));
              toast.success(`Listing marked as ${finalStatus}.`);
            } catch (e) {
              toast.error(e.message || 'Failed to update listing.');
            }
          }} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Confirm</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

const handleDelete = async (id) => {
    // Use toast-based confirmation instead of native browser dialog
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">Delete this listing?</p>
          <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary transition-colors"
            >Cancel</button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeleting(id);
                try {
                  await deleteListing(id);
                  setListings(l => l.filter(x => x.id !== id));
                  toast.success('Listing deleted.');
                } catch (e) {
                  toast.error(e.message || 'Failed to delete listing.');
                } finally {
                  setDeleting(null);
                }
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >Yes, Delete</button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // user === undefined means AuthContext is still initialising
  if (user === undefined) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {[...Array(3)].map((_,i) => (
          <div key={i} className="flex h-[140px] w-full animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
            <div className="w-[140px] shrink-0 bg-secondary/50"></div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="mb-3 h-5 w-3/4 rounded-md bg-secondary/60"></div>
              <div className="h-4 w-1/4 rounded-md bg-secondary/50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!user) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-500">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 shadow-inner border border-border">
        <Lock className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-3 tracking-tight text-foreground">Login Required</h1>
      <p className="mb-8 text-muted-foreground max-w-sm text-lg">You need to be logged in to view your ads, manage your listings, and connect with buyers.</p>
      <Link to="/login" className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 active:scale-95">
        Sign In to Continue
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">My Ads</h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Welcome back, <span className="font-bold text-foreground">{user.name}</span> 👋</p>
          </div>
          <Link to="/post-ad" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto w-full">
            <PlusCircle className="h-4 w-4" />
            Post New Ad
          </Link>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="flex h-[140px] w-full animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                <div className="w-[140px] shrink-0 bg-secondary/50"></div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="mb-3 h-5 w-3/4 rounded-md bg-secondary/60"></div>
                    <div className="h-4 w-1/4 rounded-md bg-secondary/50"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-3 w-16 rounded-md bg-secondary/40"></div>
                    <div className="h-3 w-16 rounded-md bg-secondary/40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card shadow-sm py-24 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-inner">
              <PackageOpen className="h-12 w-12 text-primary animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">No ads yet</h2>
            <p className="mb-8 max-w-md text-muted-foreground text-lg">You haven't posted any ads. Start selling today and reach thousands of buyers across Kenya!</p>
            <Link to="/post-ad" className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 active:scale-95 inline-block">
              Post your first Ad — Free
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map(l => (
              <div key={l.id} className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/30 hover:shadow-md">
                
                {/* Image */}
                <div className="h-48 w-full shrink-0 sm:h-auto sm:w-[200px] overflow-hidden">
                  <Image
                    src={l.images?.[0] ? imageUrl(l.images[0]) : null}
                    alt={l.title}
                    className="h-full w-full transition duration-300 group-hover:scale-105"
                    fallbackIconSize={28}
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link to={UrlService.listing(l)} className="block truncate text-lg font-bold text-foreground transition hover:text-primary">
                        {l.title}
                      </Link>
                      <div className="font-display mt-1 text-xl font-black text-primary">
                        {formatPrice(l.price)}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1">
                          <MapPin className="h-3 w-3" /> <span className="truncate max-w-[120px]">{l.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1">
                          <Eye className="h-3 w-3" /> {l.views} views
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1">
                          <Clock className="h-3 w-3" /> {timeAgo(l.created_at)}
                        </span>
                        {l.status === 'active' && <span className="flex items-center rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-green-600 border border-green-500/20">ACTIVE</span>}
                        {l.status === 'sold' && <span className="flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 border border-blue-500/20">SOLD</span>}
                        {l.status === 'pending' && <span className="flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 border border-orange-500/20">PENDING</span>}
                        {l.status === 'expired' && <span className="flex items-center rounded-full bg-gray-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-gray-500/20">CLOSED</span>}
                        {l.status === 'draft' && <span className="flex items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-500/20">DRAFT</span>}
                        {(l.status === 'rejected' || l.status === 'needs_revision' || l.status === 'suspended') && <span className="flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-500/20">{l.status.toUpperCase().replace('_', ' ')}</span>}
                        {l.promoted_until && new Date(l.promoted_until) > new Date() && (
                          <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold shadow-sm">
                            <Sparkles className="h-3 w-3" /> Promoted
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex shrink-0 items-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border sm:border-0 w-full sm:w-auto justify-end flex-wrap">
                      {/* Edit (Active, Pending, Draft, Needs Revision) */}
                      {['active', 'pending', 'draft', 'needs_revision'].includes(l.status) && (
                        <Link to={`/edit-ad/${l.id}`} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-xs font-semibold text-foreground transition hover:bg-secondary sm:w-auto flex-1 sm:flex-none">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Link>
                      )}

                      {/* Promote (Active) */}
                      {l.status === 'active' && (
                        <button onClick={() => setPromoteModalOpen(l)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-4 text-xs font-semibold text-gold transition hover:bg-gold hover:text-white sm:w-auto flex-1 sm:flex-none">
                          <Sparkles className="h-3.5 w-3.5" /> Promote
                        </button>
                      )}

                      {/* Mark Sold (Active) */}
                      {l.status === 'active' && (
                        <button onClick={() => handleStatusChange(l.id, 'sold', l.title)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white sm:w-auto flex-1 sm:flex-none">
                          Sold
                        </button>
                      )}

                      {/* Close (Active) */}
                      {l.status === 'active' && (
                        <button onClick={() => handleStatusChange(l.id, 'expired', l.title)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-xs font-semibold text-muted-foreground transition hover:bg-secondary sm:w-auto flex-1 sm:flex-none">
                          Close
                        </button>
                      )}

                      {/* Reactivate (Sold, Closed, Expired) */}
                      {['sold', 'expired'].includes(l.status) && (
                        <button onClick={() => handleStatusChange(l.id, 'pending', l.title)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 text-xs font-semibold text-green-600 transition hover:bg-green-600 hover:text-white sm:w-auto flex-1 sm:flex-none">
                          Reactivate
                        </button>
                      )}

                      {/* Publish (Draft, Rejected, Needs Revision) */}
                      {['draft', 'rejected', 'needs_revision'].includes(l.status) && (
                        <button onClick={() => handleStatusChange(l.id, 'pending', l.title)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-4 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto flex-1 sm:flex-none">
                          Publish
                        </button>
                      )}

                      {/* Delete (All) */}
                      <button onClick={()=>handleDelete(l.id)} disabled={deleting===l.id} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 text-xs font-semibold text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto flex-1 sm:flex-none">
                        <Trash2 className="h-3.5 w-3.5" /> {deleting===l.id ? '...' : 'Delete'}
                      </button>
                    </div>
                    
                    {(l.status === 'rejected' || l.status === 'needs_revision') && l.rejection_reason && (
                      <div className="mt-4 w-full bg-destructive/5 border border-destructive/20 rounded-xl p-3 text-sm text-destructive">
                        <span className="font-bold">Moderator Note:</span> {l.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {promoteModalOpen && (
        <PromoteAdModal 
          listing={promoteModalOpen} 
          onClose={() => setPromoteModalOpen(null)} 
          onSuccess={(updatedListing) => {
            setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
            setPromoteModalOpen(null);
          }}
        />
      )}
    </div>
  );
}
