import { DatabaseManager } from '../database/Database';

export class CandidateRepository {
    static async findByEmail(email: string): Promise<any> {
        return DatabaseManager.getInstance().get('SELECT * FROM candidates WHERE email = ?', [email]);
    }

    static async findById(id: number): Promise<any> {
        return DatabaseManager.getInstance().get('SELECT * FROM candidates WHERE id = ?', [id]);
    }

    /**
      * Find candidate by email or create new one (for application upsert)
      * Prevents duplicate candidates when applying to multiple jobs
      */
    static async findOrCreateByEmail(email: string, data: { firstName: string; lastName: string; phone?: string; resumeUrl?: string; tags?: string[] }): Promise<any> {
        // Check if candidate exists
        const existing = await DatabaseManager.getInstance().get(
            'SELECT * FROM candidates WHERE email = ?',
            [email]
        );

        if (existing) {
            return existing;
        }

        // Create new candidate
        const tagsJson = data.tags ? JSON.stringify(data.tags) : null;
        const result = await DatabaseManager.getInstance().run(
            `INSERT INTO candidates (user_id, first_name, last_name, email, phone, resume_url, status, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [1, data.firstName, data.lastName, email, data.phone || null, data.resumeUrl || null, 'new', tagsJson]
        );

        return this.findById(result.lastID);
    }

    static async updateTags(id: number, tags: string[]): Promise<void> {
        await DatabaseManager.getInstance().run(
            'UPDATE candidates SET tags = ? WHERE id = ?',
            [JSON.stringify(tags), id]
        );
    }

    static async findByUserId(userId: number): Promise<any[]> {
        return DatabaseManager.getInstance().all('SELECT * FROM candidates WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }
}
