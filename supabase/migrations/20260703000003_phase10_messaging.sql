-- Migration: Phase 10 Messaging
-- Creates conversations and messages tables

-- Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON public.conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON public.conversations(updated_at DESC);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at ASC);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" 
ON public.conversations FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can create conversations" ON public.conversations;
CREATE POLICY "Buyers can create conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.messages;
CREATE POLICY "Users can insert messages in their conversations" 
ON public.messages FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can update message read status in their conversations" ON public.messages;
CREATE POLICY "Users can update message read status in their conversations"
ON public.messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
);

-- Realtime Setup
-- Supabase requires tables to be explicitly added to the realtime publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.messages;
COMMIT;
