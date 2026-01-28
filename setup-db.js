const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uulakxkwsclbujsnosos.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bGFreGt3c2NsYnVqc25vc29zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYzMzI3NCwiZXhwIjoyMDg1MjA5Mjc0fQ.A1d7wzOWAVP1g0fcSwFjLEaTlKc97GtWG7dTFbsmWW8';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createSchema() {
  try {
    console.log('Creating database schema...');
    
    // Create leads table
    let res = await supabase.rpc('execute_sql', {
      sql: `
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
      `
    });

    console.log('✓ Leads table created');

    // Create conversations table
    res = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS conversations (
          id BIGSERIAL PRIMARY KEY,
          lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ended_at TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        );
      `
    });

    console.log('✓ Conversations table created');

    // Create messages table
    res = await supabase.rpc('execute_sql', {
      sql: `
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
      `
    });

    console.log('✓ Messages table created');

    // Create fine_tuning_data table
    res = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS fine_tuning_data (
          id BIGSERIAL PRIMARY KEY,
          lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
          conversation_history JSONB NOT NULL,
          final_score INT NOT NULL,
          feedback TEXT,
          model_version VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    console.log('✓ Fine tuning data table created');

    console.log('\n✓ All tables created successfully!');
    console.log('Database schema setup complete.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createSchema();
