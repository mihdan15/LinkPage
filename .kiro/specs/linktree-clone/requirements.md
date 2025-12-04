# Requirements Document

## Introduction

Website personal link aggregator yang memungkinkan pengguna untuk menyimpan, mengelola, dan membagikan koleksi link penting mereka melalui satu URL yang mudah diingat. Mirip dengan Linktree, website ini menyediakan halaman profil publik yang menampilkan semua link pengguna dalam tampilan yang menarik dan responsif.

## Glossary

- **Link_Page**: Halaman publik yang menampilkan profil pengguna beserta daftar link yang dapat diklik
- **Link_Item**: Satu entri link yang berisi judul, URL tujuan, dan icon
- **Link_Icon**: Ikon visual yang ditampilkan di samping link (contoh: ikon Instagram, YouTube, Website)
- **Profile**: Informasi pengguna yang ditampilkan di halaman publik (nama, bio, foto)
- **Slug**: Identifier unik untuk URL halaman pengguna (contoh: /username)
- **Dashboard**: Area admin untuk mengelola link dan pengaturan profil
- **Supabase**: Backend-as-a-Service yang menyediakan database PostgreSQL dan authentication secara gratis
- **Theme**: Konfigurasi tampilan visual halaman publik (warna, background)
- **Shared_Notepad**: Area teks publik yang bisa digunakan siapapun untuk menyimpan catatan sementara

## Requirements

### Requirement 1

**User Story:** As a user, I want to create and manage my link collection, so that I can organize all my important links in one place.

#### Acceptance Criteria

1. WHEN a user adds a new link with title, URL, and icon THEN the Link_Page SHALL store the link and display it in the link list with the selected icon
2. WHEN a user edits an existing link THEN the Link_Page SHALL update the link information and reflect changes immediately
3. WHEN a user deletes a link THEN the Link_Page SHALL remove the link from storage and from the displayed list
4. WHEN a user reorders links via drag-and-drop THEN the Link_Page SHALL persist the new order and display links in that sequence
5. IF a user attempts to add a link with an invalid URL format THEN the Link_Page SHALL reject the submission and display a validation error message
6. WHEN a user selects an icon for a link THEN the Link_Page SHALL display that icon alongside the link title on the public page
7. WHEN a user toggles a link's visibility THEN the Link_Page SHALL update the link status and hide disabled links from the public page
8. WHEN a user views the Dashboard THEN the Dashboard SHALL display both enabled and disabled links with clear visual distinction
9. WHEN adding or editing a link THEN the Dashboard SHALL provide a selection of predefined icons (social media, general categories) for the user to choose from
10. WHEN a user prefers a custom icon THEN the Dashboard SHALL allow the user to input an external image URL as the link icon
11. WHEN a custom icon URL is provided THEN the Link_Page SHALL display the external image as the link icon

### Requirement 2

**User Story:** As a user, I want to customize my profile information, so that visitors can identify me and understand who I am.

#### Acceptance Criteria

1. WHEN a user updates their display name THEN the Profile SHALL save the new name and show it on the Link_Page
2. WHEN a user updates their bio text THEN the Profile SHALL save the bio (maximum 150 characters) and display it below the name
3. WHEN a user uploads a profile picture THEN the Profile SHALL store the image and display it as a circular avatar on the Link_Page
4. WHEN a user sets a custom slug THEN the Link_Page SHALL be accessible via that unique URL path
5. IF a user attempts to set a slug that already exists THEN the Profile SHALL reject the change and display an error message

### Requirement 3

**User Story:** As a visitor, I want to view a user's link page and click on their links, so that I can access the resources they have shared.

#### Acceptance Criteria

1. WHEN a visitor accesses a valid slug URL THEN the Link_Page SHALL display the user's profile and all active links
2. WHEN a visitor clicks on a link THEN the Link_Page SHALL redirect the visitor to the target URL in a new browser tab
3. WHEN a visitor accesses the Link_Page on a mobile device THEN the Link_Page SHALL render responsively with touch-friendly link buttons
4. IF a visitor accesses an invalid or non-existent slug THEN the Link_Page SHALL display a 404 error page with a friendly message
5. WHEN a Link_Page contains more than five links THEN the Link_Page SHALL display a search input field
6. WHEN a visitor types in the search field THEN the Link_Page SHALL filter and display only links whose titles contain the search text

### Requirement 9

**User Story:** As a visitor, I want to use a shared notepad on the link page, so that I can temporarily store and retrieve text across different devices.

#### Acceptance Criteria

1. WHEN a visitor views a Link_Page THEN the Link_Page SHALL display a shared notepad textarea at the bottom of the page
2. WHEN a visitor types in the shared notepad THEN the System SHALL save the text to the database in real-time
3. WHEN a visitor views the Link_Page from any device THEN the Link_Page SHALL display the most recent saved note content
4. WHEN a visitor clicks the copy button on the notepad THEN the System SHALL copy the note content to the clipboard
5. WHEN a visitor clears the notepad THEN the System SHALL remove the note content from the database
6. WHEN the notepad content exceeds 5000 characters THEN the System SHALL prevent further input and display a character limit warning

### Requirement 6

**User Story:** As a user, I want to track how many people visit my link page and click my links, so that I can understand my audience engagement.

#### Acceptance Criteria

1. WHEN a visitor views the Link_Page THEN the System SHALL increment the page view counter for that user's profile
2. WHEN a visitor clicks on a Link_Item THEN the System SHALL increment the click counter for that specific link
3. WHEN a user views their Dashboard THEN the Dashboard SHALL display the total page view count
4. WHEN a user views their Dashboard THEN the Dashboard SHALL display the click count for each individual link
5. WHEN tracking a page view or click THEN the System SHALL record the timestamp of the event
6. WHEN a user views their Dashboard THEN the Dashboard SHALL display analytics data including views and clicks in a summary section

### Requirement 4

**User Story:** As a user, I want to share my link page easily, so that others can find and access my links.

#### Acceptance Criteria

1. WHEN a user views their Dashboard THEN the Dashboard SHALL display their shareable link URL prominently
2. WHEN a user clicks the copy button THEN the Dashboard SHALL copy the link URL to the clipboard and show a confirmation message
3. WHEN a user shares their link page THEN the Link_Page SHALL display proper Open Graph meta tags for social media previews

### Requirement 5

**User Story:** As a developer, I want the link data to be stored and retrieved reliably, so that users' links persist across sessions.

#### Acceptance Criteria

1. WHEN link data is saved THEN the System SHALL serialize the data to JSON format for storage
2. WHEN link data is loaded THEN the System SHALL deserialize the JSON data back to application objects
3. WHEN serializing and then deserializing link data THEN the System SHALL produce data equivalent to the original input (round-trip consistency)
4. WHEN the System parses stored JSON data THEN the System SHALL validate it against the expected schema
5. IF stored data is corrupted or invalid THEN the System SHALL handle the error gracefully and display an appropriate message

### Requirement 7

**User Story:** As a user, I want to customize the appearance of my link page, so that it reflects my personal brand and style.

#### Acceptance Criteria

1. WHEN a user selects a theme color THEN the Link_Page SHALL apply that color to buttons and accent elements
2. WHEN a user selects a background style THEN the Link_Page SHALL display the chosen background on the public page
3. WHEN a user saves theme settings THEN the System SHALL persist the theme configuration to the database
4. WHEN a visitor views the Link_Page THEN the Link_Page SHALL render with the user's custom theme settings

### Requirement 10

**User Story:** As a visitor, I want to toggle between dark and light mode, so that I can view the page comfortably based on my preference.

#### Acceptance Criteria

1. WHEN a visitor views the Link_Page THEN the Link_Page SHALL display a dark/light mode toggle button
2. WHEN a visitor clicks the dark mode toggle THEN the Link_Page SHALL switch to dark color scheme with appropriate contrast
3. WHEN a visitor clicks the light mode toggle THEN the Link_Page SHALL switch to light color scheme
4. WHEN a visitor sets a mode preference THEN the System SHALL store the preference in browser local storage
5. WHEN a visitor returns to the Link_Page THEN the Link_Page SHALL apply the previously saved mode preference
6. WHEN no preference is saved THEN the Link_Page SHALL default to the system color scheme preference

### Requirement 11

**User Story:** As a user, I want my link page to have a modern and polished UI design, so that visitors have a professional and pleasant experience.

#### Acceptance Criteria

1. WHEN the Link_Page is rendered THEN the UI SHALL display smooth animations and transitions for interactive elements
2. WHEN links are displayed THEN the Link_Page SHALL show hover effects with subtle shadows and scale transformations
3. WHEN the page loads THEN the Link_Page SHALL display a staggered fade-in animation for link items
4. WHEN buttons are interacted with THEN the UI SHALL provide visual feedback through color transitions and micro-animations
5. WHEN the Dashboard is rendered THEN the UI SHALL use consistent spacing, typography hierarchy, and visual balance
6. WHEN displaying icons THEN the UI SHALL use a consistent icon library with proper sizing and alignment

### Requirement 8

**User Story:** As a user, I want to export my link data, so that I can backup or migrate my links to another platform.

#### Acceptance Criteria

1. WHEN a user clicks the export button THEN the Dashboard SHALL generate a JSON file containing all link data
2. WHEN exporting data THEN the System SHALL include profile information, all links, and their settings in the export file
3. WHEN the export file is downloaded THEN the System SHALL name the file with the user's slug and current date
