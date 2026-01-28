import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function initializeDatabase() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0]);
    await createTablesIfNotExist();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
}

async function createTablesIfNotExist() {
  const client = await pool.connect();
  try {
    await client.query(`
      -- Leads table
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(20),
        qualification_score DECIMAL(5, 2) DEFAULT 0,
        qualification_status VARCHAR(50) DEFAULT 'pending', -- pending, qualified, rejected, in-progress
        source VARCHAR(100),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Conversations table
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        session_token VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active', -- active, completed, escalated
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        metadata JSONB DEFAULT '{}',
        FOREIGN KEY (lead_id) REFERENCES leads(id)
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL, -- user, assistant
        content TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      );

      -- Lead scoring history
      CREATE TABLE IF NOT EXISTS lead_scoring_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        score DECIMAL(5, 2),
        factors JSONB, -- JSON object with scoring factors
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id)
      );

      -- Fine-tuning data collection
      CREATE TABLE IF NOT EXISTS fine_tuning_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
        messages JSONB NOT NULL, -- Array of {role, content}
        outcome VARCHAR(50), -- qualified, rejected, escalated
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(qualification_status);
      CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
      CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_scoring_lead ON lead_scoring_history(lead_id);
      CREATE INDEX IF NOT EXISTS idx_fine_tuning_outcome ON fine_tuning_data(outcome);
    `);
    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('✗ Failed to create tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

export function getPool() {
  return pool;
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function closeDatabase() {
  await pool.end();
}
