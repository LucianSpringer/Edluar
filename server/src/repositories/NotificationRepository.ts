import { DatabaseManager } from '../database/Database';

interface Notification {
    id: number;
    user_id: number;
    type: 'new_candidate' | 'interview_confirmed' | 'job_filled';
    resource_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
}

interface CreateNotificationData {
    userId: number;
    type: 'new_candidate' | 'interview_confirmed' | 'job_filled';
    resourceId: number;
    content: string;
}

export class NotificationRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    /**
     * Create new notification
     */
    static async create(data: CreateNotificationData): Promise<Notification> {
        const result = await this.getDB().run(
            `INSERT INTO notifications (user_id, type, resource_id, content)
             VALUES (?, ?, ?, ?)`,
            [data.userId, data.type, data.resourceId, data.content]
        );

        const notification = await this.findById(Number(result.lastID));
        if (!notification) {
            throw new Error('Failed to create notification');
        }
        return notification;
    }

    /**
     * Find by ID
     */
    static async findById(id: number): Promise<Notification | undefined> {
        return this.getDB().get('SELECT * FROM notifications WHERE id = ?', [id]);
    }

    /**
     * Find by User ID
     */
    static async findByUserId(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        if (unreadOnly) {
            query += ' AND is_read = 0';
        }
        query += ' ORDER BY created_at DESC LIMIT 20';

        return this.getDB().all(query, [userId]);
    }

    /**
     * Mark as read
     */
    static async markAsRead(id: number): Promise<void> {
        await this.getDB().run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    }

    /**
     * Count unread
     */
    static async countUnread(userId: number): Promise<number> {
        const result = await this.getDB().get(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        return result?.count || 0;
    }
}
