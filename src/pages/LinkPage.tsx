// LinkPage (Public Page)
// Requirements: 3.1, 3.3, 3.5, 4.3, 6.1, 11.3

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ProfileHeader,
  LinkCard,
  SearchBar,
  SharedNotepad,
  LinkPageSkeleton,
} from '../components';
import {
  getProfileBySlug,
  getEnabledLinks,
  recordPageView,
  recordLinkClick,
  getNoteContent,
  saveNoteContent,
  clearNote,
  subscribeToNotepad,
} from '../services';
import { filterLinksBySearch } from '../utils/searchUtils';
import { generateOGMetaTags, updateDocumentOGTags, clearDocumentOGTags } from '../utils/ogTags';
import type { Profile, LinkItem, Theme } from '../types';


// Always show search bar (removed minimum links requirement)

/**
 * LinkPage component - Public page displaying user's profile and links
 * Requirements: 3.1 - Display profile and active links for valid slug
 * Requirements: 3.3 - Responsive rendering with touch-friendly buttons
 * Requirements: 3.5 - Display search input when more than 5 links
 * Requirements: 6.1 - Record page view on load
 * Requirements: 11.3 - Staggered fade-in animation for links
 */
interface LinkPageProps {
  slug?: string; // Optional prop for direct slug
}

export function LinkPage({ slug: propSlug }: LinkPageProps) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile and links on mount
  useEffect(() => {
    async function fetchData() {
      if (!slug) {
        navigate('/404');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch profile by slug
        const profileData = await getProfileBySlug(slug);
        
        if (!profileData) {
          navigate('/404');
          return;
        }

        setProfile(profileData);

        // Fetch enabled links and notepad content in parallel
        const [linksData, noteData] = await Promise.all([
          getEnabledLinks(profileData.id),
          getNoteContent(slug),
        ]);

        setLinks(linksData);
        setNoteContent(noteData);

        // Record page view (fire and forget)
        recordPageView(profileData.id);
      } catch (err) {
        console.error('Failed to load page:', err);
        setError('Failed to load page. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, navigate]);

  // Subscribe to real-time notepad updates
  useEffect(() => {
    if (!slug) return;

    const unsubscribe = subscribeToNotepad(slug, (content) => {
      setNoteContent(content);
    });

    return unsubscribe;
  }, [slug]);

  // Update Open Graph meta tags when profile loads
  // Requirements: 4.3 - Generate dynamic OG tags based on profile
  useEffect(() => {
    if (profile) {
      const ogTags = generateOGMetaTags(profile);
      updateDocumentOGTags(ogTags);
    }

    // Cleanup on unmount
    return () => {
      clearDocumentOGTags();
    };
  }, [profile]);

  // Filter links by search query
  const filteredLinks = useMemo(
    () => filterLinksBySearch(links, searchQuery),
    [links, searchQuery]
  );

  // Always show search bar
  const showSearchBar = links.length > 0;

  // Handle link click with analytics
  const handleLinkClick = async (linkId: string) => {
    if (profile) {
      recordLinkClick(linkId, profile.id);
    }
  };

  // Handle notepad save
  const handleNoteSave = async (content: string) => {
    if (slug) {
      await saveNoteContent(slug, content);
    }
  };

  // Handle notepad clear
  const handleNoteClear = async () => {
    if (slug) {
      await clearNote(slug);
    }
  };

  // Build theme object
  const theme: Theme = profile
    ? {
        primaryColor: profile.themeColor,
        backgroundType: profile.backgroundType,
        backgroundValue: profile.backgroundValue,
        isDarkMode: false,
      }
    : {
        primaryColor: '#3B82F6',
        backgroundType: 'solid',
        backgroundValue: '#ffffff',
        isDarkMode: false,
      };

  // Generate background style
  const getBackgroundStyle = () => {
    if (!profile) return {};
    
    if (profile.backgroundType === 'gradient') {
      return { background: profile.backgroundValue };
    }
    return { backgroundColor: profile.backgroundValue };
  };

  // Loading state with skeleton
  if (isLoading) {
    return <LinkPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4">{error}</p>
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

  if (!profile) {
    return null;
  }

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={getBackgroundStyle()}
    >
      {/* Main Content - Full width with max content width (wider) */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col">
        {/* Profile Header */}
        <ProfileHeader profile={profile} theme={theme} />

        {/* Search Bar (if enough links) */}
        {showSearchBar && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search links..."
            primaryColor={profile.themeColor}
          />
        )}

        {/* Links List with Staggered Animation */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                onClick={() => handleLinkClick(link.id)}
                isAnimated={true}
                index={index}
                primaryColor={profile.themeColor}
                buttonStyle={profile.buttonStyle || 'filled'}
                buttonGradient={profile.buttonGradient || undefined}
              />
            ))
          ) : searchQuery ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 py-8"
            >
              No links found matching "{searchQuery}"
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 py-8"
            >
              No links available yet.
            </motion.p>
          )}
        </motion.div>

        {/* Shared Notepad */}
        <SharedNotepad
          slug={slug || ''}
          initialContent={noteContent}
          onSave={handleNoteSave}
          onClear={handleNoteClear}
          primaryColor={profile.themeColor}
        />
      </div>
    </div>
  );
}

export default LinkPage;
