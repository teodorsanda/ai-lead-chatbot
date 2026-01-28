import { Router, Request, Response } from 'express';
import * as FineTuningModel from '../models/FineTuning';

const router = Router();

router.get('/data', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 5000);
    const offset = parseInt(req.query.offset as string) || 0;
    const outcome = req.query.outcome as string | undefined;

    const data = await FineTuningModel.getFineTuningData(limit, offset, outcome);
    const stats = await FineTuningModel.getFineTuningStats();

    res.json({
      data,
      stats,
      pagination: { limit, offset },
    });
  } catch (error) {
    console.error('Error fetching fine-tuning data:', error);
    res.status(500).json({ error: 'Failed to fetch fine-tuning data' });
  }
});

router.get('/export/jsonl', async (req: Request, res: Response) => {
  try {
    const outcome = req.query.outcome as string | undefined;

    let data;
    if (outcome) {
      data = await FineTuningModel.getFineTuningDataByOutcome(
        outcome as any
      );
    } else {
      data = await FineTuningModel.getFineTuningData(10000, 0);
    }

    // Format as JSONL for fine-tuning
    const jsonl = data
      .map((record) => {
        return JSON.stringify({
          messages: record.messages,
          metadata: {
            outcome: record.outcome,
            feedback: record.feedback,
          },
        });
      })
      .join('\n');

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=fine-tuning-data.jsonl'
    );
    res.send(jsonl);
  } catch (error) {
    console.error('Error exporting fine-tuning data:', error);
    res.status(500).json({ error: 'Failed to export fine-tuning data' });
  }
});

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await FineTuningModel.getFineTuningStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching fine-tuning stats:', error);
    res.status(500).json({ error: 'Failed to fetch fine-tuning stats' });
  }
});

router.post('/record', async (req: Request, res: Response) => {
  try {
    const { conversationId, messages, outcome, feedback } = req.body;

    const record = await FineTuningModel.recordFineTuningData(
      conversationId,
      messages,
      outcome,
      feedback
    );

    res.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('Error recording fine-tuning data:', error);
    res.status(500).json({ error: 'Failed to record fine-tuning data' });
  }
});

export default router;
