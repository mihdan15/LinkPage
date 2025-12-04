// Notepad Service
// Requirements: 9.1, 9.2, 9.3, 9.5, 9.6

import { supabase } from './supabase';
import { validateNotepadContent, MAX_NOTEPAD_LENGTH } from '../utils/validation';

/**
 * Gets the notepad content for a specific slug
 * Requirements: 9.3 - Display most recent saved note content
 * 
 * @param slug - The profile slug
 * @returns The notepad content string
 */
export async function getNoteContent(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from('notepads')
    .select('content')
    .eq('slug', slug)
    .single();

  if (error) {
    // If notepad doesn't exist, return empty string
    if (error.code === 'PGRST116') {
      return '';
    }
    throw new Error(`Failed to fetch notepad content: ${error.message}`);
  }

  return data?.content || '';
}

/**
 * Saves notepad content with real-time sync
 * Requirements: 9.2 - Save text to database in real-time
 * Requirements: 9.6 - Enforce 5000 character limit
 * 
 * @param slug - The profile slug
 * @param content - The content to save
 */
export async function saveNoteContent(slug: string, content: string): Promise<void> {
  // Validate content length
  const validation = validateNotepadContent(content);
  if (!validation.valid) {
    throw new Error(validation.error || `Content exceeds ${MAX_NOTEPAD_LENGTH} characters`);
  }

  // Use upsert to create or update the notepad
  const { error } = await supabase
    .from('notepads')
    .upsert(
      {
        slug,
        content,
      },
      {
        onConflict: 'slug',
      }
    );

  if (error) {
    throw new Error(`Failed to save notepad content: ${error.message}`);
  }
}


/**
 * Clears the notepad content
 * Requirements: 9.5 - Remove note content from database
 * 
 * @param slug - The profile slug
 */
export async function clearNote(slug: string): Promise<void> {
  const { error } = await supabase
    .from('notepads')
    .update({ content: '' })
    .eq('slug', slug);

  if (error) {
    // If notepad doesn't exist, that's fine - nothing to clear
    if (error.code !== 'PGRST116') {
      throw new Error(`Failed to clear notepad: ${error.message}`);
    }
  }
}

/**
 * Subscribes to real-time notepad updates
 * Requirements: 9.2 - Real-time sync
 * 
 * @param slug - The profile slug
 * @param callback - Function to call when content changes
 * @returns Unsubscribe function
 */
export function subscribeToNotepad(
  slug: string,
  callback: (content: string) => void
): () => void {
  const channel = supabase
    .channel(`notepad:${slug}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notepads',
        filter: `slug=eq.${slug}`,
      },
      (payload) => {
        if (payload.new && 'content' in payload.new) {
          callback(payload.new.content as string);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
