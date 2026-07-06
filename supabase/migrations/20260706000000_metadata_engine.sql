-- Phase 1: Platform-Wide Metadata Engine Schema

-- 1. categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    level INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    allow_price BOOLEAN NOT NULL DEFAULT true,
    allow_negotiable BOOLEAN NOT NULL DEFAULT true,
    allow_location BOOLEAN NOT NULL DEFAULT true,
    allow_condition BOOLEAN NOT NULL DEFAULT true,
    listing_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    seo_title TEXT,
    seo_description TEXT,
    min_photos INTEGER DEFAULT 1,
    max_photos INTEGER DEFAULT 10,
    allow_video BOOLEAN DEFAULT false,
    allow_pdf BOOLEAN DEFAULT false,
    allow_360 BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- 2. attribute_groups
CREATE TABLE IF NOT EXISTS public.attribute_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. lookup_tables
CREATE TABLE IF NOT EXISTS public.lookup_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lookup_type TEXT NOT NULL, -- e.g., 'vehicle_makes', 'counties'
    parent_id UUID REFERENCES public.lookup_values(id) ON DELETE CASCADE, -- e.g., Model's Make
    value TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lookup_values_type ON public.lookup_values(lookup_type);

-- 4. attributes
CREATE TABLE IF NOT EXISTS public.attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.attribute_groups(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    placeholder TEXT,
    help_text TEXT,
    field_type TEXT NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'boolean', 'date'
    default_value TEXT,
    unit TEXT,
    validation_rules TEXT, -- e.g. 'numeric', 'regex'
    min_value NUMERIC,
    max_value NUMERIC,
    lookup_type TEXT, -- references lookup_values.lookup_type if field_type is 'select'/'multiselect'
    is_required BOOLEAN NOT NULL DEFAULT false,
    is_searchable BOOLEAN NOT NULL DEFAULT false,
    is_filterable BOOLEAN NOT NULL DEFAULT false,
    is_listing_card BOOLEAN NOT NULL DEFAULT false,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    is_admin_only BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attributes_category_id ON public.attributes(category_id);

-- 5. attribute_dependencies
CREATE TABLE IF NOT EXISTS public.attribute_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    depends_on_attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    operator TEXT NOT NULL DEFAULT 'equals', -- 'equals', 'not_equals', 'in', 'exists', etc.
    dependency_value JSONB,
    effect TEXT NOT NULL DEFAULT 'show', -- 'show', 'require', 'hide'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dependencies_attr ON public.attribute_dependencies(attribute_id);

-- Seed Minimal Top-Level Categories for testing
INSERT INTO public.categories (slug, name, icon, level, order_index, is_active)
VALUES 
('vehicles', 'Vehicles', '🚗', 1, 10, true),
('property', 'Property', '🏠', 1, 20, true),
('electronics', 'Electronics', '💻', 1, 30, true)
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookup_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attribute_groups" ON public.attribute_groups FOR SELECT USING (true);
CREATE POLICY "Allow public read access to lookup_values" ON public.lookup_values FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attributes" ON public.attributes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to attribute_dependencies" ON public.attribute_dependencies FOR SELECT USING (true);
