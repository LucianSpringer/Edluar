import { DatabaseManager } from '../database/Database';

interface Application {
    id: number;
    job_id: number;
    candidate_id: number;
    status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'hired' | 'rejected';
    source: string;
    applied_at: string;
    updated_at: string;
}

interface CreateApplicationData {
    jobId: number;
    candidateId: number;
    status?: string;
    source?: string;
}

export class ApplicationRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    /**
     * Create new application
     */
    static async create(data: CreateApplicationData): Promise<Application> {
        const result = await this.getDB().run(
            `INSERT INTO applications (job_id, candidate_id, status, source)
             VALUES (?, ?, ?, ?)`,
            [
                data.jobId,
                data.candidateId,
                data.status || 'applied',
                data.source || 'Direct'
            ]
        );

        const newApplication = await this.findById(Number(result.lastID));
        if (!newApplication) {
            throw new Error('Failed to create application');
        }

        return newApplication;
    }

    /**
     * Find application by ID
     */
    static async findById(id: number): Promise<Application | undefined> {
        return this.getDB().get('SELECT * FROM applications WHERE id = ?', [id]);
    }

    /**
     * Get all applications for a job (grouped for Kanban)
     */
    static async findByJobId(jobId: number): Promise<Application[]> {
        return this.getDB().all(
            `SELECT a.*, 
                    c.first_name, c.last_name, c.email, c.resume_url
             FROM applications a
             JOIN candidates c ON a.candidate_id = c.id
             WHERE a.job_id = ?
             ORDER BY a.applied_at DESC`,
            [jobId]
        );
    }

    /**
     * Update application stage
     */
    static async updateStage(id: number, newStage: string): Promise<Application> {
        await this.getDB().run(
            `UPDATE applications 
             SET status = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [newStage, id]
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Application not found');
        }

        return updated;
    }

    static async updateAIAnalysis(id: number, analysisJson: string): Promise<void> {
        await this.getDB().run('UPDATE applications SET ai_analysis = ? WHERE id = ?', [analysisJson, id]);
    }

    /**
     * Check if candidate already applied to this job
     */
    static async findByJobAndCandidate(jobId: number, candidateId: number): Promise<Application | undefined> {
        return this.getDB().get(
            'SELECT * FROM applications WHERE job_id = ? AND candidate_id = ?',
            [jobId, candidateId]
        );
    }

    /**
     * Count hired candidates for a job
     */
    static async countHired(jobId: number): Promise<number> {
        const result = await this.getDB().get(
            'SELECT COUNT(*) as count FROM applications WHERE job_id = ? AND status = ?',
            [jobId, 'hired']
        );
        return result?.count || 0;
    }

    /**
     * Get applications by status (for analytics)
     */
    static async findByStatus(status: string): Promise<Application[]> {
        return this.getDB().all(
            'SELECT * FROM applications WHERE status = ? ORDER BY applied_at DESC',
            [status]
        );
    }
    /**
     * Find all applications
     */
    static async findAll(): Promise<Application[]> {
        return this.getDB().all(
            `SELECT a.*, 
                    c.first_name, c.last_name, c.email, c.resume_url
             FROM applications a
             JOIN candidates c ON a.candidate_id = c.id
             ORDER BY a.updated_at DESC, a.applied_at DESC`
        );
    }
    /**
     * Find all applications for a specific candidate (History)
     */
    static async findHistoryByCandidateId(candidateId: number): Promise<any[]> {
        return this.getDB().all(
            `SELECT a.*, j.title as job_title, j.department, j.location
             FROM applications a
             JOIN job_openings j ON a.job_id = j.id
             WHERE a.candidate_id = ?
             ORDER BY a.applied_at DESC`,
            [candidateId]
        );
    }
    /**
     * Reject an application with a reason
     */
    static async reject(id: number, reason: string): Promise<void> {
        await this.getDB().run(
            `UPDATE applications 
             SET status = 'rejected', disqualification_reason = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [reason, id]
        );
    }
}
