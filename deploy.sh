#!/bin/bash

# PikaBot Cloud Deployment Script
# Deploys to Render + Vercel + Supabase

set -e

echo "🚀 PikaBot Cloud Deployment Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}Installing Render CLI...${NC}"
    npm install -g render-cli
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo ""
echo -e "${BLUE}Step 1: Deploy Backend to Render${NC}"
echo "===================================="
echo ""
echo "Opening Render dashboard..."
echo "1. Go to: https://render.com/dashboard"
echo "2. Click 'New Web Service'"
echo "3. Connect repo: teodorsanda/ai-lead-chatbot"
echo "4. Fill in:"
echo "   - Name: ai-lead-chatbot-api"
echo "   - Root directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm run dev"
echo "5. Add these environment variables:"
echo "   - OPENAI_API_KEY={your-key}"
echo "   - DATABASE_URL={your-supabase-url}"
echo "   - SUPABASE_URL={your-supabase-url}"
echo "   - SUPABASE_ANON_KEY={your-anon-key}"
echo "   - SUPABASE_SERVICE_ROLE_KEY={your-service-key}"
echo "6. Click Deploy"
echo ""
read -p "Press Enter when Render deployment is complete..."
read -p "Enter your Render backend URL (e.g., https://ai-lead-chatbot-api.onrender.com): " BACKEND_URL

echo ""
echo -e "${BLUE}Step 2: Create Supabase Tables${NC}"
echo "===================================="
echo ""
echo "Opening Supabase SQL editor..."
echo "1. Go to: https://supabase.com/dashboard/project/uulakxkwsclbujsnosos/sql/new"
echo "2. Copy the entire content of supabase-schema.sql"
echo "3. Paste it in the SQL editor"
echo "4. Click Run"
echo ""
read -p "Press Enter when Supabase tables are created..."

echo ""
echo -e "${BLUE}Step 3: Deploy Frontend to Vercel${NC}"
echo "===================================="
echo ""
echo "Deploying to Vercel..."
export REACT_APP_API_URL="$BACKEND_URL"
cd client
vercel --prod --yes
cd ..

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "===================================="
echo ""
echo "Your PikaBot is now live!"
echo "Frontend: Check your Vercel dashboard for the URL"
echo "Backend: $BACKEND_URL"
echo ""
echo "🎉 PikaBot with GPT-5.2 is ready to chat!"
