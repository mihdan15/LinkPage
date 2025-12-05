// LinkCard Component
// Requirements: 1.6, 3.2, 11.2, 11.4

import { motion } from 'framer-motion';
import {
  ExternalLink,
  Link as LinkIcon,
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Music,
  Video,
  ShoppingBag,
  BookOpen,
  Camera,
  MessageCircle,
} from 'lucide-react';
import type { LinkItem } from '../../types';

/**
 * Renders the appropriate icon based on icon type and value
 */
function renderPredefinedIcon(iconValue: string, primaryColor: string) {
  const iconProps = { className: 'w-5 h-5', color: primaryColor };
  const iconKey = iconValue.toLowerCase();

  switch (iconKey) {
    case 'instagram': return <Instagram {...iconProps} />;
    case 'youtube': return <Youtube {...iconProps} />;
    case 'twitter': return <Twitter {...iconProps} />;
    case 'github': return <Github {...iconProps} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'facebook': return <Facebook {...iconProps} />;
    case 'globe': return <Globe {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'music': return <Music {...iconProps} />;
    case 'video': return <Video {...iconProps} />;
    case 'shop': return <ShoppingBag {...iconProps} />;
    case 'book': return <BookOpen {...iconProps} />;
    case 'camera': return <Camera {...iconProps} />;
    case 'message': return <MessageCircle {...iconProps} />;
    case 'link': return <LinkIcon {...iconProps} />;
    default: return <ExternalLink {...iconProps} />;
  }
}

export interface LinkCardProps {
  link: LinkItem;
  onClick?: () => void;
  isAnimated?: boolean;
  index?: number;
  primaryColor?: string;
  buttonStyle?: 'outline' | 'filled' | 'gradient';
  buttonGradient?: string;
}

/**
 * LinkCard component - Displays a single link with icon and hover effects
 */
export function LinkCard({
  link,
  onClick,
  isAnimated = true,
  index = 0,
  primaryColor = '#3B82F6',
  buttonStyle = 'filled',
  buttonGradient,
}: LinkCardProps) {
  const handleClick = () => {
    onClick?.();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getButtonStyles = () => {
    if (buttonStyle === 'gradient' && buttonGradient) {
      return { background: buttonGradient, color: 'white' };
    }
    if (buttonStyle === 'filled') {
      return { backgroundColor: primaryColor, color: 'white' };
    }
    return { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: primaryColor };
  };

  const isFilledOrGradient = buttonStyle === 'filled' || buttonStyle === 'gradient';

  const cardContent = (
    <button
      onClick={handleClick}
      className={`w-full p-4 min-h-[56px] cursor-pointer rounded-xl flex items-center gap-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isFilledOrGradient ? 'border-transparent' : 'border-2'
      }`}
      style={getButtonStyles()}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isFilledOrGradient ? 'bg-white/20' : ''
        }`}
        style={!isFilledOrGradient ? { backgroundColor: `${primaryColor}20` } : undefined}
      >
        {link.iconType === 'custom' && link.iconValue ? (
          <img
            src={link.iconValue}
            alt=""
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const parent = e.currentTarget.parentElement;
              e.currentTarget.style.display = 'none';
              if (parent) {
                const fallback = document.createElement('span');
                fallback.innerHTML = '🔗';
                fallback.className = 'text-lg';
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          renderPredefinedIcon(link.iconValue, isFilledOrGradient ? '#ffffff' : primaryColor)
        )}
      </div>

      {/* Title */}
      <span className={`flex-1 font-medium truncate ${isFilledOrGradient ? 'text-white' : 'text-gray-900'}`}>
        {link.title}
      </span>

      {/* External link indicator */}
      <ExternalLink className={`w-4 h-4 flex-shrink-0 ${isFilledOrGradient ? 'text-white/70' : 'text-gray-400'}`} />
    </button>
  );

  if (!isAnimated) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {cardContent}
    </motion.div>
  );
}
