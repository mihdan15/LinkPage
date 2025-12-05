// Dashboard Page
// Requirements: 1.8, 4.1, 6.6, 11.5

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  User,
  Palette,
  BarChart3,
  Plus,
  LogOut,
} from 'lucide-react';
import {
  DraggableLinkList,
  LinkForm,
  ProfileEditor,
  ThemeEditor,
  AnalyticsSummary,
  ShareSection,
  DashboardSkeleton,
  AnalyticsSkeleton,
} from '../components';
import {
  getProfileBySlug,
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  updateProfile,
  uploadAvatar,
  checkSlugAvailability,
  getAnalytics,
} from '../services';
import { useToast } from '../contexts';
import type { Profile, LinkItem, LinkFormData, UpdateProfileInput, AnalyticsData } from '../types';
import { MY_SLUG } from '../App';

type TabType = 'links' | 'profile' | 'theme' | 'analytics';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'links', label: 'Links', icon: <Link2 className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'theme', label: 'Theme', icon: <Palette className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
];

export function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('links');
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Link form state
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Check login status and fetch data
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const profileData = await getProfileBySlug(MY_SLUG);
        
        if (!profileData) {
          setError('Profile not found. Please create your profile in Supabase.');
          setIsLoading(false);
          return;
        }

        setProfile(profileData);

        const [linksData, analyticsData] = await Promise.all([
          getLinks(profileData.id),
          getAnalytics(profileData.id),
        ]);

        setLinks(linksData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    toast.success('Logged out');
    navigate('/login');
  };

  // Link handlers
  const handleAddLink = () => {
    setEditingLink(null);
    setShowLinkForm(true);
  };

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleLinkFormSubmit = async (data: LinkFormData) => {
    if (!profile) return;

    try {
      if (editingLink) {
        const updated = await updateLink(editingLink.id, {
          title: data.title,
          url: data.url,
          iconType: data.iconType,
          iconValue: data.iconValue,
        });
        setLinks((prev) =>
          prev.map((l) => (l.id === updated.id ? updated : l))
        );
        toast.success('Link updated successfully');
      } else {
        const created = await createLink({
          userId: profile.id,
          title: data.title,
          url: data.url,
          iconType: data.iconType,
          iconValue: data.iconValue,
        });
        setLinks((prev) => [...prev, created]);
        toast.success('Link created successfully');
      }
      setShowLinkForm(false);
      setEditingLink(null);
    } catch (err) {
      console.error('Failed to save link:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      toast.success('Link deleted successfully');
    } catch (err) {
      console.error('Failed to delete link:', err);
      toast.error('Failed to delete link. Please try again.');
    }
  };

  const handleToggleLink = async (linkId: string, enabled: boolean) => {
    try {
      const updated = await updateLink(linkId, { isEnabled: enabled });
      setLinks((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      toast.success(enabled ? 'Link enabled' : 'Link disabled');
    } catch (err) {
      console.error('Failed to toggle link:', err);
      toast.error('Failed to update link. Please try again.');
    }
  };

  const handleReorderLinks = useCallback(async (reorderedLinks: LinkItem[]) => {
    if (!profile) return;

    setLinks(reorderedLinks);

    try {
      await reorderLinks(
        profile.id,
        reorderedLinks.map((l) => l.id)
      );
    } catch (err) {
      console.error('Failed to reorder links:', err);
      toast.error('Failed to reorder links');
      const linksData = await getLinks(profile.id);
      setLinks(linksData);
    }
  }, [profile, toast]);

  const handleProfileSave = async (data: UpdateProfileInput) => {
    if (!profile) return;
    const updated = await updateProfile(profile.id, data);
    setProfile(updated);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!profile) throw new Error('No profile');
    return uploadAvatar(profile.id, file);
  };

  const handleCheckSlugAvailability = async (slug: string) => {
    return checkSlugAvailability(slug, profile?.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const primaryColor = profile.themeColor || '#3B82F6';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Share Section */}
        <div className="mb-8">
          <ShareSection slug={profile.slug} primaryColor={primaryColor} />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex  space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'links' && (
              <div className=" bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Links</h2>
                  <motion.button
                    onClick={handleAddLink}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Link
                  </motion.button>
                </div>
                <DraggableLinkList
                  links={links}
                  onReorder={handleReorderLinks}
                  onEdit={handleEditLink}
                  onDelete={handleDeleteLink}
                  onToggle={handleToggleLink}
                  primaryColor={primaryColor}
                />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                <ProfileEditor
                  profile={profile}
                  onSave={handleProfileSave}
                  onAvatarUpload={handleAvatarUpload}
                  checkSlugAvailability={handleCheckSlugAvailability}
                  primaryColor={primaryColor}
                />
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Customize Theme</h2>
                <ThemeEditor profile={profile} onSave={handleProfileSave} />
              </div>
            )}

            {activeTab === 'analytics' && (
              analytics ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Analytics Overview</h2>
                  <AnalyticsSummary
                    totalViews={analytics.totalViews}
                    totalClicks={analytics.totalClicks}
                    linkStats={analytics.linkStats}
                    primaryColor={primaryColor}
                  />
                </div>
              ) : (
                <AnalyticsSkeleton />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Link Form Modal */}
      <AnimatePresence>
        {showLinkForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLinkForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h2>
                <LinkForm
                  link={editingLink || undefined}
                  onSubmit={handleLinkFormSubmit}
                  onCancel={() => {
                    setShowLinkForm(false);
                    setEditingLink(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
