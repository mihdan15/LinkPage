// ProfileEditor Component
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { validateBio, validateSlug, MAX_BIO_LENGTH } from '../utils/validation';
import type { Profile, UpdateProfileInput } from '../types';

export interface ProfileEditorProps {
  profile: Profile;
  onSave: (data: UpdateProfileInput) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<string>;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
  primaryColor?: string;
}

/**
 * ProfileEditor component - Edit profile information
 * Requirements: 2.1 - Update display name
 * Requirements: 2.2 - Update bio with character counter (150 max)
 * Requirements: 2.3 - Upload profile picture
 * Requirements: 2.4 - Set custom slug
 * Requirements: 2.5 - Slug availability check
 */
export function ProfileEditor({
  profile,
  onSave,
  onAvatarUpload,
  checkSlugAvailability,
  primaryColor = '#3B82F6',
}: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio || '');
  const [slug, setSlug] = useState(profile.slug);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [bioError, setBioError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Validate bio on change
  useEffect(() => {
    const result = validateBio(bio);
    setBioError(result.valid ? null : result.error || null);
  }, [bio]);

  // Validate and check slug availability on change
  useEffect(() => {
    // Clear previous timeout
    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }

    // Validate slug format
    const result = validateSlug(slug);
    if (!result.valid) {
      setSlugError(result.error || null);
      setSlugAvailable(null);
      return;
    }

    setSlugError(null);

    // Don't check if slug hasn't changed
    if (slug === profile.slug) {
      setSlugAvailable(true);
      return;
    }

    // Debounce slug availability check
    setIsCheckingSlug(true);
    slugCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const available = await checkSlugAvailability(slug);
        setSlugAvailable(available);
        if (!available) {
          setSlugError('This slug is already taken');
        }
      } catch {
        setSlugError('Failed to check slug availability');
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => {
      if (slugCheckTimeoutRef.current) {
        clearTimeout(slugCheckTimeoutRef.current);
      }
    };
  }, [slug, profile.slug, checkSlugAvailability]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const newAvatarUrl = await onAvatarUpload(file);
      setAvatarUrl(newAvatarUrl);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    // Validate all fields
    if (bioError || slugError || slugAvailable === false) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates: UpdateProfileInput = {};

      if (displayName !== profile.displayName) {
        updates.displayName = displayName;
      }
      if (bio !== (profile.bio || '')) {
        updates.bio = bio;
      }
      if (slug !== profile.slug) {
        updates.slug = slug;
      }

      if (Object.keys(updates).length > 0) {
        await onSave(updates);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    displayName !== profile.displayName ||
    bio !== (profile.bio || '') ||
    slug !== profile.slug;

  const canSave = hasChanges && !bioError && !slugError && slugAvailable !== false;


  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.button
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg group"
            style={{ borderColor: primaryColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Click to upload a new photo
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label
          htmlFor="display-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Display Name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 transition-shadow"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          placeholder="Your display name"
        />
      </div>


      {/* Bio with Character Counter */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bio
          </label>
          <span
            className={`text-sm ${
              bio.length > MAX_BIO_LENGTH
                ? 'text-red-500'
                : bio.length > MAX_BIO_LENGTH - 20
                ? 'text-yellow-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {bio.length}/{MAX_BIO_LENGTH}
          </span>
        </div>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 transition-shadow resize-none ${
            bioError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          style={!bioError ? { '--tw-ring-color': primaryColor } as React.CSSProperties : undefined}
          placeholder="Tell visitors about yourself..."
        />
        {bioError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {bioError}
          </motion.p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Custom URL
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500 dark:text-gray-400 text-sm">
            linkpage.com/
          </span>
          <div className="relative flex-1">
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              className={`w-full px-4 py-2 rounded-r-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 transition-shadow ${
                slugError
                  ? 'border-red-500 focus:ring-red-500'
                  : slugAvailable === true
                  ? 'border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={!slugError && slugAvailable !== true ? { '--tw-ring-color': primaryColor } as React.CSSProperties : undefined}
              placeholder="your-unique-slug"
            />
            {/* Status indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingSlug && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              {!isCheckingSlug && slugAvailable === true && slug !== profile.slug && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {!isCheckingSlug && slugError && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>
        {slugError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {slugError}
          </motion.p>
        )}
        {!slugError && slugAvailable === true && slug !== profile.slug && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-green-500 flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            This slug is available!
          </motion.p>
        )}
      </div>


      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2 ${
            canSave && !isSaving
              ? 'hover:opacity-90 shadow-md hover:shadow-lg'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ backgroundColor: primaryColor }}
          whileHover={canSave && !isSaving ? { scale: 1.02 } : undefined}
          whileTap={canSave && !isSaving ? { scale: 0.98 } : undefined}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </motion.button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Profile updated successfully!
        </motion.div>
      )}
    </div>
  );
}
