# AI Lead Qualification Chatbot - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Chat Page    │  │  Dashboard   │  │ Fine-Tuning  │       │
│  │  - Realtime  │  │  - Metrics   │  │  - Export    │       │
│  │  - Scoring   │  │  - Analytics │  │  - Stats     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                │                    │              │
│         └────────────────┴────────────────────┘              │
│                         │                                    │
│              API Client (Axios) on Port 3000                │
└─────────────────────────────────────────────────────────────┘
                          │
                   ┌──────┴──────┐
                   │   NETWORK   │
                   │  (HTTP/REST)│
                   └──────┬──────┘
                          │
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js) on Port 3001              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ API Routes                                          │   │
│  │ ├─ /api/chat/message       (POST)                  │   │
│  │ ├─ /api/leads             (GET)                    │   │
│  │ ├─ /api/qualification     (GET/POST)               │   │
│  │ └─ /api/fine-tuning       (GET/POST)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────────────┐   │
│  │                      │                              │    │
│  ▼                      ▼                              ▼    │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │   OpenAI GPT-4│  │ Conversation │  │ Fine-Tuning  │      │
│ │   Service    │  │   Service    │  │   Service    │      │
│ │              │  │              │  │              │      │
│ │ - Qualify    │  │ - Chat mgmt  │  │ - Collect    │      │
│ │ - Score      │  │ - Scoring    │  │ - Export     │      │
│ │ - Recommend  │  │ - History    │  │ - Stats      │      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────────────┐   │
│  │                      │                              │    │
│  ▼                      ▼                              ▼    │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │     Lead     │  │ Conversation │  │ Fine-Tuning  │      │
│ │    Model     │  │    Model     │  │    Model     │      │
│ │              │  │              │  │              │      │
│ │ - CRUD       │  │ - Messages   │  │ - Recording  │      │
│ │ - Scoring    │  │ - History    │  │ - Export     │      │
│ │ - Analytics  │  │ - Status     │  │ - Stats      │      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │                │
└─────────┼─────────────────┼─────────────────┼────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────────────────────────────────────────┐
    │        PostgreSQL Database (Port 5432)        │
    │  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
    │  │  leads   │  │   msgs   │  │fine_tuning  │ │
    │  ├──────────┤  ├──────────┤  ├─────────────┤ │
    │  │ email    │  │ content  │  │ messages    │ │
    │  │ score    │  │ role     │  │ outcome     │ │
    │  │ status   │  │ conv_id  │  │ feedback    │ │
    │  └──────────┘  └──────────┘  └─────────────┘ │
    └──────────────────────────────────────────────┘
          │
          ▼
    ┌──────────────────────────────────────────────┐
    │      Redis Session Store (Port 6379)         │
    │  ┌──────────────────────────────────────┐   │
    │  │ session:{token}                      │   │
    │  │ ├─ leadId                            │   │
    │  │ ├─ conversationId                    │   │
    │  │ ├─ conversationHistory               │   │
    │  │ └─ lastActivity                      │   │
    │  └──────────────────────────────────────┘   │
    └──────────────────────────────────────────────┘
          │
          ▼
    ┌──────────────────────────────────────────────┐
    │    OpenAI GPT-4 API                     │
    │  ├─ Model: gpt-4-turbo       │
    │  ├─ Features: Qualified responses            │
    │  ├─ Scoring & recommendations               │
    │  └─ Fine-tuning ready                        │
    └──────────────────────────────────────────────┘
```

## Data Flow

### Chat Message Flow
```
1. User enters message in React component
   │
2. ChatWindow component captures input
   │
3. API client sends to: POST /api/chat/message
   │
4. Express route handler receives request
   │
5. Service retrieves session data from Redis
   │
6. Conversation history retrieved from PostgreSQL
   │
7. OpenAI Service calls OpenAI API with:
   - Conversation history
   - System prompt (qualification instructions)
   │
8. OpenAI GPT-4 returns:
   - Response message
   - Qualification score
   - Scoring factors
   - Recommendation
   │
9. Response saved to PostgreSQL (messages, scoring history)
   │
10. Session data updated in Redis
    │
11. Lead score updated in PostgreSQL
    │
12. API returns response to frontend
    │
13. React component updates UI with:
    - New message
    - Updated score visualization
    - Factor breakdown
    - Status badge
```

### Lead Qualification Scoring
```
User Message
    │
    ▼
OpenAI GPT-4 with System Prompt
    │
    ├─ Analyze budget indicators
    ├─ Assess timeline alignment
    ├─ Evaluate need fit
    ├─ Gauge engagement level
    ├─ Determine decision authority
    │
    ▼
Calculate Composite Score (0-100)
    │
    ├─ Average of 5 factors
    ├─ Update running score
    ├─ Track score history
    │
    ▼
Make Recommendation
    ├─ qualified (score ≥ 80)
    ├─ needs_more_info (50-80)
    └─ rejected (< 50)
    │
    ▼
Store in PostgreSQL
    ├─ Update lead.qualification_score
    ├─ Record in lead_scoring_history
    ├─ Update lead.qualification_status
    └─ Add scoring factors to message metadata
```

### Fine-Tuning Pipeline
```
Chat Conversation
    │
    ▼
Message stored in PostgreSQL
    │
    ├─ Role: 'user' | 'assistant'
    ├─ Content: message text
    ├─ Metadata: scores, factors
    │
    ▼
Conversation completed
    │
    ├─ Lead qualified/rejected/escalated
    ├─ Final score recorded
    │
    ▼
Fine-tuning data recorded
    │
    ├─ Collect all messages from conversation
    ├─ Add outcome (qualified/rejected/escalated)
    ├─ Store in fine_tuning_data table
    │
    ▼
Data Export & Retraining
    │
    ├─ GET /api/fine-tuning/export/jsonl
    ├─ Format as JSONL (one object per line)
    ├─ Include:
    │   - messages: [{role, content}]
    │   - metadata: {outcome, feedback}
    │
    ▼
OpenAI Fine-tuning API
    │
    ├─ Upload JSONL file
    ├─ Initiate training job
    ├─ Deploy updated model
    │
    ▼
Improved Model Performance
    │
    └─ Better lead scoring
    └─ More natural conversations
    └─ Higher conversion rates
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **HTTP Client**: Axios
- **UI Components**: Custom CSS components
- **Icons**: lucide-react
- **State Management**: React hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **LLM Client**: @anthropic-ai/sdk
- **Type Validation**: Zod

### Infrastructure
- **Database**: PostgreSQL 13+
- **Cache**: Redis 6+
- **LLM**: GPT-4 Turbo (OpenAI)
- **Protocols**: HTTP REST, JSON

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (state in Redis/PostgreSQL)
- Load balancer in front of multiple Express instances
- PostgreSQL connection pooling
- Redis cluster for session management

### Vertical Scaling
- PostgreSQL query optimization via indexes
- Redis TTL management (24-hour sessions)
- Message pagination for long conversations
- JSONL batch exports for efficient processing

### Performance Optimization
- Session caching in Redis (24-hour TTL)
- Database indexes on frequently queried columns
- Conversation streaming (not bulk-loaded)
- JSONL export for batch fine-tuning

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│ API Authentication & Authorization              │
├─────────────────────────────────────────────────┤
│ ├─ CORS configured for frontend URL             │
│ ├─ Session tokens generated per user            │
│ ├─ Redis session validation                     │
│ └─ Environment variable secrets management      │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Database Security                               │
├─────────────────────────────────────────────────┤
│ ├─ Parameterized queries (SQL injection proof)  │
│ ├─ PostgreSQL user permissions                  │
│ ├─ No sensitive data in logs                    │
│ └─ Automatic data cleanup (sessions TTL)        │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ External API Security                           │
├─────────────────────────────────────────────────┤
│ ├─ API key in environment variables only        │
│ ├─ Encrypted transmission to OpenAI          │
│ ├─ Rate limiting on API calls                   │
│ └─ Error handling without exposing secrets      │
└─────────────────────────────────────────────────┘
```
