// TypeScript Types and Interfaces
// Requirements: 5.1, 5.2

// ============================================
// Core Data Models
// ============================================

/**
 * Social link configuration for profile
 */
export interface SocialLink {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin' | 'github' | 'email' | 'website';
  url: string;
  isEnabled: boolean;
}

/**
 * Text style settings for name and bio
 */
export interface TextStyleSettings {
  fontSize: number; // in pixels
  color: string;
  fontFamily: string;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  fontStyle: 'normal' | 'italic';
}

/**
 * Display settings for profile elements
 */
export interface ProfileDisplaySettings {
  nameStyle: TextStyleSettings;
  bioStyle: TextStyleSettings;
}

/**
 * User profile information displayed on the public link page
 */
export interface Profile {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  themeColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  buttonStyle: 'outline' | 'filled' | 'gradient';
  buttonGradient: string | null;
  darkModeEnabled: boolean;
  displaySettings: ProfileDisplaySettings;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Individual link item in a user's link collection
 */
export interface LinkItem {
  id: string;
  userId: string;
  title: string;
  url: string;
  iconType: 'predefined' | 'custom';
  iconValue: string;
  displayOrder: number;
  isEnabled: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Theme configuration for the public link page
 */
export interface Theme {
  primaryColor: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  isDarkMode: boolean;
}

/**
 * Analytics data for a user's link page
 */
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  linkStats: LinkAnalytics[];
}


/**
 * Analytics data for an individual link
 */
export interface LinkAnalytics {
  linkId: string;
  title: string;
  clickCount: number;
}

/**
 * Export data structure for backup/migration
 */
export interface ExportData {
  profile: Profile;
  links: LinkItem[];
  exportedAt: string;
}

// ============================================
// Form Input Types
// ============================================

/**
 * Input for creating a new link
 */
export interface CreateLinkInput {
  userId: string;
  title: string;
  url: string;
  iconType: 'predefined' | 'custom';
  iconValue: string;
}

/**
 * Input for updating an existing link
 */
export interface UpdateLinkInput {
  title?: string;
  url?: string;
  iconType?: 'predefined' | 'custom';
  iconValue?: string;
  isEnabled?: boolean;
}

/**
 * Input for updating profile information
 */
export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  slug?: string;
  themeColor?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  buttonStyle?: 'outline' | 'filled' | 'gradient';
  buttonGradient?: string;
  darkModeEnabled?: boolean;
  displaySettings?: ProfileDisplaySettings;
  socialLinks?: SocialLink[];
}

/**
 * Form data for link creation/editing
 */
export interface LinkFormData {
  title: string;
  url: string;
  iconType: 'predefined' | 'custom';
  iconValue: string;
}

// ============================================
// Validation Result Types
// ============================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================
// Notepad Types
// ============================================

/**
 * Shared notepad content
 */
export interface NotepadContent {
  slug: string;
  content: string;
  updatedAt: string;
}
