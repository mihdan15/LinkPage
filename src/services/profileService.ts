// Profile Service
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1

import { supabase, mapDbProfileToProfile } from './supabase';
import type { Profile, UpdateProfileInput } from '../types';
import { validateBio, validateSlug } from '../utils/validation';

/**
 * Fetches a profile by its unique slug
 * Requirements: 3.1 - Access valid slug URL displays profile
 * 
 * @param slug - The unique slug identifier
 * @returns Profile if found, null otherwise
 */
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbProfileToProfile(data);
}

/**
 * Updates a user's profile information
 * Requirements: 2.1, 2.2, 2.3, 2.4 - Update display name, bio, avatar, slug
 * 
 * @param userId - The user's ID
 * @param input - The profile fields to update
 * @returns Updated Profile or throws error
 */
export async function updateProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<Profile> {
  // Validate bio if provided
  if (input.bio !== undefined) {
    const bioValidation = validateBio(input.bio);
    if (!bioValidation.valid) {
      throw new Error(bioValidation.error);
    }
  }

  // Validate slug if provided
  if (input.slug !== undefined) {
    const slugValidation = validateSlug(input.slug);
    if (!slugValidation.valid) {
      throw new Error(slugValidation.error);
    }


    // Check slug availability
    const isAvailable = await checkSlugAvailability(input.slug, userId);
    if (!isAvailable) {
      throw new Error('This slug is already taken');
    }
  }

  // Build update object with snake_case keys for database
  const updateData: Record<string, unknown> = {};
  
  if (input.displayName !== undefined) {
    updateData.display_name = input.displayName;
  }
  if (input.bio !== undefined) {
    updateData.bio = input.bio;
  }
  if (input.slug !== undefined) {
    updateData.slug = input.slug;
  }
  if (input.themeColor !== undefined) {
    updateData.theme_color = input.themeColor;
  }
  if (input.backgroundType !== undefined) {
    updateData.background_type = input.backgroundType;
  }
  if (input.backgroundValue !== undefined) {
    updateData.background_value = input.backgroundValue;
  }
  if (input.buttonStyle !== undefined) {
    updateData.button_style = input.buttonStyle;
  }
  if (input.buttonGradient !== undefined) {
    updateData.button_gradient = input.buttonGradient;
  }
  if (input.darkModeEnabled !== undefined) {
    updateData.dark_mode_enabled = input.darkModeEnabled;
  }
  if (input.displaySettings !== undefined) {
    updateData.display_settings = input.displaySettings;
  }
  if (input.socialLinks !== undefined) {
    updateData.social_links = input.socialLinks;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return mapDbProfileToProfile(data);
}

/**
 * Checks if a slug is available for use
 * Requirements: 2.5 - Reject duplicate slugs
 * 
 * @param slug - The slug to check
 * @param excludeUserId - Optional user ID to exclude (for updates)
 * @returns true if available, false if taken
 */
export async function checkSlugAvailability(
  slug: string,
  excludeUserId?: string
): Promise<boolean> {
  let query = supabase
    .from('profiles')
    .select('id')
    .eq('slug', slug);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to check slug availability: ${error.message}`);
  }

  return !data || data.length === 0;
}

/**
 * Uploads an avatar image for a user
 * Requirements: 2.3 - Upload profile picture
 * 
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The public URL of the uploaded avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Failed to upload avatar: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const avatarUrl = urlData.publicUrl;

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (updateError) {
    throw new Error(`Failed to update avatar URL: ${updateError.message}`);
  }

  return avatarUrl;
}
