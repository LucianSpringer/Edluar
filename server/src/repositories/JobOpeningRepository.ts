import { DatabaseManager } from '../database/Database';

interface JobOpening {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    content_blocks: string | null; // JSON string
    application_form_config: string | null; // JSON string
    theme_config: string | null; // JSON string
    scorecard_config?: string; // JSON string
    department: string | null;
    location: string | null;
    employment_type: string;
    status: string;
    headcount?: number;
    page_content_json?: string;
    view_count?: number;
    created_at: string;
    updated_at: string;
    close_date?: string;
    reply_time_limit?: number;
}

interface CreateJobOpeningData {
    userId: number;
    title: string;
    description?: string;
    content_blocks?: string; // JSON string
    application_form_config?: string; // JSON string
    theme_config?: string; // JSON string
    scorecard_config?: string; // JSON string
    department?: string;
    location?: string;
    employmentType?: string;
    status?: string;
    close_date?: string;
    reply_time_limit?: number;
}

/**
 * JobOpeningRepository - Repository Pattern for Job Postings
 * Volume-dominant data layer for recruitment pipeline management
 */
export class JobOpeningRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    /**
     * Find all job openings for a user
     */
    static async findByUserId(userId: number): Promise<JobOpening[]> {
        return this.getDB().all(`
            SELECT j.*, 
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as candidate_count,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'interview') as interview_count,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'offer') as offer_count
            FROM job_openings j
            WHERE j.user_id = ?
            ORDER BY j.created_at DESC
        `, [userId]);
    }

    /**
     * Find job opening by ID
     */
    static async findById(id: number): Promise<JobOpening | undefined> {
        return this.getDB().get('SELECT * FROM job_openings WHERE id = ?', [id]);
    }

    /**
     * Create new job opening
     */
    static async create(data: CreateJobOpeningData): Promise<JobOpening> {
        const result = await this.getDB().run(
            `INSERT INTO job_openings (user_id, title, description, content_blocks, application_form_config, theme_config, scorecard_config, department, location, employment_type, status, close_date, reply_time_limit)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId,
                data.title,
                data.description || null,
                data.content_blocks || null,
                data.application_form_config || null,
                data.theme_config || null,
                data.scorecard_config || null,
                data.department || null,
                data.location || null,
                data.employmentType || 'full-time',
                data.status || 'active',
                data.close_date || null,
                data.reply_time_limit || 3
            ]
        );

        const newJob = await this.findById(Number(result.lastID));
        if (!newJob) {
            throw new Error('Failed to create job opening');
        }

        return newJob;
    }

    /**
     * Update job opening
     */
    static async update(id: number, data: Partial<CreateJobOpeningData>): Promise<JobOpening> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.title) {
            updates.push('title = ?');
            values.push(data.title);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.content_blocks !== undefined) {
            updates.push('content_blocks = ?');
            values.push(data.content_blocks);
        }
        if (data.application_form_config !== undefined) {
            updates.push('application_form_config = ?');
            values.push(data.application_form_config);
        }
        if (data.theme_config !== undefined) {
            updates.push('theme_config = ?');
            values.push(data.theme_config);
        }
        if (data.scorecard_config !== undefined) {
            updates.push('scorecard_config = ?');
            values.push(data.scorecard_config);
        }
        if (data.department !== undefined) {
            updates.push('department = ?');
            values.push(data.department);
        }
        if (data.location !== undefined) {
            updates.push('location = ?');
            values.push(data.location);
        }
        if (data.employmentType !== undefined) {
            updates.push('employment_type = ?');
            values.push(data.employmentType);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.close_date !== undefined) {
            updates.push('close_date = ?');
            values.push(data.close_date);
        }
        if (data.reply_time_limit !== undefined) {
            updates.push('reply_time_limit = ?');
            values.push(data.reply_time_limit);
        }

        if (updates.length === 0) {
            return this.findById(id) as Promise<JobOpening>;
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await this.getDB().run(
            `UPDATE job_openings SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Job opening not found');
        }

        return updated;
    }

    /**
     * Delete job opening with cascading delete of dependencies
     */
    static async delete(id: number): Promise<boolean> {
        const db = this.getDB();

        try {
            await db.run('BEGIN TRANSACTION');

            // 1. Get all applications for this job
            const applications = await db.all('SELECT id FROM applications WHERE job_id = ?', [id]);

            // 2. Delete activities for each application
            for (const app of applications) {
                await db.run('DELETE FROM activities WHERE application_id = ?', [app.id]);
            }

            // 3. Delete applications
            await db.run('DELETE FROM applications WHERE job_id = ?', [id]);

            // 4. Delete the job opening
            const result = await db.run('DELETE FROM job_openings WHERE id = ?', [id]);

            await db.run('COMMIT');
            return result.changes > 0;
        } catch (error) {
            await db.run('ROLLBACK');
            console.error('Failed to delete job:', error);
            throw error;
        }
    }

    /**
     * Find active job openings
     */
    static async findActive(userId: number): Promise<JobOpening[]> {
        return this.getDB().all('SELECT * FROM job_openings WHERE user_id = ? AND status = ?', [userId, 'active']);
    }
}
