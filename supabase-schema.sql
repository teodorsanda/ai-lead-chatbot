-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(255),
  company VARCHAR(255),
  website VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  qualification_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  scoring_factors JSONB,
  qualification_score INT,
  recommendation VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fine_tuning_data table
CREATE TABLE IF NOT EXISTS fine_tuning_data (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  conversation_history JSONB NOT NULL,
  final_score INT NOT NULL,
  feedback TEXT,
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scoring history table for analytics
CREATE TABLE IF NOT EXISTS scoring_history (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  score INT NOT NULL,
  factors JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_fine_tuning_lead_id ON fine_tuning_data(lead_id);
CREATE INDEX IF NOT EXISTS idx_scoring_history_lead_id ON scoring_history(lead_id);

-- Enable RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_tuning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write (for development - restrict in production)
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on conversations" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on fine_tuning_data" ON fine_tuning_data FOR ALL USING (true);
CREATE POLICY "Allow all operations on scoring_history" ON scoring_history FOR ALL USING (true);
