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

// --- Admin API ---
export const getAdminStats = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const [
    { count: totalAds },
    { count: activeAds },
    { count: pendingAds },
    { count: users }
  ] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('id', { count: 'exact', head: true })
  ]);

  const { data: transactions } = await supabase.from('transactions').select('amount').eq('status', 'completed');
  const revenue = (transactions || []).reduce((acc, tx) => acc + Number(tx.amount || 0), 0);

  return {
    totalAds: totalAds || 0,
    activeAds: activeAds || 0,
    pendingAds: pendingAds || 0,
    users: users || 0,
    revenue
  };
};

// --- Listings API ---
export const getListings = async (params = {}) => {
  const page  = parseInt(params.page)  || 1;
  const limit = parseInt(params.limit) || 12;
  const offset = (page - 1) * limit;

  let query = supabase.from('listings').select('*, seller:profiles!seller_id(name, location, created_at)', { count: 'exact' });

  // Filter to active listings only
  query = query.or('status.eq.active,status.is.null');

  const hasKeyword = params.keyword && params.keyword.trim().length > 0;
  if (hasKeyword) {
    const k = params.keyword.trim();
    if (k.length <= 2) {
      // Short queries: fall back to ILIKE (tsquery requires real tokens)
      query = query.or(`title.ilike.%${k}%,description.ilike.%${k}%,make.ilike.%${k}%,specs->>model.ilike.%${k}%`);
    } else {
      // Full-text search via pre-built GIN index on search_vector
      // websearch_to_tsquery accepts natural language ('toyota fielder 2018')
      query = query.textSearch('search_vector', k, { type: 'websearch', config: 'english' });
    }
  }

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
  const RESERVED_PARAMS = ['category', 'location', 'minPrice', 'maxPrice', 'keyword', 'sort', 'page', 'limit', 'county', 'town', 'area', 'engineCC_max', 'mileage_max', 'year_min', 'year_max', 'year', 'salaryMin_min', 'salaryMax_max', 'cvSalaryMin_min', 'cvSalaryMax_max', 'posted', 'oemNumber', 'has_cv', 'skills'];

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
    // CV / seeking-work specific
    'availability', 'employmentStatus', 'languages', 'salaryPeriod',
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
  // CV expected salary range
  if (params.cvSalaryMin_min) query = query.gte(`specs->>salaryMin`, params.cvSalaryMin_min);
  if (params.cvSalaryMax_max) query = query.lte(`specs->>salaryMax`, params.cvSalaryMax_max);
  // Skills substring search (stored as comma-separated string in specs.skills)
  if (params.skills) query = query.ilike(`specs->>skills`, `%${params.skills}%`);
  // Has CV file uploaded
  if (params.has_cv === 'true') query = query.not(`specs->>cvFileUrl`, 'is', null);

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
  // When a keyword is active and the user hasn't chosen a manual sort,
  // order by relevance rank first then fall back to recency.
  if (hasKeyword && sort === 'createdAt') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'createdAt') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  }

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


export const getListing = async (idOrSlug) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
  
  const query = supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(name, location, created_at)');
    
  if (isUuid) {
    query.eq('id', idOrSlug);
  } else {
    query.eq('slug', idOrSlug);
  }
  
  const { data, error } = await query.single();
    
  if (error) throw error;
  
  // Increment views
  supabase.from('listing_events').insert({ listing_id: data.id, event_type: 'view' }).then();
  
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

// ── CV Document Upload ─────────────────────────────────────────────────────
/**
 * Uploads a CV document (PDF/DOC/DOCX) to Supabase storage.
 * Falls back gracefully if the cv-documents bucket doesn't exist yet.
 * Returns the public URL or null on failure.
 */
export const uploadCvDocument = async (file, userId) => {
  if (!file) return null;
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}_cv.${ext}`;
  const { data, error } = await supabase.storage
    .from('cv-documents')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) {
    console.warn('CV document upload failed:', error.message);
    return null;
  }
  const { data: { publicUrl } } = supabase.storage.from('cv-documents').getPublicUrl(data.path);
  return publicUrl;
};

// ── CV Analytics ──────────────────────────────────────────────────────────
export const logCvEvent = async (listingId, eventType) => {
  try {
    await supabase.from('listing_events').insert({
      listing_id: listingId,
      event_type: eventType
    });
  } catch (_) { /* non-critical */ }
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
        const fileExt = file.name.split('.').pop() || 'jpg';
        // Use crypto.randomUUID() for secure uniqueness
        const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const fileName = `${uniqueId}.${fileExt}`;
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
      
      // Provide a more user-friendly error for RLS violations
      if (err.message && err.message.includes('row-level security policy')) {
        throw new Error('Upload failed due to security restrictions. Please ensure you are uploading valid image formats (.jpg, .png, .webp).');
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
        status: listingData.status || 'pending'
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

// ── Moderation Workflow Actions ──
export const logModerationAction = async (listingId, action, oldStatus, newStatus, reason) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from('moderation_audit_logs').insert({
    moderator_id: session.user.id,
    listing_id: listingId,
    action,
    old_status: oldStatus,
    new_status: newStatus,
    reason
  });
};

export const moderateListing = async (id, currentStatus, newStatus, updates = {}, reason = '') => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('listings')
    .update({ ...updates, status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  await logModerationAction(id, newStatus, currentStatus, newStatus, reason);
  return data;
};

// ── Platform-Wide Metadata API ──
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  if (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
  return data;
};

export const getCategoryMetadata = async (categorySlug) => {
  if (!categorySlug) return null;
  
  // 1. Get Category
  const { data: category, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();
    
  if (catErr || !category) return null;

  // 2. Get Attribute Groups
  const { data: groups } = await supabase
    .from('attribute_groups')
    .select('*')
    .eq('category_id', category.id)
    .order('order_index');

  // 3. Get Attributes
  const { data: attributes } = await supabase
    .from('attributes')
    .select('*')
    .eq('category_id', category.id)
    .order('display_order');

  // 4. Get Dependencies
  const attributeIds = (attributes || []).map(a => a.id);
  let dependencies = [];
  if (attributeIds.length > 0) {
    const { data: deps } = await supabase
      .from('attribute_dependencies')
      .select('*')
      .in('attribute_id', attributeIds);
    dependencies = deps || [];
  }

  return {
    category,
    groups: groups || [],
    attributes: attributes || [],
    dependencies
  };
};

export const getLookupValues = async (lookupType, parentId = null) => {
  let query = supabase
    .from('lookup_values')
    .select('*')
    .eq('lookup_type', lookupType)
    .eq('is_active', true)
    .order('order_index');
    
  if (parentId === 'any') {
    // No parent filter, just fetch by lookup_type
  } else if (parentId) {
    query = query.eq('parent_id', parentId);
  } else {
    query = query.is('parent_id', null);
  }
  
  const { data, error } = await query;
  if (error) return [];
  return data;
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

export async function checkDuplicateListing(sellerId, title, category) {
  if (!sellerId || !title || !category) return false;
  const { data, error } = await supabase
    .from('listings')
    .select('id')
    .eq('seller_id', sellerId)
    .eq('category', category)
    .eq('status', 'active')
    .ilike('title', title.trim())
    .limit(1);
    
  if (error) {
    console.error('Duplicate check error:', error);
    return false; // Fail open
  }
  return data && data.length > 0;
}

// ============================================================================
// Phase 3: Analytics & Trust RPC CallsES
// ==========================================

export const getListingViews = async (listingId) => {
  const { count } = await supabase.from('listing_events')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId)
    .eq('event_type', 'view');
  return count || 0;
};

export const getSellerStats = async (sellerId) => {
  const [
    { count: totalListings },
    { data: profile }
  ] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('seller_id', sellerId).eq('status', 'active'),
    supabase.from('profiles').select('created_at, average_rating, review_count').eq('id', sellerId).single()
  ]);
  return {
    total_listings: totalListings || 0,
    member_since: profile?.created_at,
    average_rating: profile?.average_rating || 0,
    review_count: profile?.review_count || 0
  };
};

// ── Reputation Engine ────────────────────────────────────────────────────────

export const submitReview = async (revieweeId, rating, comment) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      reviewer_id: session.user.id,
      reviewee_id: revieweeId,
      rating,
      comment
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserReviews = async (userId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:reviewer_id(id, name, full_name, avatar_url)
    `)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};


export const getSaved = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data } = await supabase.from('saved_listings').select('*, listings(*)').eq('user_id', session.user.id);
  return data || [];
};

export const toggleSaved = async (listingId) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  
  const { data: existing } = await supabase.from('saved_listings').select('id').eq('user_id', session.user.id).eq('listing_id', listingId).single();
  if (existing) {
    await supabase.from('saved_listings').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('saved_listings').insert({ user_id: session.user.id, listing_id: listingId });
    return true;
  }
};

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

export const getTrendingSearches = async (limitCount = 10) => {
  // Returns popular searches for the search dropdown
  return [
    { search_term: 'Toyota', search_count: 150 },
    { search_term: 'Apartments in Nairobi', search_count: 120 },
    { search_term: 'iPhone 14', search_count: 95 },
    { search_term: 'Laptops', search_count: 85 },
    { search_term: 'Land for sale', search_count: 70 },
    { search_term: 'Sneakers', search_count: 65 }
  ].slice(0, limitCount);
};

export const getCountyCounts = async () => {
  const { data } = await supabase.rpc('get_county_counts');
  return data || [];
};

// ── Recommendations Engine ──────────────────────────────────────────────────

export const trackInteraction = async (listingId, category, type = 'view') => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return; // Only track for logged-in users

  try {
    await supabase.from('user_interactions').insert([{
      user_id: session.user.id,
      listing_id: listingId,
      category,
      interaction_type: type
    }]);
  } catch (err) {
    console.error('Failed to track interaction:', err);
  }
};

export const getPersonalizedRecommendations = async (limit = 12) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { listings: [] };

  const { data, error } = await supabase.rpc('get_recommendations', {
    p_user_id: session.user.id,
    p_limit: limit
  });

  if (error) {
    console.error('Failed to fetch recommendations:', error);
    return { listings: [] };
  }

  return { listings: data || [] };
};

// ── Native Analytics Engine ─────────────────────────────────────────────────

const getDeviceType = () => {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
};

const getSessionId = () => {
  if (typeof sessionStorage === 'undefined') return 'unknown-session';
  let sid = sessionStorage.getItem('adhub_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('adhub_session_id', sid);
  }
  return sid;
};

export const logPageView = async (path) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('page_views').insert([{
      path,
      device_type: getDeviceType(),
      session_id: getSessionId(),
      user_id: session?.user?.id || null
    }]);
  } catch (err) {
    console.error('Failed to log page view:', err);
  }
};

export const logSearch = async (query) => {
  if (!query || query.trim().length < 2) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('search_logs').insert([{
      query: query.trim(),
      device_type: getDeviceType(),
      user_id: session?.user?.id || null
    }]);
  } catch (err) {
    console.error('Failed to log search:', err);
  }
};

export const fetchAdminAnalytics = async () => {
  const { data, error } = await supabase.rpc('get_admin_analytics');
  if (error) {
    console.error('Failed to fetch admin analytics:', error);
    throw error;
  }
  return data;
};
