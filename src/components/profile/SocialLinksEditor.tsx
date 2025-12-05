// SocialLinksEditor Component

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  Mail,
  Globe,
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
} from 'lucide-react';
import type { SocialLink } from '../../types';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export interface SocialLinksEditorProps {
  socialLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  primaryColor?: string;
}

type SocialPlatform = SocialLink['platform'];

const PLATFORM_CONFIG: Record<SocialPlatform, { icon: React.ReactNode; label: string; placeholder: string; color: string }> = {
  instagram: { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', placeholder: 'https://instagram.com/username', color: '#E4405F' },
  twitter: { icon: <Twitter className="w-5 h-5" />, label: 'Twitter/X', placeholder: 'https://twitter.com/username', color: '#1DA1F2' },
  facebook: { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', placeholder: 'https://facebook.com/username', color: '#1877F2' },
  youtube: { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', placeholder: 'https://youtube.com/@channel', color: '#FF0000' },
  tiktok: { icon: <TikTokIcon />, label: 'TikTok', placeholder: 'https://tiktok.com/@username', color: '#000000' },
  linkedin: { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', color: '#0A66C2' },
  github: { icon: <Github className="w-5 h-5" />, label: 'GitHub', placeholder: 'https://github.com/username', color: '#181717' },
  email: { icon: <Mail className="w-5 h-5" />, label: 'Email', placeholder: 'mailto:email@example.com', color: '#EA4335' },
  website: { icon: <Globe className="w-5 h-5" />, label: 'Website', placeholder: 'https://yourwebsite.com', color: '#3B82F6' },
};

const ALL_PLATFORMS: SocialPlatform[] = ['instagram', 'twitter', 'facebook', 'youtube', 'tiktok', 'linkedin', 'github', 'email', 'website'];

export function SocialLinksEditor({ socialLinks, onChange, primaryColor = '#3B82F6' }: SocialLinksEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const availablePlatforms = ALL_PLATFORMS.filter((platform) => !socialLinks.some((link) => link.platform === platform));

  const handleAddPlatform = (platform: SocialPlatform) => {
    const newLink: SocialLink = { id: `social-${Date.now()}`, platform, url: '', isEnabled: true };
    onChange([...socialLinks, newLink]);
    setEditingId(newLink.id);
    setEditUrl('');
    setShowAddMenu(false);
  };

  const handleRemove = (id: string) => onChange(socialLinks.filter((link) => link.id !== id));
  const handleToggle = (id: string) => onChange(socialLinks.map((link) => (link.id === id ? { ...link, isEnabled: !link.isEnabled } : link)));
  const handleStartEdit = (link: SocialLink) => { setEditingId(link.id); setEditUrl(link.url); };
  const handleSaveEdit = (id: string) => { onChange(socialLinks.map((link) => (link.id === id ? { ...link, url: editUrl } : link))); setEditingId(null); setEditUrl(''); };
  const handleCancelEdit = () => { setEditingId(null); setEditUrl(''); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Social Media Links</h3>
        {availablePlatforms.length > 0 && (
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg text-white cursor-pointer"
              style={{ backgroundColor: primaryColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />Tambah
            </motion.button>

            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
                >
                  {availablePlatforms.map((platform) => {
                    const config = PLATFORM_CONFIG[platform];
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handleAddPlatform(platform)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <span style={{ color: config.color }}>{config.icon}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{config.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {socialLinks.map((link) => {
            const config = PLATFORM_CONFIG[link.platform];
            const isEditing = editingId === link.id;

            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                    <div className="p-2 rounded-lg" style={{ backgroundColor: link.isEnabled ? `${config.color}20` : '#e5e7eb' }}>
                      <span style={{ color: link.isEnabled ? config.color : '#9ca3af' }}>{config.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{config.label}</p>
                      {!isEditing && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={() => handleStartEdit(link)}>
                          {link.url || 'Klik untuk menambah URL'}
                        </p>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => handleToggle(link.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${link.isEnabled ? '' : 'bg-gray-300 dark:bg-gray-600'}`}
                      style={{ backgroundColor: link.isEnabled ? primaryColor : undefined }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow" animate={{ left: link.isEnabled ? '1.25rem' : '0.125rem' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </motion.button>
                    <button type="button" onClick={() => handleRemove(link.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isEditing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 flex gap-2">
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder={config.placeholder}
                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
                      />
                      <button type="button" onClick={() => handleSaveEdit(link.id)} className="p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer">
                        <Check className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {socialLinks.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Belum ada social link. Klik "Tambah" untuk menambahkan.</p>}
      </div>
    </div>
  );
}
