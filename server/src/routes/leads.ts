import { Router, Request, Response } from 'express';
import * as LeadModel from '../models/Lead';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    const qualified = req.query.qualified === 'true';

    let leads;
    if (qualified) {
      const minScore = parseFloat(req.query.minScore as string) || 70;
      leads = await LeadModel.getQualifiedLeads(minScore, limit, offset);
    } else {
      leads = await LeadModel.getAllLeads(limit, offset);
    }

    const metrics = await LeadModel.getLeadConversionMetrics();

    res.json({
      leads,
      metrics,
      pagination: { limit, offset },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.get('/:leadId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { leadId } = req.params;

    const lead = await LeadModel.getLead(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

router.get('/metrics/conversion', async (_req: Request, res: Response): Promise<any> => {
  try {
    const metrics = await LeadModel.getLeadConversionMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
