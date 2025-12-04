# Implementation Plan

- [x] 1. Project Setup and Configuration





  - [x] 1.1 Initialize React + TypeScript + Vite project


    - Create new Vite project with React and TypeScript template
    - Configure TypeScript strict mode
    - _Requirements: 5.1_
  - [x] 1.2 Install and configure dependencies


    - Install Tailwind CSS, Framer Motion, Lucide React, React Query
    - Install Supabase client library
    - Install Vitest and fast-check for testing
    - Configure Tailwind with custom theme colors
    - _Requirements: 11.1, 11.5_
  - [x] 1.3 Set up Supabase project and database schema


    - Create Supabase project
    - Execute SQL schema for profiles, links, analytics_events, notepads tables
    - Configure Row Level Security policies
    - _Requirements: 5.1, 5.2_
  - [x] 1.4 Create project folder structure


    - Set up src/components, src/pages, src/services, src/hooks, src/types, src/utils directories
    - Create index files for each directory
    - _Requirements: 5.1_

- [x] 2. Core Types and Utilities





  - [x] 2.1 Define TypeScript interfaces and types


    - Create Profile, LinkItem, Theme, AnalyticsData interfaces
    - Create form input types (CreateLinkInput, UpdateLinkInput, etc.)
    - _Requirements: 5.1, 5.2_

  - [x] 2.2 Implement validation utilities

    - Create URL validation function
    - Create bio length validation function
    - Create slug format validation function
    - _Requirements: 1.5, 2.2, 2.4_
  - [ ]* 2.3 Write property tests for validation utilities
    - **Property 4: URL Validation Rejects Invalid URLs**
    - **Property 6: Bio Length Validation**
    - **Validates: Requirements 1.5, 2.2**

  - [x] 2.4 Implement serialization utilities

    - Create JSON serialization functions for LinkItem and Profile
    - Create schema validation function
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ]* 2.5 Write property tests for serialization
    - **Property 13: Link Data Serialization Round-Trip**
    - **Property 14: Schema Validation Rejects Invalid Data**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 3. Supabase Service Layer





  - [x] 3.1 Create Supabase client configuration


    - Set up Supabase client with environment variables
    - Create typed database client
    - _Requirements: 5.1_

  - [x] 3.2 Implement Profile Service

    - Create getProfileBySlug function
    - Create updateProfile function
    - Create checkSlugAvailability function
    - Create uploadAvatar function
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1_
  - [ ]* 3.3 Write property tests for Profile Service
    - **Property 7: Slug Uniqueness Enforcement**
    - **Property 8: Profile Retrieval by Slug**
    - **Validates: Requirements 2.5, 3.1, 3.4**

  - [x] 3.4 Implement Link Service

    - Create getLinks function
    - Create createLink function
    - Create updateLink function
    - Create deleteLink function
    - Create reorderLinks function
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7_
  - [ ]* 3.5 Write property tests for Link Service
    - **Property 1: Link Addition Grows List**
    - **Property 2: Link Deletion Removes from List**
    - **Property 3: Link Reorder Preserves Content**
    - **Property 5: Disabled Links Hidden from Public View**
    - **Validates: Requirements 1.1, 1.3, 1.4, 1.7**
  - [x] 3.6 Implement Analytics Service


    - Create recordPageView function
    - Create recordLinkClick function
    - Create getAnalytics function
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 3.7 Write property tests for Analytics Service
    - **Property 12: Analytics Counter Increment**
    - **Validates: Requirements 6.1, 6.2**

  - [x] 3.8 Implement Notepad Service


    - Create getNoteContent function
    - Create saveNoteContent function with real-time sync
    - Create clearNote function
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6_
  - [ ]* 3.9 Write property tests for Notepad Service
    - **Property 10: Notepad Content Persistence Round-Trip**
    - **Property 11: Notepad Character Limit Enforcement**
    - **Validates: Requirements 9.2, 9.3, 9.6**

- [x] 4. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. UI Components - Core





  - [x] 5.1 Create ThemeToggle component


    - Implement dark/light mode toggle button with icon
    - Store preference in localStorage
    - Apply system preference as default
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  - [ ]* 5.2 Write property tests for ThemeToggle
    - **Property 16: Dark Mode Preference Persistence**
    - **Validates: Requirements 10.4, 10.5**

  - [x] 5.3 Create ProfileHeader component

    - Display avatar, name, bio with theme colors
    - Implement circular avatar with fallback
    - Add smooth fade-in animation
    - _Requirements: 2.1, 2.2, 2.3, 11.1, 11.3_

  - [x] 5.4 Create LinkCard component

    - Display link with icon, title, hover effects
    - Implement scale and shadow animations on hover
    - Handle click to open URL in new tab
    - _Requirements: 1.6, 3.2, 11.2, 11.4_

  - [x] 5.5 Create SearchBar component

    - Implement search input with icon
    - Add clear button functionality
    - Style with theme colors
    - _Requirements: 3.5, 3.6_
  - [ ]* 5.6 Write property tests for search filtering
    - **Property 9: Search Filter Correctness**
    - **Validates: Requirements 3.6**

  - [x] 5.7 Create SharedNotepad component

    - Implement textarea with character counter
    - Add copy and clear buttons
    - Implement real-time save with debounce
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6_

  - [x] 5.8 Create IconPicker component

    - Display grid of predefined icons (social media, general)
    - Allow custom URL input option
    - Show selected icon preview
    - _Requirements: 1.9, 1.10, 1.11_

- [-] 6. UI Components - Dashboard



  - [x] 6.1 Create LinkForm component


    - Implement form with title, URL, icon picker inputs
    - Add URL validation with error display
    - Support create and edit modes
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

  - [x] 6.2 Create DraggableLinkList component

    - Implement drag-and-drop reordering
    - Show enabled/disabled visual distinction
    - Add edit, delete, toggle buttons per link
    - _Requirements: 1.4, 1.7, 1.8_

  - [x] 6.3 Create AnalyticsSummary component

    - Display total views and clicks
    - Show per-link click counts
    - Style with cards and icons
    - _Requirements: 6.3, 6.4, 6.6_
  - [x] 6.4 Create ProfileEditor component













    - Implement name, bio, slug, avatar editing
    - Add bio character counter (150 max)
    - Implement slug availability check
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 6.5 Create ThemeEditor component





    - Implement color picker for theme color
    - Add background type selector (solid, gradient)
    - Show live preview
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]* 6.6 Write property tests for Theme persistence
    - **Property 15: Theme Settings Persistence**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  - [x] 6.7 Create ShareSection component





    - Display shareable URL prominently
    - Implement copy button with confirmation toast
    - _Requirements: 4.1, 4.2_

- [x] 7. Export Feature





  - [x] 7.1 Implement Export Service


    - Create exportUserData function to gather all data
    - Create generateExportFile function to create JSON blob
    - Generate filename with slug and date
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]* 7.2 Write property tests for Export
    - **Property 17: Export Data Completeness**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  - [x] 7.3 Create ExportButton component


    - Trigger export and download JSON file
    - Show loading state during export
    - _Requirements: 8.1_

- [x] 8. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Pages and Routing



  - [x] 9.1 Set up React Router


    - Configure routes for /, /dashboard, /:slug, /404
    - Implement route guards for dashboard
    - _Requirements: 2.4, 3.1_

  - [x] 9.2 Create LinkPage (public page)
    - Fetch profile and links by slug
    - Render ProfileHeader, LinkCards, SearchBar, SharedNotepad
    - Implement staggered animation for links
    - Record page view on load

    - _Requirements: 3.1, 3.3, 3.5, 6.1, 11.3_
  - [x] 9.3 Create Dashboard page
    - Integrate all dashboard components
    - Implement tab navigation (Links, Profile, Theme, Analytics)

    - Add responsive layout
    - _Requirements: 1.8, 4.1, 6.6, 11.5_
  - [x] 9.4 Create NotFound (404) page
    - Design friendly 404 message

    - Add link back to home
    - _Requirements: 3.4_
  - [x] 9.5 Implement Open Graph meta tags

    - Generate dynamic OG tags based on profile
    - Include og:title, og:description, og:image
    - _Requirements: 4.3_
  - [ ]* 9.6 Write property tests for Open Graph generation
    - **Property 18: Open Graph Meta Tags Generation**
    - **Validates: Requirements 4.3**

- [x] 10. Final Polish and Integration



  - [x] 10.1 Implement global dark/light mode context


    - Create ThemeContext provider
    - Apply theme to all pages
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 10.2 Add loading states and skeletons


    - Create skeleton components for profile, links
    - Show loading indicators during data fetch
    - _Requirements: 11.1_


  - [x] 10.3 Implement toast notifications
    - Add success/error toasts for actions

    - Style consistently with theme
    - _Requirements: 1.5, 2.5, 4.2_
  - [x] 10.4 Final responsive design review

    - Test on mobile, tablet, desktop viewports
    - Ensure touch-friendly buttons
    - _Requirements: 3.3, 11.5_
  - [x] 10.5 Add consistent icon usage with Lucide



    - Replace any inconsistent icons
    - Ensure proper sizing and alignment
    - _Requirements: 11.6_

- [x] 11. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
