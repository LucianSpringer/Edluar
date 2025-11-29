import { DatabaseManager } from '../database/Database';

export class TodoRepository {
    /**
     * Create a new todo task
     */
    static async create(todoData: {
        task: string;
        assignee_id: number;
        candidate_id?: number;
        job_id?: number;
        due_date?: string;
        created_by: number;
    }): Promise<any> {
        const result = await DatabaseManager.getInstance().run(
            `INSERT INTO todos (task, assignee_id, candidate_id, job_id, due_date, created_by) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                todoData.task,
                todoData.assignee_id,
                todoData.candidate_id || null,
                todoData.job_id || null,
                todoData.due_date || null,
                todoData.created_by
            ]
        );
        return this.findById(result.lastID);
    }

    /**
     * Find todo by ID with context data (candidate/job names)
     */
    static async findById(id: number): Promise<any> {
        return DatabaseManager.getInstance().get(
            `SELECT 
                t.*,
                u.name as assignee_name,
                c.first_name || ' ' || c.last_name as candidate_name,
                j.title as job_title
             FROM todos t
             LEFT JOIN users u ON t.assignee_id = u.id
             LEFT JOIN applications a ON t.candidate_id = a.id
             LEFT JOIN candidates c ON a.candidate_id = c.id
             LEFT JOIN job_openings j ON t.job_id = j.id
             WHERE t.id = ?`,
            [id]
        );
    }

    /**
     * Find all todos for a specific user (assignee)
     * Optional status filter: 'pending', 'completed', or null for all
     */
    static async findByAssignee(userId: number, status?: string): Promise<any[]> {
        let query = `
            SELECT 
                t.*,
                u.name as assignee_name,
                c.first_name || ' ' || c.last_name as candidate_name,
                j.title as job_title
            FROM todos t
            LEFT JOIN users u ON t.assignee_id = u.id
            LEFT JOIN applications a ON t.candidate_id = a.id
            LEFT JOIN candidates c ON a.candidate_id = c.id
            LEFT JOIN job_openings j ON t.job_id = j.id
            WHERE t.assignee_id = ?
        `;

        const params: any[] = [userId];

        if (status) {
            query += ` AND t.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY 
            CASE WHEN t.due_date < date('now') AND t.status = 'pending' THEN 0 ELSE 1 END,
            t.due_date ASC,
            t.created_at DESC
        `;

        return DatabaseManager.getInstance().all(query, params);
    }

    /**
     * Update todo fields
     */
    static async update(id: number, updates: {
        task?: string;
        assignee_id?: number;
        due_date?: string;
        status?: string;
    }): Promise<void> {
        const fields: string[] = [];
        const values: any[] = [];

        if (updates.task !== undefined) {
            fields.push('task = ?');
            values.push(updates.task);
        }
        if (updates.assignee_id !== undefined) {
            fields.push('assignee_id = ?');
            values.push(updates.assignee_id);
        }
        if (updates.due_date !== undefined) {
            fields.push('due_date = ?');
            values.push(updates.due_date);
        }
        if (updates.status !== undefined) {
            fields.push('status = ?');
            values.push(updates.status);
        }

        if (fields.length === 0) return;

        values.push(id);

        await DatabaseManager.getInstance().run(
            `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
    }

    /**
     * Mark todo as completed
     */
    static async markComplete(id: number): Promise<void> {
        await DatabaseManager.getInstance().run(
            `UPDATE todos 
             SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [id]
        );
    }

    /**
     * Delete a todo
     */
    static async delete(id: number): Promise<void> {
        await DatabaseManager.getInstance().run(
            'DELETE FROM todos WHERE id = ?',
            [id]
        );
    }
}
