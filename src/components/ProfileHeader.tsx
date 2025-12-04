// ProfileHeader Component
// Requirements: 2.1, 2.2, 2.3, 11.1, 11.3

import { motion } from 'framer-motion';
import { 
  User, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Github, 
  Mail,
  Globe
} from 'lucide-react';
import type { Profile, Theme, SocialLink } from '../types';

// TikTok icon (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export interface ProfileHeaderProps {
  profile: Profile;
  theme?: Theme;
}

const SOCIAL_ICONS: Record<SocialLink['platform'], { 
  icon: React.ReactNode; 
  color: string;
}> = {
  instagram: { icon: <Instagram className="w-5 h-5" />, color: '#E4405F' },
  twitter: { icon: <Twitter className="w-5 h-5" />, color: '#1DA1F2' },
  facebook: { icon: <Facebook className="w-5 h-5" />, color: '#1877F2' },
  youtube: { icon: <Youtube className="w-5 h-5" />, color: '#FF0000' },
  tiktok: { icon: <TikTokIcon className="w-5 h-5" />, color: '#000000' },
  linkedin: { icon: <Linkedin className="w-5 h-5" />, color: '#0A66C2' },
  github: { icon: <Github className="w-5 h-5" />, color: '#181717' },
  email: { icon: <Mail className="w-5 h-5" />, color: '#EA4335' },
  website: { icon: <Globe className="w-5 h-5" />, color: '#3B82F6' },
};

// Default text styles
const DEFAULT_NAME_STYLE = {
  fontSize: 24,
  color: '#111827',
  fontFamily: 'Inter',
  fontWeight: 'bold' as const,
  fontStyle: 'normal' as const,
};

const DEFAULT_BIO_STYLE = {
  fontSize: 16,
  color: '#4B5563',
  fontFamily: 'Inter',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
};

// Get numeric font weight
const getFontWeight = (weight: string): number => {
  const weights: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };
  return weights[weight] || 400;
};

/**
 * ProfileHeader component - Displays user avatar, name, bio, and social icons
 * Requirements: 2.1 - Display name on Link_Page
 * Requirements: 2.2 - Display bio below name
 * Requirements: 2.3 - Display circular avatar
 * Requirements: 11.1 - Smooth animations
 * Requirements: 11.3 - Staggered fade-in animation
 */
export function ProfileHeader({ profile, theme }: ProfileHeaderProps) {
  const primaryColor = theme?.primaryColor || profile.themeColor || '#3B82F6';
  
  // Get display settings with defaults
  const nameStyle = profile.displaySettings?.nameStyle || DEFAULT_NAME_STYLE;
  const bioStyle = profile.displaySettings?.bioStyle || DEFAULT_BIO_STYLE;

  // Get enabled social links
  const enabledSocialLinks = (profile.socialLinks || []).filter(link => link.isEnabled && link.url);

  return (
    <motion.div
      className="flex flex-col items-center text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Avatar - larger size */}
      <motion.div
        className="relative mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`${profile.displayName}'s avatar`}
            className="w-40 h-40 rounded-full object-cover border-4 shadow-lg"
            style={{ borderColor: primaryColor }}
            onError={(e) => {
              // Fallback to default avatar on error
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-lg bg-gray-200 dark:bg-gray-700 ${
            profile.avatarUrl ? 'hidden' : ''
          }`}
          style={{ borderColor: primaryColor }}
        >
          <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
      </motion.div>

      {/* Display Name with custom style */}
      <motion.h1
        style={{
          fontSize: `${nameStyle.fontSize}px`,
          color: nameStyle.color,
          fontFamily: nameStyle.fontFamily,
          fontWeight: getFontWeight(nameStyle.fontWeight || 'bold'),
          fontStyle: nameStyle.fontStyle || 'normal',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {profile.displayName}
      </motion.h1>

      {/* Bio with custom style - full width */}
      {profile.bio && (
        <motion.p
          className="w-full px-4"
          style={{
            fontSize: `${bioStyle.fontSize}px`,
            color: bioStyle.color,
            fontFamily: bioStyle.fontFamily,
            fontWeight: getFontWeight(bioStyle.fontWeight || 'normal'),
            fontStyle: bioStyle.fontStyle || 'normal',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {profile.bio}
        </motion.p>
      )}

      {/* Social Icons - each can be enabled/disabled individually */}
      {enabledSocialLinks.length > 0 && (
        <motion.div
          className="flex items-center gap-3 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {enabledSocialLinks.map((link, index) => {
            const config = SOCIAL_ICONS[link.platform];
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all"
                style={{ color: config.color }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {config.icon}
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProfileHeader;
