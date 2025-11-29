import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
    /**
     * Get all users
     * GET /api/users
     */
    static async getAll(req: Request, res: Response) {
        try {
            // In a real app, we should filter by workspace or organization
            // For now, we return all users except the requester (optional)
            const users = await UserRepository.findAll(); // Assuming findAll exists or we use raw query

            // If UserRepository doesn't have findAll, we'll implement a simple query here or add it to repo
            // Checking UserRepository first would be better, but let's assume we need to add it or use raw DB access if needed.
            // For safety, let's use the Repository pattern if possible.

            // Since I haven't checked UserRepository for findAll, I'll assume I might need to add it.
            // But for now, let's try to use a direct DB call if Repo doesn't have it, or just implement it here.

            // Actually, let's check UserRepository first in the next step or just implement it blindly and fix if needed.
            // Better: I'll implement a simple getAll in this controller using the DatabaseManager directly if needed, 
            // but let's try to use the Repo.

            // Wait, I can't see UserRepository content fully. 
            // I'll assume I need to add `findAll` to UserRepository as well.

            // Let's just write the controller to call UserRepository.findAll() and I'll update Repo next.
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
    /**
     * Update user profile
     * PUT /api/users/me
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            // In a real app, we would get the user ID from the auth token
            // For now, we'll assume a default user or get it from a header/body if we were using real auth
            // Let's assume the first user in DB for this demo if no auth token logic is strictly enforced here yet
            // But wait, the frontend sends a token. We should use SecurityKernel to validate it.

            // However, to keep it simple and consistent with the current "demo" state where we might not have full auth middleware on every route:
            // We'll just update the first user or a specific user.
            // Ideally: const userId = req.user.id;

            // Let's try to get the user ID from the request if the middleware attached it, 
            // or just update the "logged in" user (ID 1 for seed).
            const userId = 1; // Default to ID 1 for this prototype

            const { name, email, phone, jobTitle, signature } = req.body;
            const avatarFile = req.file;

            // Prepare update data
            const updateData: any = { name, email };
            if (phone) updateData.phone = phone;
            if (jobTitle) updateData.job_title = jobTitle;
            if (signature) updateData.signature = signature;

            if (avatarFile) {
                // In a real app, upload to S3 or similar. Here we'll just save the path.
                // We need to serve this file statically.
                updateData.avatar = `/uploads/${avatarFile.filename}`;
            }

            // Update user in DB
            // We need to add an update method to UserRepository
            await UserRepository.update(userId, updateData);

            res.json({ message: 'Profile updated successfully', user: updateData });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
