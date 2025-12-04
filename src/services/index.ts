// Service Layer
// Export all services from this file

// Supabase client and utilities
export { supabase, mapDbProfileToProfile, mapDbLinkToLinkItem, mapDbNotepadToNotepadContent } from './supabase';
export type { ProfileRow, LinkRow, AnalyticsEventRow, NotepadRow } from './supabase';

// Profile Service
export {
  getProfileBySlug,
  updateProfile,
  checkSlugAvailability,
  uploadAvatar,
} from './profileService';

// Link Service
export {
  getLinks,
  getEnabledLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from './linkService';

// Analytics Service
export {
  recordPageView,
  recordLinkClick,
  getAnalytics,
  getRecentEvents,
} from './analyticsService';

// Notepad Service
export {
  getNoteContent,
  saveNoteContent,
  clearNote,
  subscribeToNotepad,
} from './notepadService';

// Export Service
export {
  exportUserData,
  generateExportFile,
  generateExportFilename,
  downloadExportFile,
} from './exportService';

// Auth Service
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  isSlugAvailable,
} from './authService';
export type { AuthUser } from './authService';
