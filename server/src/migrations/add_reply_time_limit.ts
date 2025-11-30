import { DatabaseManager } from '../database/Database';

export async function up(db: DatabaseManager): Promise<void> {
    try {
        await db.run('ALTER TABLE job_openings ADD COLUMN reply_time_limit INTEGER DEFAULT 3');
        console.log('✅ Added reply_time_limit column to job_openings');
    } catch (error: any) {
        if (error.message.includes('duplicate column name')) {
            console.log('⚠️ reply_time_limit column already exists, skipping');
        } else {
            throw error;
        }
    }
}

export async function down(db: DatabaseManager): Promise<void> {
    try {
        await db.run('ALTER TABLE job_openings DROP COLUMN reply_time_limit');
        console.log('✅ Removed reply_time_limit column from job_openings');
    } catch (error) {
        console.error('❌ Failed to remove reply_time_limit column:', error);
        throw error;
    }
}
