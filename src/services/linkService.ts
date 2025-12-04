// Link Service
// Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7

import { supabase, mapDbLinkToLinkItem } from './supabase';
import type { LinkItem, CreateLinkInput, UpdateLinkInput } from '../types';
import { validateUrl } from '../utils/validation';

/**
 * Fetches all links for a user, ordered by display_order
 * Requirements: 1.1 - Display links in the link list
 * 
 * @param userId - The user's ID
 * @returns Array of LinkItems sorted by display order
 */
export async function getLinks(userId: string): Promise<LinkItem[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch links: ${error.message}`);
  }

  return (data || []).map(mapDbLinkToLinkItem);
}

/**
 * Fetches all enabled links for a user (public view)
 * Requirements: 1.7 - Hide disabled links from public page
 * 
 * @param userId - The user's ID
 * @returns Array of enabled LinkItems sorted by display order
 */
export async function getEnabledLinks(userId: string): Promise<LinkItem[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .eq('is_enabled', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch links: ${error.message}`);
  }

  return (data || []).map(mapDbLinkToLinkItem);
}


/**
 * Creates a new link for a user
 * Requirements: 1.1 - Add new link with title, URL, and icon
 * 
 * @param input - The link data to create
 * @returns The created LinkItem
 */
export async function createLink(input: CreateLinkInput): Promise<LinkItem> {
  // Validate URL
  if (!validateUrl(input.url)) {
    throw new Error('Invalid URL format. URL must start with http:// or https://');
  }

  // Get the current max display_order for this user
  const { data: existingLinks } = await supabase
    .from('links')
    .select('display_order')
    .eq('user_id', input.userId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existingLinks && existingLinks.length > 0 
    ? existingLinks[0].display_order + 1 
    : 0;

  const { data, error } = await supabase
    .from('links')
    .insert({
      user_id: input.userId,
      title: input.title,
      url: input.url,
      icon_type: input.iconType,
      icon_value: input.iconValue,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create link: ${error.message}`);
  }

  return mapDbLinkToLinkItem(data);
}

/**
 * Updates an existing link
 * Requirements: 1.2 - Edit existing link information
 * 
 * @param linkId - The link's ID
 * @param input - The fields to update
 * @returns The updated LinkItem
 */
export async function updateLink(
  linkId: string,
  input: UpdateLinkInput
): Promise<LinkItem> {
  // Validate URL if provided
  if (input.url !== undefined && !validateUrl(input.url)) {
    throw new Error('Invalid URL format. URL must start with http:// or https://');
  }

  // Build update object with snake_case keys for database
  const updateData: Record<string, unknown> = {};
  
  if (input.title !== undefined) {
    updateData.title = input.title;
  }
  if (input.url !== undefined) {
    updateData.url = input.url;
  }
  if (input.iconType !== undefined) {
    updateData.icon_type = input.iconType;
  }
  if (input.iconValue !== undefined) {
    updateData.icon_value = input.iconValue;
  }
  if (input.isEnabled !== undefined) {
    updateData.is_enabled = input.isEnabled;
  }

  const { data, error } = await supabase
    .from('links')
    .update(updateData)
    .eq('id', linkId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update link: ${error.message}`);
  }

  return mapDbLinkToLinkItem(data);
}

/**
 * Deletes a link
 * Requirements: 1.3 - Remove link from storage and display
 * 
 * @param linkId - The link's ID to delete
 */
export async function deleteLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId);

  if (error) {
    throw new Error(`Failed to delete link: ${error.message}`);
  }
}

/**
 * Reorders links by updating their display_order
 * Requirements: 1.4 - Persist new order via drag-and-drop
 * 
 * @param userId - The user's ID
 * @param linkIds - Array of link IDs in the new order
 */
export async function reorderLinks(
  userId: string,
  linkIds: string[]
): Promise<void> {
  // Update each link's display_order based on its position in the array
  const updates = linkIds.map((linkId, index) => 
    supabase
      .from('links')
      .update({ display_order: index })
      .eq('id', linkId)
      .eq('user_id', userId)
  );

  const results = await Promise.all(updates);
  
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    throw new Error(`Failed to reorder links: ${errors[0].error?.message}`);
  }
}
