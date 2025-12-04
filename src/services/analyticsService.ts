// Analytics Service
// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5

import { supabase } from './supabase';
import type { AnalyticsData, LinkAnalytics } from '../types';

/**
 * Records a page view event for a profile
 * Requirements: 6.1 - Increment page view counter
 * 
 * @param profileId - The profile's ID
 */
export async function recordPageView(profileId: string): Promise<void> {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      profile_id: profileId,
      event_type: 'page_view',
    });

  if (error) {
    // Log error but don't throw - analytics shouldn't break the page
    console.error('Failed to record page view:', error.message);
  }
}

/**
 * Records a link click event
 * Requirements: 6.2 - Increment click counter for specific link
 * 
 * @param linkId - The link's ID
 * @param profileId - The profile's ID
 */
export async function recordLinkClick(
  linkId: string,
  profileId: string
): Promise<void> {
  // Insert analytics event
  const { error: eventError } = await supabase
    .from('analytics_events')
    .insert({
      profile_id: profileId,
      link_id: linkId,
      event_type: 'link_click',
    });

  if (eventError) {
    console.error('Failed to record link click event:', eventError.message);
  }

  // Increment the click_count on the link itself
  // Get current count and increment
  const { data: linkData } = await supabase
    .from('links')
    .select('click_count')
    .eq('id', linkId)
    .single();

  if (linkData) {
    await supabase
      .from('links')
      .update({ click_count: linkData.click_count + 1 })
      .eq('id', linkId);
  }
}


/**
 * Gets analytics data for a user's profile
 * Requirements: 6.3, 6.4, 6.5, 6.6 - Display view count, click counts, timestamps
 * 
 * @param userId - The user's ID
 * @returns AnalyticsData with total views, clicks, and per-link stats
 */
export async function getAnalytics(userId: string): Promise<AnalyticsData> {
  // Get total page views
  const { count: totalViews, error: viewsError } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .eq('event_type', 'page_view');

  if (viewsError) {
    throw new Error(`Failed to fetch page views: ${viewsError.message}`);
  }

  // Get total link clicks
  const { count: totalClicks, error: clicksError } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .eq('event_type', 'link_click');

  if (clicksError) {
    throw new Error(`Failed to fetch link clicks: ${clicksError.message}`);
  }

  // Get per-link click counts from the links table
  const { data: linksData, error: linksError } = await supabase
    .from('links')
    .select('id, title, click_count')
    .eq('user_id', userId)
    .order('display_order', { ascending: true });

  if (linksError) {
    throw new Error(`Failed to fetch link stats: ${linksError.message}`);
  }

  const linkStats: LinkAnalytics[] = (linksData || []).map(link => ({
    linkId: link.id,
    title: link.title,
    clickCount: link.click_count,
  }));

  return {
    totalViews: totalViews || 0,
    totalClicks: totalClicks || 0,
    linkStats,
  };
}

/**
 * Gets analytics events with timestamps for detailed analysis
 * Requirements: 6.5 - Record timestamp of events
 * 
 * @param userId - The user's ID
 * @param limit - Maximum number of events to return
 * @returns Array of analytics events with timestamps
 */
export async function getRecentEvents(
  userId: string,
  limit: number = 100
): Promise<Array<{ eventType: string; linkId: string | null; createdAt: string }>> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, link_id, created_at')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent events: ${error.message}`);
  }

  return (data || []).map(event => ({
    eventType: event.event_type,
    linkId: event.link_id,
    createdAt: event.created_at,
  }));
}
