import { DatabaseManager } from '../database/Database';

interface JobOpening {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    department: string | null;
    location: string | null;
    employment_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface CreateJobOpeningData {
    userId: number;
    title: string;
    description?: string;
    department?: string;
    location?: string;
    employmentType?: string;
    status?: string;
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
        return this.getDB().all('SELECT * FROM job_openings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
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
            `INSERT INTO job_openings (user_id, title, description, department, location, employment_type, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId,
                data.title,
                data.description || null,
                data.department || null,
                data.location || null,
                data.employmentType || 'full-time',
                data.status || 'active'
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
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
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
     * Delete job opening
     */
    static async delete(id: number): Promise<boolean> {
        const result = await this.getDB().run('DELETE FROM job_openings WHERE id = ?', [id]);
        return result.changes > 0;
    }

    /**
     * Find active job openings
     */
    static async findActive(userId: number): Promise<JobOpening[]> {
        return this.getDB().all('SELECT * FROM job_openings WHERE user_id = ? AND status = ?', [userId, 'active']);
    }
}
