// Validation Utilities
// Requirements: 1.5, 2.2, 2.4

import type { ValidationResult } from '../types';

/**
 * URL validation pattern
 * Matches URLs with http:// or https:// protocol
 */
const URL_PATTERN = /^https?:\/\/.+\..+/;

/**
 * Slug validation pattern
 * Only lowercase letters, numbers, and hyphens allowed
 */
const SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Maximum bio length in characters
 */
export const MAX_BIO_LENGTH = 150;

/**
 * Minimum and maximum slug length
 */
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 50;

/**
 * Maximum notepad content length
 */
export const MAX_NOTEPAD_LENGTH = 5000;

/**
 * Validates a URL string
 * Requirements: 1.5 - Reject invalid URL format
 * 
 * @param url - The URL string to validate
 * @returns true if the URL is valid, false otherwise
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return URL_PATTERN.test(url.trim());
}

/**
 * Validates bio text length
 * Requirements: 2.2 - Bio maximum 150 characters
 * 
 * @param bio - The bio text to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateBio(bio: string): ValidationResult {
  if (bio.length > MAX_BIO_LENGTH) {
    return {
      valid: false,
      error: `Bio must be ${MAX_BIO_LENGTH} characters or less`
    };
  }
  return { valid: true };
}

/**
 * Validates slug format and length
 * Requirements: 2.4 - Custom slug for unique URL path
 * 
 * @param slug - The slug string to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateSlug(slug: string): ValidationResult {
  if (!slug || typeof slug !== 'string') {
    return {
      valid: false,
      error: 'Slug is required'
    };
  }

  const trimmedSlug = slug.trim();

  if (trimmedSlug.length < MIN_SLUG_LENGTH || trimmedSlug.length > MAX_SLUG_LENGTH) {
    return {
      valid: false,
      error: `Slug must be between ${MIN_SLUG_LENGTH} and ${MAX_SLUG_LENGTH} characters`
    };
  }

  if (!SLUG_PATTERN.test(trimmedSlug)) {
    return {
      valid: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens'
    };
  }

  return { valid: true };
}

/**
 * Validates notepad content length
 * Requirements: 9.6 - Notepad content max 5000 characters
 * 
 * @param content - The notepad content to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateNotepadContent(content: string): ValidationResult {
  if (content.length > MAX_NOTEPAD_LENGTH) {
    return {
      valid: false,
      error: `Notepad content must be ${MAX_NOTEPAD_LENGTH} characters or less`
    };
  }
  return { valid: true };
}
