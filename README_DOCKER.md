# Task Manager - Docker Deployment Guide

## Overview

Your Task Manager application has been fully containerized with Docker. Deploy three separate services (Database, Backend, Frontend) with a single command:

```bash
docker-compose up -d
```

---

## 🚀 Quick Start (1 Minute)

```bash
# 1. Navigate to project
cd task_manager_static_app

# 2. Start all services
docker-compose up -d

# 3. Open browser
http://localhost:3000
```

Done! Your application is running.

---

## 📖 Documentation

### For Different Needs

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **START_HERE.txt** | Entry point for all users | 2 min |
| **QUICK_DEPLOY.md** | Fast deployment guide | 2 min |
| **DOCKER_SUMMARY.txt** | Overview of changes | 5 min |
| **DEPLOYMENT.md** | Commands and reference | 10 min |
| **DOCKER_SETUP.md** | Comprehensive guide | 15 min |
| **DOCKER_INDEX.md** | Complete index | 10 min |
| **DEPLOYMENT_CHECKLIST.md** | Verification steps | 5 min |
| **FILES_CREATED.md** | File inventory | 10 min |

### Recommended Reading Order

1. Start with: **START_HERE.txt** or **QUICK_DEPLOY.md**
2. Then read: **DOCKER_SUMMARY.txt**
3. Reference: **DEPLOYMENT.md** for commands
4. Deep dive: **DOCKER_SETUP.md** for details

---

## 🎯 Services

### 1. MySQL Database (Port 3306)
- **Container**: task_manager_db
- **Image**: MySQL 8.0
- **Database**: app_db
- **User**: root/passw0rd
- **Data**: Persistent mysql_data volume
- **Health**: Automatic health check

### 2. Flask Backend API (Port 5000)
- **Container**: task_manager_backend
- **Image**: Python 3.11
- **Framework**: Flask 2.3.0
- **Purpose**: REST API for task management
- **Health**: HTTP health check on /hello
- **Environment**: production (debug off)

### 3. React Frontend (Port 3000)
- **Container**: task_manager_frontend
- **Image**: Node.js 20 (Alpine)
- **Framework**: React 19.2.0 + Vite 7.2.4
- **Purpose**: User interface
- **Health**: HTTP health check on root
- **Build**: Multi-stage optimized build

---

## 🔧 Common Commands

### Start/Stop
```bash
docker-compose up -d              # Start all services
docker-compose stop               # Stop all services
docker-compose restart            # Restart all services
docker-compose down               # Remove containers (keep data)
docker-compose down -v            # Remove everything (delete data)
```

### View Logs
```bash
docker-compose logs -f            # All services
docker-compose logs -f backend    # Backend only
docker-compose logs -f frontend   # Frontend only
docker-compose logs -f db         # Database only
```

### Manage Services
```bash
docker-compose ps                 # View status
docker-compose build              # Build images
docker-compose up -d --build      # Build and start
docker-compose exec backend sh    # Shell into backend
docker-compose exec db mysql -u root -ppassw0rd app_db
```

---

## 🧪 Testing

### API Endpoints
```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task Title","description":"Description","status":"pending"}'

# Get single task
curl http://localhost:5000/api/tasks/1

# Update task
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/1
```

### Health Checks
```bash
curl http://localhost:5000/hello         # Backend alive
curl http://localhost:3000               # Frontend loads
docker-compose exec db mysqladmin ping   # Database alive
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│           Docker Compose Setup                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (React)   Backend (Flask)   DB (MySQL)   │
│  Port: 3000         Port: 5000        Port: 3306   │
│                                                      │
│  ├─────────────────────────────────────────────┤   │
│  │    task_manager_network (bridge)            │   │
│  │                                              │   │
│  │    Persistent: mysql_data volume            │   │
│  └─────────────────────────────────────────────┤   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Files Created

### Docker Configuration
- `docker-compose.yml` - Main orchestration file
- `backend/Dockerfile` - Python Flask container
- `frontend/Dockerfile` - React/Vite container
- `init.sql` - Database initialization

### Build Optimization
- `backend/.dockerignore` - Exclude unnecessary files
- `frontend/.dockerignore` - Exclude unnecessary files

### Configuration
- `.env.example` - Environment variables template
- `.dockerignore.root` - Root-level ignore patterns

### Documentation (NEW)
- `START_HERE.txt` - Entry point
- `QUICK_DEPLOY.md` - TL;DR deployment
- `DOCKER_SETUP.md` - Comprehensive guide
- `DEPLOYMENT.md` - Commands reference
- `DOCKER_SUMMARY.txt` - Overview
- `DOCKER_INDEX.md` - Complete index
- `FILES_CREATED.md` - File inventory
- `DEPLOYMENT_CHECKLIST.md` - Verification
- `README_DOCKER.md` - This file

---

## 🔧 Configuration

### Environment Variables

**Database**:
```
MYSQL_ROOT_PASSWORD=passw0rd
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=apppass123
```

**Backend**:
```
FLASK_APP=app.py
FLASK_ENV=production
DATABASE_URL=mysql+pymysql://root:passw0rd@db:3306/app_db?charset=utf8mb4
```

**Frontend**:
```
VITE_API_URL=http://backend:5000
```

### Custom Configuration

Edit `docker-compose.yml` to:
- Change ports
- Modify credentials
- Adjust resources
- Configure environment variables

---

## 🚨 Troubleshooting

### Services Won't Start
```bash
# Check Docker is running
docker ps

# View all logs
docker-compose logs

# Check specific service
docker-compose logs db

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000     # Frontend
lsof -i :5000     # Backend
lsof -i :3306     # Database

# Kill process or change ports in docker-compose.yml
```

### Database Connection Error
```bash
# Wait for MySQL to initialize (10-15 seconds)
docker-compose logs db

# Check health
docker-compose ps

# Restart backend
docker-compose restart backend
```

### Frontend Can't Reach Backend
```bash
# Wait 15 seconds, then refresh browser
# Check backend is running
docker-compose ps backend

# Test API directly
curl http://localhost:5000/hello

# Check logs
docker-compose logs frontend backend
```

---

## 🔒 Security

### Development (Current)
- Debug mode: OFF
- CORS: Enabled for all origins
- Credentials: Default values

### For Production

Before deploying to production:

1. **Change Credentials**
   ```yaml
   MYSQL_ROOT_PASSWORD: your_secure_password
   MYSQL_PASSWORD: your_secure_password
   ```

2. **Set Up HTTPS**
   - Configure SSL certificates
   - Use reverse proxy (Nginx)
   - Redirect HTTP to HTTPS

3. **Configure Firewall**
   - Only expose port 3000 (frontend)
   - Hide ports 5000 and 3306
   - Use VPN or bastion host

4. **Remove Development Features**
   - Remove volume mounts for backend code
   - Disable debug logging
   - Use secrets management

5. **Set Up Monitoring**
   - Container log aggregation
   - Error tracking
   - Performance monitoring
   - Health check alerts

---

## 📊 Resource Usage

Typical resource consumption:
- **Memory**: 1.5-2GB total
- **Disk**: 2GB per service
- **CPU**: Minimal when idle

Monitor with:
```bash
docker stats
```

---

## 🔄 Updates and Maintenance

### Update Code
```bash
git pull
docker-compose build
docker-compose up -d --build
```

### Backup Database
```bash
docker-compose exec db mysqldump -u root -ppassw0rd app_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db mysql -u root -ppassw0rd app_db < backup.sql
```

### Clean Up
```bash
docker system prune        # Remove unused images/containers
docker image prune         # Remove unused images only
docker container prune     # Remove unused containers only
```

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Docker Desktop installed
- [ ] Docker daemon running
- [ ] Ports 3000, 5000, 3306 available
- [ ] Git repository cloned

After deploying:

- [ ] `docker-compose ps` shows 3 "Up" containers
- [ ] `curl localhost:5000/hello` returns JSON
- [ ] `curl localhost:5000/api/tasks` returns tasks
- [ ] `http://localhost:3000` loads UI
- [ ] Can create/read/update/delete tasks
- [ ] No errors in `docker-compose logs`

---

## 🆘 Getting Help

### Quick Issues
- **Services won't start**: See DOCKER_SETUP.md "Troubleshooting"
- **Port in use**: Change ports in docker-compose.yml
- **Can't reach API**: Wait 15s, check `docker-compose logs`

### Documentation
- **Quick Start**: QUICK_DEPLOY.md
- **Full Guide**: DOCKER_SETUP.md
- **Commands**: DEPLOYMENT.md
- **Reference**: DOCKER_INDEX.md

### Commands for Debugging
```bash
docker-compose ps              # Status
docker-compose logs -f         # Live logs
docker-compose exec db mysql   # Database shell
docker inspect <container>     # Container details
docker stats                   # Resource usage
```

---

## 📚 Full Documentation Set

All documentation files:

1. **START_HERE.txt** - Begin here
2. **QUICK_DEPLOY.md** - Fast deployment
3. **DOCKER_SUMMARY.txt** - Overview
4. **DOCKER_SETUP.md** - Comprehensive
5. **DEPLOYMENT.md** - Commands
6. **DOCKER_INDEX.md** - Complete index
7. **FILES_CREATED.md** - File inventory
8. **DEPLOYMENT_CHECKLIST.md** - Verification
9. **README_DOCKER.md** - This document

---

## 🎯 Summary

Your Task Manager application is now fully containerized. Deploy with:

```bash
docker-compose up -d
```

Access at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Database**: localhost:3306

For details, read **START_HERE.txt** or **QUICK_DEPLOY.md**.

---

**Status**: ✅ Ready for Deployment
**Version**: 1.0
**Last Updated**: 2024
