-- Fix storage policy to accept heic and be explicit
DROP POLICY IF EXISTS "Users can upload images to their own folder" ON storage.objects;

CREATE POLICY "Users can upload images to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (
    right(lower(name), 4) = ANY (ARRAY['.jpg', '.png'])
    OR right(lower(name), 5) = ANY (ARRAY['.jpeg', '.webp', '.heic'])
  )
);
