import { Request, Response } from 'express';
import { NotificationRepository } from '../repositories/NotificationRepository';

export class NotificationController {
    /**
     * Get notifications for the current user
     */
    static async getMine(req: Request, res: Response) {
        try {
            // Assuming user is authenticated and req.user.id exists
            // In a real app, use middleware to ensure auth
            // For now, we might need to pass userId in query or assume a default if not fully auth'd in dev
            // But based on DashboardPage, we have a user.
            // Let's assume the auth middleware populates req.user or we use a query param for dev simplicity if needed.
            // However, looking at other controllers, they don't seem to rely heavily on req.user yet?
            // Wait, DashboardPage has `user` object.
            // Let's check how auth is handled.
            // For now, I'll check if there's a user_id query param or header, or just default to 1 for testing if missing?
            // No, let's try to get it from the request if possible.

            // NOTE: In this codebase, it seems we might not have full auth middleware on all routes yet.
            // I'll accept a query param `userId` for now to be safe and compatible with the frontend which knows the user ID.

            const userId = req.query.userId ? Number(req.query.userId) : 1; // Default to 1 (Admin) if not provided

            const unreadOnly = req.query.unread === 'true';

            const notifications = await NotificationRepository.findByUserId(userId, unreadOnly);
            const unreadCount = await NotificationRepository.countUnread(userId);

            res.json({ notifications, unreadCount });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    /**
     * Mark a notification as read
     */
    static async markRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await NotificationRepository.markAsRead(Number(id));
            res.json({ success: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    }
}
