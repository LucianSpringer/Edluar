import { Request, Response } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';

const reportRepo = new ReportRepository();

export class ReportController {
    static async getOverview(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;

            // Default to last 30 days if not provided
            const end = endDate ? String(endDate) : new Date().toISOString();
            const start = startDate ? String(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

            const data = await reportRepo.getOverview(start, end);
            res.json(data);
        } catch (error) {
            console.error('Error fetching report overview:', error);
            res.status(500).json({ error: 'Failed to fetch report overview' });
        }
    }

    static async getDashboardMetrics(req: Request, res: Response) {
        try {
            const [disqualification, interviews, timeToResponse] = await Promise.all([
                reportRepo.getDisqualificationBreakdown(),
                reportRepo.getInterviewCount(),
                reportRepo.getAvgTimeToResponse()
            ]);

            res.json({
                disqualification,
                interviews,
                timeToResponse
            });
        } catch (error) {
            console.error('Error fetching report metrics:', error);
            res.status(500).json({ error: 'Failed to fetch metrics' });
        }
    }
}
