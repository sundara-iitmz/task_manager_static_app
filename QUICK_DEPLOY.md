# Quick Deploy Guide

## TL;DR - Deploy in 3 Steps

```bash
# 1. Clone (if not already cloned)
git clone <your-repo-url>
cd task_manager_static_app

# 2. Start Docker
docker-compose up -d

# 3. Open browser
open http://localhost:3000
```

## That's It! 🎉

Your application is now running with:
- **Frontend**: http://localhost:3000 (React/Vite)
- **Backend API**: http://localhost:5000 (Flask)
- **Database**: localhost:3306 (MySQL)

## Verify Everything Works

```bash
# Check all services are running
docker-compose ps

# Should show 3 containers all with status "Up"
```

## Stop When Done

```bash
# Stop all services
docker-compose stop

# Or remove everything (keeps data)
docker-compose down

# Or remove everything including data
docker-compose down -v
```

## View Logs

```bash
# All logs
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend

# Just database
docker-compose logs -f db
```

## Test the API

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task desc","status":"pending"}'
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 already in use | `lsof -i :3000` to find process, or edit docker-compose.yml |
| Port 5000 already in use | `lsof -i :5000` to find process, or edit docker-compose.yml |
| Services won't start | Run `docker-compose logs` to see errors |
| Frontend can't reach API | Wait 15s and refresh, check `docker-compose ps` |
| Database errors | Run `docker-compose logs db` to see MySQL issues |

## For More Info

- **Detailed Guide**: Read `DOCKER_SETUP.md`
- **Deployment Reference**: Read `DEPLOYMENT.md`
- **Architecture**: Read `DOCKER_SUMMARY.txt`

---

**That's everything you need to know to deploy!** 🚀
