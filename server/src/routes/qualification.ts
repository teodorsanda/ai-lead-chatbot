import { Router, Request, Response } from 'express';
import * as ConversationModel from '../models/Conversation';
import * as LeadModel from '../models/Lead';

const router = Router();

router.get('/lead/:leadId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { leadId } = req.params;

    const lead = await LeadModel.getLead(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const conversations = await ConversationModel.getLeadConversations(leadId);

    // Build comprehensive qualification data
    const allMessages: any[] = [];
    let totalScore = 0;
    let conversationCount = 0;

    for (const conversation of conversations) {
      const messages = await ConversationModel.getConversationMessages(conversation.id);
      allMessages.push(...messages);
      conversationCount++;

      // Extract scores from metadata
      const assistantMessages = messages.filter((m) => m.role === 'assistant');
      if (assistantMessages.length > 0) {
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        if (lastMessage.metadata?.qualificationScore) {
          totalScore += lastMessage.metadata.qualificationScore;
        }
      }
    }

    const avgScore = conversationCount > 0 ? totalScore / conversationCount : 0;

    res.json({
      lead,
      qualificationData: {
        conversationCount,
        totalMessages: allMessages.length,
        averageScore: Math.round(avgScore),
        lastInteraction: conversations[0]?.endTime || conversations[0]?.startTime,
        scoringFactors: {
          budget: lead.metadata?.budget || 0,
          timeline: lead.metadata?.timeline || 0,
          needAlignment: lead.metadata?.needAlignment || 0,
          engagement: lead.metadata?.engagement || 0,
          authority: lead.metadata?.authority || 0,
        },
      },
      recentConversations: conversations.slice(0, 5),
    });
  } catch (error) {
    console.error('Error getting qualification details:', error);
    return res.status(500).json({ error: 'Failed to get qualification details' });
  }
});

router.post('/complete/:leadId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    if (!['qualified', 'rejected', 'escalated'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await LeadModel.updateLeadStatus(leadId, status as any);

    const lead = await LeadModel.getLead(leadId);

    res.json({
      success: true,
      lead,
      message: `Lead marked as ${status}`,
    });
  } catch (error) {
    console.error('Error completing qualification:', error);
    return res.status(500).json({ error: 'Failed to complete qualification' });
  }
});

export default router;
