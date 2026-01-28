import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

export interface FineTuningRecord {
  id: string;
  conversationId?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  outcome?: 'qualified' | 'rejected' | 'escalated';
  feedback?: string;
  createdAt: Date;
}

export async function recordFineTuningData(
  conversationId: string | undefined,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  outcome?: 'qualified' | 'rejected' | 'escalated',
  feedback?: string
): Promise<FineTuningRecord> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO fine_tuning_data (id, conversation_id, messages, outcome, feedback)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, conversationId, JSON.stringify(messages), outcome, feedback]
  );
  return formatFineTuningRecord(result.rows[0]);
}

export async function getFineTuningData(
  limit: number = 1000,
  offset: number = 0,
  outcome?: string
): Promise<FineTuningRecord[]> {
  let queryStr = 'SELECT * FROM fine_tuning_data';
  const params: any[] = [];

  if (outcome) {
    queryStr += ' WHERE outcome = $1';
    params.push(outcome);
  }

  queryStr += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(queryStr, params);
  return result.rows.map(formatFineTuningRecord);
}

export async function getFineTuningDataByOutcome(
  outcome: 'qualified' | 'rejected' | 'escalated'
): Promise<FineTuningRecord[]> {
  const result = await query(
    `SELECT * FROM fine_tuning_data WHERE outcome = $1 ORDER BY created_at DESC`,
    [outcome]
  );
  return result.rows.map(formatFineTuningRecord);
}

export async function getFineTuningStats() {
  const result = await query(`
    SELECT
      COUNT(*) as total_records,
      COUNT(CASE WHEN outcome = 'qualified' THEN 1 END) as qualified_count,
      COUNT(CASE WHEN outcome = 'rejected' THEN 1 END) as rejected_count,
      COUNT(CASE WHEN outcome = 'escalated' THEN 1 END) as escalated_count,
      ROUND(
        COUNT(CASE WHEN outcome = 'qualified' THEN 1 END)::numeric /
        COUNT(*)::numeric * 100, 2
      ) as qualification_rate
    FROM fine_tuning_data
  `);
  return result.rows[0];
}

function formatFineTuningRecord(row: any): FineTuningRecord {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    messages: Array.isArray(row.messages) ? row.messages : JSON.parse(row.messages || '[]'),
    outcome: row.outcome,
    feedback: row.feedback,
    createdAt: new Date(row.created_at),
  };
}
