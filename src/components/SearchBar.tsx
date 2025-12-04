// SearchBar Component
// Requirements: 3.5, 3.6

import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  primaryColor?: string;
}

/**
 * SearchBar component - Search input with icon and clear button
 * Requirements: 3.5 - Display search input when more than 5 links
 * Requirements: 3.6 - Filter links by title
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search links...',
  primaryColor = '#3B82F6',
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <motion.div
      className="relative w-full  mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* Input - Touch-friendly with min height */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 min-h-[48px] rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base"
        style={{
          '--tw-ring-color': primaryColor,
        } as React.CSSProperties}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '';
        }}
      />

      {/* Clear Button - Touch-friendly */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SearchBar;
