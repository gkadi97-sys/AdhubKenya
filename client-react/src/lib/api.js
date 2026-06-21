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
  const page  = parseInt(params.page)  || 1;
  const limit = parseInt(params.limit) || 12;
  const offset = (page - 1) * limit;

  // 1. If searching by keyword, use the advanced search ranking RPC
  if (params.keyword) {
    // Extract filter-only params (exclude pagination, keyword, sort)
    const filters = { ...params };
    delete filters.keyword;
    delete filters.category;
    delete filters.page;
    delete filters.limit;
    delete filters.sort;

    const { data, error } = await supabase.rpc('search_listings_ranked', {
      p_keyword: params.keyword,
      p_category: params.category || null,
      p_filters: Object.keys(filters).length > 0 ? filters : null,
      p_limit: limit,
      p_offset: offset
    });

    if (error) throw error;

    const total = data.length > 0 ? Number(data[0].total_count) : 0;
    
    // The RPC returns ranked results natively. We only re-sort if explicitly requested.
    let sortedData = data;
    if (params.sort === 'price_asc') {
      sortedData = [...data].sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      sortedData = [...data].sort((a, b) => b.price - a.price);
    } else if (params.sort === 'createdAt') {
       // already secondarily sorted by created_at in RPC
    }

    // fetch seller profiles separately since RPC returns raw rows
    if (sortedData.length > 0) {
       const sellerIds = [...new Set(sortedData.map(d => d.seller_id))];
       const { data: profiles } = await supabase.from('profiles').select('id, name, location, created_at').in('id', sellerIds);
       if (profiles) {
         sortedData = sortedData.map(d => ({
           ...d,
           seller: profiles.find(p => p.id === d.seller_id)
         }));
       }
    }

    return {
      listings: sortedData,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  // 2. Standard Query (No Keyword)
  let query = supabase.from('listings').select('*, seller:profiles!seller_id(name, location, created_at)', { count: 'exact' });

  // ── Top-level column filters (backward-compatible) ────────────────────────
  if (params.category)  query = query.eq('category', params.category);
  if (params.location)  query = query.eq('location', params.location);
  if (params.minPrice)  query = query.gte('price', params.minPrice);
  if (params.maxPrice)  query = query.lte('price', params.maxPrice);

  // ── Structured attribute filters via specs JSONB column ───────────────────
  if (params.make) {
    query = query.or(`make.ilike.%${params.make}%,specs->make.ilike.%${params.make}%`);
  }

  const SPECS_PARAMS = [
    'model', 'subcategory', 'system', 'part',
    'vehicle_type', 'bodyStyle', 'fuel', 'transmission', 'drive',
    'color', 'numSeats', 'registered', 'exchange',
    'os', 'ram', 'storage',
    'property_type', 'purpose', 'bedrooms', 'bathrooms', 'furnished', 'parking',
    'job_type', 'industry', 'animal_type', 'gender',
    'condition',
    'equipmentType', 'brand', 'series', 'cpuBrand', 'cpuFamily', 'gpu', 
    'screenSize', 'channels', 'connectivity', 'resolution', 'tv_size', 'tv_tech'
  ];

  SPECS_PARAMS.forEach(key => {
    if (params[key]) {
      query = query.ilike(`specs->>${key}`, `%${params[key]}%`);
    }
  });

  // ── Numeric range filters from specs ──────────────────────────────────────
  if (params.engineCC_max) query = query.lte(`specs->>engineCC`, params.engineCC_max);
  if (params.mileage_max) query = query.lte(`specs->>mileage`, params.mileage_max);
  if (params.year_min) query = query.gte('year', parseInt(params.year_min));
  if (params.year_max) query = query.lte('year', parseInt(params.year_max));

  // ── Date-posted filter ────────────────────────────────────────────────────
  if (params.posted) {
    const now = new Date();
    if (params.posted === 'Today') {
      now.setHours(0, 0, 0, 0);
      query = query.gte('created_at', now.toISOString());
    } else if (params.posted === 'Last 7 days') {
      query = query.gte('created_at', new Date(Date.now() - 7 * 864e5).toISOString());
    } else if (params.posted === 'Last 30 days') {
      query = query.gte('created_at', new Date(Date.now() - 30 * 864e5).toISOString());
    }
  }

  // ── County / location ──────────────────────────────────────────────────────
  if (params.county) query = query.ilike('location', `%${params.county}%`);

  // ── Sorting ────────────────────────────────────────────────────────────────
  const sort = params.sort || 'createdAt';
  if (sort === 'createdAt') query = query.order('created_at', { ascending: false });
  if (sort === 'price_asc')  query = query.order('price', { ascending: true });
  if (sort === 'price_desc') query = query.order('price', { ascending: false });

  // ── Pagination ─────────────────────────────────────────────────────────────
  const to = offset + limit - 1;
  query = query.range(offset, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    listings: data,
    total: count,
    pages: Math.ceil(count / limit),
  };
};

/**
 * Fetches dynamic aggregations (counts) for a specific field based on current filters.
 * Powers the data-driven filter sidebar options.
 */
export const getFilterAggregates = async (category, aggregateField, currentFilters = {}) => {
  if (!category || !aggregateField) return {};
  
  // Clean up filters to only send actual DB fields
  const cleanFilters = { ...currentFilters };
  delete cleanFilters.category;
  delete cleanFilters.page;
  delete cleanFilters.sort;
  delete cleanFilters.keyword;

  const { data, error } = await supabase.rpc('get_filter_aggregates', {
    p_category: category,
    p_aggregate_field: aggregateField,
    p_filters: Object.keys(cleanFilters).length > 0 ? cleanFilters : null
  });

  if (error) {
    console.error('Error fetching filter aggregates:', error);
    return {};
  }
  return data || {};
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
