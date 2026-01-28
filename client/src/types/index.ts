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
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  sessionToken: string;
  status: 'active' | 'completed' | 'escalated';
  startTime: string;
  endTime?: string;
  metadata?: Record<string, any>;
}

export interface ScoringFactors {
  budget: number;
  timeline: number;
  needAlignment: number;
  engagement: number;
  authority: number;
}
