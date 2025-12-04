// Skeleton Components for Loading States
// Requirements: 11.1

import { motion } from 'framer-motion';

/**
 * Base skeleton component with shimmer animation
 */
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
}

/**
 * Profile header skeleton
 */
export function ProfileHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center mb-8"
    >
      {/* Avatar skeleton */}
      <Skeleton className="w-24 h-24 rounded-full mb-4" />
      
      {/* Name skeleton */}
      <Skeleton className="h-7 w-40 mb-2" />
      
      {/* Bio skeleton */}
      <Skeleton className="h-4 w-64 mb-1" />
      <Skeleton className="h-4 w-48" />
    </motion.div>
  );
}

/**
 * Link card skeleton
 */
export function LinkCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        {/* Icon skeleton */}
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        
        {/* Title skeleton */}
        <Skeleton className="h-5 flex-1" />
      </div>
    </motion.div>
  );
}

/**
 * Multiple link cards skeleton
 */
interface LinkListSkeletonProps {
  count?: number;
}

export function LinkListSkeleton({ count = 4 }: LinkListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <LinkCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton for LinkPage
 */
export function LinkPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-lg mx-auto px-4 py-12">
        <ProfileHeaderSkeleton />
        <LinkListSkeleton count={4} />
      </div>
    </div>
  );
}

/**
 * Dashboard content skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Share section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
      
      {/* Tab navigation skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-12 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <LinkListSkeleton count={3} />
      </div>
    </div>
  );
}

/**
 * Analytics skeleton
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      
      {/* Link stats skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
