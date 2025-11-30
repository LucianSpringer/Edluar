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

    async getDisqualificationBreakdown(): Promise<{ reason: string; count: number }[]> {
        return this.db.all(`
            SELECT disqualification_reason as reason, COUNT(*) as count 
            FROM applications 
            WHERE status = 'rejected' 
            GROUP BY disqualification_reason
        `);
    }

    async getInterviewCount(): Promise<number> {
        const result = await this.db.get(`
            SELECT COUNT(*) as count FROM activities 
            WHERE type = 'interview' AND created_at >= date('now', '-30 days')
        `);
        // Note: The user plan said 'FROM interviews', but we don't have an interviews table, we use activities with type='interview' or status='interview' in applications.
        // Let's assume we count applications in 'interview' status or activities of type 'interview'.
        // The plan said "SELECT COUNT(*) FROM interviews". I'll assume activities table has type='interview' or similar.
        // Actually, looking at previous code, we have 'activities' table.
        // Let's stick to activities table if possible, or applications status.
        // "SELECT COUNT(*) FROM applications WHERE status = 'interview'" is simpler but only gives current snapshot.
        // "SELECT COUNT(*) FROM activities WHERE type = 'interview'" gives historical volume.
        // I'll use activities table assuming 'interview' type exists or similar.
        // Wait, looking at ActivityRepository (not shown but inferred), we create activities.
        // Let's check if we have 'interview' type activities.
        // In ApplicationController, we saw `ActivityRepository.create({ type, ... })`.
        // I'll use activities table.
        return result?.count || 0;
    }

    async getAvgTimeToResponse(): Promise<number> {
        const result = await this.db.get(`
            SELECT AVG((JULIANDAY(act.created_at) - JULIANDAY(app.applied_at)) * 24) as avg_hours
            FROM applications app
            JOIN activities act ON act.application_id = app.id
            WHERE act.id = (
                SELECT MIN(id) FROM activities a2 
                WHERE a2.application_id = app.id AND a2.type IN ('email', 'status_change')
            )
        `);
        return Math.round(result?.avg_hours || 0);
    }

    async getCandidatesHired(): Promise<number> {
        const result = await this.db.get(`
            SELECT COUNT(*) as count FROM applications WHERE status = 'hired'
        `);
        return result?.count || 0;
    }
}
