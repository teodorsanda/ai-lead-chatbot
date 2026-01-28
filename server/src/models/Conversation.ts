import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  leadId: string;
  sessionToken: string;
  status: 'active' | 'completed' | 'escalated';
  startTime: Date;
  endTime?: Date;
  metadata?: Record<string, any>;
}

export async function createConversation(
  leadId: string,
  sessionToken: string
): Promise<Conversation> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO conversations (id, lead_id, session_token)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, leadId, sessionToken]
  );
  return formatConversation(result.rows[0]);
}

export async function getConversation(
  conversationId: string
): Promise<Conversation | null> {
  const result = await query(
    'SELECT * FROM conversations WHERE id = $1',
    [conversationId]
  );
  return result.rows.length ? formatConversation(result.rows[0]) : null;
}

export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const result = await query(
    `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows.map(formatMessage);
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: Record<string, any>
): Promise<Message> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO messages (id, conversation_id, role, content, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, conversationId, role, content, JSON.stringify(metadata || {})]
  );
  return formatMessage(result.rows[0]);
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'completed' | 'escalated'
): Promise<void> {
  const endTime = status !== 'active' ? new Date() : null;
  await query(
    `UPDATE conversations SET status = $1, end_time = $2 WHERE id = $3`,
    [status, endTime, conversationId]
  );
}

export async function getLeadConversations(leadId: string): Promise<Conversation[]> {
  const result = await query(
    `SELECT * FROM conversations WHERE lead_id = $1 ORDER BY start_time DESC`,
    [leadId]
  );
  return result.rows.map(formatConversation);
}

function formatConversation(row: any): Conversation {
  return {
    id: row.id,
    leadId: row.lead_id,
    sessionToken: row.session_token,
    status: row.status,
    startTime: new Date(row.start_time),
    endTime: row.end_time ? new Date(row.end_time) : undefined,
    metadata: row.metadata,
  };
}

function formatMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    metadata: row.metadata,
    createdAt: new Date(row.created_at),
  };
}
