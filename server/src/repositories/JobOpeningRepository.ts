import { EngineKernel } from '../core/EngineKernel';

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
        return EngineKernel.getInstance().getDatabase();
    }

    /**
     * Find all job openings for a user
     */
    static findByUserId(userId: number): JobOpening[] {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM job_openings WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId) as JobOpening[];
    }

    /**
     * Find job opening by ID
     */
    static findById(id: number): JobOpening | undefined {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM job_openings WHERE id = ?');
        return stmt.get(id) as JobOpening | undefined;
    }

    /**
     * Create new job opening
     */
    static create(data: CreateJobOpeningData): JobOpening {
        const db = this.getDB();

        const stmt = db.prepare(`
            INSERT INTO job_openings (user_id, title, description, department, location, employment_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.userId,
            data.title,
            data.description || null,
            data.department || null,
            data.location || null,
            data.employmentType || 'full-time',
            data.status || 'active'
        );

        const newJob = this.findById(Number(result.lastInsertRowid));
        if (!newJob) {
            throw new Error('Failed to create job opening');
        }

        return newJob;
    }

    /**
     * Update job opening
     */
    static update(id: number, data: Partial<CreateJobOpeningData>): JobOpening {
        const db = this.getDB();

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

        const stmt = db.prepare(`
            UPDATE job_openings 
            SET ${updates.join(', ')}
            WHERE id = ?
        `);

        stmt.run(...values);

        const updated = this.findById(id);
        if (!updated) {
            throw new Error('Job opening not found');
        }

        return updated;
    }

    /**
     * Delete job opening
     */
    static delete(id: number): boolean {
        const db = this.getDB();
        const stmt = db.prepare('DELETE FROM job_openings WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Find active job openings
     */
    static findActive(userId: number): JobOpening[] {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM job_openings WHERE user_id = ? AND status = ?');
        return stmt.all(userId, 'active') as JobOpening[];
    }
}
