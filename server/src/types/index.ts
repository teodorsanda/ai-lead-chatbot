export interface ChatRequest {
  leadId: string;
  sessionToken: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  conversationId: string;
  message: string;
  qualificationScore: number;
  scoringFactors: {
    budget: number;
    timeline: number;
    needAlignment: number;
    engagement: number;
    authority: number;
  };
  recommendation?: 'qualified' | 'rejected' | 'needs_more_info';
  nextQuestion?: string;
  metadata?: Record<string, any>;
}

export interface LeadQualificationData {
  leadId: string;
  email: string;
  name: string;
  company?: string;
  conversationCount: number;
  totalMessages: number;
  qualificationScore: number;
  status: string;
  scoringFactors: Record<string, number>;
  lastInteraction: Date;
}
