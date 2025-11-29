import { DatabaseManager } from '../database/Database';

export class UserRepository {
    static async findByEmail(email: string): Promise<any> {
        return DatabaseManager.getInstance().get('SELECT * FROM users WHERE email = ?', [email]);
    }

    static async findById(id: number): Promise<any> {
        return DatabaseManager.getInstance().get('SELECT * FROM users WHERE id = ?', [id]);
    }

    static async create(userData: any): Promise<any> {
        const result = await DatabaseManager.getInstance().run(
            `INSERT INTO users (email, password, name, provider, social_id) VALUES (?, ?, ?, ?, ?)`,
            [userData.email, userData.password, userData.name, userData.provider || 'local', userData.socialId]
        );
        return this.findById(result.lastID);
    }

    static async updateLoginTimestamp(id: number): Promise<void> {
        await DatabaseManager.getInstance().run('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    }

    static async findAll(): Promise<any[]> {
        return DatabaseManager.getInstance().all('SELECT id, name, email, role FROM users');
    }

    static async update(id: number, updateData: any): Promise<void> {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];

        await DatabaseManager.getInstance().run(
            `UPDATE users SET ${fields} WHERE id = ?`,
            values
        );
    }
}
