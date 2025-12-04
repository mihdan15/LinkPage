// Serialization Utilities
// Requirements: 5.1, 5.2, 5.3, 5.4

import type { LinkItem, Profile, ValidationResult } from '../types';

/**
 * Required fields for LinkItem schema validation
 */
const LINK_ITEM_REQUIRED_FIELDS = [
  'id',
  'userId',
  'title',
  'url',
  'iconType',
  'iconValue',
  'displayOrder',
  'isEnabled',
  'clickCount',
  'createdAt',
  'updatedAt'
] as const;

/**
 * Required fields for Profile schema validation
 */
const PROFILE_REQUIRED_FIELDS = [
  'id',
  'slug',
  'displayName',
  'themeColor',
  'backgroundType',
  'backgroundValue',
  'createdAt',
  'updatedAt'
] as const;

/**
 * Valid icon types
 */
const VALID_ICON_TYPES = ['predefined', 'custom'] as const;

/**
 * Valid background types
 */
const VALID_BACKGROUND_TYPES = ['solid', 'gradient', 'image'] as const;

/**
 * Serializes a LinkItem to JSON string
 * Requirements: 5.1 - Serialize data to JSON format
 * 
 * @param link - The LinkItem to serialize
 * @returns JSON string representation
 */
export function serializeLinkItem(link: LinkItem): string {
  return JSON.stringify(link);
}


/**
 * Deserializes a JSON string to LinkItem
 * Requirements: 5.2 - Deserialize JSON data back to application objects
 * 
 * @param json - The JSON string to deserialize
 * @returns LinkItem object or null if invalid
 */
export function deserializeLinkItem(json: string): LinkItem | null {
  try {
    const parsed = JSON.parse(json);
    const validation = validateLinkItemSchema(parsed);
    if (!validation.valid) {
      return null;
    }
    return parsed as LinkItem;
  } catch {
    return null;
  }
}

/**
 * Serializes a Profile to JSON string
 * Requirements: 5.1 - Serialize data to JSON format
 * 
 * @param profile - The Profile to serialize
 * @returns JSON string representation
 */
export function serializeProfile(profile: Profile): string {
  return JSON.stringify(profile);
}

/**
 * Deserializes a JSON string to Profile
 * Requirements: 5.2 - Deserialize JSON data back to application objects
 * 
 * @param json - The JSON string to deserialize
 * @returns Profile object or null if invalid
 */
export function deserializeProfile(json: string): Profile | null {
  try {
    const parsed = JSON.parse(json);
    const validation = validateProfileSchema(parsed);
    if (!validation.valid) {
      return null;
    }
    return parsed as Profile;
  } catch {
    return null;
  }
}

/**
 * Validates that an object conforms to the LinkItem schema
 * Requirements: 5.4 - Validate against expected schema
 * 
 * @param data - The data to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateLinkItemSchema(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' };
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  for (const field of LINK_ITEM_REQUIRED_FIELDS) {
    if (!(field in obj)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate field types
  if (typeof obj.id !== 'string') {
    return { valid: false, error: 'Field "id" must be a string' };
  }
  if (typeof obj.userId !== 'string') {
    return { valid: false, error: 'Field "userId" must be a string' };
  }
  if (typeof obj.title !== 'string') {
    return { valid: false, error: 'Field "title" must be a string' };
  }
  if (typeof obj.url !== 'string') {
    return { valid: false, error: 'Field "url" must be a string' };
  }
  if (!VALID_ICON_TYPES.includes(obj.iconType as typeof VALID_ICON_TYPES[number])) {
    return { valid: false, error: 'Field "iconType" must be "predefined" or "custom"' };
  }
  if (typeof obj.iconValue !== 'string') {
    return { valid: false, error: 'Field "iconValue" must be a string' };
  }
  if (typeof obj.displayOrder !== 'number') {
    return { valid: false, error: 'Field "displayOrder" must be a number' };
  }
  if (typeof obj.isEnabled !== 'boolean') {
    return { valid: false, error: 'Field "isEnabled" must be a boolean' };
  }
  if (typeof obj.clickCount !== 'number') {
    return { valid: false, error: 'Field "clickCount" must be a number' };
  }
  if (typeof obj.createdAt !== 'string') {
    return { valid: false, error: 'Field "createdAt" must be a string' };
  }
  if (typeof obj.updatedAt !== 'string') {
    return { valid: false, error: 'Field "updatedAt" must be a string' };
  }

  return { valid: true };
}


/**
 * Validates that an object conforms to the Profile schema
 * Requirements: 5.4 - Validate against expected schema
 * 
 * @param data - The data to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateProfileSchema(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' };
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  for (const field of PROFILE_REQUIRED_FIELDS) {
    if (!(field in obj)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate field types
  if (typeof obj.id !== 'string') {
    return { valid: false, error: 'Field "id" must be a string' };
  }
  if (typeof obj.slug !== 'string') {
    return { valid: false, error: 'Field "slug" must be a string' };
  }
  if (typeof obj.displayName !== 'string') {
    return { valid: false, error: 'Field "displayName" must be a string' };
  }
  // bio can be null or string
  if (obj.bio !== null && typeof obj.bio !== 'string') {
    return { valid: false, error: 'Field "bio" must be a string or null' };
  }
  // avatarUrl can be null or string
  if (obj.avatarUrl !== null && typeof obj.avatarUrl !== 'string') {
    return { valid: false, error: 'Field "avatarUrl" must be a string or null' };
  }
  if (typeof obj.themeColor !== 'string') {
    return { valid: false, error: 'Field "themeColor" must be a string' };
  }
  if (!VALID_BACKGROUND_TYPES.includes(obj.backgroundType as typeof VALID_BACKGROUND_TYPES[number])) {
    return { valid: false, error: 'Field "backgroundType" must be "solid", "gradient", or "image"' };
  }
  if (typeof obj.backgroundValue !== 'string') {
    return { valid: false, error: 'Field "backgroundValue" must be a string' };
  }
  if (typeof obj.createdAt !== 'string') {
    return { valid: false, error: 'Field "createdAt" must be a string' };
  }
  if (typeof obj.updatedAt !== 'string') {
    return { valid: false, error: 'Field "updatedAt" must be a string' };
  }

  return { valid: true };
}
