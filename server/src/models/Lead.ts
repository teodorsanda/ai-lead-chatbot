import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

export interface Lead {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  qualificationScore: number;
  qualificationStatus: string;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export async function createLead(
  email: string,
  name: string,
  company?: string,
  phone?: string,
  source?: string
): Promise<Lead> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO leads (id, email, name, company, phone, source)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id, email, name, company, phone, source]
  );
  return formatLead(result.rows[0]);
}

export async function getLead(leadId: string): Promise<Lead | null> {
  const result = await query('SELECT * FROM leads WHERE id = $1', [leadId]);
  return result.rows.length ? formatLead(result.rows[0]) : null;
}

export async function getLeadByEmail(email: string): Promise<Lead | null> {
  const result = await query('SELECT * FROM leads WHERE email = $1', [email]);
  return result.rows.length ? formatLead(result.rows[0]) : null;
}

export async function updateLeadScore(
  leadId: string,
  score: number,
  factors: Record<string, number>
): Promise<void> {
  // Update lead qualification score
  await query(
    `UPDATE leads SET qualification_score = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [score, leadId]
  );

  // Record scoring history
  await query(
    `INSERT INTO lead_scoring_history (lead_id, score, factors)
     VALUES ($1, $2, $3)`,
    [leadId, score, JSON.stringify(factors)]
  );
}

export async function updateLeadStatus(
  leadId: string,
  status: 'pending' | 'qualified' | 'rejected' | 'in-progress'
): Promise<void> {
  await query(
    `UPDATE leads SET qualification_status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [status, leadId]
  );
}

export async function getQualifiedLeads(
  minScore: number = 70,
  limit: number = 50,
  offset: number = 0
): Promise<Lead[]> {
  const result = await query(
    `SELECT * FROM leads
     WHERE qualification_score >= $1 AND qualification_status = 'qualified'
     ORDER BY qualification_score DESC, updated_at DESC
     LIMIT $2 OFFSET $3`,
    [minScore, limit, offset]
  );
  return result.rows.map(formatLead);
}

export async function getAllLeads(
  limit: number = 100,
  offset: number = 0
): Promise<Lead[]> {
  const result = await query(
    `SELECT * FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows.map(formatLead);
}

export async function getLeadConversionMetrics() {
  const result = await query(`
    SELECT
      COUNT(*) as total_leads,
      COUNT(CASE WHEN qualification_status = 'qualified' THEN 1 END) as qualified_leads,
      COUNT(CASE WHEN qualification_status = 'rejected' THEN 1 END) as rejected_leads,
      COUNT(CASE WHEN qualification_status = 'in-progress' THEN 1 END) as in_progress_leads,
      ROUND(AVG(qualification_score), 2) as avg_score,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY qualification_score) as median_score
    FROM leads
  `);
  return result.rows[0];
}

function formatLead(row: any): Lead {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    phone: row.phone,
    qualificationScore: parseFloat(row.qualification_score || 0),
    qualificationStatus: row.qualification_status,
    source: row.source,
    metadata: row.metadata,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
