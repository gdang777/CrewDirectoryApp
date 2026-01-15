# Docker Setup Instructions

## Install Docker Desktop

### For macOS:
1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download the Mac version (Intel or Apple Silicon)
   - Install the .dmg file

2. **Or use Homebrew:**
   ```bash
   brew install --cask docker
   ```

3. **Start Docker Desktop:**
   - Open Docker Desktop from Applications
   - Wait for it to start (whale icon in menu bar)

4. **Verify installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

### For Windows:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and restart if prompted
3. Start Docker Desktop

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

## Start Infrastructure

Once Docker is installed:

```bash
cd infrastructure
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS on port 5432
- Redis on port 6379

## Verify Containers are Running

```bash
docker ps
```

You should see:
- `crew_directory_postgres`
- `crew_directory_redis`

## Initialize Database

```bash
# Initialize PostGIS extension
docker exec -i crew_directory_postgres psql -U postgres -d crew_directory < infrastructure/init-db.sql

# Or run migrations
cd apps/api
npm run migration:run

# Seed initial data
npm run seed
```

## Stop Containers

```bash
cd infrastructure
docker-compose down
```

## View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

## Troubleshooting

**Port already in use:**
- Check if PostgreSQL/Redis are already running: `lsof -i :5432` or `lsof -i :6379`
- Stop existing services or change ports in `docker-compose.yml`

**Permission denied:**
- On Linux, add your user to docker group: `sudo usermod -aG docker $USER`
- Log out and back in

**Docker daemon not running:**
- Start Docker Desktop
- On Linux: `sudo systemctl start docker`
