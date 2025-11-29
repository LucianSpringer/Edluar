import { DatabaseManager } from '../database/Database';

export class ReportRepository {
    private db = DatabaseManager.getInstance();

    async getOverview(startDate: string, endDate: string) {
        const metrics: any = {};

        try {
            // 1. Time to Hire (Avg days from applied to hired)
            const timeToHireQuery = `
                SELECT AVG(julianday(act.created_at) - julianday(app.applied_at)) as avg_days
                FROM applications app
                JOIN activities act ON app.id = act.application_id
                WHERE act.type = 'status_change' 
                AND act.content LIKE '%hired%'
                AND act.created_at BETWEEN ? AND ?
            `;
            const timeToHireRow = await this.db.get(timeToHireQuery, [startDate, endDate]);
            metrics.timeToHire = timeToHireRow?.avg_days ? Math.round(timeToHireRow.avg_days) : 0;

            // 2. Offer Acceptance Rate
            const offerQuery = `
                SELECT 
                    SUM(CASE WHEN status = 'hired' THEN 1 ELSE 0 END) as hired_count,
                    SUM(CASE WHEN status = 'offer' THEN 1 ELSE 0 END) as pending_offer_count
                FROM applications
                WHERE updated_at BETWEEN ? AND ?
            `;
            const offerRow = await this.db.get(offerQuery, [startDate, endDate]);
            const hired = offerRow?.hired_count || 0;
            const pending = offerRow?.pending_offer_count || 0;
            const totalOffers = hired + pending;
            metrics.offerAcceptanceRate = totalOffers > 0 ? Math.round((hired / totalOffers) * 100) : 0;

            // 3. Active Pipeline Volume
            const pipelineQuery = `
                SELECT COUNT(*) as count
                FROM applications
                WHERE status NOT IN ('hired', 'rejected', 'withdrawn')
                AND applied_at BETWEEN ? AND ?
            `;
            const pipelineRow = await this.db.get(pipelineQuery, [startDate, endDate]);
            metrics.activePipeline = pipelineRow?.count || 0;

            // 4. Funnel
            const funnelQuery = `
                SELECT status, COUNT(*) as count
                FROM applications
                WHERE applied_at BETWEEN ? AND ?
                GROUP BY status
            `;
            metrics.funnel = await this.db.all(funnelQuery, [startDate, endDate]);

            // 5. Source Effectiveness
            const sourceQuery = `
                SELECT source, COUNT(*) as count
                FROM applications
                WHERE applied_at BETWEEN ? AND ?
                GROUP BY source
            `;
            metrics.sources = await this.db.all(sourceQuery, [startDate, endDate]);

            // 6. Department Breakdown
            const deptQuery = `
                SELECT j.department, COUNT(*) as count
                FROM applications a
                JOIN job_openings j ON a.job_id = j.id
                WHERE a.status = 'hired'
                AND a.updated_at BETWEEN ? AND ?
                GROUP BY j.department
            `;
            metrics.departments = await this.db.all(deptQuery, [startDate, endDate]);

            return metrics;

        } catch (err) {
            console.error("ReportRepository Error:", err);
            throw err;
        }
    }
}
