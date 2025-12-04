// AnalyticsSummary Component
// Requirements: 6.3, 6.4, 6.6

import { motion } from 'framer-motion';
import { Eye, MousePointer, TrendingUp, BarChart3 } from 'lucide-react';
import type { LinkAnalytics } from '../types';

export interface AnalyticsSummaryProps {
  totalViews: number;
  totalClicks: number;
  linkStats: LinkAnalytics[];
  primaryColor?: string;
}

/**
 * Formats a number with K/M suffix for large numbers
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * AnalyticsSummary component - Displays analytics overview
 * Requirements: 6.3 - Display total page view count
 * Requirements: 6.4 - Display click count for each link
 * Requirements: 6.6 - Display analytics in summary section
 */
export function AnalyticsSummary({
  totalViews,
  totalClicks,
  linkStats,
  primaryColor = '#3B82F6',
}: AnalyticsSummaryProps) {
  // Calculate click-through rate
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  // Sort links by click count for top performers
  const sortedLinks = [...linkStats].sort((a, b) => b.clickCount - a.clickCount);
  const topLinks = sortedLinks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Views Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Eye className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(totalViews)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Total Clicks Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#10B98120' }}
            >
              <MousePointer className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(totalClicks)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Click-Through Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#F59E0B20' }}
            >
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ctr}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Per-Link Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" style={{ color: primaryColor }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Link Performance
          </h3>
        </div>

        {linkStats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No link data available yet. Add some links to see their performance!
          </p>
        ) : (
          <div className="space-y-3">
            {topLinks.map((link, index) => {
              // Calculate percentage of total clicks
              const percentage =
                totalClicks > 0
                  ? Math.round((link.clickCount / totalClicks) * 100)
                  : 0;

              return (
                <motion.div
                  key={link.linkId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  {/* Rank */}
                  <span className="w-6 text-sm font-medium text-gray-400 dark:text-gray-500">
                    #{index + 1}
                  </span>

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {link.title}
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Click Count */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatNumber(link.clickCount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Show more indicator */}
            {linkStats.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                +{linkStats.length - 5} more links
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AnalyticsSummary;
