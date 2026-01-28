# 📑 Project Files Index

## Complete File Listing

### Root Level Documentation
```
/ai-lead-chatbot/
├── README.md                    Main project documentation (comprehensive setup & usage)
├── QUICKSTART.md               5-minute setup and usage guide
├── PROJECT_SUMMARY.md          Complete project overview and features
├── ARCHITECTURE.md             System architecture and data flows
├── CHANGELOG.md                Version history
├── .gitignore                  Git ignore rules
├── setup.sh                    Unix/macOS automated setup script
└── setup.bat                   Windows automated setup script
```

### Backend (Express.js + TypeScript)
```
/server/
├── package.json                Dependencies and scripts
├── tsconfig.json               TypeScript configuration
├── .env.example                Environment template (COPY THIS TO .env)
│
├── src/
│   ├── index.ts                🚀 Server entry point (HTTP server setup)
│   ├── database.ts             🗄️ PostgreSQL connection & table creation
│   │
│   ├── services/               📦 Business logic layer
│   │   ├── claude.ts           🤖 OpenAI GPT-4 integration (qualification scoring)
│   │   └── redis.ts            💾 Redis session management
│   │
│   ├── models/                 📋 Database models (CRUD operations)
│   │   ├── Lead.ts             👤 Lead data management
│   │   ├── Conversation.ts     💬 Conversation & message management
│   │   └── FineTuning.ts       🎓 Fine-tuning data collection
│   │
│   ├── routes/                 🛣️ API endpoints
│   │   ├── chat.ts             Chat messaging endpoint
│   │   ├── leads.ts            Lead retrieval & metrics
│   │   ├── qualification.ts    Qualification details & status
│   │   └── fine-tuning.ts      Fine-tuning data & export
│   │
│   ├── types/                  🔤 TypeScript type definitions
│   │   └── index.ts            Shared types (ChatRequest, ChatResponse, etc.)
│   │
│   └── utils/                  🔧 Utility functions (currently empty)
│
└── README.md                   Backend-specific documentation
```

**Backend Endpoints:**
- `POST /api/chat/message` - Send message and get AI response with scoring
- `GET /api/chat/conversation/:id` - Get conversation history
- `GET /api/leads` - List leads with filtering
- `GET /api/leads/:id` - Get specific lead
- `GET /api/leads/metrics/conversion` - Get conversion metrics
- `GET /api/qualification/lead/:id` - Get detailed qualification data
- `POST /api/qualification/complete/:id` - Mark lead as complete
- `GET /api/fine-tuning/data` - Get fine-tuning records
- `GET /api/fine-tuning/export/jsonl` - Export as JSONL
- `GET /api/fine-tuning/stats` - Get fine-tuning statistics
- `POST /api/fine-tuning/record` - Record training data

### Frontend (React + TypeScript)
```
/client/
├── package.json                Dependencies and scripts
├── tsconfig.json               TypeScript configuration
├── .env.example                Environment template (COPY THIS TO .env)
│
├── src/
│   ├── index.tsx               📍 React app entry point
│   ├── App.tsx                 🏠 Main app component (routing)
│   │
│   ├── pages/                  📄 Page components
│   │   ├── ChatPage.tsx        💬 Chat interface page
│   │   ├── Dashboard.tsx       📊 Lead dashboard page
│   │   └── FineTuning.tsx      🎓 Fine-tuning management page
│   │
│   ├── components/             🧩 Reusable components
│   │   └── ChatWindow.tsx      Chat UI component
│   │
│   ├── services/               🔌 API layer
│   │   └── api.ts              Axios API client (all endpoints)
│   │
│   ├── types/                  🔤 TypeScript types
│   │   └── index.ts            Lead, Message, Conversation types
│   │
│   └── styles/                 🎨 CSS stylesheets
│       ├── index.css           Global styles
│       ├── App.css             App layout & navigation
│       ├── ChatWindow.css      Chat UI styling
│       ├── Dashboard.css       Dashboard styling
│       └── FineTuning.css      Fine-tuning UI styling
│
├── public/
│   └── index.html              HTML template
│
└── README.md                   Frontend-specific documentation
```

**Frontend Pages:**
- `/` (Chat) - Real-time lead qualification chat
- `/dashboard` - Lead analytics and metrics
- `/fine-tuning` - Training data management

### Configuration
```
/.github/
└── copilot-instructions.md    Development guidelines and architecture notes
```

---

## 📊 File Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| TypeScript Files | 15 | Backend services, models, routes |
| React Components | 5 | Frontend pages and components |
| CSS Stylesheets | 5 | UI styling and responsive design |
| Configuration | 8 | TypeScript, npm, environment |
| Documentation | 7 | Setup guides, architecture, changelog |
| Scripts | 2 | Setup automation |
| **Total** | **42** | Complete full-stack application |

---

## 🔄 Key File Dependencies

### Backend Flow
```
index.ts (Server)
├── database.ts (PostgreSQL setup)
├── services/
│   ├── claude.ts (OpenAI GPT-4)
│   └── redis.ts (Session cache)
├── models/ (Database queries)
│   ├── Lead.ts
│   ├── Conversation.ts
│   └── FineTuning.ts
└── routes/ (API endpoints)
    ├── chat.ts
    ├── leads.ts
    ├── qualification.ts
    └── fine-tuning.ts
```

### Frontend Flow
```
index.tsx (React entry)
└── App.tsx (Main component)
    ├── pages/
    │   ├── ChatPage.tsx
    │   ├── Dashboard.tsx
    │   └── FineTuning.tsx
    ├── components/
    │   └── ChatWindow.tsx
    ├── services/
    │   └── api.ts (Axios client)
    └── styles/ (CSS modules)
```

---

## 🚀 Quick File Reference

### To Start Server
Edit: `server/.env` (add ANTHROPIC_API_KEY)
Run: `server/package.json` scripts
- `npm run dev:watch` - Development server
- `npm run build` - TypeScript compilation
- `npm start` - Production server

### To Start Frontend
Edit: `client/.env` (API_URL)
Run: `client/package.json` scripts
- `npm run dev` - Development server
- `npm run build` - Production build

### To Customize Behavior
Edit: `server/src/services/claude.ts`
- SYSTEM_PROMPT - AI qualification behavior
- Scoring logic and factors

### To Modify UI
Edit: `client/src/styles/*.css`
- Color scheme in CSS variables
- Component layouts and responsive design

### To Add API Features
Edit: `server/src/routes/*.ts`
- Create new route files
- Add models in `server/src/models/`
- Update types in `server/src/types/`

---

## 📚 Documentation Map

| Document | Purpose | Read When... |
|----------|---------|--------------|
| [README.md](README.md) | Complete guide | First time setup |
| [QUICKSTART.md](QUICKSTART.md) | 5-min setup | Want quick start |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Overview | Want feature overview |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | Want technical deep dive |
| [CHANGELOG.md](CHANGELOG.md) | Version history | Want release info |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Dev guidelines | Contributing code |

---

## 🔐 Environment Variables

### Server .env
```
OPENAI_API_KEY=sk-proj-...              # OpenAI API key (REQUIRED)
DATABASE_URL=postgresql://user:pwd@...   # PostgreSQL connection
REDIS_URL=redis://localhost:6379         # Redis connection
PORT=3001                                # Server port
NODE_ENV=development                     # Environment
FRONTEND_URL=http://localhost:3000       # CORS origin
FINE_TUNING_ENABLED=true                 # Fine-tuning feature flag
```

### Client .env
```
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 🏗️ Project Architecture Summary

### Layered Architecture
```
┌─────────────────────────────────────┐
│      Frontend (React/TypeScript)     │ Port 3000
│  Chat | Dashboard | Fine-tuning      │
└──────────────────┬──────────────────┘
                   │ HTTP REST
┌──────────────────▼──────────────────┐
│   Backend (Express/TypeScript)       │ Port 3001
│  Routes → Services → Models → DB     │
└──────────┬──────────────────┬────────┘
           │                  │
    ┌──────▼────────┐  ┌──────▼────────┐
    │  PostgreSQL   │  │    Redis      │
    │  (Persistence)│  │   (Sessions)  │
    └───────────────┘  └───────────────┘
           │
    ┌──────▼──────────────────┐
    │  OpenAI GPT-4 API   │
    │  (AI Qualification)     │
    └────────────────────────┘
```

---

## 📦 Dependencies Included

### Backend
- express (REST API framework)
- @anthropic-ai/sdk (Claude AI client)
- pg (PostgreSQL driver)
- redis (Redis client)
- typescript (Type safety)
- uuid (Session/ID generation)
- zod (Type validation)

### Frontend
- react (UI framework)
- typescript (Type safety)
- axios (HTTP client)
- lucide-react (Icons)

---

## ✅ Everything Included

✅ Complete backend with all services
✅ Complete frontend with all pages
✅ Database schema and migrations
✅ API endpoints fully implemented
✅ OpenAI GPT-4 integration ready
✅ Fine-tuning pipeline setup
✅ Comprehensive documentation
✅ Setup automation scripts
✅ TypeScript throughout
✅ Professional styling
✅ Type definitions
✅ Environment templates

---

## 🎯 Next Steps

1. **Review [QUICKSTART.md](QUICKSTART.md)** for immediate setup
2. **Copy `.env.example` to `.env`** in both server and client
3. **Add your ANTHROPIC_API_KEY** to server/.env
4. **Run setup scripts** or `npm install` in both directories
5. **Start servers** in separate terminals
6. **Open http://localhost:3000** and start chatting!

---

**Total Project Files: 42**
**Ready to Deploy! 🚀**
