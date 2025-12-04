// Supabase Client Configuration
// Requirements: 5.1 - Reliable data storage and retrieval

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Profile, LinkItem, NotepadContent } from '../types';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Database row types
export interface ProfileRow {
  id: string;
  slug: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme_color: string;
  background_type: string;
  background_value: string;
  button_style: string;
  button_gradient: string | null;
  dark_mode_enabled: boolean;
  display_settings: Profile['displaySettings'] | null;
  social_links: Profile['socialLinks'] | null;
  created_at: string;
  updated_at: string;
}

export interface LinkRow {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon_type: string;
  icon_value: string;
  display_order: number;
  is_enabled: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEventRow {
  id: string;
  profile_id: string;
  link_id: string | null;
  event_type: string;
  created_at: string;
}

export interface NotepadRow {
  id: string;
  slug: string;
  content: string;
  updated_at: string;
}

/**
 * Supabase client instance (untyped for flexibility)
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Default display settings
const DEFAULT_DISPLAY_SETTINGS: Profile['displaySettings'] = {
  nameStyle: { fontSize: 24, color: '#111827', fontFamily: 'Inter', fontWeight: 'bold', fontStyle: 'normal' },
  bioStyle: { fontSize: 16, color: '#4B5563', fontFamily: 'Inter', fontWeight: 'normal', fontStyle: 'normal' },
};

/**
 * Maps database profile row to Profile type
 */
export function mapDbProfileToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    themeColor: row.theme_color,
    backgroundType: row.background_type as Profile['backgroundType'],
    backgroundValue: row.background_value,
    buttonStyle: (row.button_style as Profile['buttonStyle']) || 'filled',
    buttonGradient: row.button_gradient,
    darkModeEnabled: row.dark_mode_enabled ?? false,
    displaySettings: row.display_settings || DEFAULT_DISPLAY_SETTINGS,
    socialLinks: row.social_links || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps database link row to LinkItem type
 */
export function mapDbLinkToLinkItem(row: LinkRow): LinkItem {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    url: row.url,
    iconType: row.icon_type as LinkItem['iconType'],
    iconValue: row.icon_value,
    displayOrder: row.display_order,
    isEnabled: row.is_enabled,
    clickCount: row.click_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps database notepad row to NotepadContent type
 */
export function mapDbNotepadToNotepadContent(row: NotepadRow): NotepadContent {
  return {
    slug: row.slug,
    content: row.content,
    updatedAt: row.updated_at,
  };
}
