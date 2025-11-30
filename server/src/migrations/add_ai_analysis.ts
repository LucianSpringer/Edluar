import { DatabaseManager } from '../database/Database';

export async function up(db: DatabaseManager): Promise<void> {
    // Check if column exists first to avoid errors if run multiple times
    try {
        await db.run('ALTER TABLE applications ADD COLUMN ai_analysis TEXT');
        console.log('Added ai_analysis column to applications table');
    } catch (error: any) {
        if (error.message.includes('duplicate column name')) {
            console.log('ai_analysis column already exists');
        } else {
            throw error;
        }
    }
}

export async function down(db: DatabaseManager): Promise<void> {
    try {
        await db.run('ALTER TABLE applications DROP COLUMN ai_analysis');
    } catch (error) {
        console.error('Error dropping ai_analysis column:', error);
    }
}
