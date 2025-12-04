// ExportButton Component
// Requirements: 8.1

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Check } from 'lucide-react';
import {
  exportUserData,
  generateExportFile,
  generateExportFilename,
  downloadExportFile,
} from '../services';

export interface ExportButtonProps {
  userId: string;
  slug: string;
  primaryColor?: string;
}

/**
 * ExportButton component - Triggers export and download of user data as JSON
 * Requirements: 8.1 - Click export button to generate JSON file
 */
export function ExportButton({
  userId,
  slug,
  primaryColor = '#3B82F6',
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Gather all user data
      const exportData = await exportUserData(userId);

      // Generate the JSON blob
      const blob = generateExportFile(exportData);

      // Generate filename with slug and date
      const filename = generateExportFilename(slug);

      // Trigger download
      downloadExportFile(blob, filename);

      // Show success state
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleExport}
        disabled={isLoading}
        className="px-4 py-3 rounded-lg font-medium text-white transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: isSuccess ? '#10B981' : primaryColor }}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        aria-label={isLoading ? 'Exporting...' : 'Export data'}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Exporting...</span>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Exported!</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExportButton;
