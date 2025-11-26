import { DatabaseManager } from '../database/Database';

interface Candidate {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    resume_url: string | null;
    status: string;
    current_stage: string | null;
    created_at: string;
    updated_at: string;
}

interface CreateCandidateData {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    resumeUrl?: string;
    status?: string;
    currentStage?: string;
}

/**
 * CandidateRepository - Repository Pattern for Candidates
 * High-density data access layer for candidate management
 */
export class CandidateRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    /**
     * Find all candidates for a user
     */
    static async findByUserId(userId: number): Promise<Candidate[]> {
        return this.getDB().all('SELECT * FROM candidates WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }

    /**
     * Find candidate by ID
     */
    static async findById(id: number): Promise<Candidate | undefined> {
        return this.getDB().get('SELECT * FROM candidates WHERE id = ?', [id]);
    }

    /**
     * Create new candidate
     */
    static async create(data: CreateCandidateData): Promise<Candidate> {
        const result = await this.getDB().run(
            `INSERT INTO candidates (user_id, first_name, last_name, email, phone, resume_url, status, current_stage)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.phone || null,
                data.resumeUrl || null,
                data.status || 'new',
                data.currentStage || null
            ]
        );

        const newCandidate = await this.findById(Number(result.lastID));
        if (!newCandidate) {
            throw new Error('Failed to create candidate');
        }

        return newCandidate;
    }

    /**
     * Update candidate
     */
    static async update(id: number, data: Partial<CreateCandidateData>): Promise<Candidate> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.firstName) {
            updates.push('first_name = ?');
            values.push(data.firstName);
        }
        if (data.lastName) {
            updates.push('last_name = ?');
            values.push(data.lastName);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.currentStage) {
            updates.push('current_stage = ?');
            values.push(data.currentStage);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await this.getDB().run(
            `UPDATE candidates SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Candidate not found');
        }

        return updated;
    }

    /**
     * Delete candidate
     */
    static async delete(id: number): Promise<boolean> {
        const result = await this.getDB().run('DELETE FROM candidates WHERE id = ?', [id]);
        return result.changes > 0;
    }

    /**
     * Search candidates by status
     */
    static async findByStatus(userId: number, status: string): Promise<Candidate[]> {
        return this.getDB().all('SELECT * FROM candidates WHERE user_id = ? AND status = ?', [userId, status]);
    }
}
