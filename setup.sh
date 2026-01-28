#!/bin/bash

# Quick Start Script for AI Lead Qualification Chatbot

set -e

echo "🚀 Setting up AI Lead Qualification Chatbot..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd server

if [ ! -f .env ]; then
    echo "   Creating .env from template..."
    cp .env.example .env
    echo "   ⚠️  Edit server/.env with your ANTHROPIC_API_KEY and database settings"
fi

echo "   Installing dependencies..."
npm install > /dev/null 2>&1

echo "   Building TypeScript..."
npm run build > /dev/null 2>&1
echo "✅ Backend ready!"
echo ""

# Frontend Setup
echo "📦 Setting up frontend..."
cd ../client

if [ ! -f .env ]; then
    echo "   Creating .env from template..."
    cp .env.example .env
fi

echo "   Installing dependencies..."
npm install > /dev/null 2>&1
echo "✅ Frontend ready!"
echo ""

echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit server/.env with your ANTHROPIC_API_KEY"
echo "   - Verify DATABASE_URL and REDIS_URL"
echo ""
echo "2. Start the application (in separate terminals):"
echo ""
echo "   Terminal 1 - Backend:"
echo "   $ cd server && npm run dev:watch"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   $ cd client && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "4. Start chatting with leads!"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo "========================================"
