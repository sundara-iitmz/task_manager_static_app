# Quick Start: Deploy to Render.com in 5 Minutes

> **Cost:** FREE
> **Time:** ~5-10 minutes
> **Result:** Live, production-ready URL with HTTPS

---

## TL;DR - The Fast Path

1. **Create accounts:**
   - Render.com (free) - https://render.com (sign up with GitHub)

2. **Create PostgreSQL database:**
   - In Render dashboard → **New +** → **PostgreSQL**
   - Name: `task-manager-db`
   - Database: `taskmanagerdb`
   - User: `taskmanager`
   - Plan: **FREE**
   - Copy the **Internal Database URL** (looks like: `postgresql://taskmanager:password@dpg-xxx.onrender.com:5432/taskmanagerdb`)

3. **Deploy Backend:**
   - Render → **New +** → **Web Service**
   - Select repository: `task_manager_static_app`
   - Name: `task-manager-backend`
   - Environment: `Docker`
   - Plan: **FREE**
   - Add environment variables:
     ```
     FLASK_APP = app.py
     FLASK_ENV = production
     DATABASE_URL = <paste your PostgreSQL URL from step 2>
     ```
   - Deploy! ✅
   - **Copy the backend URL** (example: `https://task-manager-backend.onrender.com`)

4. **Deploy Frontend:**
   - Render → **New +** → **Web Service**
   - Select repository: `task_manager_static_app`
   - Name: `task-manager-frontend`
   - Environment: `Docker`
   - Plan: **FREE**
   - Add environment variable:
     ```
     VITE_API_URL = <paste your backend URL from step 3>
     ```
   - Deploy! ✅

5. **Done! Your app is live:**
   - Visit: `https://task-manager-frontend.onrender.com`
   - Create tasks
   - Refresh the page - tasks persist! 🎉

---

## Detailed Instructions

See **RENDER_DEPLOYMENT.md** for full step-by-step guide with screenshots and troubleshooting.

---

## What Just Happened?

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet Users                           │
│                         ↓                                    │
│              https://your-app.onrender.com                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                      RENDER CLOUD                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Frontend Service (React)                             │  │
│  │ - Node.js running "serve" to serve React build      │  │
│  │ - Dockerfile automatically builds and deploys       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Backend Service (Flask)                              │  │
│  │ - Python Flask API server                            │  │
│  │ - Handles all /api/tasks requests                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Database Service (PostgreSQL)                        │  │
│  │ - Managed PostgreSQL database                        │  │
│  │ - Stores all your tasks persistently                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Points

### ✅ What's Included
- Automatic HTTPS/SSL
- Auto-deploys when you push to GitHub
- Free PostgreSQL database with 256MB storage
- Free tier services have 750 dyno hours/month

### ⚠️ Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- ~750 free hours per month (enough for demo, not 24/7 production)
- Limited to 1 PostgreSQL database

### 🔄 How Updates Work
1. Make code changes locally
2. Push to GitHub: `git push origin dockerised_app`
3. Render automatically detects changes
4. Auto-rebuilds and redeploys (1-2 minutes)
5. Check logs in Render dashboard

---

## Demo Script for Students

```markdown
## Live Production Demo

### 1. Show the Live App (30 seconds)
- Open https://task-manager-frontend.onrender.com
- Create a few tasks
- Refresh the page → tasks persist!
- Mention: This is running in the cloud, not on my computer

### 2. Show the Architecture (1 minute)
- Open Render dashboard
- Show three services:
  - Frontend (React)
  - Backend (Flask API)
  - Database (PostgreSQL)
- Explain: Each runs in its own container in the cloud

### 3. Show Auto-Deployment (2 minutes)
- Make a small change locally (e.g., update title)
- Push to GitHub
- Watch Render automatically detect and deploy
- Show logs in real-time
- Wait 1-2 minutes, refresh app → changes live

### 4. Show Database (1 minute)
- Backend logs show queries happening
- Explain: Data persists in PostgreSQL
- Even if we restart, tasks are still there

### 5. Talk About Cost
- This setup: FREE
- Features: HTTPS, auto-deploy, database, monitoring
- Why: Designed for learning and demos
- At scale: Would need paid plans
```

---

## Troubleshooting

### **Backend won't deploy**
- Check logs for database URL errors
- Verify `DATABASE_URL` environment variable is set
- Should start with `postgresql://`

### **Frontend shows blank page**
- Open browser DevTools (F12)
- Check Console for errors
- Usually: `VITE_API_URL` is wrong
- Make sure it points to your backend URL

### **Tasks don't persist**
- Backend might not have created tables
- Check backend logs for `[OK] Database tables created`
- Try refreshing the page

### **Service keeps spinning down**
- This is normal on free tier!
- Just visit the URL to wake it up (takes 30 seconds)

---

## Next Steps

**For Students to Learn:**
1. Read the code - understand how frontend calls backend
2. Make changes locally, test with `docker-compose up`
3. Push to GitHub and see auto-deploy in action
4. Check logs to debug issues
5. Understand how databases work in the cloud

**For Production (Later):**
1. Upgrade Render plan to keep services always on
2. Use proper WSGI server (not Flask dev server)
3. Add authentication and security headers
4. Set up monitoring and alerts
5. Use CI/CD pipeline with tests

---

## Useful Links

- **Render Docs:** https://render.com/docs
- **Your Repository:** https://github.com/sundara-iitmz/task_manager_static_app
- **Render Dashboard:** https://dashboard.render.com

---

**Questions? See RENDER_DEPLOYMENT.md for detailed instructions.**

Good luck! 🚀
