// Components - Main Export File
// Organized by feature/domain for better maintainability

// Common Components (reusable UI elements)
export { SearchBar } from './common/SearchBar';
export type { SearchBarProps } from './common/SearchBar';
export {
  Skeleton,
  ProfileHeaderSkeleton,
  LinkCardSkeleton,
  LinkListSkeleton,
  SearchBarSkeleton,
  NotepadSkeleton,
  LinkPageSkeleton,
  DashboardSkeleton,
  AnalyticsSkeleton,
} from './common/Skeleton';

// Layout Components
export { ThemeToggle } from './layout/ThemeToggle';
export type { ThemeToggleProps } from './layout/ThemeToggle';

// Links Components
export { LinkCard } from './links/LinkCard';
export type { LinkCardProps } from './links/LinkCard';
export { LinkForm } from './links/LinkForm';
export type { LinkFormProps } from './links/LinkForm';
export { DraggableLinkList } from './links/DraggableLinkList';
export type { DraggableLinkListProps } from './links/DraggableLinkList';
export { IconPicker } from './links/IconPicker';
export type { IconPickerProps } from './links/IconPicker';

// Profile Components
export { ProfileHeader } from './profile/ProfileHeader';
export type { ProfileHeaderProps } from './profile/ProfileHeader';
export { ProfileEditor } from './profile/ProfileEditor';
export type { ProfileEditorProps } from './profile/ProfileEditor';
export { SocialLinksEditor } from './profile/SocialLinksEditor';
export type { SocialLinksEditorProps } from './profile/SocialLinksEditor';

// Settings Components
export { ThemeEditor } from './settings/ThemeEditor';
export type { ThemeEditorProps } from './settings/ThemeEditor';
export { DisplaySettingsEditor } from './settings/DisplaySettingsEditor';
export type { DisplaySettingsEditorProps } from './settings/DisplaySettingsEditor';

// Analytics Components
export { AnalyticsSummary } from './analytics/AnalyticsSummary';
export type { AnalyticsSummaryProps } from './analytics/AnalyticsSummary';

// Share Components
export { ShareSection } from './share/ShareSection';
export type { ShareSectionProps } from './share/ShareSection';
export { ExportButton } from './share/ExportButton';
export type { ExportButtonProps } from './share/ExportButton';
export { SharedNotepad } from './share/SharedNotepad';
export type { SharedNotepadProps } from './share/SharedNotepad';
