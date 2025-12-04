// ThemeEditor Component
// Requirements: 7.1, 7.2, 7.3

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import type { Profile, UpdateProfileInput, ProfileDisplaySettings, SocialLink } from '../types';
import { DisplaySettingsEditor } from './DisplaySettingsEditor';
import { SocialLinksEditor } from './SocialLinksEditor';

export interface ThemeEditorProps {
  profile: Profile;
  onSave: (data: UpdateProfileInput) => Promise<void>;
}

// Predefined color palette
const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#000000', // Black
  '#6B7280', // Gray
];

// Predefined gradient options - expanded with more cool gradients
const PRESET_GRADIENTS = [
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Sky', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)' },
  { name: 'Candy', value: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { name: 'Citrus', value: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)' },
  { name: 'Cosmic', value: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)' },
  { name: 'Aqua', value: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)' },
  { name: 'Flame', value: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)' },
  { name: 'Berry', value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  { name: 'Emerald', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
];

/**
 * ThemeEditor component - Customize link page appearance
 * Requirements: 7.1 - Select theme color for buttons and accent elements
 * Requirements: 7.2 - Select background style (solid, gradient)
 * Requirements: 7.3 - Save theme settings to database
 */
// Default display settings
const DEFAULT_DISPLAY_SETTINGS: ProfileDisplaySettings = {
  nameStyle: { fontSize: 24, color: '#111827', fontFamily: 'Inter', fontWeight: 'bold', fontStyle: 'normal' },
  bioStyle: { fontSize: 16, color: '#4B5563', fontFamily: 'Inter', fontWeight: 'normal', fontStyle: 'normal' },
};

export function ThemeEditor({ profile, onSave }: ThemeEditorProps) {
  const [themeColor, setThemeColor] = useState(profile.themeColor);
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient'>(
    profile.backgroundType === 'gradient' ? 'gradient' : 'solid'
  );
  const [backgroundValue, setBackgroundValue] = useState(profile.backgroundValue);
  const [customColor, setCustomColor] = useState(profile.themeColor);
  const [solidBgColor, setSolidBgColor] = useState(
    profile.backgroundType === 'solid' ? profile.backgroundValue : '#ffffff'
  );
  
  // Custom gradient colors for background
  const [gradientColor1, setGradientColor1] = useState('#667eea');
  const [gradientColor2, setGradientColor2] = useState('#764ba2');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [useCustomGradient, setUseCustomGradient] = useState(false);

  // Button style (kept for compatibility but not editable)
  const buttonStyle = profile.buttonStyle || 'filled';
  const buttonGradient = profile.buttonGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  // Display settings for name and bio
  const [displaySettings, setDisplaySettings] = useState<ProfileDisplaySettings>(
    profile.displaySettings || DEFAULT_DISPLAY_SETTINGS
  );

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    profile.socialLinks || []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Collapsible states
  const [isThemeColorOpen, setIsThemeColorOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);

  // Update background value when type or color changes
  useEffect(() => {
    if (backgroundType === 'solid') {
      setBackgroundValue(solidBgColor);
    } else if (backgroundType === 'gradient' && useCustomGradient) {
      setBackgroundValue(`linear-gradient(${gradientAngle}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`);
    }
  }, [backgroundType, solidBgColor, useCustomGradient, gradientColor1, gradientColor2, gradientAngle]);

  const handleColorSelect = (color: string) => {
    setThemeColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setThemeColor(color);
  };

  const handleGradientSelect = (gradient: string) => {
    setBackgroundValue(gradient);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates: UpdateProfileInput = {};

      if (themeColor !== profile.themeColor) {
        updates.themeColor = themeColor;
      }
      if (backgroundType !== profile.backgroundType) {
        updates.backgroundType = backgroundType;
      }
      if (backgroundValue !== profile.backgroundValue) {
        updates.backgroundValue = backgroundValue;
      }
      if (buttonStyle !== (profile.buttonStyle || 'filled')) {
        updates.buttonStyle = buttonStyle;
      }
      if (buttonStyle === 'gradient' && buttonGradient !== profile.buttonGradient) {
        updates.buttonGradient = buttonGradient;
      }

      // Check display settings changes
      if (JSON.stringify(displaySettings) !== JSON.stringify(profile.displaySettings || DEFAULT_DISPLAY_SETTINGS)) {
        updates.displaySettings = displaySettings;
      }

      // Check social links changes
      if (JSON.stringify(socialLinks) !== JSON.stringify(profile.socialLinks || [])) {
        updates.socialLinks = socialLinks;
      }

      if (Object.keys(updates).length > 0) {
        await onSave(updates);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save theme:', error);
      alert('Failed to save theme settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    themeColor !== profile.themeColor ||
    backgroundType !== profile.backgroundType ||
    backgroundValue !== profile.backgroundValue ||
    buttonStyle !== (profile.buttonStyle || 'filled') ||
    (buttonStyle === 'gradient' && buttonGradient !== profile.buttonGradient) ||
    JSON.stringify(displaySettings) !== JSON.stringify(profile.displaySettings || DEFAULT_DISPLAY_SETTINGS) ||
    JSON.stringify(socialLinks) !== JSON.stringify(profile.socialLinks || []);

  // Generate preview background style
  const getPreviewBackground = () => {
    if (backgroundType === 'gradient') {
      return { background: backgroundValue };
    }
    return { backgroundColor: backgroundValue };
  };

  return (
    <div className="space-y-8">
      {/* Live Preview Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Live Preview
          </h3>
        </div>
        <motion.div
          className="rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={getPreviewBackground()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Preview Profile with text styles */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="w-20 h-20 rounded-full border-4 bg-gray-200 dark:bg-gray-600 mb-3"
              style={{ borderColor: themeColor }}
            />
            {/* Name with custom style */}
            <div
              className="mb-2"
              style={{
                fontSize: `${displaySettings.nameStyle?.fontSize || 24}px`,
                color: displaySettings.nameStyle?.color || '#111827',
                fontFamily: displaySettings.nameStyle?.fontFamily || 'Inter',
                fontWeight: displaySettings.nameStyle?.fontWeight === 'bold' ? 700 : 
                           displaySettings.nameStyle?.fontWeight === 'semibold' ? 600 :
                           displaySettings.nameStyle?.fontWeight === 'medium' ? 500 : 400,
                fontStyle: displaySettings.nameStyle?.fontStyle || 'normal',
              }}
            >
              Nama Anda
            </div>
            {/* Bio with custom style */}
            <div
              className="text-center px-4"
              style={{
                fontSize: `${displaySettings.bioStyle?.fontSize || 16}px`,
                color: displaySettings.bioStyle?.color || '#4B5563',
                fontFamily: displaySettings.bioStyle?.fontFamily || 'Inter',
                fontWeight: displaySettings.bioStyle?.fontWeight === 'bold' ? 700 : 
                           displaySettings.bioStyle?.fontWeight === 'semibold' ? 600 :
                           displaySettings.bioStyle?.fontWeight === 'medium' ? 500 : 400,
                fontStyle: displaySettings.bioStyle?.fontStyle || 'normal',
              }}
            >
              Bio singkat tentang Anda
            </div>
          </div>

          {/* Preview Links */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="py-3 px-4 rounded-lg text-white text-center text-sm font-medium shadow-md"
                style={{ backgroundColor: themeColor }}
                whileHover={{ scale: 1.02 }}
              >
                Sample Link {i}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>


      {/* Theme Color Section - Collapsible */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsThemeColorOpen(!isThemeColorOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg shadow-sm"
              style={{ backgroundColor: themeColor }}
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Theme Color</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Warna tombol dan aksen
              </p>
            </div>
          </div>
          {isThemeColorOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {isThemeColorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* Preset Colors Grid */}
                <div className="grid grid-cols-6 gap-3">
                  {PRESET_COLORS.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-lg shadow-md relative transition-all ${
                        themeColor === color
                          ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: themeColor === color ? 1 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Select color ${color}`}
                    >
                      {themeColor === color && (
                        <Check
                          className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                            color === '#000000' || color === '#6B7280'
                              ? 'text-white'
                              : 'text-white drop-shadow-md'
                          }`}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Custom:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={handleCustomColorChange}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          setCustomColor(value);
                          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                            setThemeColor(value);
                          }
                        }
                      }}
                      className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Style Section - Collapsible */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg shadow-sm"
              style={backgroundType === 'gradient' ? { background: backgroundValue } : { backgroundColor: solidBgColor }}
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Background Style</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {backgroundType === 'gradient' ? 'Gradient' : 'Solid Color'}
              </p>
            </div>
          </div>
          {isBackgroundOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {isBackgroundOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* Background Type Tabs */}
                <div className="flex gap-2">
                  {(['solid', 'gradient'] as const).map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => setBackgroundType(type)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        backgroundType === type
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      style={
                        backgroundType === type ? { backgroundColor: themeColor } : undefined
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </motion.button>
                  ))}
                </div>

                {/* Solid Color Options */}
                {backgroundType === 'solid' && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Warna:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={solidBgColor}
                        onChange={(e) => setSolidBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={solidBgColor}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                            setSolidBgColor(value);
                          }
                        }}
                        className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                )}

                {/* Gradient Options */}
                {backgroundType === 'gradient' && (
                  <div className="space-y-4">
                    {/* Toggle between preset and custom */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUseCustomGradient(false)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          !useCustomGradient
                            ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        Preset
                      </button>
                      <button
                        onClick={() => setUseCustomGradient(true)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          useCustomGradient
                            ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        Custom
                      </button>
                    </div>

                    {/* Preset Gradients */}
                    {!useCustomGradient && (
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_GRADIENTS.map((gradient) => (
                          <motion.button
                            key={gradient.name}
                            onClick={() => handleGradientSelect(gradient.value)}
                            className={`h-16 rounded-lg shadow-md relative overflow-hidden transition-all ${
                              backgroundValue === gradient.value
                                ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500'
                                : 'hover:scale-105'
                            }`}
                            style={{ background: gradient.value }}
                            whileHover={{ scale: backgroundValue === gradient.value ? 1 : 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="absolute bottom-1 left-1 text-[10px] font-medium text-white drop-shadow-lg">
                              {gradient.name}
                            </span>
                            {backgroundValue === gradient.value && (
                              <Check className="w-4 h-4 absolute top-1 right-1 text-white drop-shadow-lg" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Custom Gradient Controls */}
                    {useCustomGradient && (
                      <div className="space-y-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        {/* Preview */}
                        <div
                          className="h-20 rounded-lg shadow-inner"
                          style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)` }}
                        />
                        
                        {/* Color 1 */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Warna 1:</label>
                          <input
                            type="color"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={gradientColor1}
                            onChange={(e) => {
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                setGradientColor1(e.target.value);
                              }
                            }}
                            className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                          />
                        </div>

                        {/* Color 2 */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Warna 2:</label>
                          <input
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input
                            type="text"
                            value={gradientColor2}
                            onChange={(e) => {
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                setGradientColor2(e.target.value);
                              }
                            }}
                            className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                          />
                        </div>

                        {/* Angle */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Sudut:</label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-10">{gradientAngle}°</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Style Settings (Name & Bio) */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <DisplaySettingsEditor
          settings={displaySettings}
          onChange={setDisplaySettings}
          primaryColor={themeColor}
        />
      </div>

      {/* Social Links */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <SocialLinksEditor
          socialLinks={socialLinks}
          onChange={setSocialLinks}
          primaryColor={themeColor}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2 ${
            hasChanges && !isSaving
              ? 'hover:opacity-90 shadow-md hover:shadow-lg'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ backgroundColor: themeColor }}
          whileHover={hasChanges && !isSaving ? { scale: 1.02 } : undefined}
          whileTap={hasChanges && !isSaving ? { scale: 0.98 } : undefined}
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
            'Save Theme'
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
          Theme settings saved successfully!
        </motion.div>
      )}
    </div>
  );
}
