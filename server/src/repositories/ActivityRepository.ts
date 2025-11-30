import { DatabaseManager } from '../database/Database';

interface Activity {
    id: number;
    application_id: number;
    type: 'note' | 'email' | 'interview_scheduled' | 'status_change';
    content: string | null;
    scheduled_at: string | null;
    created_at: string;
}

interface CreateActivityData {
    applicationId: number;
    type: 'note' | 'email' | 'interview_scheduled' | 'status_change';
    content?: string;
    scheduledAt?: string;
}

export class ActivityRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    /**
     * Create new activity
     */
    static async create(data: CreateActivityData): Promise<Activity> {
        // If scheduled_at is in the future, status is 'pending', else 'sent'
        const status = data.scheduledAt ? 'pending' : 'sent';

        const result = await this.getDB().run(
            `INSERT INTO activities (application_id, type, content, scheduled_at, status)
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.applicationId,
                data.type,
                data.content || null,
                data.scheduledAt || null,
                status
            ]
        );

        const newActivity = await this.findById(Number(result.lastID));
        if (!newActivity) {
            throw new Error('Failed to create activity');
        }

        return newActivity;
    }

    /**
     * Find activity by ID
     */
    static async findById(id: number): Promise<Activity | undefined> {
        return this.getDB().get('SELECT * FROM activities WHERE id = ?', [id]);
    }

    /**
     * Get all activities for an application (for timeline/inbox)
     */
    static async findByApplicationId(applicationId: number): Promise<Activity[]> {
        return this.getDB().all(
            'SELECT * FROM activities WHERE application_id = ? ORDER BY created_at DESC',
            [applicationId]
        );
    }

    /**
     * Get communication activities only (for Inbox view)
     * Excludes status_change to prevent clutter
     */
    static async findCommunications(applicationId: number): Promise<Activity[]> {
        return this.getDB().all(
            `SELECT * FROM activities 
             WHERE application_id = ? 
             AND type IN ('note', 'email', 'interview_scheduled')
             ORDER BY created_at ASC`,
            [applicationId]
        );
    }

    /**
     * Get scheduled activities (for Calendar view)
     */
    static async findScheduled(): Promise<Activity[]> {
        return this.getDB().all(
            'SELECT * FROM activities WHERE scheduled_at IS NOT NULL ORDER BY scheduled_at ASC'
        );
    }

    /**
     * Get recent status changes (for notifications)
     */
    static async findRecentStatusChanges(limit: number = 10): Promise<Activity[]> {
        return this.getDB().all(
            'SELECT * FROM activities WHERE type = ? ORDER BY created_at DESC LIMIT ?',
            ['status_change', limit]
        );
    }

    /**
     * Get recent communications (emails/notes) across all applications
     * Joins with candidates and job_openings to provide context
     */
    static async findRecentCommunications(limit: number = 5): Promise<any[]> {
        return this.getDB().all(
            `SELECT 
                a.*, 
                c.first_name || ' ' || c.last_name as candidate_name,
                j.title as job_title
             FROM activities a
             JOIN applications app ON a.application_id = app.id
             JOIN candidates c ON app.candidate_id = c.id
             JOIN job_openings j ON app.job_id = j.id
             WHERE a.type IN ('email', 'note')
             ORDER BY a.created_at DESC
             LIMIT ?`,
            [limit]
        );
    }

    /**
     * Process scheduled messages that are due
     */
    static async processScheduledMessages(): Promise<void> {
        const db = DatabaseManager.getInstance();
        // Find messages that are pending AND past their due date
        const pending = await db.all(`
            SELECT * FROM activities 
            WHERE status = 'pending' 
            AND scheduled_at <= datetime('now')
        `);

        for (const msg of pending) {
            // In a real app, you would trigger the Email API here (SendGrid/Resend)
            console.log(`📧 [Auto-Sender] Sending scheduled email ID ${msg.id} to candidate...`);

            // Mark as sent so it shows up in the UI timeline
            await db.run("UPDATE activities SET status = 'sent' WHERE id = ?", [msg.id]);
        }
    }
}
