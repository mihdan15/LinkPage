// ShareSection Component
// Requirements: 4.1, 4.2

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '../../contexts';

export interface ShareSectionProps {
  slug: string;
  baseUrl?: string;
  primaryColor?: string;
}

export function ShareSection({ slug, baseUrl = window.location.origin, primaryColor = '#3B82F6' }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const shareableUrl = `${baseUrl}/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenLink = () => window.open(shareableUrl, '_blank', 'noopener,noreferrer');

  return (
    <div className="relative">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Link className="w-5 h-5" style={{ color: primaryColor }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Link Page</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share this URL with your audience to showcase all your links in one place.</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            <p className="text-gray-900 dark:text-white font-medium truncate">{shareableUrl}</p>
          </div>
          <motion.button onClick={handleCopy} className="px-4 cursor-pointer py-3 rounded-lg font-medium text-white transition-all flex items-center gap-2 min-w-[100px] justify-center" style={{ backgroundColor: copied ? '#10B981' : primaryColor }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><Check className="w-4 h-4" /><span>Copied!</span></motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><Copy className="w-4 h-4" /><span>Copy</span></motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button onClick={handleOpenLink} className="p-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} title="Open link in new tab">
            <ExternalLink className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
