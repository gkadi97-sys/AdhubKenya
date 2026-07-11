import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getSaved, toggleSaved, formatPrice, imageUrl, timeAgo } from '@/lib/api';
import { Heart, Clock, MapPin, Trash2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from '@/components/Image';

export default function SavedAds() {
  const { user } = useAuth();
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedAds();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSavedAds = async () => {
    try {
      setLoading(true);
      const data = await getSaved();
      setSavedAds(data || []);
    } catch (error) {
      toast.error('Failed to load saved ads');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (listingId, e) => {
    e.preventDefault();
    try {
      await toggleSaved(listingId, true);
      setSavedAds(prev => prev.filter(ad => ad.listing_id !== listingId));
      toast.success('Removed from saved ads');
    } catch (error) {
      toast.error('Failed to remove ad');
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-500">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 shadow-inner border border-border">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3 tracking-tight text-foreground">Login Required</h1>
        <p className="text-muted-foreground mb-8 max-w-sm text-lg">Please log in to view and manage your saved ads.</p>
        <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" /> Saved Ads
      </h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse bg-secondary rounded-2xl h-80 border border-border"></div>
          ))}
        </div>
      ) : savedAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card shadow-sm py-24 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-inner">
            <Heart className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3">No saved ads yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-lg">Keep track of items you love! Click the heart icon on any ad to save it here for easy access later.</p>
          <Link to="/browse" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95 inline-block">Start Browsing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedAds.map((saved) => {
            const ad = saved.listings;
            if (!ad) return null;
            return (
              <Link key={saved.id} to={`/listing/${ad.slug || ad.id}`} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all flex flex-col relative">
                <button 
                  onClick={(e) => handleRemove(ad.id, e)}
                  className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full text-red-500 hover:scale-110 transition-transform z-10 shadow-sm"
                  title="Remove from saved"
                >
                  <Trash2 size={18} />
                </button>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={ad.images?.length > 0 ? imageUrl(ad.images[0]) : null}
                    alt={ad.title}
                    className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500"
                    fallbackIconSize={28}
                  />
                  {ad.condition && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded">
                      {ad.condition}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xl font-bold text-primary mb-1">{formatPrice(ad.price)}</div>
                  <h3 className="font-semibold line-clamp-2 mb-2 flex-1 group-hover:text-primary transition-colors">{ad.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground gap-3">
                    <div className="flex items-center gap-1"><MapPin size={12}/> <span className="truncate">{ad.location}</span></div>
                    <div className="flex items-center gap-1"><Clock size={12}/> {timeAgo(ad.created_at)}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
