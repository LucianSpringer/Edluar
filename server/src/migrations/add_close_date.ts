import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();
    try {
        console.log('Running Close Date Migration...');

        try {
            await db.run("ALTER TABLE job_openings ADD COLUMN close_date TEXT");
            console.log('✅ Added close_date to job_openings');
        } catch (e) {
            console.log('ℹ️ close_date likely exists or error:', e);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
