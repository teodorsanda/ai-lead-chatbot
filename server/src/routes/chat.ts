import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as LeadModel from '../models/Lead';
import * as ConversationModel from '../models/Conversation';
import { qualifyLead, QualificationMessage } from '../services/claude';
import { setSessionData, getSessionData } from '../services/redis';

const router = Router();

interface ChatRequest {
  leadId?: string;
  sessionToken?: string;
  leadEmail?: string;
  leadName?: string;
  leadCompany?: string;
  message: string;
}

router.post('/message', async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      leadId,
      sessionToken,
      leadEmail,
      leadName,
      leadCompany,
      message,
    } = req.body as ChatRequest;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    let currentLeadId = leadId;
    let currentSessionToken = sessionToken || uuidv4();

    // Get or create lead
    if (!currentLeadId) {
      if (!leadEmail) {
        return res.status(400).json({ error: 'Either leadId or leadEmail is required' });
      }

      let lead = await LeadModel.getLeadByEmail(leadEmail);
      if (!lead) {
        lead = await LeadModel.createLead(
          leadEmail,
          leadName || 'Unknown',
          leadCompany
        );
      }
      currentLeadId = lead.id;
    }

    // Get session data
    let sessionData = await getSessionData(currentSessionToken);
    let conversationId = sessionData?.conversationId;
    let conversationHistory: QualificationMessage[] = sessionData?.history || [];

    // Create conversation if needed
    if (!conversationId) {
      const conversation = await ConversationModel.createConversation(
        currentLeadId,
        currentSessionToken
      );
      conversationId = conversation.id;
    }

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Store user message in database
    await ConversationModel.addMessage(conversationId, 'user', message);

    // Get Claude response with qualification
    const claudeResponse = await qualifyLead(conversationHistory);

    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: claudeResponse.message,
    });

    // Store assistant message in database
    await ConversationModel.addMessage(
      conversationId,
      'assistant',
      claudeResponse.message,
      {
        qualificationScore: claudeResponse.qualificationScore,
        scoringFactors: claudeResponse.scoringFactors,
      }
    );

    // Update lead score
    const avgScore = Math.round(
      (claudeResponse.scoringFactors.budget +
        claudeResponse.scoringFactors.timeline +
        claudeResponse.scoringFactors.needAlignment +
        claudeResponse.scoringFactors.engagement +
        claudeResponse.scoringFactors.authority) /
        5
    );

    await LeadModel.updateLeadScore(currentLeadId, avgScore, claudeResponse.scoringFactors);

    // Update lead status based on recommendation
    if (claudeResponse.recommendation === 'qualified') {
      await LeadModel.updateLeadStatus(currentLeadId, 'qualified');
    } else if (claudeResponse.recommendation === 'rejected') {
      await LeadModel.updateLeadStatus(currentLeadId, 'rejected');
    } else {
      await LeadModel.updateLeadStatus(currentLeadId, 'in-progress');
    }

    // Save session data
    await setSessionData(
      currentSessionToken,
      {
        leadId: currentLeadId,
        conversationId,
        history: conversationHistory,
        lastActivity: new Date().toISOString(),
      },
      86400 // 24 hours
    );

    res.json({
      conversationId,
      sessionToken: currentSessionToken,
      leadId: currentLeadId,
      message: claudeResponse.message,
      qualificationScore: avgScore,
      scoringFactors: claudeResponse.scoringFactors,
      recommendation: claudeResponse.recommendation,
      nextQuestion: claudeResponse.nextQuestion,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/conversation/:conversationId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { conversationId } = req.params;

    const conversation = await ConversationModel.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await ConversationModel.getConversationMessages(conversationId);

    res.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

export default router;
