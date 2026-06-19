import { supabase } from './supabase';

// Generic fetch wrapper is no longer needed since we use Supabase client

// --- Auth API ---
// Handled by AuthContext now, but we can export dummies if needed by older components
export const getMe = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  if (error) throw error;
  return data;
};

// --- Listings API ---
export const getListings = async (params = {}) => {
  let query = supabase.from('listings').select('*, seller:profiles!seller_id(name, location, created_at)', { count: 'exact' });

  // Filters
  if (params.category) query = query.eq('category', params.category);
  if (params.location) query = query.eq('location', params.location);
  if (params.keyword) query = query.or(`title.ilike.%${params.keyword}%,description.ilike.%${params.keyword}%`);
  if (params.minPrice) query = query.gte('price', params.minPrice);
  if (params.maxPrice) query = query.lte('price', params.maxPrice);

  // Sorting
  const sort = params.sort || 'createdAt';
  if (sort === 'createdAt') query = query.order('created_at', { ascending: false });
  if (sort === 'price_asc') query = query.order('price', { ascending: true });
  if (sort === 'price_desc') query = query.order('price', { ascending: false });

  // Pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;
  
  if (error) throw error;
  
  return {
    listings: data,
    total: count,
    pages: Math.ceil(count / limit)
  };
};

export const getFeaturedListings = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);
    
  if (error) throw error;
  return data;
};

export const getListing = async (id) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(name, location, created_at)')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  // Increment views
  supabase.rpc('increment_listing_views', { listing_id: id }).then();
  
  return data;
};

export const getSellerListings = async (sellerId) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Instead of passing FormData directly to Supabase, we need to handle image uploads separately
export const createListing = async (listingData, imageFiles) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  // Upload images first
  const imageUrls = [];
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);
        
      imageUrls.push(publicUrl);
    }
  }

  // Then create listing
  const { data, error } = await supabase
    .from('listings')
    .insert([
      {
        ...listingData,
        images: imageUrls,
        seller_id: session.user.id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateListing = async (id, updates) => {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteListing = async (id) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// Categories API (hardcoded in Supabase world since it's usually static data)
export const getCategories = async () => {
  return [];
};

// Count active listings per category (for sidebar display)
export const getCategoryCounts = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select('category');
  if (error) return {};
  const counts = {};
  (data || []).forEach(r => {
    if (r.category) counts[r.category] = (counts[r.category] || 0) + 1;
  });
  return counts;
};

// Image URL helper
export const imageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  // If we have relative paths (legacy MongoDB ones), we just return them for now,
  // but new Supabase paths will be full HTTP URLs.
  return path;
};

// Format price in KES
export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return `KES ${Number(price).toLocaleString('en-KE')}`;
};

// Time ago
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};
