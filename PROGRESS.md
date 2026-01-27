# Crew Lounge - Development Progress

> **Last Updated:** 2026-01-27 (AI Integration Fix)  
> **Status:** Active Development

---

## 📋 Project Overview

**Crew Lounge** is a city-centric, user-generated directory for aviation professionals. It enables crew members to discover and contribute places (eat, drink, shop, visit), properties (crashpads, vacation rentals), and gigs (temporary work opportunities) in various layover cities.

---

## ✅ Completed Features

### 1. Database & Backend Infrastructure

- [x] **Supabase Integration** - Cloud PostgreSQL database connected
- [x] **Database Schema** - Tables created via TypeORM (cities, users, playbooks, POIs, products, etc.)
- [x] **Seed Data** - 5 cities (Copenhagen, Bangkok, Dubai, New York, London) + 6 products
- [x] **Environment Configuration** - DATABASE_URL with SSL support for cloud connections
- [x] **Image Upload System** - Supabase Storage integration for file uploads ✨ NEW

### 2. Authentication (Full Stack) ✨ NEW

- [x] **User Registration** - Sign up with email, password, name, and optional airline
- [x] **User Login** - Email/password authentication with JWT tokens
- [x] **Password Hashing** - Secure bcrypt hashing (10 rounds)
- [x] **JWT Tokens** - 7-day expiry, secure token generation and validation
- [x] **Protected Routes** - JwtAuthGuard for securing endpoints
- [x] **Profile Endpoint** - GET /auth/profile returns current user
- [x] **AuthPage UI** - Login and Sign Up forms with error/success feedback
- [x] **AuthContext** - React context for app-wide auth state management
- [x] **Token Persistence** - Tokens saved to localStorage

### 3. City Directory

- [x] **HomePage** - City grid with 6 featured cities
- [x] **CityPage** - Category tabs (Eat, Drink, Shop, Visit) with place listings
- [x] **AllCitiesPage** - Displays all cities from database via API
- [x] **View All Cities Button** - Links from HomePage to AllCitiesPage
- [x] **Add City Feature** - Modal to add new cities to database

### 4. Places System

- [x] **PlaceCard** - Visual cards with images, ratings, category badges
- [x] **PlaceDetailsPage** - Hero image, stats, description, tips, comments section
- [x] **Voting System** - Upvote/downvote on places (frontend state)
- [x] **Comments** - Add and display comments on places (frontend state)

### 5. Properties Feature

- [x] **PropertiesPage** - Tabbed navigation (Crashpads, Vacation Rentals)
- [x] **PropertyCard** - Property listings with images
- [x] **AddPropertyModal** - Form for adding new properties

### 6. API Integration

- [x] **API Service** (`apps/web/src/services/api.ts`) - Full API client with:
  - Auth methods (login, signup, logout, profile)
  - Cities CRUD operations
  - Playbooks/Places CRUD
  - Voting system
  - Admin endpoints (stats, users, listings)
  - User endpoints (profile, saved listings)
- [x] **React Hooks** (`useCities.ts`) - Data fetching with refetch capability

### 7. User Profiles & Dashboards

- [x] **User Roles** - Three roles: User, Admin, Moderator
- [x] **RolesGuard & Decorator** - Role-based access control for API endpoints
- [x] **User Dashboard** - Profile, stats, listings, saved places
- [x] **Admin Dashboard** - Stats, user management, listings overview
- [x] **Profile Editor** - Update name and airline
- [x] **Saved Listings** - Save/unsave places functionality
- [x] **Protected Routes** - Role-based frontend routing
- [x] **Seeded Admin User** - admin@crewlounge.com / admin123

### 8. Places API & Persistence ✨ NEW

- [x] **Place Entity** - Name, description, tips, category, city relation, ratings
- [x] **Comments with Ratings** - Users can leave reviews with 1-5 star ratings
- [x] **Voting Persistence** - Upvote/downvote with toggle, database stored
- [x] **Places Endpoints** - Full CRUD, filtering by city/category
- [x] **StarRating Component** - Reusable display + interactive mode
- [x] **Enhanced PlaceDetailsPage** - API integration, voting, comments, glassmorphism
- [x] **CityPage API Integration** - Real places from database
- [x] **10 Seeded Places** - Copenhagen, Bangkok, Dubai, New York
- [x] **Add Place Feature** - UI for users to submit new places
- [x] **Interactive Map** - Leaflet-based map showing places on CityPage and PlaceDetailsPage

### 9. Shopping Guide (Module B) ✨ NEW

- [x] **ProductsPage** - Shopping guide with city comparisons
- [x] **Price Comparison** - Compare home base prices with layover city
- [x] **ProductAPI** - Endpoints for fetching products and price deltas
- [x] **ProductCard** - Visual display of products with price difference

### 10. Crew Chat (Module C) ✨ NEW

- [x] **ChatPage** - Real-time chat functionality
- [x] **City Rooms** - Dedicated chat rooms for each city
- [x] **Socket.io Integration** - Real-time message delivery
- [x] **Participant List** - See who else is in the room

### 11. Image Upload System ✨ NEW

- [x] **UploadModule** - Backend module for file uploads
- [x] **Supabase Storage Integration** - Cloud storage for images
- [x] **ImageUpload Component** - Reusable drag-and-drop upload UI
- [x] **File Validation** - Type (JPEG, PNG, WebP, GIF) and size (5MB max) checks
- [x] **Protected Upload Endpoint** - POST /upload/image with JWT authentication
- [x] **Delete Endpoint** - DELETE /upload/image for cleanup
- [x] **AddPlaceModal Integration** - Replace URL input with drag-and-drop upload
- [x] **Database Fields** - imageUrl for cities, avatarUrl for users
- [x] **Unique Filenames** - UUID + timestamp to prevent collisions
- [x] **Organized Storage** - Categorized folders (places/, cities/, avatars/, properties/)

### 12. Search & Filter Features ✨ NEW

- [x] **PostgreSQL Full-Text Search** - tsvector columns with weighted search
- [x] **GIN Indexes** - Fast full-text search queries
- [x] **Auto-Update Triggers** - search_vector updates automatically
- [x] **Text Search** - Search places by name, description, tips, address
- [x] **Rating Filter** - Filter by minimum rating (2+, 3+, 4+ stars)
- [x] **Multiple Sort Options** - Sort by rating, popular, newest, oldest
- [x] **Distance Search** - PostGIS radius search (ready for geolocation)
- [x] **Enhanced API** - 13 query parameters for advanced filtering
- [x] **CityPage Integration** - Search input, rating filter, sort dropdown
- [x] **Backend-Driven Filtering** - Moved from client-side to server-side
- [x] **Pagination-Ready** - limit/offset parameters for infinite scroll
- [x] **Glassmorphic UI** - Matches existing dark/neon design aesthetic

### 13. Layovers/Gigs Feature ✨ NEW

- [x] **Backend Implementation**
  - `Gig` entity with title, description, category, city, pay rate/type, duration, requirements, status, image URL, and poster information
  - `GigApplication` entity tracking user applications with message and status (pending, accepted, rejected)
  - `GigsService` with comprehensive CRUD operations, filtering, sorting, and application management
  - `GigsController` with RESTful API endpoints for all gig operations
  - Database migration for `gigs` and `gig_applications` tables with foreign keys and indexes
  - DTOs with `class-validator` for robust input validation
  - JWT-protected endpoints for creating, updating, and applying to gigs
  - Ownership checks ensuring users can only modify their own gigs
- [x] **Frontend Implementation**
  - `GigCard` component displaying gig summaries with category icons and glassmorphic styling
  - `AddGigModal` for posting new gig listings with comprehensive form fields
  - `ApplyGigModal` for submitting job applications with optional message
  - `GigsPage` with category filtering, search bar, and grid layout
  - `GigDetailsPage` with comprehensive gig information and apply functionality
  - API service integration for all gig-related operations
  - Routing configured for `/gigs` and `/gigs/:gigId`
- [x] **Special Features**
  - Canadian cities filter - City dropdown restricted to Canadian cities only
  - Contact poster button - Navigate to chat with gig poster from details page
  - Redesigned details page matching provided reference image
  - Dark/neon glassmorphic theme consistent across all components
  - 5 mock gigs seeded across different Canadian cities
- [x] **Bug Fixes**
  - Fixed navbar Gigs link to point to correct route
  - Fixed unclickable "View Details" button on GigCard (CSS pointer-events issue)
  - Fixed TypeScript compilation errors in seed script

**API Endpoints:**

| Endpoint                        | Method | Description                                       |
| ------------------------------- | ------ | ------------------------------------------------- |
| `/gigs`                         | GET    | List gigs with filtering and sorting              |
| `/gigs/:id`                     | GET    | Get single gig with applications                  |
| `/gigs`                         | POST   | Create new gig (JWT protected)                    |
| `/gigs/:id`                     | PATCH  | Update gig (JWT protected, owner/admin only)      |
| `/gigs/:id`                     | DELETE | Delete gig (JWT protected, owner/admin only)      |
| `/gigs/:id/apply`               | POST   | Apply to gig (JWT protected)                      |
| `/gigs/applications/me`         | GET    | Get user's applications (JWT protected)           |
| `/gigs/:id/applications`        | GET    | Get gig applications (JWT protected, poster only) |
| `/gigs/applications/:id/status` | PATCH  | Update application status (JWT protected)         |

---

## 🔄 In Progress

_No features currently in progress_

---

## 📝 Planned Features (Not Started)

### High Priority

- [ ] **Search Autocomplete** - Suggestions as you type (enhanced version)

### Medium Priority

- [ ] **Advanced Filters** - Distance filter with geolocation, price range
- [ ] **Moderator Dashboard** - Content moderation queue

### Lower Priority

- [ ] **Mobile App Parity** - React Native app features
- [ ] **Push Notifications** - New comments, votes, etc.
- [ ] **Email Verification** - Verify airline email addresses

---

## 🐛 Known Issues

| Issue                                      | Priority | Status | Notes                                                 |
| ------------------------------------------ | -------- | ------ | ----------------------------------------------------- |
| Homepage search suggestions don't navigate | High     | Fixed  | Added click handlers with `useNavigate`               |
| Gigs navbar link broken                    | High     | Fixed  | Changed to React Router `Link` to `/cities`           |
| Chat Join button unresponsive              | Medium   | Fixed  | Added sign-in modal for unauthenticated users         |
| Auth form validation missing               | Medium   | Fixed  | Added client-side validation with inline errors       |
| Logo emoji inconsistency                   | Low      | Fixed  | Added ✈️ to AuthPage navbar                           |
| Property details map placeholder           | Low      | Open   | Shows "Map coming soon" - requires map implementation |

---

## 📜 Change Log

### 2026-01-27 - AI Itinerary Integration with Gemini 2.5 Flash ✨ NEW

**Fixed:**

- AI itinerary generator now uses **Gemini 2.5 Flash** instead of OpenAI
- JSON response truncation fixed by increasing `AI_MAX_TOKENS` to 4000
- Removed unsupported `response_format` option for Gemini compatibility
- Added robust markdown JSON extraction for parsing responses

**Result:**

- AI generates real, personalized itineraries with specific places (Nyhavn, Torvehallerne, Amalienborg, Rundetårn)
- No more "Offline Mode" fallback when Gemini API is configured

**Files Modified:**

- `apps/api/.env` - Gemini provider configuration
- `apps/api/src/modules/ai/ai.service.ts` - Multi-provider support + JSON parsing

---

### 2026-01-20 18:51 PST - Comprehensive End-to-End Testing

**Testing Scope:**

- Homepage, City Pages (CPH, LHR), Properties, Auth, Cities list, Place Details
- Tested as unauthenticated user

**✅ Features Verified Working:**

- City pages with category tabs, search, map/list toggle
- Properties page with filtering and search
- Place details with voting and reviews (auth-gated correctly)
- Sign-in modals for protected actions (Add Place, Add Property)
- Navigation between all pages
- All Cities grid display and card navigation
- Plan My Layover AI modal

**⚠️ Issues Found (6 total):**

| Issue                             | Priority | Location            |
| --------------------------------- | -------- | ------------------- |
| Search suggestions don't navigate | High     | Homepage            |
| Gigs navbar link → `/#about`      | High     | Navbar              |
| Chat Join button unresponsive     | Medium   | City Page Chats tab |
| Auth validation missing           | Medium   | Auth Page           |
| Logo missing emoji                | Low      | Auth Page navbar    |
| Map placeholder                   | Low      | Property Details    |

**Recordings:** See `/walkthrough.md` for browser session recordings.

---

### 2026-01-20 - UI Improvements & Fixes

**Added:**

- **Persistent Sign-In Modal** - Replaced browser `confirm()` dialog with styled modal
  - Glassmorphic design matching app theme
  - "Maybe Later" and "Sign In" buttons
  - Appears when unauthenticated users click "Add Place" on CityPage
  - Modal persists until user dismisses it
- **Clickable Feature Cards** - Made homepage feature cards navigable
  - Crashpads & Vacation Rentals → `/properties`
  - Layover Recommendations → `/cities`
  - Aviation Gigs → `/cities`
  - Verified Community → `/auth`

**Removed:**

- **Global Search from Navbar** - Removed GlobalSearch component from navbar per user feedback
  - Component files (`GlobalSearch.tsx`, `GlobalSearch.css`) remain in codebase for potential future use

**Changed:**

- `CityPage.tsx` - Added `showSignInModal` state and styled modal JSX
- `HomePage.tsx` - Wrapped feature cards with `Link` components

---

### 2026-01-19 - Search & Filter Features

**Added:**

- **PostgreSQL Full-Text Search** - Database migration: `AddFullTextSearch`
  - `search_vector` tsvector column on places and cities tables
  - GIN indexes for fast full-text search
  - Auto-update triggers to maintain search vectors
  - Weighted search: name (A), description (B), tips (C), address (D)
- **Enhanced Places API** - 13 query parameters
  - `search` - Full-text search across name, description, tips, address
  - `minRating` / `maxRating` - Filter by star rating (0-5)
  - `sortBy` - Sort by rating, newest, oldest, popular, distance
  - `sortOrder` - ASC or DESC ordering
  - `latitude` / `longitude` / `radius` - PostGIS distance search (km)
  - `limit` / `offset` - Pagination support
- **FindAllPlacesDto** - Validation DTO with class-validator decorators
- **CityPage Search UI** - Integrated into existing header
  - Search input with glassmorphic design
  - Rating filter dropdown (All, 4+, 3+, 2+ stars)
  - Sort dropdown (Top Rated, Most Popular, Newest, Oldest)
  - Matches existing dark/neon aesthetic
- **Backend-Driven Filtering** - Moved logic from client to server

**Changed:**

- `PlacesService.findAll()` - Enhanced with search, filters, sorting, pagination
- `PlacesController` - Updated GET /places endpoint to use FindAllPlacesDto
- `api.ts` - Enhanced getPlaces() method with 10 new parameters
- `CityPage.tsx` - Added search/filter/sort state and UI controls
- Removed client-side filtering and sorting (now backend-driven)

**Performance:**

- GIN indexes enable sub-millisecond full-text searches
- PostGIS spatial indexes for distance queries
- Pagination-ready for infinite scroll
- Scalable to tens of thousands of records

**API Examples:**

```bash
# Search for coffee places
GET /places?cityCode=CPH&search=coffee&minRating=4

# Popular places, newest first
GET /places?cityCode=JFK&sortBy=popular

# Places within 5km radius
GET /places?latitude=55.67&longitude=12.56&radius=5&sortBy=distance
```

---

### 2026-01-19 - Image Upload System

**Added:**

- `UploadModule` - New NestJS module for handling file uploads
- `UploadService` - Service with Supabase Storage integration
  - Automatic Supabase URL extraction from DATABASE_URL
  - File validation (JPEG, PNG, WebP, GIF, max 5MB)
  - Unique filename generation (UUID + timestamp)
  - Organized storage structure (places/, cities/, avatars/, properties/)
  - Image deletion support for cleanup
- `UploadController` - Protected upload endpoints
  - POST `/upload/image` - Upload single image, returns public URL
  - DELETE `/upload/image` - Delete image from storage
- `ImageUpload` component - Reusable React component
  - Drag-and-drop file selection
  - Instant image preview
  - Upload progress indicator
  - Change/Remove image functionality
  - Client-side validation
  - Beautiful glassmorphic design
- Database migration: `AddImageFields`
  - Added `imageUrl` column to `cities` table
  - Added `avatarUrl` column to `users` table
- Dependencies: `@supabase/supabase-js`, `multer`, `@nestjs/platform-express`

**Changed:**

- Updated `AddPlaceModal` - Replaced URL input with ImageUpload component
- Removed random image fallback logic from place creation
- Updated `api.ts` - Added `uploadImage()` and `deleteImage()` methods
- Fixed unused React import in `ErrorBoundary` component

**API Endpoints:**

| Endpoint        | Method | Auth | Description                           |
| --------------- | ------ | ---- | ------------------------------------- |
| `/upload/image` | POST   | JWT  | Upload image file, returns public URL |
| `/upload/image` | DELETE | JWT  | Delete image from Supabase Storage    |

**Technical Notes:**

- Requires Supabase Storage bucket: `crew-lounge-images` (must be PUBLIC)
- Requires `SUPABASE_SERVICE_KEY` environment variable
- Service automatically extracts Supabase URL from DATABASE_URL
- Backward compatible: existing URL-based images continue to work
- All uploads are JWT-protected

---

### 2026-01-16 - Places API, Comments, Voting & Star Ratings

**Added:**

- `Place` entity with name, description, tips, category, city relation, ratings
- `Comment` entity with text and 1-5 star rating
- `PlaceVote` entity for upvote/downvote with toggle behavior
- PlacesModule with full CRUD, comments, and voting endpoints
- `StarRating` component (reusable, display + interactive modes)
- Enhanced `PlaceDetailsPage` with API integration, voting, comments
- Updated `CityPage` to fetch places from API with category counts
- Updated `PlaceCard` with star ratings instead of numeric
- 10 sample places seeded across 4 cities

**API Endpoints:**

| Endpoint               | Method | Description                                      |
| ---------------------- | ------ | ------------------------------------------------ |
| `/places`              | GET    | List places (filter by cityId/cityCode/category) |
| `/places/:id`          | GET    | Get place with comments                          |
| `/places`              | POST   | Create new place                                 |
| `/places/:id`          | PATCH  | Update place                                     |
| `/places/:id/comments` | GET    | Get comments                                     |
| `/places/:id/comments` | POST   | Add comment with rating                          |
| `/places/:id/vote`     | POST   | Vote (toggles on repeat)                         |
| `/places/:id/vote`     | GET    | Get user's current vote                          |

**Technical Notes:**

- Average rating calculated from comment ratings
- Comment/Vote count logic optimistic updates

### 2026-01-16 - Add Place Feature

**Added:**

- `AddPlaceModal` connected to backend API
- "Add Place" button on `CityPage` (authenticated users only)
- Proper form validation and error handling
- Category-based random image placeholders if no URL provided
- Automatic list refresh after submission automatically
- Comments include user relation for display

### 2026-01-16 - Backend Authentication Implementation

**Added:**

- Bcrypt password hashing for secure credential storage
- `POST /auth/register` endpoint for user registration
- `POST /auth/login` endpoint for user login with password
- `GET /auth/profile` protected endpoint for current user
- `RegisterDto` and `LoginDto` with validation (class-validator)
- `firstName`, `lastName`, `password` fields to User entity
- `AuthContext` React context for frontend auth state
- Signup method in API service
- Error/success message display in AuthPage
- Automatic redirect to home after login/signup

**Changed:**

- Updated `AuthService` with bcrypt, register/validateCredentials methods
- Fixed `JwtStrategy` validation bug (was re-extracting token incorrectly)
- Updated `AuthController` with proper endpoints and HTTP status codes
- Updated `api.ts` with full signup/login implementation
- Wrapped `App.tsx` with `AuthProvider`

**Technical Notes:**

- Password hashing uses bcrypt with 10 salt rounds
- JWT tokens expire after 7 days
- Duplicate email registration returns 409 Conflict
- Wrong password returns 401 Unauthorized
- All auth state persisted to localStorage

### 2026-01-16 - User Profiles & Role-Based Dashboards

**Added:**

- `UserRole` enum (user, admin, moderator) to User entity
- `RolesGuard` and `@Roles()` decorator for route protection
- `AdminModule` with stats, user management, listings endpoints
- `UsersModule` with profile, saved listings endpoints
- `SavedListing` entity for saving places
- `UserDashboard` page with profile, stats, listings
- `AdminDashboard` page with role management, all users, all listings
- `ProfilePage` for editing user info
- `ProtectedRoute` component for frontend role checks
- Database migration for role and saved_listings table
- Seeded admin user (admin@crewlounge.com) and moderator user

**API Endpoints:**

| Endpoint                | Method      | Description             |
| ----------------------- | ----------- | ----------------------- |
| `/admin/stats`          | GET         | Dashboard statistics    |
| `/admin/users`          | GET         | Paginated user list     |
| `/admin/users/recent`   | GET         | Users from last 7 days  |
| `/admin/listings`       | GET         | All playbooks           |
| `/admin/users/:id/role` | PATCH       | Change user role        |
| `/users/profile`        | GET/PATCH   | Get/update profile      |
| `/users/stats`          | GET         | User's stats            |
| `/users/listings`       | GET         | User's created listings |
| `/users/saved`          | GET         | User's saved listings   |
| `/users/saved/:id`      | POST/DELETE | Save/unsave listing     |

**Frontend Routes:**

- `/dashboard` - User dashboard (auth required)
- `/admin` - Admin dashboard (admin role required)
- `/profile` - Edit profile page (auth required)

### 2026-01-16 - Supabase & Cities Features

**Added:**

- Supabase database connection with pooler configuration
- Database seeding script with 5 cities and 6 products
- AllCitiesPage showing cities from real database
- AddCityModal for creating new cities
- API service for frontend-backend communication
- useCities hook with refetch capability

**Changed:**

- Updated database config to support DATABASE_URL
- Updated typeorm.config.ts for cloud connections
- Modified HomePage "View All Cities" link

**Technical Notes:**

- Password with special characters required URL encoding
- Used pooler connection (aws-1-us-east-1.pooler.supabase.com:6543)
- SSL required for Supabase connections

### 2026-01-16 - Auth & Places Enhancement

**Added:**

- AuthPage with Login/SignUp forms
- PlaceDetailsPage with hero, stats, comments
- Enhanced PlaceCard with images, ratings

**Changed:**

- Updated mockData.ts with imageUrl, rating, reviewCount fields
- Changed company name to "Crew Lounge"

### 2026-01-16 - Maps, Shopping & Chat

**Added:**

- **Interactive Maps**: Leaflet integration for displaying places on maps
- **Shopping Guide**: Product comparison tool for crew members
- **Crew Chat**: Real-time chat rooms for cities
- **Socket.io Gateway**: Backend infrastructure for real-time features

**Changed:**

- Updated `CityPage` to include map view
- Updated navigation to include Chat and Shopping

### 2026-01-16 - Bug Fixes & Stability

**Fixed:**

- **Critical Router Crash**: Restructured `App.tsx` ensuring `ChatWindow` has access to `Router` context.
- **White Screen of Death**: Added `ErrorBoundary` to catch runtime errors.
- **Build System**: Fixed TypeScript validation errors and CSS syntax issues.
- **Server Ports**: Resolved port conflicts for backend (3001) and frontend (5173).

---

## ❌ Failed Attempts & Troubleshooting Log

### Supabase Connection Issues (2026-01-16)

**Issue:** "Invalid URL" error when connecting to database

**Tried:**

1. Direct connection string - Failed (unencoded special characters)
2. URL-encoded password with wrong region - Failed ("Tenant not found")
3. Direct db.xxx.supabase.co host - Failed (DNS not resolving)

**Solution:**

- Used pooler connection string from Supabase dashboard
- Correct format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- URL-encode special characters in password (`[` → `%5B`, etc.)

---

## 🔧 Environment Setup

### Required Environment Variables

**Backend (`apps/api/.env`):**

```env
DATABASE_URL=postgresql://postgres.xxx:PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-min-32-chars
```

**Frontend (`apps/web/.env`):**

```env
VITE_API_URL=http://localhost:3001
```

---

## 📁 Key Files Reference

| File                                           | Purpose                     |
| ---------------------------------------------- | --------------------------- |
| `apps/api/src/config/database.config.ts`       | Database connection config  |
| `apps/api/src/seed/seed-data.ts`               | Database seeding script     |
| `apps/api/src/modules/auth/auth.service.ts`    | Auth logic with bcrypt      |
| `apps/api/src/modules/auth/auth.controller.ts` | Auth API endpoints          |
| `apps/api/src/modules/auth/dto/`               | Register and Login DTOs     |
| `apps/web/src/services/api.ts`                 | Frontend API client         |
| `apps/web/src/context/AuthContext.tsx`         | React auth state management |
| `apps/web/src/hooks/useCities.ts`              | React hook for cities       |
| `apps/web/src/pages/AuthPage.tsx`              | Login/Signup UI             |
| `apps/web/src/pages/AllCitiesPage.tsx`         | All cities display          |
| `apps/web/src/components/AddCityModal.tsx`     | Add city form               |

---

## 👥 Development Commands

```bash
# Start API server
cd apps/api && npm run dev

# Start web frontend
cd apps/web && npm run dev

# Seed database
cd apps/api && npm run seed

# Run tests
npm run test
```
