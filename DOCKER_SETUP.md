# Docker Setup Guide - Task Manager Application

This guide explains how to run the Task Manager application using Docker Compose with three separate services.

## Architecture

The application is containerized into three separate services:

1. **MySQL Database Server** (port 3306)
   - Database: `app_db`
   - Root password: `passw0rd`
   - User: `app_user` / `apppass123`
   - Volume: `mysql_data` for persistent storage

2. **Backend Flask API Server** (port 5000)
   - Python Flask application
   - REST API for task management
   - Automatically creates database tables on startup
   - Connects to MySQL database service

3. **Frontend React Application** (port 3000)
   - React + Vite frontend
   - Serves the UI interface
   - Proxies API calls to backend service

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git (for cloning the repository)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd task_manager_static_app
```

### 2. Start All Services
```bash
docker-compose up -d
```

This single command will:
- Pull necessary images
- Build backend and frontend images
- Create and start all three containers
- Set up networking between services
- Create the MySQL database and tables

### 3. Access the Application

Once the services are running:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **MySQL Database**: localhost:3306

## Detailed Setup

### Building and Starting Services

```bash
# Start all services in detached mode (background)
docker-compose up -d

# Start and watch logs
docker-compose up

# Start specific service only
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d db
```

### Viewing Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# View last 50 lines
docker-compose logs --tail=50
```

### Stopping Services

```bash
# Stop all running containers
docker-compose stop

# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Managing Services

```bash
# View running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Rebuild images
docker-compose build

# Build and start
docker-compose up -d --build
```

## Service Details

### Database Service (MySQL 8.0)

**Container Name**: `task_manager_db`

**Environment Variables**:
- `MYSQL_ROOT_PASSWORD`: passw0rd
- `MYSQL_DATABASE`: app_db
- `MYSQL_USER`: app_user
- `MYSQL_PASSWORD`: apppass123

**Health Check**: MySQL ping - checks if database is accepting connections

**Volume**: `mysql_data` persists database files

**Port Mapping**: 3306 (container) → 3306 (host)

The `init.sql` script runs automatically on first startup to create the tasks table.

### Backend Service (Python Flask)

**Container Name**: `task_manager_backend`

**Environment Variables**:
- `FLASK_APP`: app.py
- `FLASK_ENV`: production
- `DATABASE_URL`: mysql+pymysql://root:passw0rd@db:3306/app_db?charset=utf8mb4

**Health Check**: HTTP request to `/hello` endpoint

**Port Mapping**: 5000 (container) → 5000 (host)

**Dependencies**: Waits for database health check before starting

**Key Features**:
- Automatically creates database tables on startup
- REST API endpoints for CRUD operations
- CORS enabled for frontend communication

### Frontend Service (React/Vite)

**Container Name**: `task_manager_frontend`

**Environment Variables**:
- `VITE_API_URL`: http://backend:5000

**Health Check**: HTTP GET request to root path

**Port Mapping**: 3000 (container) → 3000 (host)

**Dependencies**: Waits for backend service

**Key Features**:
- Built with Node.js 20 Alpine (small image)
- Multi-stage build for optimized production image
- Serves optimized static build with `serve`

## API Endpoints

Once running, you can test the API:

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create a new task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description", "status": "pending"}'

# Get a specific task
curl http://localhost:5000/api/tasks/1

# Update a task
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/1
```

## Database Access

To directly access the MySQL database:

```bash
# Connect to MySQL from host
mysql -h localhost -u root -p
# Password: passw0rd

# Or use inside Docker container
docker-compose exec db mysql -u root -ppassw0rd app_db
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs db

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backend Can't Connect to Database

```bash
# Wait longer for database to be ready
docker-compose restart backend

# Check database health
docker-compose exec db mysqladmin ping -u root -ppassw0rd

# View database logs
docker-compose logs db
```

### Frontend Can't Reach Backend

```bash
# Check backend is running
docker-compose ps

# Backend URL should be http://backend:5000 inside containers
# Not localhost - use service name for inter-container communication

# Verify backend is accessible
docker-compose exec frontend wget -O- http://backend:5000/hello
```

### Database Data Persists After `docker-compose down`

This is expected! The `mysql_data` volume keeps data between runs. To completely remove data:

```bash
docker-compose down -v
```

### Memory/Performance Issues

If Docker is consuming too much memory:

```bash
# Stop all services
docker-compose stop

# Remove unused images and containers
docker image prune
docker container prune

# Restart
docker-compose up -d
```

## Environment Files

The application uses the following environment configuration:

**Backend** (set in docker-compose.yml):
- `FLASK_ENV=production` (runs without debug mode)
- `DATABASE_URL` points to MySQL container

**Frontend** (set in docker-compose.yml):
- `VITE_API_URL` points to backend container

These are automatically configured in the docker-compose.yml file.

## Development vs Production

### Development Mode (Local)
- Run `npm run dev` in frontend (Vite dev server)
- Run `python app.py` in backend (Flask debug mode)
- Run MySQL locally or with old Docker Compose setup

### Production Mode (Docker)
- Frontend built with Vite and served with `serve`
- Backend runs without debug mode
- All services isolated in containers
- Database persists in named volume
- Services communicate through network

## Security Notes

**For Production Deployments**:

1. **Change Database Credentials**:
   - Update `MYSQL_ROOT_PASSWORD` in docker-compose.yml
   - Update `DATABASE_URL` in docker-compose.yml
   - Update `MYSQL_PASSWORD` for app_user

2. **Use Environment Files**:
   ```bash
   # Create .env file
   echo "MYSQL_ROOT_PASSWORD=your_secure_password" > .env
   ```

3. **Restrict Port Access**:
   - Don't expose port 3306 (database) to the internet
   - Only expose 3000 (frontend) and optionally 5000 (API)

4. **Enable HTTPS**:
   - Use Nginx/reverse proxy in front
   - Obtain SSL certificates

## Common Commands

```bash
# Start everything fresh
docker-compose up -d --build

# View all logs
docker-compose logs -f

# Rebuild without starting
docker-compose build

# Execute command in running container
docker-compose exec backend python -c "print('Hello')"

# Shell into a container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec db bash

# View container stats
docker stats

# View specific service details
docker-compose exec db mysql -u root -ppassw0rd app_db -e "SHOW TABLES;"
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Test connectivity between services
4. Check the application documentation

---

**Last Updated**: 2024
**Application**: Task Manager
**Version**: 1.0.0 (Dockerized)
