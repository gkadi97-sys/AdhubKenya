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

  // Filter to active listings only
  query = query.or('status.eq.active,status.is.null');

  // ── Top-level column filters (exact match) ──────────────────────────────
  if (params.category)  query = query.eq('category', params.category);
  if (params.location)  query = query.eq('location', params.location);
  if (params.minPrice)  query = query.gte('price', params.minPrice);
  if (params.maxPrice)  query = query.lte('price', params.maxPrice);

  // ── Top-level structured columns (exact match — PostAd saves these as columns) ───
  // make, model, year are extracted from attrs and saved as top-level DB columns.
  // We check both the column AND specs JSONB for backward-compatibility.
  if (params.make) {
    // Exact match on top-level column; also check specs JSONB for legacy data
    query = query.or(`make.eq.${params.make},specs->>make.eq.${params.make}`);
  }
  if (params.model) {
    query = query.or(`model.eq.${params.model},specs->>model.eq.${params.model}`);
  }
  if (params.year) {
    const yr = parseInt(params.year);
    if (!isNaN(yr)) query = query.eq('year', yr);
  }

  // ── Backward-compat ALIAS filters (URL param → actual DB field name) ──────
  // These fix field-name mismatches between filterConfig URL params and what
  // forms actually save into the specs JSONB column.

  // fuel: VehicleForm saves specs.fuelType, TruckForm saves specs.fuel — query both
  if (params.fuel) {
    query = query.or(`specs->>fuel.ilike.%${params.fuel}%,specs->>fuelType.ilike.%${params.fuel}%`);
  }
  // drive: VehicleForm saves specs.driveType — query both
  if (params.drive) {
    query = query.or(`specs->>drive.ilike.%${params.drive}%,specs->>driveType.ilike.%${params.drive}%`);
  }
  // job_type: JobForm saves specs.employmentType — query both
  if (params.job_type) {
    query = query.or(`specs->>job_type.ilike.%${params.job_type}%,specs->>employmentType.ilike.%${params.job_type}%`);
  }
  // tv_size: TvForm saves specs.screenSize (not specs.tv_size)
  if (params.tv_size) {
    query = query.ilike('specs->>screenSize', `%${params.tv_size}%`);
  }
  // tv_tech: TvForm saves specs.displayTech (not specs.tv_tech)
  if (params.tv_tech) {
    query = query.ilike('specs->>displayTech', `%${params.tv_tech}%`);
  }
  // seller_type: stored in specs.sellerType
  if (params.seller_type) {
    query = query.ilike('specs->>sellerType', `%${params.seller_type}%`);
  }
  // amenities: stored as a JSONB array in specs.amenities — use contains text search
  if (params.amenities) {
    query = query.ilike('specs->>amenities', `%${params.amenities}%`);
  }
  // oemNumber: PostAd.jsx spreads all attrs into listingData.specs (line 210), so it's always in specs JSONB
  if (params.oemNumber) {
    query = query.ilike('specs->>oemNumber', `%${params.oemNumber}%`);
  }

  // ── Standard JSONB specs filters (dynamic) ────────────────────────────────
  // Any parameter that isn't a top-level column or reserved keyword is treated as a specs filter.
  // STRUCTURED fields (enums/selects) use EXACT match. Free-text fields use ILIKE.
  const RESERVED_PARAMS = ['category', 'location', 'minPrice', 'maxPrice', 'keyword', 'sort', 'page', 'limit', 'county', 'town', 'area', 'engineCC_max', 'mileage_max', 'year_min', 'year_max', 'year', 'salaryMin_min', 'salaryMax_max', 'posted', 'oemNumber'];

  // Fields that come from structured dropdowns/radios → exact match
  const EXACT_MATCH_FIELDS = new Set([
    'fuelType', 'transmission', 'bodyType', 'driveType', 'color', 'condition',
    'registered', 'exchange', 'seats', 'doors', 'usageType',
    'listingType', 'partCategory', 'part', 'position', 'universal', 'vehicleType',
    'listingCategory', 'propertyCategory', 'propertyType', 'bedrooms', 'bathrooms',
    'furnished', 'floors', 'parking',
    'brand', 'series', 'storage', 'ram', 'network', 'os',
    'subcategory', 'cpuBrand', 'storageType', 'storageSize', 'screenSize', 'screenSizeTv',
    'displayTech', 'resolution', 'smartPlatform', 'tvBrand', 'tvSeries',
    'equipmentType', 'audioBrand', 'channels', 'connectivity',
    'employmentType', 'workArrangement', 'experienceLevel', 'educationLevel', 'industry',
  ]);
  
  Object.keys(params).forEach(key => {
    // Skip reserved params
    if (RESERVED_PARAMS.includes(key)) return;
    
    // Skip if empty
    if (!params[key]) return;

    // Already handled explicitly above
    if (['make', 'model', 'fuel', 'drive', 'job_type', 'tv_size', 'tv_tech', 'seller_type', 'amenities', 'oemNumber'].includes(key)) return;

    // Handle comma-separated multicheck values (e.g., "Petrol,Diesel") as OR clauses
    const values = params[key].split(',').map(v => v.trim()).filter(Boolean);

    if (EXACT_MATCH_FIELDS.has(key)) {
      // Structured field → exact match (case-insensitive via ilike with no wildcards)
      if (values.length === 1) {
        query = query.ilike(`specs->>${key}`, values[0]); // exact, case-insensitive
      } else if (values.length > 1) {
        const orClause = values.map(v => `specs->>${key}.ilike.${v}`).join(',');
        query = query.or(orClause);
      }
    } else {
      // Free-text field → substring ILIKE
      if (values.length === 1) {
        query = query.ilike(`specs->>${key}`, `%${values[0]}%`);
      } else if (values.length > 1) {
        const orClause = values.map(v => `specs->>${key}.ilike.%${v}%`).join(',');
        query = query.or(orClause);
      }
    }
  });

  // ── Numeric range filters ─────────────────────────────────────────────────
  if (params.engineCC_max)  query = query.lte(`specs->>engineCC`,  params.engineCC_max);
  if (params.mileage_max)   query = query.lte(`specs->>mileage`,   params.mileage_max);
  if (params.year_min)      query = query.gte('year', parseInt(params.year_min));
  if (params.year_max)      query = query.lte('year', parseInt(params.year_max));
  // Salary range for jobs
  if (params.salaryMin_min) query = query.gte(`specs->>salaryMin`, params.salaryMin_min);
  if (params.salaryMax_max) query = query.lte(`specs->>salaryMax`, params.salaryMax_max);

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

  // ── County / location ─────────────────────────────────────────────────────
  if (params.county) query = query.ilike('location', `%${params.county}%`);

  // ── Sorting ───────────────────────────────────────────────────────────────
  const sort = params.sort || 'createdAt';
  if (sort === 'createdAt') query = query.order('created_at', { ascending: false });
  if (sort === 'price_asc')  query = query.order('price', { ascending: true });
  if (sort === 'price_desc') query = query.order('price', { ascending: false });

  // ── Pagination ────────────────────────────────────────────────────────────
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
    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);
          
        imageUrls.push({ url: publicUrl, path: filePath });
      }
    } catch (err) {
      if (imageUrls.length > 0) {
        // Cleanup uploaded images on failure
        const paths = imageUrls.map(i => i.path);
        await supabase.storage.from('listing-images').remove(paths);
      }
      throw err;
    }
  }

  // Then create listing
  const { data, error } = await supabase
    .from('listings')
    .insert([
      {
        ...listingData,
        images: imageUrls.map(i => i.url),
        seller_id: session.user.id,
        status: 'active'
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
    .select('category')
    .or('status.eq.active,status.is.null');
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

// ==========================================
// PHASE 3 ADVANCED FEATURES
// ==========================================

export const getSavedSearches = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const saveSearch = async (keyword, filters) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_searches')
    .insert([{ user_id: session.user.id, keyword, filters }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSavedSearch = async (id) => {
  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const promoteListing = async (id, days, badgeType) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  const { data, error } = await supabase
    .from('listings')
    .update({ 
      promoted_until: expiry.toISOString(), 
      badge_type: badgeType 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFeaturedListings = async (limit = 6) => {
  // We use the RPC defined in our migration script
  const { data, error } = await supabase.rpc('get_featured_listings', { lim: limit });
  if (error) {
    console.error('Failed to get featured listings via RPC, falling back to basic query:', error);
    // Fallback if RPC isn't deployed yet (so UI doesn't crash)
    const { data: fallback, error: fallbackErr } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('createdAt', { ascending: false })
      .limit(limit);
      
    if (fallbackErr) throw fallbackErr;
    return { listings: fallback };
  }
  return { listings: data || [] };
};
