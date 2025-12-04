// DisplaySettingsEditor Component
// Custom settings for name and bio text styles

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProfileDisplaySettings, TextStyleSettings } from '../types';

export interface DisplaySettingsEditorProps {
  settings: ProfileDisplaySettings;
  onChange: (settings: ProfileDisplaySettings) => void;
  primaryColor?: string;
}

// Available fonts
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Dancing Script', label: 'Dancing Script' },
];

interface TextStyleEditorProps {
  label: string;
  style: TextStyleSettings;
  onChange: (style: TextStyleSettings) => void;
  primaryColor: string;
}

// Font weight options
const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal', weight: 400 },
  { value: 'medium', label: 'Medium', weight: 500 },
  { value: 'semibold', label: 'Semibold', weight: 600 },
  { value: 'bold', label: 'Bold', weight: 700 },
];



function TextStyleEditor({ 
  label, 
  style, 
  onChange,
}: TextStyleEditorProps) {
  // Ensure style has all properties with defaults
  const currentStyle = {
    fontSize: style.fontSize || 16,
    color: style.color || '#111827',
    fontFamily: style.fontFamily || 'Inter',
    fontWeight: style.fontWeight || 'normal',
    fontStyle: style.fontStyle || 'normal',
  };

  // Hide label since it's shown in the collapsible header
  void label;

  return (
    <div className="space-y-4">
      {/* Font Size - Manual Input (no limits) */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Ukuran Font</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={currentStyle.fontSize}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 16;
              onChange({ ...currentStyle, fontSize: Math.max(1, value) });
            }}
            className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
        </div>
      </div>

      {/* Font Color */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Warna</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={currentStyle.color}
              onChange={(e) => onChange({ ...currentStyle, color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
            />
          </div>
          <input
            type="text"
            value={currentStyle.color}
            onChange={(e) => onChange({ ...currentStyle, color: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Font</label>
        <select
          value={currentStyle.fontFamily}
          onChange={(e) => onChange({ ...currentStyle, fontFamily: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          style={{ fontFamily: currentStyle.fontFamily }}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight & Style */}
      <div className="grid grid-cols-2 gap-3">
        {/* Font Weight */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Ketebalan</label>
          <select
            value={currentStyle.fontWeight}
            onChange={(e) => onChange({ ...currentStyle, fontWeight: e.target.value as TextStyleSettings['fontWeight'] })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {FONT_WEIGHT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Style */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Gaya</label>
          <select
            value={currentStyle.fontStyle}
            onChange={(e) => onChange({ ...currentStyle, fontStyle: e.target.value as TextStyleSettings['fontStyle'] })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="normal">Normal</option>
            <option value="italic">Miring (Italic)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Default styles
const DEFAULT_NAME_STYLE: TextStyleSettings = {
  fontSize: 24,
  color: '#111827',
  fontFamily: 'Inter',
  fontWeight: 'bold',
  fontStyle: 'normal',
};

const DEFAULT_BIO_STYLE: TextStyleSettings = {
  fontSize: 16,
  color: '#4B5563',
  fontFamily: 'Inter',
  fontWeight: 'normal',
  fontStyle: 'normal',
};

export function DisplaySettingsEditor({ settings, onChange, primaryColor = '#3B82F6' }: DisplaySettingsEditorProps) {
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);

  // Ensure settings have default values
  const nameStyle = settings.nameStyle || DEFAULT_NAME_STYLE;
  const bioStyle = settings.bioStyle || DEFAULT_BIO_STYLE;

  const handleNameStyleChange = (newStyle: TextStyleSettings) => {
    onChange({ ...settings, nameStyle: newStyle });
  };

  const handleBioStyleChange = (newStyle: TextStyleSettings) => {
    onChange({ ...settings, bioStyle: newStyle });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Pengaturan Teks
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Kustomisasi tampilan nama dan bio
      </p>

      {/* Name Settings - Collapsible */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsNameOpen(!isNameOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5" style={{ color: primaryColor }} />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Nama</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nameStyle.fontFamily}, {nameStyle.fontSize}px
              </p>
            </div>
          </div>
          {isNameOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {isNameOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <TextStyleEditor
                  label="Nama"
                  style={nameStyle}
                  onChange={handleNameStyleChange}
                  primaryColor={primaryColor}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bio Settings - Collapsible */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsBioOpen(!isBioOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5" style={{ color: primaryColor }} />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Bio</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {bioStyle.fontFamily}, {bioStyle.fontSize}px
              </p>
            </div>
          </div>
          {isBioOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {isBioOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <TextStyleEditor
                  label="Bio"
                  style={bioStyle}
                  onChange={handleBioStyleChange}
                  primaryColor={primaryColor}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DisplaySettingsEditor;
