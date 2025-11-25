import { EngineKernel } from '../core/EngineKernel';

interface User {
    id: number;
    email: string;
    password: string | null;
    name: string;
    provider: string;
    social_id: string | null;
    created_at: string;
    updated_at: string;
}

interface CreateUserData {
    email: string;
    password: string | null;
    name: string;
    provider?: string;
    socialId?: string;
}

/**
 * UserRepository - Repository Pattern Implementation
 * Abstracts database operations for User entity
 */
export class UserRepository {
    private static getDB() {
        return EngineKernel.getInstance().getDatabase();
    }

    /**
     * Find user by email
     */
    static findByEmail(email: string): User | undefined {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as User | undefined;
    }

    /**
     * Find user by ID
     */
    static findById(id: number): User | undefined {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) as User | undefined;
    }

    /**
     * Create new user
     */
    static create(userData: CreateUserData): User {
        const db = this.getDB();

        const stmt = db.prepare(`
            INSERT INTO users (email, password, name, provider, social_id)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            userData.email,
            userData.password,
            userData.name,
            userData.provider || 'local',
            userData.socialId || null
        );

        const newUser = this.findById(Number(result.lastInsertRowid));
        if (!newUser) {
            throw new Error('Failed to create user');
        }

        return newUser;
    }

    /**
     * Update user data
     */
    static update(id: number, data: Partial<CreateUserData>): User {
        const db = this.getDB();

        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.password !== undefined) {
            updates.push('password = ?');
            values.push(data.password);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const stmt = db.prepare(`
            UPDATE users 
            SET ${updates.join(', ')}
            WHERE id = ?
        `);

        stmt.run(...values);

        const updatedUser = this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        return updatedUser;
    }

    /**
     * Delete user
     */
    static delete(id: number): boolean {
        const db = this.getDB();
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Get all users (for admin)
     */
    static findAll(): User[] {
        const db = this.getDB();
        const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
        return stmt.all() as User[];
    }
}
