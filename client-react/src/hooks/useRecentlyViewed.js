import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adhub_recently_viewed';
const MAX_ITEMS = 15;

export function useRecentlyViewed() {
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentListings(parsed);
        
        // Background validation: remove any listings that are no longer active (e.g. banned, sold, deleted)
        if (parsed.length > 0) {
          const ids = parsed.map(p => p.id);
          import('@/lib/supabase').then(({ supabase }) => {
            supabase
              .from('listings')
              .select('id, status')
              .in('id', ids)
              .then(({ data, error }) => {
                if (data && !error) {
                  // Only keep listings that still exist and are 'active'
                  const activeIds = new Set(data.filter(d => d.status === 'active').map(d => d.id));
                  const validListings = parsed.filter(p => activeIds.has(p.id));
                  
                  if (validListings.length !== parsed.length) {
                    setRecentListings(validListings);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(validListings));
                  }
                }
              });
          });
        }
      }
    } catch (e) {
      console.error('Failed to load recently viewed:', e);
    }
  }, []);

  const addListing = (listing) => {
    if (!listing || !listing.id) return;
    
    setRecentListings(prev => {
      // Remove if it already exists to avoid duplicates
      const filtered = prev.filter(item => item.id !== listing.id);
      
      // We only store the bare minimum metadata needed for the cards to save storage space
      const listingToStore = {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        county: listing.county,
        condition: listing.condition,
        images: listing.images ? [listing.images[0]] : [],
        category: listing.category
      };
      
      const updated = [listingToStore, ...filtered].slice(0, MAX_ITEMS);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed:', e);
      }
      
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentListings([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentListings, addListing, clearHistory };
}
