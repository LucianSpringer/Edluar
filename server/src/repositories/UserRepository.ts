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
}
