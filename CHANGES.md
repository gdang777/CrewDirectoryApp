# Changelog

## [Unreleased]

### Layovers/Gigs Feature (Feature Complete)

- **Date**: 2026-01-21
- **Status**: **COMPLETE**
- **Description**: Full implementation of the Gigs/Layovers feature allowing aviation professionals to find and post temporary work opportunities in layover cities.
- **Backend Technical Changes**:
  - Created `Gig` entity with comprehensive fields (title, description, category, city, pay rate/type, duration, requirements, status, image, poster)
  - Created `GigApplication` entity for tracking job applications with status management (pending, accepted, rejected)
  - Implemented `GigsService` with full CRUD operations, filtering (city, category, pay range, search, status), sorting, and application management
  - Created `GigsController` with 9 RESTful API endpoints (list, get, create, update, delete, apply, applications, update status)
  - Database migration `1737497000000-AddGigsTables.ts` for `gigs` and `gig_applications` tables with foreign keys and indexes
  - DTOs: `CreateGigDto`, `UpdateGigDto`, `FindAllGigsDto`, `ApplyToGigDto` with `class-validator` validation
  - JWT authentication for all sensitive operations (create, update, delete, apply)
  - Ownership checks ensuring users can only modify their own gigs; admin users have elevated privileges
  - Added `GigsModule` to `app.module.ts`
- **Frontend Technical Changes**:
  - Created `GigCard` component with category badges, pay rate display, glassmorphic styling
  - Created `AddGigModal` component with comprehensive form (title, description, category, city, pay, duration, requirements, image upload)
  - Created `ApplyGigModal` component for job applications with optional message field
  - Created `GigsPage` with category filtering, search bar, "Post a Gig" button, and grid layout
  - Created `GigDetailsPage` with comprehensive information display, apply button, and contact poster functionality
  - Extended `api.ts` with all gig-related API methods
  - Routes configured: `/gigs` and `/gigs/:gigId` in `App.tsx`
- **Special Features**:
  - **Canadian Cities Filter**: City dropdown in `AddGigModal` shows only Canadian cities
  - **Contact Poster**: "Contact Poster" button navigates to chat room (`/chat/gig-${gig.id}`) with authentication check
  - **Redesigned Details Page**: Completely redesigned `GigDetailsPage` matching provided reference image with improved layout and visual hierarchy
  - **Consistent Theme**: All components use dark/neon glassmorphic theme matching app aesthetic
  - **Seed Data**: 5 mock gigs added across different Canadian cities with diverse categories
- **Bug Fixes**:
  - Fixed navbar Gigs link to point to `/gigs` route
  - Fixed unclickable "View Details" button on `GigCard` (removed parent `cursor: pointer`, added `pointer-events: none` to pseudo-element)
  - Fixed TypeScript compilation errors in seed script (proper category typing, removed cityCode field)
  - Fixed CSS mask compatibility issues in `GigCard.css`
- **Files Modified/Created**:
  - Backend: `gigs.service.ts`, `gigs.controller.ts`, `gigs.module.ts`, `entities/gig.entity.ts`, `entities/gig-application.entity.ts`, `dto/*.ts`, `migrations/1737497000000-AddGigsTables.ts`, `app.module.ts`, `typeorm.config.ts`, `seed-data.ts`
  - Frontend: `GigCard.tsx/css`, `AddGigModal.tsx`, `ApplyGigModal.tsx/css`, `GigsPage.tsx/css`, `GigDetailsPage.tsx/css`, `api.ts`, `App.tsx`, `Navbar.tsx`

---

### Comprehensive End-to-End Testing

- **Date**: 2026-01-20 18:51 PST
- **Status**: **COMPLETE - ISSUES FIXED**
- **Description**: Full E2E testing of all major pages and features as unauthenticated user.
- **Pages Tested**: Homepage, City Pages (CPH, LHR), Properties, Auth, Cities list, Place Details
- **Results**:
  - ✅ **Working**: City pages, Properties, Place details, Sign-in modals, Navigation, Map/List toggle
  - ✅ **Issues Fixed (5 of 6)**:
    - [FIXED] Homepage search suggestions now navigate on click
    - [FIXED] Gigs navbar link now uses React Router Link to `/cities`
    - [FIXED] Chat Join button shows sign-in modal for unauthenticated users
    - [FIXED] Auth forms now show inline validation errors
    - [FIXED] Auth page navbar now has ✈️ emoji
    - [DEFERRED] Property details map placeholder (requires implementation)

---

### UI Improvements & Fixes (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Multiple UI improvements for better user experience.
- **Technical Changes**:
  - **Removed Global Search from Navbar**: Removed `GlobalSearch` component from navbar per user feedback.
  - **Persistent Sign-In Modal**: Replaced browser `confirm()` with styled modal in `CityPage.tsx` for "Add Place" button.
  - **Clickable Feature Cards**: Made homepage feature cards clickable with proper routing:
    - Crashpads & Vacation Rentals → `/properties`
    - Layover Recommendations → `/cities`
    - Aviation Gigs → `/cities`
    - Verified Community → `/auth`

---

### Global Search in Navbar (Feature Complete - Removed)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Added global search bar to the Navbar with autocomplete for places and cities.
- **Technical Changes**:
  - Created `GlobalSearch.tsx` component with debounced search (300ms).
  - Added `GlobalSearch.css` with glassmorphic dark/neon theme styling.
  - Integrated into `Navbar.tsx` between logo and nav-links.
  - Keyboard navigation support (Arrow keys + Enter).
  - Responsive design (hidden on mobile, compact on tablet).

### Image Upload Extension (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Extended the ImageUpload component to AddPropertyModal and AddCityModal.
- **Technical Changes**:
  - Updated `AddPropertyModal.tsx` to use `ImageUpload` component instead of basic file input.
  - Added image upload to `AddCityModal.tsx` with optional city banner images.
  - Updated `PlaybooksService.createCity()` to accept `imageUrl` parameter.
  - Updated `api.ts` frontend service `createCity()` method.

---

### Personalized Recommendations (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Added personalized "Recommended for You" section to the Home Page.
- **Technical Changes**:
  - Created `UserInteraction` entity to track user behavior (views, clicks, saves).
  - Implemented `RecommendationsService` with category-based scoring algorithm.
  - Added `RecommendationsController` with endpoints for tracking and fetching recommendations.
  - Created `RecommendationsSection` frontend component.
  - Integrated interaction tracking into `PlaceCard`.

### UI Polish & Fixes

- **Date**: 2026-01-20
- **Custom Airplane Loading Animation**: Replaced generic loading spinner with animated airplane orbit loader. Applied to `CityPage`, `PlaceDetailsPage`, `ProductsPage`, `AllCitiesPage`.
- **Add Property Sign-In Prompt**: Added a styled modal that prompts unauthenticated users to sign in before adding a property listing.

### Property Details Page (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Built a comprehensive property details page accessible via "View Details" button.
- **Technical Changes**:
  - Created `PropertyDetailsPage.tsx` with hero image, amenities grid, description, house rules, and booking card.
  - Created `PropertyDetailsPage.css` with dark/neon theme styling.
  - Added route `/property/:propertyId` to `App.tsx`.
  - Updated `PropertyCard` to link to details page.

### Property Host Messaging (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Enabled potential tenants to contact property hosts via chat.
- **Technical Changes**:
  - Updated "Contact Host" button to navigate to `/chat/property-{propertyId}`.
  - Added authentication check with styled sign-in modal.
  - Integrated with existing `ChatPage` infrastructure.

---

### AI Provider Switch (Feature Skipped)

- **Date**: 2026-01-20
- **Status**: **FAILED / SKIPPED**
- **Description**: Attempted to switch AI provider from OpenAI to Perplexity/Gemini to resolve 429 quota errors.
- **Issues Encountered**:
  - Persistent connectivity and verification issues with Perplexity API.
  - Despite backend configuration updates, the integration could not be reliably verified in the UI.
  - "Offline Mode" fallback was hardened in `ItineraryService` to prevent 500 crashes, but the primary AI generation remains unstable.
- **Decision**: Feature deprioritized to focus on "Personalized Recommendations".
- **Technical Changes**:
  - Refactored `apps/api/src/modules/ai/ai.service.ts` to support multiple providers (OpenAI, Perplexity, Gemini).
  - Updated `apps/api/src/modules/ai/itinerary.service.ts` with emergency fallback logic to ensure response delivery.
  - Updated configuration in `apps/api/.env` and `.env.example`.
