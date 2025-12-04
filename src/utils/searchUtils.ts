// Search Utilities
// Requirements: 3.6

/**
 * Filters links by search query (case-insensitive title match)
 * Requirements: 3.6 - Filter links whose titles contain search text
 */
export function filterLinksBySearch<T extends { title: string }>(
  links: T[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) {
    return links;
  }
  const query = searchQuery.toLowerCase().trim();
  return links.filter((link) => link.title.toLowerCase().includes(query));
}
