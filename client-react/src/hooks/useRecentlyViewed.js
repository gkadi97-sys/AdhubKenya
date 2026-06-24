import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adhub_recently_viewed';
const MAX_ITEMS = 15;

export function useRecentlyViewed() {
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentListings(JSON.parse(stored));
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
