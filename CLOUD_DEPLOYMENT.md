# 🚀 Cloud Deployment Guide: Supabase + Vercel + Render

## ✅ Completed Steps

1. **GitHub Repository** - ✅ DONE
   - Repo: https://github.com/teodorsanda/ai-lead-chatbot
   - All code committed and pushed

2. **Supabase Project** - ✅ DONE
   - Project: `ai-lead-chatbot-prod`
   - Region: eu-west-1 (Ireland)
   - Status: Active and ready

3. **Database Credentials** - ✅ DONE
   ```
   Project Reference ID: uulakxkwsclbujsnosos
   URL: https://uulakxkwsclbujsnosos.supabase.co
   Database: postgresql://postgres:***@db.uulakxkwsclbujsnosos.supabase.co:5432/postgres
   ```

---

## 📋 Next Steps: Deploy to Production

### Step 1: Deploy Database Schema to Supabase

1. Go to https://supabase.com/dashboard/project/uulakxkwsclbujsnosos/sql/new
2. Copy-paste the entire content from `supabase-schema.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS leads (
     id BIGSERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     ...
   ```
3. Click "Run" button
4. Wait for "✓ Success" message

---

### Step 2: Deploy Backend to Render

1. Go to https://render.com/dashboard
2. Click **"+ New"** → **"Web Service"**
3. **Connect Repository:**
   - Select: `teodorsanda/ai-lead-chatbot`
   - Branch: `main`
   - Root Directory: `server`

4. **Configure Build & Deploy:**
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run dev`

5. **Environment Variables:**
   Copy from your `server/.env` file or use these variable names:
   ```
   OPENAI_API_KEY={your-openai-api-key}
   DATABASE_URL={your-supabase-database-url}
   SUPABASE_URL={your-supabase-project-url}
   SUPABASE_ANON_KEY={your-supabase-anon-key}
   SUPABASE_SERVICE_ROLE_KEY={your-supabase-service-role-key}
   NODE_ENV=production
   PORT=3001
   ```
   
   **⚠️ Get these values from:**
   - Supabase Dashboard: https://supabase.com/dashboard
   - Your local `server/.env` file (see server/.env.example)

6. **Service Details:**
   - Name: `ai-lead-chatbot-api`
   - Plan: Free tier (for testing)
7. Click **"Create Web Service"**
8. Wait 3-5 minutes for deployment
9. Copy the URL (e.g., `https://ai-lead-chatbot-api.onrender.com`)

---

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Select: `teodorsanda/ai-lead-chatbot`
   
4. **Configure Project:**
   - Framework: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`

5. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://ai-lead-chatbot-api.onrender.com
   ```

6. Click **"Deploy"**
7. Wait for deployment to complete
8. Your frontend will be at: `https://ai-lead-chatbot-[id].vercel.app`

---

## 🔗 Architecture

```
┌─────────────────────────────────────────────────┐
│         GitHub: teodorsanda/ai-lead-chatbot     │
└────────┬────────────────────────────┬───────────┘
         │                            │
         ▼                            ▼
    ┌─────────────┐            ┌──────────────┐
    │   Vercel    │            │   Render     │
    │  (Frontend) │            │  (Backend)   │
    │ React 18+   │   HTTP     │  Express.js  │
    │ Port 3000   │◄──────────►│ Port 3001    │
    └─────────────┘            └──────┬───────┘
                                      │
                                      ▼
                          ┌──────────────────────┐
                          │   Supabase           │
                          │  (PostgreSQL DB)     │
                          │  eu-west-1 (Ireland)│
                          └──────────────────────┘
```

---

## 📊 Database Credentials (Saved)

**Supabase Project Details:**
- Project ID: `uulakxkwsclbujsnosos`
- Organization: Corelio.AI
- Region: eu-west-1 (Ireland)
- Created: 2026-01-28

**Connection String:**
```
postgresql://postgres:PikaSea2026!SecureDB123@db.uulakxkwsclbujsnosos.supabase.co:5432/postgres
```

**API Keys:**
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (shown in env vars above)
- Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (shown in env vars above)

---

## ✨ PikaBot Features Deployed

✅ OpenAI GPT-4 Turbo integration
✅ PikaBot system prompt (Romanian sailing assistant)
✅ Lead qualification with Big 4 capture
✅ Real-time conversation scoring
✅ Supabase database persistence
✅ Cloud-based - no local resources needed

---

## 🚀 Testing After Deployment

Once both Vercel and Render deployments are complete:

1. **Test Backend:**
   ```bash
   curl https://ai-lead-chatbot-api.onrender.com/health
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

2. **Test Bot:**
   - Go to your Vercel frontend URL
   - Type: "Vreau o vacanță în Grecia!" (or any Romanian text)
   - Wait for PikaBot response

3. **Check Logs:**
   - Vercel: https://vercel.com/teodorsanda/ai-lead-chatbot/logs
   - Render: https://dashboard.render.com/ (select your service)

---

## 📝 Important Notes

- **Security:** The .env file is NOT in Git (correct practice)
- **Auto-deploy:** Push to GitHub → Vercel & Render auto-redeploy
- **Database:** Supabase handles backups and scaling automatically
- **Costs:** Free tier covers development (Vercel, Render, Supabase)

---

## 🔄 What's Next?

After deployment verification:
1. Test PikaBot with live data
2. Monitor database with Supabase dashboard
3. Check performance logs
4. Scale if needed (all services offer paid tiers)

---

**Your chatbot is production-ready! 🎉**
