# Crew Directory App - Setup Guide

## Project Structure

This is a monorepo containing:
- **Backend API**: NestJS + TypeScript + PostgreSQL + PostGIS + Redis (`apps/api`)
- **Web App**: React + TypeScript + Vite (`apps/web`)
- **Mobile App**: React Native + TypeScript + Expo (`apps/mobile`)
- **Shared Packages**: Common types, utilities, and API client (`packages/`)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for PostgreSQL + PostGIS and Redis)
- PostgreSQL client (optional, for direct DB access)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Infrastructure (Database & Redis)

```bash
cd infrastructure
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS extension on port 5432
- Redis on port 6379

### 3. Configure Environment Variables

Create `.env` files in `apps/api/`:

```bash
cd apps/api
cp .env.example .env
# Edit .env with your configuration
```

Key variables to set:
- Database credentials
- JWT secret
- OAuth credentials (for airline portal integration)
- Mapbox access token
- S3 credentials (for audio file storage)

### 4. Initialize Database

```bash
# Connect to PostgreSQL and run:
psql -U postgres -d crew_directory -f ../infrastructure/init-db.sql
```

Or use TypeORM migrations (when implemented):
```bash
cd apps/api
npm run migration:run
```

### 5. Start Development Servers

**Backend API:**
```bash
cd apps/api
npm run dev
```
API will run on http://localhost:3001

**Web App:**
```bash
cd apps/web
npm run dev
```
Web app will run on http://localhost:5173

**Mobile App:**
```bash
cd apps/mobile
npm install
npm start
```

## Modules Implemented

### Module A: Crew-verified City Playbooks ✅
- Database schema complete
- API endpoints complete
- Basic web UI complete
- Mobile structure ready

### Module B: Layover Buy-List & Crew-Cart ✅
- Database schema complete
- Price scraping service structure complete
- API endpoints complete
- Web UI pending (can be built using API)

### Module C: Same-Trip Crew Match ✅
- Database schema complete
- ICS parser structure complete
- API endpoints complete
- WebSocket/Redis setup pending (structure ready)
- Web UI pending

### Module D: Crew-Guide Live Audio Walk ✅
- Database schema complete
- API endpoints complete
- File storage structure ready
- Transcription/translation integration pending
- Web UI pending

## Next Steps

1. **Connect to GitHub:**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Complete Web UIs:**
   - Module B: Product catalog and cart
   - Module C: Pairing upload and crew matching UI
   - Module D: Audio walk player and creator CMS

3. **Complete Mobile App:**
   - Add screens for all modules
   - Implement GPS tracking
   - Add push notifications
   - Offline map caching

4. **Set Up Real-time Features:**
   - WebSocket server for Module C
   - Redis pub/sub integration

5. **Add Production Features:**
   - File storage (S3) integration
   - Transcription/translation services
   - Push notification service
   - CI/CD pipeline

## Testing

Run tests (when implemented):
```bash
npm run test
```

## Building for Production

```bash
npm run build
```

## Architecture Notes

- **Monorepo**: Uses Turborepo for build orchestration
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Caching**: Redis for caching and pub/sub
- **Authentication**: OAuth 2.0 + JWT tokens
- **Maps**: Mapbox integration (to be configured)
- **File Storage**: S3-compatible storage (to be configured)

## Support

For questions or issues, please refer to the main README.md or create an issue in the repository.
