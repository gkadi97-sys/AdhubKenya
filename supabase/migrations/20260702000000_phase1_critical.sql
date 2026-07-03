-- ==============================================================================
-- AdHubKenya Phase 1 Critical Features Migration
-- ==============================================================================

-- 1. MESSAGING SYSTEM
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(listing_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for conversations and messages
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can send messages to own conversations" ON public.messages;
CREATE POLICY "Users can send messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
        AND auth.uid() = sender_id
    );

DROP POLICY IF EXISTS "Users can mark messages as read" ON public.messages;
CREATE POLICY "Users can mark messages as read" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
        AND sender_id != auth.uid()
    );


-- 2. SAVED LISTINGS
CREATE TABLE IF NOT EXISTS public.saved_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own saved listings" ON public.saved_listings;
CREATE POLICY "Users can manage own saved listings" ON public.saved_listings
    FOR ALL USING (auth.uid() = user_id);


-- 3. REPORTS (Moderation)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('scam', 'duplicate', 'offensive', 'sold', 'wrong_category', 'other')),
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can report, but only admins can view
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.reports;
CREATE POLICY "Authenticated users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 4. TRANSACTIONS (Payments)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KES' NOT NULL,
    payment_method TEXT DEFAULT 'mpesa' NOT NULL,
    provider_reference TEXT, -- e.g., M-Pesa receipt number
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    plan_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Add payment_reference and receipt_number columns if not yet present (Phase 11 compatibility)
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS receipt_number TEXT;


-- 5. LISTING EXPIRY & STATUS MODIFICATIONS
-- Add expires_at to listings if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'expires_at') THEN
        ALTER TABLE public.listings ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '90 days');
    END IF;
END $$;

-- Update the status check constraint to include pending, rejected, suspended
-- We need to drop the old constraint and add a new one, but for simplicity we'll assume we can alter the type if it was a custom type, or drop/add constraint.
-- Assuming status was TEXT CHECK (...)
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check CHECK (status IN ('active', 'sold', 'expired', 'pending', 'rejected', 'suspended'));
