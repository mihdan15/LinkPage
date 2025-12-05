// IconPicker Component
// Requirements: 1.9, 1.10, 1.11

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Link as LinkIcon,
  ExternalLink,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Heart,
  Star,
  Coffee,
  Briefcase,
  Check,
  Image,
} from 'lucide-react';

export interface IconPickerProps {
  selectedIcon: string;
  selectedType: 'predefined' | 'custom';
  onSelect: (iconValue: string, iconType: 'predefined' | 'custom') => void;
  allowCustomUrl?: boolean;
  primaryColor?: string;
}

// Predefined icons organized by category
const PREDEFINED_ICONS = {
  social: [
    { name: 'instagram', icon: Instagram, label: 'Instagram' },
    { name: 'youtube', icon: Youtube, label: 'YouTube' },
    { name: 'twitter', icon: Twitter, label: 'Twitter/X' },
    { name: 'github', icon: Github, label: 'GitHub' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { name: 'facebook', icon: Facebook, label: 'Facebook' },
  ],
  general: [
    { name: 'globe', icon: Globe, label: 'Website' },
    { name: 'mail', icon: Mail, label: 'Email' },
    { name: 'phone', icon: Phone, label: 'Phone' },
    { name: 'link', icon: LinkIcon, label: 'Link' },
    { name: 'external', icon: ExternalLink, label: 'External' },
    { name: 'message', icon: MessageCircle, label: 'Message' },
  ],
  media: [
    { name: 'music', icon: Music, label: 'Music' },
    { name: 'video', icon: Video, label: 'Video' },
    { name: 'camera', icon: Camera, label: 'Photo' },
    { name: 'image', icon: Image, label: 'Image' },
  ],
  business: [
    { name: 'shop', icon: ShoppingBag, label: 'Shop' },
    { name: 'briefcase', icon: Briefcase, label: 'Work' },
    { name: 'calendar', icon: Calendar, label: 'Calendar' },
    { name: 'file', icon: FileText, label: 'Document' },
    { name: 'download', icon: Download, label: 'Download' },
  ],
  other: [
    { name: 'book', icon: BookOpen, label: 'Blog' },
    { name: 'location', icon: MapPin, label: 'Location' },
    { name: 'heart', icon: Heart, label: 'Favorite' },
    { name: 'star', icon: Star, label: 'Featured' },
    { name: 'coffee', icon: Coffee, label: 'Support' },
  ],
};

/**
 * IconPicker component - Grid of predefined icons with custom URL option
 */
export function IconPicker({
  selectedIcon,
  selectedType,
  onSelect,
  allowCustomUrl = true,
  primaryColor = '#3B82F6',
}: IconPickerProps) {
  const [customUrl, setCustomUrl] = useState(
    selectedType === 'custom' ? selectedIcon : ''
  );
  const [showCustomInput, setShowCustomInput] = useState(selectedType === 'custom');

  const handlePredefinedSelect = (iconName: string) => {
    setShowCustomInput(false);
    onSelect(iconName, 'predefined');
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url);
    if (url.trim()) {
      onSelect(url.trim(), 'custom');
    }
  };

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput && customUrl.trim()) {
      onSelect(customUrl.trim(), 'custom');
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Sections */}
      {Object.entries(PREDEFINED_ICONS).map(([category, icons]) => (
        <div key={category}>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {category}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {icons.map(({ name, icon: Icon, label }) => {
              const isSelected = selectedType === 'predefined' && selectedIcon === name;
              return (
                <motion.button
                  key={name}
                  type="button"
                  onClick={() => handlePredefinedSelect(name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-current bg-opacity-10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={{
                    borderColor: isSelected ? primaryColor : undefined,
                    backgroundColor: isSelected ? `${primaryColor}10` : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={label}
                  aria-label={`Select ${label} icon`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isSelected ? primaryColor : undefined }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom URL Option */}
      {allowCustomUrl && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCustomToggle}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Image className="w-4 h-4" />
            <span>Use custom image URL</span>
            {showCustomInput && <Check className="w-4 h-4 text-green-500" />}
          </button>

          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-3"
              >
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => handleCustomUrlChange(e.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />

                {customUrl && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Preview:</span>
                    <div
                      className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden"
                      style={{ borderColor: selectedType === 'custom' ? primaryColor : undefined }}
                    >
                      <img
                        src={customUrl}
                        alt="Custom icon preview"
                        className="w-6 h-6 object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Selected Icon Preview */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            {selectedType === 'custom' && selectedIcon ? (
              <img
                src={selectedIcon}
                alt="Selected icon"
                className="w-6 h-6 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              (() => {
                const allIcons = Object.values(PREDEFINED_ICONS).flat();
                const found = allIcons.find((i) => i.name === selectedIcon);
                const IconComponent = found?.icon || Globe;
                return <IconComponent className="w-6 h-6" style={{ color: primaryColor }} />;
              })()
            )}
          </div>
          <span className="text-sm text-gray-900 dark:text-white">
            {selectedType === 'custom' ? 'Custom Image' : selectedIcon}
          </span>
        </div>
      </div>
    </div>
  );
}
