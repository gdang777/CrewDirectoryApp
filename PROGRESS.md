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

### 2. Authentication (Frontend Only)

- [x] **AuthPage** - Login and Sign Up tabs with forms
- [x] **Form Fields** - Email, password, first name, last name, airline selection
- [x] **Dark Theme** - Consistent styling with app design
- [x] **Route** - `/auth` accessible from navigation

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
  - Auth methods (login, profile)
  - Cities CRUD operations
  - Playbooks/Places CRUD
  - Voting system
- [x] **React Hooks** (`useCities.ts`) - Data fetching with refetch capability

---

## 🔄 In Progress

_No features currently in progress_

---

## 📝 Planned Features (Not Started)

### High Priority

- [ ] **Backend Authentication** - JWT token validation, protected routes
- [ ] **User Profiles** - View/edit profile, karma score display
- [ ] **Places API** - CRUD operations for places (currently mock data)
- [ ] **Comments Persistence** - Save comments to database
- [ ] **Voting Persistence** - Save votes to database

### Medium Priority

- [ ] **Layovers/Gigs Feature** - Work opportunities for crew
- [ ] **Search Functionality** - Search cities, places, properties
- [ ] **Filtering & Sorting** - Filter by category, rating, distance
- [ ] **Image Upload** - Upload images for places/properties
- [ ] **Maps Integration** - Show locations on map (Mapbox)

### Lower Priority

- [ ] **Mobile App Parity** - React Native app features
- [ ] **Push Notifications** - New comments, votes, etc.
- [ ] **Email Verification** - Verify airline email addresses
- [ ] **Admin Dashboard** - Moderate content, manage users

---

## 🐛 Known Issues

| Issue                           | Status | Notes                           |
| ------------------------------- | ------ | ------------------------------- |
| Mock data used for places       | Open   | Places not yet connected to API |
| Comments only in frontend state | Open   | Need backend endpoint           |
| Votes only in frontend state    | Open   | Need backend endpoint           |

---

## 📜 Change Log

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
JWT_SECRET=your-secret-key
```

**Frontend (`apps/web/.env`):**

```env
VITE_API_URL=http://localhost:3001
```

---

## 📁 Key Files Reference

| File                                       | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `apps/api/src/config/database.config.ts`   | Database connection config |
| `apps/api/src/seed/seed-data.ts`           | Database seeding script    |
| `apps/web/src/services/api.ts`             | Frontend API client        |
| `apps/web/src/hooks/useCities.ts`          | React hook for cities      |
| `apps/web/src/pages/AllCitiesPage.tsx`     | All cities display         |
| `apps/web/src/components/AddCityModal.tsx` | Add city form              |

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
