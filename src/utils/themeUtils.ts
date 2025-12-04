// Theme Utilities
// Requirements: 10.4, 10.5, 10.6

const THEME_STORAGE_KEY = 'linktree-theme-preference';

/**
 * Gets the initial theme preference
 * Requirements: 10.5, 10.6 - Apply saved preference or system default
 */
export function getInitialTheme(): boolean {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored !== null) {
    return stored === 'dark';
  }
  
  // Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return false;
}

/**
 * Saves theme preference to localStorage
 * Requirements: 10.4 - Store preference in browser local storage
 */
export function saveThemePreference(isDark: boolean): void {
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
}
