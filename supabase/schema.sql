-- Linktree Clone Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Users/Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  slug VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio VARCHAR(150),
  avatar_url TEXT,
  theme_color VARCHAR(7) DEFAULT '#3B82F6',
  background_type VARCHAR(20) DEFAULT 'solid',
  background_value VARCHAR(100) DEFAULT '#ffffff',
  button_style VARCHAR(20) DEFAULT 'filled',
  button_gradient TEXT,
  dark_mode_enabled BOOLEAN DEFAULT false,
  display_settings JSONB DEFAULT '{"nameStyle":{"fontSize":24,"color":"#111827","fontFamily":"Inter"},"bioStyle":{"fontSize":16,"color":"#4B5563","fontFamily":"Inter"}}',
  social_links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add new columns if table already exists
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS button_style VARCHAR(20) DEFAULT 'filled';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS button_gradient TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dark_mode_enabled BOOLEAN DEFAULT false;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_settings JSONB DEFAULT '{"nameStyle":{"fontSize":24,"color":"#111827","fontFamily":"Inter"},"bioStyle":{"fontSize":16,"color":"#4B5563","fontFamily":"Inter"}}';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]';

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon_type VARCHAR(20) DEFAULT 'predefined',
  icon_value VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL, -- 'page_view' or 'link_click'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared notepad table
CREATE TABLE notepads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Indexes for performance
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_display_order ON links(user_id, display_order);
CREATE INDEX idx_analytics_profile ON analytics_events(profile_id);
CREATE INDEX idx_analytics_link ON analytics_events(link_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notepads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Links policies
CREATE POLICY "Public links are viewable by everyone"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own links"
  ON links FOR ALL
  USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own analytics"
  ON analytics_events FOR SELECT
  USING (auth.uid() = profile_id);

-- Notepads policies (public read/write for shared notepad feature)
CREATE POLICY "Anyone can view notepads"
  ON notepads FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert notepads"
  ON notepads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update notepads"
  ON notepads FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete notepads"
  ON notepads FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notepads_updated_at
  BEFORE UPDATE ON notepads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================
-- Run this in Supabase Dashboard > Storage > Create new bucket
-- Bucket name: avatars
-- Public bucket: YES (for public avatar URLs)
--
-- Or run this SQL:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
-- Allow anyone to view avatars (public)
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow anyone to upload avatars (for demo purposes)
-- In production, you'd want: auth.uid()::text = (storage.foldername(name))[1]
CREATE POLICY "Anyone can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

-- Allow anyone to update avatars
CREATE POLICY "Anyone can update avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars');

-- Allow anyone to delete avatars
CREATE POLICY "Anyone can delete avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');
