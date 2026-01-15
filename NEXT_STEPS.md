# Next Steps - Development Setup

## ✅ Completed
- [x] Project structure created
- [x] All 4 modules (A-D) database schemas
- [x] Backend API endpoints
- [x] Authentication system
- [x] Basic web UI (Module A)
- [x] Mobile app structure
- [x] GitHub repository connected
- [x] Dependencies installed

## 🚀 Immediate Next Steps

### Step 1: Start Database & Redis (Required)
```bash
cd infrastructure
docker-compose up -d
```

This starts:
- PostgreSQL with PostGIS on port 5432
- Redis on port 6379

**Verify it's running:**
```bash
docker ps
```

### Step 2: Initialize Database
```bash
# Option A: Using Docker exec
docker exec -i crew_directory_postgres psql -U postgres -d crew_directory < infrastructure/init-db.sql

# Option B: Using psql (if installed locally)
psql -U postgres -d crew_directory -f infrastructure/init-db.sql
```

### Step 3: Test the API
```bash
cd apps/api
npm run dev
```

The API should start on http://localhost:3001

**Test it:**
```bash
curl http://localhost:3001/health
```

### Step 4: Test the Web App
```bash
cd apps/web
npm run dev
```

Visit http://localhost:5173

## 📋 Priority Features to Build Next

### High Priority
1. **Module A Enhancements**
   - Add Mapbox integration for POI visualization
   - Complete playbook editor UI
   - Add voting UI

2. **Module B Web UI**
   - Product catalog page
   - Price comparison view
   - Shopping cart functionality

3. **Database Migrations**
   - Set up TypeORM migrations
   - Seed initial data (cities, sample products)

### Medium Priority
4. **Module C Real-time Features**
   - WebSocket server setup
   - Redis pub/sub for crew matching
   - Real-time availability updates

5. **Module C Web UI**
   - Pairing upload interface
   - Availability calendar
   - Group chat interface

6. **Module D Features**
   - File upload for audio walks
   - GPS tracking integration
   - Audio player component

### Lower Priority
7. **Mobile App Screens**
   - Complete all module screens
   - GPS tracking
   - Push notifications

8. **Production Features**
   - S3 file storage
   - Transcription/translation services
   - CI/CD pipeline

## 🛠️ Development Workflow

1. **Make changes** in your code
2. **Test locally** with the dev servers
3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push
   ```

## 📝 Notes

- The `.env` file in `apps/api/` is already created with default values
- You'll need to configure Mapbox token for map features
- OAuth credentials needed when integrating with airline portals
- S3 credentials needed for audio file storage

## 🐛 Troubleshooting

**Database connection issues:**
- Make sure Docker containers are running: `docker ps`
- Check database is accessible: `docker exec -it crew_directory_postgres psql -U postgres`

**API won't start:**
- Check `.env` file exists in `apps/api/`
- Verify database is running
- Check port 3001 is not in use

**Web app issues:**
- Make sure API is running first
- Check CORS settings in API if getting errors
