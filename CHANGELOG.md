# Changelog

All notable changes to the Crew Directory App project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Search & Filter Features** - Full-text search and advanced filtering
  - PostgreSQL full-text search with tsvector and GIN indexes
  - Auto-update triggers for search_vector maintenance
  - Weighted search (name > description > tips > address)
  - Enhanced Places API with 13 query parameters
  - Text search, rating filter, multiple sort options
  - PostGIS distance/radius search (latitude, longitude, radius)
  - Pagination support (limit, offset)
  - FindAllPlacesDto with comprehensive validation
  - CityPage UI: search input, rating filter, sort dropdown
  - Glassmorphic controls matching dark/neon theme
  - Backend-driven filtering (moved from client-side)
  - Migration: AddFullTextSearch for places and cities
- **Image Upload System** - Complete file upload infrastructure
  - UploadModule with Supabase Storage integration
  - UploadService with file validation (JPEG, PNG, WebP, GIF, max 5MB)
  - UploadController with protected JWT endpoints
  - POST `/upload/image` endpoint for image uploads
  - DELETE `/upload/image` endpoint for image deletion
  - ImageUpload React component with drag-and-drop support
  - Instant image preview and upload progress indicator
  - Unique filename generation using UUID + timestamp
  - Organized storage structure (places/, cities/, avatars/, properties/)
  - Database migration adding `imageUrl` to cities, `avatarUrl` to users
  - Integration into AddPlaceModal (replaced URL input)
  - Dependencies: @supabase/supabase-js, multer, @nestjs/platform-express
- Comprehensive testing infrastructure with Jest for API and Vitest for web app
- Unit tests for AppController and AppService
- Unit tests for PlaybooksService with mocked repositories
- Unit tests for AuthService with JWT and user validation
- Component tests for LoadingSpinner and ErrorMessage
- Service tests for API client methods
- Test coverage configuration with 70% threshold
- GitHub Actions CI/CD workflow for automated testing
- Test documentation and best practices guide
- Test scripts for watch mode, coverage, and CI
- Test setup files with proper mocks and configurations
- Unit tests for ProductsService with price comparison logic
- Component tests for PlaybooksPage with loading and error states
- Test coverage thresholds set to 70% minimum
- Fixed Jest configuration conflicts
- Fixed API service test mocking issues
- Integration tests for Playbooks and Products modules
- E2E tests for API endpoints
- API contract tests to prevent breaking changes
- Pre-commit hooks with Husky for automated testing
- Lint-staged configuration for running tests on changed files
- Commit message linting with commitlint
- Dependency tracking documentation (DEPENDENCIES.md)
- API contract validation decorators
- Prettier configuration for code formatting
- Change Impact Checklist for preventing breaking changes
- ESLint configuration for code quality
- Commit message linting with commitlint
- Automated pre-commit hooks with Husky and lint-staged
- Module B web UI - Product catalog page with filtering and price comparison
- React Router integration for navigation between pages
- Product price comparison functionality in web UI
- Shopping cart sidebar component
- Product category filtering (chocolate, cosmetics, spirits)
- Price delta visualization (percentage difference display)
- Navigation bar with tabs for Playbooks and Products
- Product API client methods (getProducts, comparePrices, getProductsWithPriceDelta)
- Product type definition in shared package
- Reusable LoadingSpinner component
- Reusable ErrorMessage component with retry functionality
- Enhanced PlaybooksPage with improved loading and error states
- Enhanced ProductsPage with improved loading and error states
- Initial project setup with monorepo structure using Turborepo
- Git repository initialization with comprehensive .gitignore
- GitHub repository connection and initial push
- Backend API structure with NestJS
- Database schemas for all 4 modules (A-D):
  - Module A: Cities, Playbooks, POIs, Edits, Votes, Users
  - Module B: Products, Prices, Price History, Affiliate Links, QR Scans
  - Module C: Pairings, Crew Members, Availability Windows, Groups, Activities
  - Module D: Audio Walks, Waypoints, Audio Files, Translations, Purchases
- Authentication system with OAuth 2.0 and JWT
- API endpoints for all modules
- Web application with React + Vite + TypeScript
- Mobile application structure with React Native + Expo
- Shared packages for types, utilities, and API client
- Docker Compose setup for PostgreSQL + PostGIS and Redis
- Database migration system with TypeORM
- Initial migration for PostGIS extension setup
- TypeORM configuration file for migrations
- Seed data script for initial cities and products (Copenhagen, Bangkok, Dubai, NYC, London)
- Sample product data seeding (chocolates, cosmetics, spirits)
- Environment configuration files (.env.example and .env)
- Migration scripts in package.json (migration:generate, migration:run, migration:revert)
- Seed script in package.json
- Comprehensive documentation:
  - README.md - Project overview
  - SETUP.md - Detailed setup instructions
  - NEXT_STEPS.md - Development priorities and roadmap
  - QUICK_START.md - Quick setup guide
  - DOCKER_SETUP.md - Docker installation and usage
  - GITHUB_SETUP.md - GitHub connection guide
  - CHANGELOG.md - This file for tracking all changes
  - CONTRIBUTING.md - Contribution guidelines with changelog workflow
- Changelog system for tracking all project changes
- Changelog template and contribution guidelines

### Changed

- **Homepage Redesign**:
  - Implemented complete visual overhaul with Dark/Neon features (`#050508` bg, cyan accents).
  - Updated Hero section with reduced height (60vh) and glassmorphic search bar.
  - Restyled "Popular Cities" and "Featured Listings" with new cards and "Verified" badges.
  - Added specific "Designed Specifically for Aviation Professionals" features section.
  - Updated Navbar to be sticky/transparent with blur effects and corrected auth buttons.
  - Restored multi-column Footer with Platform, Company, and Legal links.
  - Applied global typography and responsive grid adjustments.
- **AddPlaceModal**: Replaced URL input field with ImageUpload component for better UX
- **API Service**: Added `uploadImage()` and `deleteImage()` methods with multipart/form-data support
- **Place Creation**: Removed random image fallback logic, now uses actual uploaded images
- **Entity Updates**: Added `imageUrl` field to City entity, `avatarUrl` field to User entity
- **ErrorBoundary**: Fixed unused React import (TypeScript lint error)

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

### [0.2.0] - 2026-01-16

### Added

#### Backend API

- **Authentication**:
  - Development login endpoint (`POST /auth/dev/login`) to bypass OAuth.
  - User entity update to support airline verification badges.
- **Module A (City Playbooks)**:
  - Geospatial queries (`findPOIsNearby`) using PostGIS.
  - POI relation added to Playbook entity.
- **Module C (Crew Match)**:
  - `ICSParserService` using `ical.js` to parse crew pairing data.
  - `CrewMatchGateway` for real-time WebSocket communication.
- **Module D (Audio Walks)**:
  - Audio file schema and upload structure.
  - Purchase flow logic skeleton.

#### Web Frontend

- **Module A (Playbooks)**:
  - `MapComponent` integration using Leaflet.
  - `PlaybookEditor` for creating and editing playbooks.
  - Voting UI with optimistic updates.
- **Module C (Crew Match)**:
  - `CrewMatchPage` with real-time chat using `socket.io-client`.

#### Mobile App

- **Structure**:
  - Expo Router setup with Tab-based navigation.
  - Scaffold screens for Playbooks, Shop, Crew, and Profile.

### Fixed

- **App Stability**:
  - Fixed "useLocation" route context crash by restructuring `App.tsx` Router provider order.
  - Added `ErrorBoundary` component to catch and display runtime errors gracefully.
- **Build & Style**:
  - Resolved CSS syntax error in `Dashboard.css` (nested media query).
  - Fixed multiple TypeScript type errors in `AddTipModal`, `ChatPage`, and `PlaybookEditor`.
  - Cleaned up unused imports across the codebase.

---

## [0.1.0] - 2025-01-XX

### Added

- Initial project structure and foundation
- Core infrastructure setup

---

## Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
