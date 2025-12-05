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
 * Profile header skeleton - matches ProfileHeader component
 */
export function ProfileHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center text-center mb-8"
    >
      {/* Avatar - w-40 h-40 like actual ProfileHeader */}
      <Skeleton className="w-40 h-40 rounded-full mb-4" />
      {/* Name */}
      <Skeleton className="h-8 w-48 mb-2" />
      {/* Bio */}
      <Skeleton className="h-4 w-72 mb-1" />
      <Skeleton className="h-4 w-56" />
      {/* Social icons */}
      <div className="flex gap-3 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-full" />
        ))}
      </div>
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
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
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
 * Search bar skeleton
 */
export function SearchBarSkeleton() {
  return (
    <div className="relative w-full mb-6">
      <Skeleton className="w-full h-12 rounded-xl" />
    </div>
  );
}

/**
 * Notepad skeleton
 */
export function NotepadSkeleton() {
  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
      <Skeleton className="w-full h-32 rounded-xl" />
      <div className="flex justify-between mt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Full page skeleton for LinkPage - matches actual LinkPage layout
 */
export function LinkPageSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col">
        {/* Profile Header Skeleton - larger avatar like actual page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center mb-8"
        >
          {/* Avatar - w-40 h-40 like ProfileHeader */}
          <Skeleton className="w-40 h-40 rounded-full mb-4" />
          {/* Name */}
          <Skeleton className="h-8 w-48 mb-2" />
          {/* Bio */}
          <Skeleton className="h-4 w-72 mb-1" />
          <Skeleton className="h-4 w-56" />
          {/* Social icons */}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </motion.div>

        {/* Search Bar Skeleton */}
        <SearchBarSkeleton />

        {/* Links Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Skeleton className="w-full h-14 rounded-xl" />
            </motion.div>
          ))}
        </div>

        {/* Notepad Skeleton */}
        <NotepadSkeleton />
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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-12 rounded-lg" />
          ))}
        </div>
      </div>
      
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
