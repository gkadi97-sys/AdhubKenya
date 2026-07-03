-- ==============================================================================
-- AdHub Kenya: Messaging V2 Enhancements
-- Adds presence tracking, conversation archiving, image messages, and Realtime
-- ==============================================================================

-- 1. Add last_seen_at to profiles (for online presence tracking)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles(last_seen_at DESC);

-- 2. Add is_archived to conversations (soft-archive)
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- 3. Add image_url to messages (for image attachment support)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. RLS: Allow users to update their own last_seen_at
--    (profiles table already has RLS enabled from previous migrations)
DROP POLICY IF EXISTS "Users can update own last_seen" ON public.profiles;
CREATE POLICY "Users can update own last_seen" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. RLS: Allow conversation participants to archive/update their conversation
DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;
CREATE POLICY "Participants can update their conversations" ON public.conversations
  FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 6. Ensure Realtime covers both messages AND conversations tables
--    (so unread badge and conversation list update in real-time)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.messages, public.conversations;
COMMIT;
