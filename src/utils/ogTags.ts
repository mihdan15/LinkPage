// Open Graph Meta Tags Utility
// Requirements: 4.3

import type { Profile } from '../types';

/**
 * Open Graph meta tag data structure
 */
export interface OGMetaTags {
  title: string;
  description: string;
  image: string | null;
  url: string;
  type: string;
}

/**
 * Generates Open Graph meta tags based on profile data
 * Requirements: 4.3 - Generate dynamic OG tags based on profile
 * 
 * @param profile - The user's profile data
 * @param baseUrl - The base URL of the site
 * @returns OGMetaTags object with og:title, og:description, og:image
 */
export function generateOGMetaTags(
  profile: Profile,
  baseUrl: string = window.location.origin
): OGMetaTags {
  return {
    title: profile.displayName,
    description: profile.bio || `Check out ${profile.displayName}'s links`,
    image: profile.avatarUrl,
    url: `${baseUrl}/${profile.slug}`,
    type: 'profile',
  };
}

/**
 * Updates the document's meta tags with Open Graph data
 * Requirements: 4.3 - Include og:title, og:description, og:image
 * 
 * @param tags - The OG meta tags to set
 */
export function updateDocumentOGTags(tags: OGMetaTags): void {
  // Helper to set or create a meta tag
  const setMetaTag = (property: string, content: string | null) => {
    if (!content) return;
    
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Set Open Graph tags
  setMetaTag('og:title', tags.title);
  setMetaTag('og:description', tags.description);
  setMetaTag('og:image', tags.image);
  setMetaTag('og:url', tags.url);
  setMetaTag('og:type', tags.type);

  // Also set Twitter Card tags for better social sharing
  setMetaTag('twitter:card', tags.image ? 'summary_large_image' : 'summary');
  setMetaTag('twitter:title', tags.title);
  setMetaTag('twitter:description', tags.description);
  setMetaTag('twitter:image', tags.image);

  // Update document title
  document.title = `${tags.title} | LinkPage`;
}

/**
 * Clears Open Graph meta tags from the document
 */
export function clearDocumentOGTags(): void {
  const properties = [
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'og:type',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ];

  properties.forEach((property) => {
    const meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) {
      meta.remove();
    }
  });
}
