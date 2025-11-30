# Deployment Guide - Docker Setup

## One-Command Deployment

After cloning the repository, simply run:

```bash
docker-compose up -d
```

That's it! All three services will be automatically:
- Built (if needed)
- Started
- Connected together
- Ready to use

## Access Points

Once running, access the application at:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Task Manager UI |
| Backend API | http://localhost:5000 | REST API |
| MySQL DB | localhost:3306 | Database (via MySQL client) |

## What's Running

```
✓ MySQL 8.0 Database Server (task_manager_db)
✓ Python Flask Backend API (task_manager_backend)
✓ React Frontend Application (task_manager_frontend)
```

## Quick Commands

### Start Everything
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f          # All services
docker-compose logs -f backend  # Specific service
```

### Stop Everything
```bash
docker-compose stop
```

### Restart Everything
```bash
docker-compose restart
```

### Remove Everything (keeps data)
```bash
docker-compose down
```

### Remove Everything (delete data)
```bash
docker-compose down -v
```

### Check Status
```bash
docker-compose ps
```

## Services Information

### Database (MySQL)
- **Host**: db (or localhost:3306 from host)
- **User**: root
- **Password**: passw0rd
- **Database**: app_db
- **Data Storage**: Named volume `mysql_data` (persistent)

### Backend API (Flask)
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/hello
- **Database**: Connects to `db` service
- **Auto Initialization**: Creates tables on startup

### Frontend (React)
- **URL**: http://localhost:3000
- **Build**: Automatically built in Docker
- **API Proxy**: Routes /api to backend service

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│            Docker Compose Network                    │
│        (task_manager_network - bridge)               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Frontend    │  │  Backend     │  │  Database  │ │
│  │  (React)     │  │  (Flask)     │  │  (MySQL)   │ │
│  │              │  │              │  │            │ │
│  │ Port: 3000   │  │ Port: 5000   │  │ Port: 3306 │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────┘ │
│         │                 │                          │
│         └─────────────────┘                          │
│              API Calls                               │
│                                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │  mysql_data Volume (Persistent Storage)          ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
         ↓
     Host System
     Ports: 3000, 5000, 3306
```

## Environment Setup

All environment variables are configured in `docker-compose.yml`. For custom configurations:

1. Create a `.env` file in the project root
2. Add or override variables as needed:
   ```
   MYSQL_ROOT_PASSWORD=passw0rd
   MYSQL_DATABASE=app_db
   MYSQL_USER=app_user
   MYSQL_PASSWORD=apppass123
   FLASK_ENV=production
   ```

## Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs

# Rebuild everything
docker-compose down
docker-compose up -d --build
```

### Database connection error
```bash
# Wait for database to be ready
docker-compose logs db

# Check database health
docker-compose exec db mysqladmin ping -u root -ppassw0rd
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# Or stop other services using those ports
```

### API calls failing from frontend
- Check backend logs: `docker-compose logs backend`
- Verify backend is running: `docker-compose ps`
- Test API: `curl http://localhost:5000/api/tasks`

## File Structure

Created files for Docker support:

```
project_root/
├── docker-compose.yml          ← Main orchestration file
├── DOCKER_SETUP.md             ← Detailed Docker guide
├── DEPLOYMENT.md               ← This file
├── .env.example                ← Environment template
├── init.sql                    ← Database initialization
│
├── backend/
│   ├── Dockerfile              ← Python Flask container
│   ├── .dockerignore
│   └── app.py                  ← Modified for Docker env vars
│
└── frontend/
    ├── Dockerfile              ← React/Vite container
    └── .dockerignore
```

## Production Checklist

Before deploying to production:

- [ ] Change `MYSQL_ROOT_PASSWORD` in docker-compose.yml
- [ ] Change `MYSQL_PASSWORD` for app_user
- [ ] Change `FLASK_ENV` to production
- [ ] Configure domain/SSL certificates
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure firewall rules
- [ ] Set up backups for mysql_data volume
- [ ] Monitor container logs
- [ ] Test failover and restart procedures

## Advanced Operations

### Rebuild images
```bash
docker-compose build
docker-compose up -d --build
```

### Access container shell
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec db bash
```

### Run database queries
```bash
docker-compose exec db mysql -u root -ppassw0rd app_db -e "SHOW TABLES;"
```

### Export database
```bash
docker-compose exec db mysqldump -u root -ppassw0rd app_db > backup.sql
```

### Import database
```bash
docker-compose exec -T db mysql -u root -ppassw0rd app_db < backup.sql
```

## Health Checks

All services include health checks:

```bash
# View health status
docker-compose ps

# Manual health check
curl http://localhost:5000/hello         # Backend alive?
curl http://localhost:3000               # Frontend alive?
docker-compose exec db mysqladmin ping   # Database alive?
```

## Support

For detailed information, see:
- `DOCKER_SETUP.md` - Comprehensive Docker documentation
- `docker-compose.yml` - Service configurations
- `README.md` - Application overview

---

**Quick Start**: `git pull && docker-compose up -d`

**Stop**: `docker-compose stop`

**View Logs**: `docker-compose logs -f`
