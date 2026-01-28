@echo off
REM Quick Start Script for AI Lead Qualification Chatbot (Windows)

echo 🚀 Setting up AI Lead Qualification Chatbot...
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm: %NPM_VERSION%
echo.

REM Backend Setup
echo 📦 Setting up backend...
cd server

if not exist .env (
    echo    Creating .env from template...
    copy .env.example .env >nul
    echo    ⚠️  Edit server\.env with your ANTHROPIC_API_KEY and database settings
)

echo    Installing dependencies...
call npm install >nul 2>&1

echo    Building TypeScript...
call npm run build >nul 2>&1
echo ✅ Backend ready!
echo.

REM Frontend Setup
echo 📦 Setting up frontend...
cd ..\client

if not exist .env (
    echo    Creating .env from template...
    copy .env.example .env >nul
)

echo    Installing dependencies...
call npm install >nul 2>&1
echo ✅ Frontend ready!
echo.

echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo 📝 Next steps:
echo.
echo 1. Configure environment variables:
echo    - Edit server\.env with your ANTHROPIC_API_KEY
echo    - Verify DATABASE_URL and REDIS_URL
echo.
echo 2. Start the application (in separate terminals):
echo.
echo    Terminal 1 - Backend:
echo    $ cd server && npm run dev:watch
echo.
echo    Terminal 2 - Frontend:
echo    $ cd client && npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 4. Start chatting with leads!
echo.
echo 📚 For detailed setup instructions, see README.md
echo ========================================
