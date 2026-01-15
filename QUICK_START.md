# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js >= 18.0.0 installed
- [ ] Docker Desktop installed and running
- [ ] Git repository cloned

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Database & Redis
```bash
cd infrastructure
docker-compose up -d
```

Wait a few seconds for containers to start, then verify:
```bash
docker ps
```

### 3. Initialize Database
```bash
# Initialize PostGIS
docker exec -i crew_directory_postgres psql -U postgres -d crew_directory < infrastructure/init-db.sql

# Run migrations (if any)
cd ../apps/api
npm run migration:run

# Seed sample data
npm run seed
```

### 4. Start Backend API
```bash
cd apps/api
npm run dev
```

API should be running on http://localhost:3001

Test it:
```bash
curl http://localhost:3001/health
```

### 5. Start Web App (in new terminal)
```bash
cd apps/web
npm run dev
```

Visit http://localhost:5173

### 6. Start Mobile App (optional, in new terminal)
```bash
cd apps/mobile
npm install
npm start
```

## Common Commands

**Stop all services:**
```bash
cd infrastructure
docker-compose down
```

**View API logs:**
```bash
cd apps/api
npm run dev
```

**Reset database:**
```bash
docker-compose down -v  # Removes volumes
docker-compose up -d
# Then re-run migrations and seed
```

## Next Steps

- Configure Mapbox token in `apps/api/.env` for map features
- Set up OAuth credentials for airline portal integration
- Build out remaining UI components
- See `NEXT_STEPS.md` for feature development priorities

## Troubleshooting

**API won't start:**
- Check `.env` file exists in `apps/api/`
- Verify database is running: `docker ps`
- Check database connection: `docker exec -it crew_directory_postgres psql -U postgres -d crew_directory`

**Web app can't connect to API:**
- Make sure API is running on port 3001
- Check CORS settings in API
- Verify `VITE_API_URL` in web app (defaults to http://localhost:3001)

**Database connection errors:**
- Ensure Docker containers are running
- Check `.env` file has correct database credentials
- Verify PostGIS extension: `docker exec -it crew_directory_postgres psql -U postgres -d crew_directory -c "SELECT PostGIS_version();"`
