-- Migration: Phase 11 Payments
-- Creates transactions table to track M-Pesa payments

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'mpesa',
    payment_reference TEXT UNIQUE NOT NULL, -- e.g., CheckoutRequestID
    receipt_number TEXT UNIQUE,             -- e.g., M-Pesa receipt
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON public.transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(payment_reference);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Only edge functions (service role) can insert/update transactions
-- Users CANNOT insert directly via client.

-- Realtime Setup
-- Add transactions to the realtime publication
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
COMMIT;
