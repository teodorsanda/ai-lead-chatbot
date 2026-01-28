# AI Lead Qualification Chatbot

A full-stack intelligent chatbot system for B2B lead qualification powered by OpenAI GPT-4 Turbo, featuring real-time conversation analysis, lead scoring, and fine-tuning capabilities.

## Features

🤖 **OpenAI Integration**
- Natural conversational interactions with human-like fidelity
- Structured lead qualification with scoring factors
- Objection handling and negotiation patterns
- Multi-turn context awareness

📊 **Lead Qualification System**
- Real-time qualification scoring (Budget, Timeline, Need Alignment, Engagement, Authority)
- Automatic lead status management (pending, qualified, rejected, in-progress)
- Lead conversion funnel analytics
- Historical scoring tracking

🎯 **Conversation Management**
- Session persistence with Redis
- Complete conversation history tracking
- Metadata enrichment for each interaction
- Multi-conversation support per lead

🔧 **Fine-Tuning Pipeline**
- Automatic conversation data collection
- JSONL export for model fine-tuning
- Outcome-based data organization (qualified, rejected, escalated)
- Fine-tuning performance metrics

📈 **Admin Dashboard**
- Real-time lead metrics and KPIs
- Conversion rate tracking
- Lead scoring distribution
- Filtering and sorting capabilities

## Project Structure

```
ai-lead-chatbot/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── index.ts       # Main server entry
│   │   ├── database.ts    # PostgreSQL setup
│   │   ├── services/      # Business logic
│   │   │   ├── claude.ts  # Claude AI service
│   │   │   └── redis.ts   # Redis session management
│   │   ├── models/        # Database models
│   │   │   ├── Lead.ts
│   │   │   ├── Conversation.ts
│   │   │   └── FineTuning.ts
│   │   ├── routes/        # API endpoints
│   │   │   ├── chat.ts
│   │   │   ├── leads.ts
│   │   │   ├── qualification.ts
│   │   │   └── fine-tuning.ts
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── ChatPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── FineTuning.tsx
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   ├── styles/        # CSS modules
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Claude API key (Anthropic)

## Installation

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb lead_qualification_db

# Database is automatically initialized on first server start
```

### 2. Backend Setup

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required: OPENAI_API_KEY, DATABASE_URL, REDIS_URL

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev:watch
```

The server will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd client

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Chat
- `POST /api/chat/message` - Send a message and get qualified response
- `GET /api/chat/conversation/:conversationId` - Get conversation history

### Leads
- `GET /api/leads` - List all leads with optional filtering
- `GET /api/leads/:leadId` - Get specific lead details
- `GET /api/leads/metrics/conversion` - Get conversion metrics

### Qualification
- `GET /api/qualification/lead/:leadId` - Get qualification details
- `POST /api/qualification/complete/:leadId` - Mark qualification as complete

### Fine-Tuning
- `GET /api/fine-tuning/data` - Get fine-tuning records
- `GET /api/fine-tuning/export/jsonl` - Export as JSONL for fine-tuning
- `GET /api/fine-tuning/stats` - Get fine-tuning statistics
- `POST /api/fine-tuning/record` - Record fine-tuning data

## Configuration

### Environment Variables

**Server (.env)**
```
ANTHROPIC_API_KEY=your_claude_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/lead_qualification_db
REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Client (.env)**
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Usage

### Starting the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev:watch

# Terminal 2 - Frontend
cd client
npm run dev
```

Open `http://localhost:3000` in your browser.

### Chat Interface
1. Enter lead email, name, and company
2. Start conversation with the AI chatbot
3. Watch real-time qualification scoring
4. Chat continues until lead is qualified/rejected or escalated

### Dashboard
- View all leads and their qualification status
- Track conversion metrics
- Filter by qualification status
- Monitor average scores and distribution

### Fine-Tuning
- View all collected conversation data
- Filter by outcome (qualified, rejected, escalated)
- Export data as JSONL for model retraining
- Monitor qualification rates and trends

## OpenAI Configuration

The system uses GPT-4 Turbo for optimal:
- Conversation fidelity and naturalness
- Negotiation and objection handling
- Structured JSON output generation
- Production reliability

System prompt automatically guides the model to:
- Ask strategic discovery questions
- Score leads on 5 qualification dimensions
- Build rapport and engagement
- Handle objections constructively
- Recommend qualification status

## Database Schema

### Leads Table
- `id` (UUID) - Primary key
- `email` - Unique email identifier
- `name` - Lead name
- `company` - Company name
- `phone` - Phone number
- `qualification_score` - Current score (0-100)
- `qualification_status` - Current status
- `source` - Lead source
- `metadata` - JSON metadata
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Conversations Table
- `id` (UUID) - Conversation ID
- `lead_id` (FK) - Associated lead
- `session_token` - Session identifier
- `status` - Conversation status
- `start_time` - Conversation start
- `end_time` - Conversation end (if completed)
- `metadata` - JSON metadata

### Messages Table
- `id` (UUID) - Message ID
- `conversation_id` (FK) - Associated conversation
- `role` - 'user' or 'assistant'
- `content` - Message content
- `metadata` - JSON metadata (scores, factors)
- `created_at` - Message timestamp

### Fine-Tuning Data Table
- `id` (UUID) - Record ID
- `conversation_id` (FK) - Associated conversation
- `messages` - Array of messages in conversation
- `outcome` - 'qualified', 'rejected', 'escalated'
- `feedback` - Optional feedback
- `created_at` - Record timestamp

## Performance Optimization

### Real-time Scoring
- Scores updated with each message turn
- Factors calculated continuously during conversation
- Redis caching for session state

### Conversation Efficiency
- Session persistence across browser reloads
- Minimal database queries per message
- Efficient conversation retrieval

### Fine-Tuning Pipeline
- Automatic data collection without overhead
- Batch export for efficient retraining
- Outcome-based filtering for targeted fine-tuning

## Customization

### Qualification Criteria
Edit the scoring factors in `server/src/services/claude.ts`:
- Budget assessment
- Timeline alignment
- Need fit
- Engagement level
- Decision authority

### UI Customization
- Modify styles in `client/src/styles/`
- Update colors and themes in CSS files
- Customize component behavior in React files

### System Prompt
Adjust qualification logic by modifying the `SYSTEM_PROMPT` in `server/src/services/claude.ts`

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify connection string in .env
# Format: postgresql://user:password@host:port/database
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Claude API Errors
- Verify `ANTHROPIC_API_KEY` is valid
- Check API rate limits
- Ensure Claude 3.5 Sonnet is available in your region

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf client/node_modules
npm install
npm run build
```

## Contributing

Contributions are welcome! Please:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub
