# Crew Lounge - Development Progress

> **Last Updated:** 2026-01-16  
> **Status:** Active Development

---

## 📋 Project Overview

**Crew Lounge** is a city-centric, user-generated directory for aviation professionals. It enables crew members to discover and contribute places (eat, drink, shop, visit) and properties (crashpads, vacation rentals) in various layover cities.

---

## ✅ Completed Features

### 1. Database & Backend Infrastructure

- [x] **Supabase Integration** - Cloud PostgreSQL database connected
- [x] **Database Schema** - Tables created via TypeORM (cities, users, playbooks, POIs, products, etc.)
- [x] **Seed Data** - 5 cities (Copenhagen, Bangkok, Dubai, New York, London) + 6 products
- [x] **Environment Configuration** - DATABASE_URL with SSL support for cloud connections

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

---

## 🔄 In Progress

_No features currently in progress_

---

## 📝 Planned Features (Not Started)

### High Priority

- [ ] **Image Upload** - Real image upload instead of URLs

### Medium Priority

- [ ] **Layovers/Gigs Feature** - Work opportunities for crew
- [ ] **Search Functionality** - Search cities, places, properties
- [ ] **Filtering & Sorting** - Filter by category, rating, distance
- [ ] **Image Upload** - Upload images for places/properties
- [ ] **Image Upload** - Upload images for places/properties
- [ ] **Moderator Dashboard** - Content moderation queue

### Lower Priority

- [ ] **Mobile App Parity** - React Native app features
- [ ] **Push Notifications** - New comments, votes, etc.
- [ ] **Email Verification** - Verify airline email addresses

---

## 🐛 Known Issues

| Issue                           | Status | Notes                           |
| ------------------------------- | ------ | ------------------------------- |
| Mock data used for places       | Open   | Places not yet connected to API |
| Comments only in frontend state | Open   | Need backend endpoint           |
| Votes only in frontend state    | Open   | Need backend endpoint           |

---

## 📜 Change Log

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
