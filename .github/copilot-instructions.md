<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Lead Qualification Chatbot - Development Guide

## Project Overview
Full-stack AI chatbot for B2B lead qualification with Claude AI, real-time scoring, and fine-tuning capabilities.

## Architecture

### Backend (Node.js/Express/TypeScript)
- REST API with Express.js
- PostgreSQL for persistent storage
- Redis for session management
- Claude API integration for conversational AI
- Structured data models for leads, conversations, and scoring

### Frontend (React/TypeScript)
- Single Page Application (SPA)
- Real-time chat interface
- Lead dashboard with metrics
- Fine-tuning data management
- Responsive design

### Key Technologies
- **LLM**: Claude 3.5 Sonnet (Anthropic)
- **Database**: PostgreSQL with optimized schema
- **Caching**: Redis for session persistence
- **Frontend Framework**: React 18 with TypeScript
- **API**: RESTful with JSON payloads

## Development Workflow

### File Structure Guidelines
- `server/src/services/` - Business logic (Claude integration, data processing)
- `server/src/models/` - Database queries and data models
- `server/src/routes/` - API endpoint handlers
- `client/src/components/` - Reusable React components
- `client/src/pages/` - Page-level components
- `client/src/services/` - API client and external service integration

### Testing & Validation
- TypeScript strict mode for type safety
- API endpoints tested via REST client or curl
- Frontend components tested in browser dev tools
- Database migrations automatic on server startup

### Common Tasks

#### Adding a New API Endpoint
1. Create route handler in `server/src/routes/`
2. Add model method if needed in `server/src/models/`
3. Update type definitions in `server/src/types/`
4. Add to Express app in `server/src/index.ts`

#### Adding Fine-Tuning Features
1. Modify Claude system prompt in `server/src/services/claude.ts`
2. Update scoring factors in data collection
3. Export new data format in fine-tuning routes
4. Test with JSONL export

#### UI Enhancements
1. Create components in `client/src/components/`
2. Update styles in `client/src/styles/`
3. Add types in `client/src/types/`
4. Import and use in page components

## Claude AI System Prompt

The system prompt defines qualification behavior:
- **5 Scoring Dimensions**: Budget, Timeline, Need Alignment, Engagement, Authority
- **Conversational Strategy**: Discovery questions → objection handling → qualification
- **Output Format**: Structured JSON with scores and recommendations
- **Fine-tuning Ready**: Conversation data automatically collected for retraining

## Performance Considerations

- Session data cached in Redis (24-hour TTL)
- Database queries indexed on `email`, `status`, `created_at`
- Conversation history streamed, not loaded entirely
- JSONL export for efficient fine-tuning batches

## Security Notes

- Sensitive data (API keys) in environment variables only
- CORS configured for frontend URL
- PostgreSQL parameterized queries prevent SQL injection
- Redis used only for session storage (no sensitive data persisted)

## Deployment Considerations

- Docker support (add Dockerfile for containerization)
- Database migrations run automatically
- Environment-specific configurations via .env files
- Frontend built as static assets for CDN distribution

## Next Steps for Enhancement

1. **Authentication**: Add user login for lead management
2. **Real-time Updates**: WebSocket for live dashboard updates
3. **Email Integration**: Send lead summaries via email
4. **Analytics**: Detailed conversion funnel analysis
5. **A/B Testing**: Test different conversation strategies
6. **Multi-language**: Localize for different markets
