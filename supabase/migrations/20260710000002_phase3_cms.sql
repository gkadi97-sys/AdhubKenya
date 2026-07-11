-- Phase 3 CMS Backend Implementation

-- 1. Static Pages
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Pages
INSERT INTO public.pages (slug, title, status)
VALUES 
('/about', 'About Us', 'published'),
('/terms', 'Terms of Service', 'published'),
('/privacy', 'Privacy Policy', 'published'),
('/faq', 'FAQ', 'published'),
('/contact', 'Contact Us', 'draft')
ON CONFLICT (slug) DO NOTHING;

-- 2. Banners
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    link TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Banners
INSERT INTO public.banners (title, subtitle, is_active)
VALUES 
('Free June Posting', 'List your ad in 60 seconds', true),
('Eid al-Adha Sale', 'Great deals on livestock!', false)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Read policies (Public can read published pages/active banners, Admins can read all)
CREATE POLICY "Public can read published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can read all pages" ON public.pages FOR SELECT USING (public.is_admin());

CREATE POLICY "Public can read active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can read all banners" ON public.banners FOR SELECT USING (public.is_admin());

-- Write policies (Admins only)
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can insert banners" ON public.banners FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update banners" ON public.banners FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete banners" ON public.banners FOR DELETE USING (public.is_admin());
