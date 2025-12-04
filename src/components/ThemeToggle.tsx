// ThemeToggle Component
// Requirements: 10.1, 10.2, 10.3

import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * ThemeToggle component - Dark/light mode toggle button
 * Requirements: 10.1 - Display toggle button
 * Requirements: 10.2 - Switch to dark color scheme
 * Requirements: 10.3 - Switch to light color scheme
 */
export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
