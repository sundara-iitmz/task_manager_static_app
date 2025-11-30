# Task Manager - Render.com Deployment Guide

## Overview
This guide explains how to deploy the Task Manager application to **Render.com** for FREE with automatic SSL/HTTPS.

**Deployment Platform:** Render.com
**Cost:** FREE (with limitations - 750 free dyno hours/month per service, auto-spins down after 15 min inactivity)
**Best For:** Demos, learning, student projects

---

## Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Free account at https://render.com

---

## Step-by-Step Deployment

### **Step 1: Push Code to GitHub**

```bash
# Add all changes
git add .

# Commit with a meaningful message
git commit -m "Prepare app for Render deployment"

# Push to GitHub
git push origin main
```

### **Step 2: Create Render Account**

1. Go to https://render.com
2. Click "Sign Up"
3. Sign up with your GitHub account (recommended)
4. Verify your email

### **Step 3: Create PostgreSQL Database**

Since MySQL is more complex on Render's free tier, we'll use PostgreSQL (free):

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. **Name:** `task-manager-db`
3. **Database:** `taskmanagerdb`
4. **User:** `taskmanager`
5. **Region:** Choose closest to you
6. **Pricing Plan:** FREE
7. Click **"Create Database"**
8. **Wait 2-3 minutes** for database to be ready
9. Copy the **Internal Database URL** (you'll need this)

Example format: `postgresql://taskmanager:password@host:5432/taskmanagerdb`

### **Step 4: Update Backend for PostgreSQL**

Your backend currently uses MySQL. Update it for PostgreSQL:

**File: `backend/requirements.txt`**

Replace:
```
PyMySQL==1.0.2
```

With:
```
psycopg2-binary==2.9.9
```

**File: `backend/app.py`**

Find the DATABASE_URL line and change it to accept PostgreSQL:

```python
# Old:
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:passw0rd@localhost:3306/app_db')

# New:
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://taskmanager:password@localhost:5432/taskmanagerdb')
```

### **Step 5: Deploy Backend Service**

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. **Connect Repository:**
   - Select your GitHub repo `task_manager_static_app`
   - Click "Connect"
3. **Service Details:**
   - **Name:** `task-manager-backend`
   - **Environment:** `Docker`
   - **Region:** Same as database
   - **Branch:** `main`
4. **Build Command:** (leave empty - uses Dockerfile)
5. **Start Command:** (leave empty - uses Dockerfile)
6. **Pricing Plan:** FREE
7. **Environment Variables:** Add these:
   ```
   FLASK_APP = app.py
   FLASK_ENV = production
   DATABASE_URL = postgresql://taskmanager:password@hostname:5432/taskmanagerdb
   ```
   (Paste your database URL from Step 3)

8. Click **"Create Web Service"**
9. **Wait 3-5 minutes** for deployment

**You'll get a URL like:** `https://task-manager-backend.onrender.com`

### **Step 6: Deploy Frontend Service**

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. **Connect Repository:**
   - Select your GitHub repo `task_manager_static_app`
   - Click "Connect"
3. **Service Details:**
   - **Name:** `task-manager-frontend`
   - **Environment:** `Docker`
   - **Region:** Same as backend
   - **Branch:** `main`
4. **Build Command:** (leave empty)
5. **Start Command:** (leave empty)
6. **Pricing Plan:** FREE
7. **Environment Variables:** Add:
   ```
   VITE_API_URL = https://task-manager-backend.onrender.com
   ```
8. Click **"Create Web Service"**
9. **Wait 3-5 minutes** for deployment

**You'll get a URL like:** `https://task-manager-frontend.onrender.com`

---

## **Step 7: Verify Deployment**

### Check Backend Logs
1. Go to Render dashboard → `task-manager-backend`
2. Click **"Logs"** tab
3. Look for:
   ```
   [OK] Database tables created successfully!
   * Running on http://...
   ```

### Test the Application
1. Visit: `https://task-manager-frontend.onrender.com`
2. Create a task
3. Refresh the page - task should persist
4. You now have a LIVE deployed app! 🎉

---

## Important Notes

### **Free Tier Limitations**
- Services spin down after 15 minutes of inactivity
- 750 free dyno hours per service per month
- If you have 2 services, that's ~15 days of 24/7 running
- For demo purposes, this is perfect!

### **Wake Up Service**
When service is asleep (gray screen), click it once to wake up - takes ~30 seconds.

### **Viewing Logs**
- Backend logs: `task-manager-backend` → **Logs** tab
- Frontend logs: `task-manager-frontend` → **Logs** tab

### **Making Changes**
1. Make code changes locally
2. Push to GitHub: `git push origin main`
3. Render auto-deploys! (Watch logs to confirm)
4. Usually deploys within 1-2 minutes

---

## **Demo Instructions for Students**

### **What to Show**

```markdown
## Live Task Manager Application

**Live URL:** https://task-manager-frontend.onrender.com

### How it Works
1. **Open the app** in your browser
2. **Create a task** - Type something and press Enter
3. **Task persists** - Refresh the page, task is still there!
4. **See the architecture:**
   - Frontend (React): task-manager-frontend.onrender.com
   - Backend (Flask): task-manager-backend.onrender.com
   - Database (PostgreSQL): Running on Render

### See the Code
- GitHub: https://github.com/sundara-iitmz/task_manager_static_app
- Docker: Containerized frontend and backend
- Automatic deployment on every git push

### Infrastructure
```
User Browser
    ↓
[Frontend] (React) - task-manager-frontend.onrender.com
    ↓
[Backend] (Flask) - task-manager-backend.onrender.com
    ↓
[Database] (PostgreSQL) - Managed by Render
```
```

### **Live Demo Tips**
1. Open the app in browser
2. Create a few tasks
3. Show GitHub commits triggering auto-deployment
4. Show Render logs in another tab
5. Explain how database persistence works
6. Mention cost (FREE!) vs traditional hosting

---

## Troubleshooting

### **Backend won't deploy**
- Check logs for `DATABASE_URL` errors
- Verify PostgreSQL connection string is correct
- Common error: `psycopg2` not installed (add to requirements.txt)

### **Frontend shows blank page**
- Check `VITE_API_URL` environment variable
- Should be: `https://task-manager-backend.onrender.com` (your actual backend URL)
- Open browser DevTools (F12) → Console for errors

### **Tasks not persisting**
- Backend database might not be initialized
- Check backend logs for `[OK] Database tables created`
- Try creating a task, then refresh browser

### **Service keeps spinning down**
- This is normal on free tier
- Services auto-spin up when accessed
- Just visit the URL to wake it up

---

## Next Steps

**For Production Use:**
- Upgrade to paid plans
- Add monitoring and alerting
- Use proper WSGI server (not Flask dev server)
- Set up continuous backups
- Add security headers and SSL verification

**For Learning:**
- Study the Dockerfile and docker-compose.yml
- Learn about environment variables
- Understand how databases work in cloud
- Explore Render's other services

---

## Files Modified for Deployment

```
task_manager_static_app/
├── backend/
│   ├── requirements.txt (updated: replaced PyMySQL with psycopg2)
│   └── app.py (updated: use PostgreSQL URL)
├── frontend/
│   ├── Dockerfile (unchanged)
│   └── .env.example (update VITE_API_URL)
├── docker-compose.yml (simplified for local dev)
├── render.yaml (NEW - Render deployment config)
└── RENDER_DEPLOYMENT.md (THIS FILE)
```

---

## Questions?

- **Render Docs:** https://render.com/docs
- **Docker Docs:** https://docs.docker.com
- **Flask Docs:** https://flask.palletsprojects.com
- **React Docs:** https://react.dev

Good luck! 🚀
