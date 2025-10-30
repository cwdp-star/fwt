-- Create storage bucket for quote attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-attachments',
  'quote-attachments',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Add attachments column to quote_requests
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- RLS policies for quote-attachments bucket
CREATE POLICY "Anyone can upload quote attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quote-attachments');

CREATE POLICY "Admins can view all quote attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'quote-attachments' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete quote attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'quote-attachments' AND is_admin(auth.uid()));