# PikaBot Cloud Deployment Walkthrough

## 🎯 Overview
You're deploying a 3-tier cloud application:
- **Database**: Supabase (PostgreSQL) - eu-west-1 Ireland
- **Backend**: Render (Express.js) - https://render.com
- **Frontend**: Vercel (React) - https://vercel.com

**Total time: ~15 minutes**

---

## Step 1️⃣: Deploy Database to Supabase (5 min)

### What you're doing:
Creating the database tables needed for the PikaBot to store leads, conversations, messages, and scoring data.

### Actions:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/uulakxkwsclbujsnosos/sql/new
   - You should see a blank SQL editor

2. **Copy the schema**
   - In your terminal, read `supabase-schema.sql`:
     ```bash
     cat /Users/admin/ai-lead-chatbot/supabase-schema.sql
     ```
   - Copy the entire content

3. **Paste into Supabase**
   - Paste all the SQL into the Supabase editor
   - Click the green **"Run"** button

4. **Verify tables were created**
   - You should see output: `✓ CREATE TABLE IF NOT EXISTS...`
   - Go to **Table Editor** in left sidebar
   - You should see these tables:
     - `leads`
     - `conversations`
     - `messages`
     - `fine_tuning_data`
     - `scoring_history`

✅ **Done!** Database is ready.

---

## Step 2️⃣: Deploy Backend to Render (5 min)

### What you're doing:
Deploying your Express.js backend server to Render. This will run the PikaBot AI engine and handle API requests.

### Actions:

1. **Go to Render Dashboard**
   - https://render.com/dashboard
   - Log in with GitHub (if you haven't already)

2. **Create New Web Service**
   - Click: **New +** > **Web Service**
   - Select repository: **teodorsanda/ai-lead-chatbot**
   - Click **Connect**

3. **Configure Service**
   - **Name**: `ai-lead-chatbot-api`
   - **Root Directory**: `server/`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
   - **Plan**: Free (or Pro if you prefer)

4. **Add Environment Variables**
   - Click **Environment**
   - Add these variables (copy from your `server/.env`):
   
   | Key | Value |
   |-----|-------|
   | `OPENAI_API_KEY` | (from your `.env`) |
   | `DATABASE_URL` | `postgresql://postgres:PikaSea2026!SecureDB123@db.uulakxkwsclbujsnosos.supabase.co:5432/postgres` |
   | `SUPABASE_URL` | `https://uulakxkwsclbujsnosos.supabase.co` |
   | `SUPABASE_ANON_KEY` | (from your `.env` or Supabase dashboard) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (from your `.env` or Supabase dashboard) |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |

5. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (2-3 minutes)
   - You'll see a URL like: `https://ai-lead-chatbot-api.onrender.com`
   - **Copy this URL** - you'll need it in Step 3!

6. **Verify Backend is Running**
   - Go to the Render deployment URL
   - Try: `https://ai-lead-chatbot-api.onrender.com/health`
   - You should see a JSON response like: `{"status":"ok"}`

✅ **Done!** Backend is live. Save the URL!

---

## Step 3️⃣: Deploy Frontend to Vercel (5 min)

### What you're doing:
Deploying your React frontend to Vercel. This is what users will see and interact with.

### Actions:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Log in with GitHub (if you haven't already)

2. **Add New Project**
   - Click: **Add New Project**
   - Select: **teodorsanda/ai-lead-chatbot** (from Import Git Repository)
   - Click **Import**

3. **Configure Project**
   - **Project Name**: (auto-filled, keep it)
   - **Framework Preset**: Select **Create React App**
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`

4. **Add Environment Variables**
   - Click **Environment Variables**
   - Add one variable:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: (paste the Render backend URL from Step 2)
     - Example: `https://ai-lead-chatbot-api.onrender.com`
   - Click **Add**

5. **Deploy**
   - Click **Deploy**
   - Wait for build and deployment (2-3 minutes)
   - You'll see a URL like: `https://ai-lead-chatbot-vercel.app`

6. **Verify Frontend is Running**
   - Click the deployment URL
   - You should see the PikaBot chat interface
   - Try typing a message and you should get a response!

✅ **Done!** Frontend is live!

---

## 🎉 Congratulations!

Your PikaBot is now deployed to the cloud with:

- ✅ **Frontend**: Vercel (React)
- ✅ **Backend**: Render (Express + GPT-5.2)
- ✅ **Database**: Supabase (PostgreSQL)
- ✅ **AI**: GPT-5.2 powered responses
- ✅ **Zero local resource usage**

### URLs for your chatbot:
- **Frontend**: (Your Vercel URL)
- **Backend**: (Your Render URL)
- **Database**: https://supabase.com/dashboard/project/uulakxkwsclbujsnosos

---

## 🆘 Troubleshooting

### Frontend won't connect to backend
- ❌ Problem: `REACT_APP_API_URL` not set
- ✅ Solution: Check Vercel Environment Variables, redeploy

### Backend returns 500 error
- ❌ Problem: Database not connected
- ✅ Solution: Verify DATABASE_URL in Render environment variables

### No GPT response from PikaBot
- ❌ Problem: OPENAI_API_KEY not set
- ✅ Solution: Add OPENAI_API_KEY to Render environment

### Database tables not found
- ❌ Problem: Schema not created
- ✅ Solution: Run supabase-schema.sql again in SQL editor

---

## 📞 Support

- **GitHub**: https://github.com/teodorsanda/ai-lead-chatbot
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
