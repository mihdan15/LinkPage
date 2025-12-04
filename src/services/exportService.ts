// Export Service
// Requirements: 8.1, 8.2, 8.3

import { supabase, mapDbProfileToProfile, mapDbLinkToLinkItem } from './supabase';
import type { ExportData, Profile, LinkItem } from '../types';

/**
 * Gathers all user data for export
 * Requirements: 8.1, 8.2 - Export all link data including profile and settings
 * 
 * @param userId - The user's ID
 * @returns ExportData containing profile, links, and export timestamp
 */
export async function exportUserData(userId: string): Promise<ExportData> {
  // Fetch profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profileData) {
    throw new Error('Failed to fetch profile for export');
  }

  const profile: Profile = mapDbProfileToProfile(profileData);

  // Fetch all links (including disabled ones for complete backup)
  const { data: linksData, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true });

  if (linksError) {
    throw new Error('Failed to fetch links for export');
  }

  const links: LinkItem[] = (linksData || []).map(mapDbLinkToLinkItem);

  return {
    profile,
    links,
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Generates a downloadable JSON file from export data
 * Requirements: 8.1, 8.3 - Generate JSON file with slug and date in filename
 * 
 * @param data - The export data to convert to JSON
 * @param slug - The user's slug for filename
 * @returns Blob containing the JSON data
 */
export function generateExportFile(data: ExportData): Blob {
  const jsonString = JSON.stringify(data, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

/**
 * Generates the export filename with slug and current date
 * Requirements: 8.3 - Name file with user's slug and current date
 * 
 * @param slug - The user's slug
 * @returns Formatted filename string
 */
export function generateExportFilename(slug: string): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${slug}-links-${dateStr}.json`;
}

/**
 * Triggers download of the export file in the browser
 * 
 * @param blob - The file blob to download
 * @param filename - The filename for the download
 */
export function downloadExportFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
