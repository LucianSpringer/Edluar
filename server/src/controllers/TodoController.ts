import { Request, Response } from 'express';
import { TodoRepository } from '../repositories/TodoRepository';

export class TodoController {
    /**
     * Create new todo
     * POST /api/todos
     */
    static async create(req: Request, res: Response) {
        try {
            const { task, assignee_id, candidate_id, job_id, due_date } = req.body;

            if (!task || !assignee_id) {
                return res.status(400).json({ error: 'task and assignee_id are required' });
            }

            // In production, get created_by from authenticated user
            const created_by = 1; // For now, default to user 1

            const todo = await TodoRepository.create({
                task,
                assignee_id,
                candidate_id,
                job_id,
                due_date,
                created_by
            });

            res.status(201).json(todo);
        } catch (error) {
            console.error('Error creating todo:', error);
            res.status(500).json({ error: 'Failed to create todo' });
        }
    }

    /**
     * Get all todos for current user
     * GET /api/todos?status=pending
     */
    static async getAll(req: Request, res: Response) {
        try {
            const status = req.query.status as string;

            // In production, get user ID from auth token
            const userId = 1; // For now, default to user 1

            const todos = await TodoRepository.findByAssignee(userId, status);

            res.json({
                todos,
                count: todos.length
            });
        } catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({ error: 'Failed to fetch todos' });
        }
    }

    /**
     * Update todo
     * PATCH /api/todos/:id
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { task, assignee_id, due_date, status } = req.body;

            await TodoRepository.update(parseInt(id), {
                task,
                assignee_id,
                due_date,
                status
            });

            const updated = await TodoRepository.findById(parseInt(id));
            res.json(updated);
        } catch (error) {
            console.error('Error updating todo:', error);
            res.status(500).json({ error: 'Failed to update todo' });
        }
    }

    /**
     * Mark todo as complete
     * PATCH /api/todos/:id/complete
     */
    static async markComplete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await TodoRepository.markComplete(parseInt(id));

            const updated = await TodoRepository.findById(parseInt(id));
            res.json(updated);
        } catch (error) {
            console.error('Error completing todo:', error);
            res.status(500).json({ error: 'Failed to complete todo' });
        }
    }

    /**
     * Delete todo
     * DELETE /api/todos/:id
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await TodoRepository.delete(parseInt(id));

            res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ error: 'Failed to delete todo' });
        }
    }
}
