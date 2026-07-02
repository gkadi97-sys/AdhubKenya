-- ==============================================================================
-- AdHubKenya Phase 1 Extensions: Trust, Retention, Analytics
-- ==============================================================================

-- 1. Trust: Add verification columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_business_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- 2. Retention: Saved Searches & Alerts
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    query TEXT,
    filters JSONB DEFAULT '{}'::jsonb,
    is_alert_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for saved_searches
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own saved searches" ON public.saved_searches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved searches" ON public.saved_searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches" ON public.saved_searches
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches" ON public.saved_searches
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Analytics: Listing Events
CREATE TABLE IF NOT EXISTS public.listing_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'phone_reveal', 'whatsapp_click')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We allow inserts from anywhere (even unauthenticated) for analytics, but selects only for the listing owner.
ALTER TABLE public.listing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events" ON public.listing_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can view own listing events" ON public.listing_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.listings l 
            WHERE l.id = listing_events.listing_id 
            AND l.seller_id = auth.uid()
        )
    );
