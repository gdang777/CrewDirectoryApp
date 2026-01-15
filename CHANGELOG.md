# Changelog

All notable changes to the Crew Directory App project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

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
