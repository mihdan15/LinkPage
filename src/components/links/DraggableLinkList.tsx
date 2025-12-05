// DraggableLinkList Component
// Requirements: 1.4, 1.7, 1.8

import { useState, useRef, useEffect } from 'react';
import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
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
  MoreVertical,
} from 'lucide-react';
import type { LinkItem } from '../../types';

export interface DraggableLinkListProps {
  links: LinkItem[];
  onReorder: (links: LinkItem[]) => void;
  onEdit: (link: LinkItem) => void;
  onDelete: (linkId: string) => void;
  onToggle: (linkId: string, enabled: boolean) => void;
  primaryColor?: string;
}

type LucideIconProps = {
  className?: string;
  color?: string;
  size?: number | string;
};

const ICON_MAP: Record<string, React.ComponentType<LucideIconProps>> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  globe: Globe,
  mail: Mail,
  music: Music,
  video: Video,
  shop: ShoppingBag,
  book: BookOpen,
  camera: Camera,
  message: MessageCircle,
  link: LinkIcon,
  default: ExternalLink,
};

interface DraggableLinkItemProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (linkId: string) => void;
  onToggle: (linkId: string, enabled: boolean) => void;
  primaryColor: string;
}

function DraggableLinkItem({
  link,
  onEdit,
  onDelete,
  onToggle,
  primaryColor,
}: DraggableLinkItemProps) {
  const dragControls = useDragControls();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconComponent =
    link.iconType === 'predefined'
      ? ICON_MAP[link.iconValue.toLowerCase()] || ICON_MAP.default
      : null;

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(link.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <Reorder.Item
      value={link}
      dragListener={false}
      dragControls={dragControls}
      className={`bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all ${
        link.isEnabled
          ? 'border-gray-200 dark:border-gray-700'
          : 'border-gray-300 dark:border-gray-600 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="p-1 cursor-grab active:cursor-grabbing touch-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            link.isEnabled ? '' : 'grayscale'
          }`}
          style={{ backgroundColor: `${primaryColor}20` }}
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
          ) : IconComponent ? (
            <IconComponent className="w-5 h-5" color={link.isEnabled ? primaryColor : '#9CA3AF'} />
          ) : (
            <ExternalLink className="w-5 h-5" color={link.isEnabled ? primaryColor : '#9CA3AF'} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${link.isEnabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {link.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.url}</p>
        </div>

        {link.clickCount > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" title={`${link.clickCount} clicks`}>
            {link.clickCount} clicks
          </span>
        )}

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(link.id, !link.isEnabled)}
            className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              link.isEnabled
                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={link.isEnabled ? 'Hide link' : 'Show link'}
          >
            {link.isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(link)}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
            title="Edit link"
          >
            <Edit2 className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDeleting ? 'bg-red-500 text-white' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            title={isDeleting ? 'Click again to confirm' : 'Delete link'}
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <div className="relative sm:hidden" ref={menuRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>

          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
              >
                <button
                  onClick={() => { onToggle(link.id, !link.isEnabled); setShowMobileMenu(false); }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    link.isEnabled ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.isEnabled ? <><EyeOff className="w-4 h-4" /><span>Sembunyikan</span></> : <><Eye className="w-4 h-4" /><span>Tampilkan</span></>}
                </button>

                <button
                  onClick={() => { onEdit(link); setShowMobileMenu(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" /><span>Edit</span>
                </button>

                <button
                  onClick={() => { handleDelete(); if (!isDeleting) setShowMobileMenu(false); }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    isDeleting ? 'bg-red-500 text-white' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Trash2 className="w-4 h-4" /><span>{isDeleting ? 'Klik lagi untuk hapus' : 'Hapus'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!link.isEnabled && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <EyeOff className="w-3 h-3" />
          Hidden from public page
        </div>
      )}
    </Reorder.Item>
  );
}

export function DraggableLinkList({
  links,
  onReorder,
  onEdit,
  onDelete,
  onToggle,
  primaryColor = '#3B82F6',
}: DraggableLinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No links yet. Add your first link to get started!</p>
      </div>
    );
  }

  return (
    <Reorder.Group axis="y" values={links} onReorder={onReorder} className="space-y-3">
      {links.map((link) => (
        <DraggableLinkItem
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          primaryColor={primaryColor}
        />
      ))}
    </Reorder.Group>
  );
}
