-- ============================================================
-- AdHub Kenya - Missing Indexes Migration
-- Adds B-tree expression indexes on specs JSONB fields that are
-- now filterable but not yet indexed, causing full table scans.
-- ============================================================

-- ── Vehicles ──────────────────────────────────────────────────────────────────
-- VehicleForm saves fuelType, TruckForm saves fuel — index both
CREATE INDEX IF NOT EXISTS idx_listings_specs_fuelType
  ON listings ((specs->>'fuelType'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_fuel
  ON listings ((specs->>'fuel'))
  WHERE status = 'active';

-- VehicleForm saves driveType
CREATE INDEX IF NOT EXISTS idx_listings_specs_driveType
  ON listings ((specs->>'driveType'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_transmission
  ON listings ((specs->>'transmission'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_vehicle_type
  ON listings ((specs->>'vehicle_type'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_bodyStyle
  ON listings ((specs->>'bodyStyle'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_color
  ON listings ((specs->>'color'))
  WHERE status = 'active';

-- ── Electronics ───────────────────────────────────────────────────────────────
-- TvForm saves screenSize and displayTech (not tv_size / tv_tech)
CREATE INDEX IF NOT EXISTS idx_listings_specs_screenSize
  ON listings ((specs->>'screenSize'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_displayTech
  ON listings ((specs->>'displayTech'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_resolution
  ON listings ((specs->>'resolution'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_smartPlatform
  ON listings ((specs->>'smartPlatform'))
  WHERE status = 'active';

-- AudioForm fields
CREATE INDEX IF NOT EXISTS idx_listings_specs_equipmentType
  ON listings ((specs->>'equipmentType'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_channels
  ON listings ((specs->>'channels'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_connectivity
  ON listings ((specs->>'connectivity'))
  WHERE status = 'active';

-- Shared brand/series (phones, laptops, audio, TV, home furniture)
CREATE INDEX IF NOT EXISTS idx_listings_specs_brand
  ON listings ((specs->>'brand'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_series
  ON listings ((specs->>'series'))
  WHERE status = 'active';

-- ── Laptops ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_specs_cpuBrand
  ON listings ((specs->>'cpuBrand'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_gpu
  ON listings ((specs->>'gpu'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_ram
  ON listings ((specs->>'ram'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_os
  ON listings ((specs->>'os'))
  WHERE status = 'active';

-- ── Phones ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_specs_storage
  ON listings ((specs->>'storage'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_network
  ON listings ((specs->>'network'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_chipset
  ON listings ((specs->>'chipset'))
  WHERE status = 'active';

-- ── Property ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_specs_bedrooms
  ON listings ((specs->>'bedrooms'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_bathrooms
  ON listings ((specs->>'bathrooms'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_furnished
  ON listings ((specs->>'furnished'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_purpose
  ON listings ((specs->>'purpose'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_listingCategory
  ON listings ((specs->>'listingCategory'))
  WHERE status = 'active';

-- ── Jobs ──────────────────────────────────────────────────────────────────────
-- JobForm saves employmentType (filter param job_type queries both)
CREATE INDEX IF NOT EXISTS idx_listings_specs_employmentType
  ON listings ((specs->>'employmentType'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_workArrangement
  ON listings ((specs->>'workArrangement'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_experienceLevel
  ON listings ((specs->>'experienceLevel'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_educationLevel
  ON listings ((specs->>'educationLevel'))
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_listings_specs_industry
  ON listings ((specs->>'industry'))
  WHERE status = 'active';

-- ── Condition (universal) ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_specs_condition
  ON listings ((specs->>'condition'))
  WHERE status = 'active';

-- ── Seller type ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_specs_sellerType
  ON listings ((specs->>'sellerType'))
  WHERE status = 'active';

-- ── Status + category composite (most common query pattern) ───────────────────
CREATE INDEX IF NOT EXISTS idx_listings_status_category
  ON listings (status, category)
  WHERE status = 'active';

-- ── Created_at for date-posted filters ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_created_at_desc
  ON listings (created_at DESC)
  WHERE status = 'active';
