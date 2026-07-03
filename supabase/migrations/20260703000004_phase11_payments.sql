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

-- Add missing columns to transactions table if not yet present
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS receipt_number TEXT;

CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(payment_reference);

-- RLS Policies for transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Realtime Setup
-- Add transactions to the realtime publication
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
COMMIT;
