import { EngineKernel } from '../core/EngineKernel';

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
        return EngineKernel.getInstance().getDatabase();
    }

    /**
     * Find all candidates for a user
     */
    static findByUserId(userId: number): Candidate[] {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM candidates WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId) as Candidate[];
    }

    /**
     * Find candidate by ID
     */
    static findById(id: number): Candidate | undefined {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM candidates WHERE id = ?');
        return stmt.get(id) as Candidate | undefined;
    }

    /**
     * Create new candidate
     */
    static create(data: CreateCandidateData): Candidate {
        const db = this.getDB();

        const stmt = db.prepare(`
            INSERT INTO candidates (user_id, first_name, last_name, email, phone, resume_url, status, current_stage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.userId,
            data.firstName,
            data.lastName,
            data.email,
            data.phone || null,
            data.resumeUrl || null,
            data.status || 'new',
            data.currentStage || null
        );

        const newCandidate = this.findById(Number(result.lastInsertRowid));
        if (!newCandidate) {
            throw new Error('Failed to create candidate');
        }

        return newCandidate;
    }

    /**
     * Update candidate
     */
    static update(id: number, data: Partial<CreateCandidateData>): Candidate {
        const db = this.getDB();

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

        const stmt = db.prepare(`
            UPDATE candidates 
            SET ${updates.join(', ')}
            WHERE id = ?
        `);

        stmt.run(...values);

        const updated = this.findById(id);
        if (!updated) {
            throw new Error('Candidate not found');
        }

        return updated;
    }

    /**
     * Delete candidate
     */
    static delete(id: number): boolean {
        const db = this.getDB();
        const stmt = db.prepare('DELETE FROM candidates WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Search candidates by status
     */
    static findByStatus(userId: number, status: string): Candidate[] {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM candidates WHERE user_id = ? AND status = ?');
        return stmt.all(userId, status) as Candidate[];
    }
}
