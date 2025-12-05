// LinkForm Component
// Requirements: 1.1, 1.2, 1.5, 1.6

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, X, Check, AlertCircle } from 'lucide-react';
import { IconPicker } from './IconPicker';
import { validateUrl } from '../../utils/validation';
import type { LinkItem, LinkFormData } from '../../types';

export interface LinkFormProps {
  link?: LinkItem;
  onSubmit: (data: LinkFormData) => void;
  onCancel: () => void;
  primaryColor?: string;
}

/**
 * LinkForm component - Form for creating and editing links
 */
export function LinkForm({
  link,
  onSubmit,
  onCancel,
  primaryColor = '#3B82F6',
}: LinkFormProps) {
  const isEditMode = !!link;

  const [title, setTitle] = useState(link?.title || '');
  const [url, setUrl] = useState(link?.url || '');
  const [iconType, setIconType] = useState<'predefined' | 'custom'>(link?.iconType || 'predefined');
  const [iconValue, setIconValue] = useState(link?.iconValue || 'link');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const urlError = useMemo(() => {
    if (url && !validateUrl(url)) {
      return 'Please enter a valid URL (must start with http:// or https://)';
    }
    return null;
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !validateUrl(url)) return;

    onSubmit({
      title: title.trim(),
      url: url.trim(),
      iconType,
      iconValue,
    });
  };

  const handleIconSelect = (value: string, type: 'predefined' | 'custom') => {
    setIconValue(value);
    setIconType(type);
  };

  const isValid = title.trim() && url.trim() && !urlError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <LinkIcon className="w-5 h-5" style={{ color: primaryColor }} />
          {isEditMode ? 'Edit Link' : 'Add New Link'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="Cancel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="link-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            id="link-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Website"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            required
          />
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL
          </label>
          <input
            id="link-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              urlError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
            }`}
            style={!urlError ? ({ '--tw-ring-color': primaryColor } as React.CSSProperties) : undefined}
            required
          />
          {urlError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {urlError}
            </motion.p>
          )}
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {showIconPicker ? 'Hide icon picker' : 'Choose an icon'}
            </span>
            <span
              className="text-sm px-2 py-1 rounded"
              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            >
              {iconType === 'custom' ? 'Custom' : iconValue}
            </span>
          </button>

          {showIconPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <IconPicker
                selectedIcon={iconValue}
                selectedType={iconType}
                onSelect={handleIconSelect}
                allowCustomUrl={true}
                primaryColor={primaryColor}
              />
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 min-h-[44px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 px-4 py-3 min-h-[44px] rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:opacity-80 cursor-pointer"
            style={{ backgroundColor: isValid ? primaryColor : '#9CA3AF' }}
          >
            <Check className="w-4 h-4" />
            {isEditMode ? 'Save Changes' : 'Add Link'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
