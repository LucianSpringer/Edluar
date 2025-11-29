import { DatabaseManager } from '../database/Database';

export interface Interview {
    id?: number;
    application_id: number | null; // Allow null for general events
    scheduled_by: number;
    interview_date: string;
    duration: number;
    title?: string;
    description?: string;
    location_link?: string;
    location: string;
    confirmed: boolean;
    confirmation_token?: string;
    created_at?: string;
    event_type?: 'interview' | 'screening' | 'team_sync' | 'blocked';
}

export interface InterviewWithDetails extends Interview {
    candidate_name: string;
    candidate_email: string;
    interviewer_name: string;
    job_title: string;
    attendees?: { id: number; name: string; avatar: string }[];
}

export class InterviewRepository {
    /**
     * Create a new interview with attendees
     */
    static async create(data: Omit<Interview, 'id' | 'created_at' | 'confirmed'> & { attendees?: number[] }): Promise<Interview> {
        const db = DatabaseManager.getInstance();

        // Use a transaction if possible, but for now sequential execution
        // SQLite in this setup might not expose explicit transaction control easily without a wrapper, 
        // but we'll assume sequential is fine for this prototype.

        const result = await db.run(
            `INSERT INTO interviews (application_id, scheduled_by, interview_date, duration, title, description, location_link, location, confirmation_token, event_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.application_id,
                data.scheduled_by,
                data.interview_date,
                data.duration || 60,
                data.title || 'Interview',
                data.description || '',
                data.location_link || '',
                data.location,
                data.confirmation_token || null,
                data.event_type || 'interview'
            ]
        );

        const interviewId = result.lastID;

        // Insert attendees
        if (data.attendees && data.attendees.length > 0) {
            for (const userId of data.attendees) {
                await db.run(
                    `INSERT INTO interview_attendees (interview_id, user_id) VALUES (?, ?)`,
                    [interviewId, userId]
                );
            }
        }

        return {
            id: interviewId,
            ...data,
            confirmed: false,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Find interview by token
     */
    static async findByToken(token: string): Promise<Interview | null> {
        const db = DatabaseManager.getInstance();

        const interview = await db.get(
            'SELECT * FROM interviews WHERE confirmation_token = ?',
            [token]
        ) as Interview | undefined;

        return interview || null;
    }

    /**
     * Confirm interview
     */
    static async confirm(id: number): Promise<void> {
        const db = DatabaseManager.getInstance();
        await db.run('UPDATE interviews SET confirmed = 1 WHERE id = ?', [id]);
    }

    /**
     * Get all interviews for an application
     */
    static async findByApplicationId(applicationId: number): Promise<Interview[]> {
        const db = DatabaseManager.getInstance();

        const interviews = await db.all(
            'SELECT * FROM interviews WHERE application_id = ? ORDER BY interview_date ASC',
            [applicationId]
        ) as Interview[];

        return interviews;
    }

    /**
     * Get all upcoming interviews with details and attendees
     */
    static async getUpcoming(): Promise<InterviewWithDetails[]> {
        const db = DatabaseManager.getInstance();

        const interviews = await db.all(
            `SELECT 
                i.*,
                COALESCE(c.first_name || ' ' || c.last_name, 'General Event') as candidate_name,
                c.email as candidate_email,
                u.name as interviewer_name,
                j.title as job_title
             FROM interviews i
             LEFT JOIN applications a ON i.application_id = a.id
             LEFT JOIN candidates c ON a.candidate_id = c.id
             LEFT JOIN users u ON i.scheduled_by = u.id
             LEFT JOIN job_openings j ON a.job_id = j.id
             -- WHERE i.interview_date > datetime('now')
             ORDER BY i.interview_date DESC`
        ) as InterviewWithDetails[];

        // Fetch attendees for each interview
        for (const interview of interviews) {
            const attendees = await db.all(
                `SELECT u.id, u.name, u.email -- Assuming avatar is not in users table yet, or we use name for initials
                 FROM interview_attendees ia
                 JOIN users u ON ia.user_id = u.id
                 WHERE ia.interview_id = ?`,
                [interview.id]
            );
            interview.attendees = attendees.map((a: any) => ({
                id: a.id,
                name: a.name,
                avatar: '' // Placeholder if avatar column doesn't exist
            }));
        }

        return interviews;
    }
    /**
     * Find by ID (Needed for logging before delete)
     */
    static async findById(id: number): Promise<Interview | undefined> {
        const db = DatabaseManager.getInstance();
        return db.get('SELECT * FROM interviews WHERE id = ?', [id]);
    }

    /**
     * Delete interview
     */
    static async delete(id: number): Promise<void> {
        const db = DatabaseManager.getInstance();
        await db.run('DELETE FROM interviews WHERE id = ?', [id]);
    }
}
