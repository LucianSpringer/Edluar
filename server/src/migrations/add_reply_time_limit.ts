
import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();
    try {
        console.log("Adding reply_time_limit column to job_openings...");
        await db.run("ALTER TABLE job_openings ADD COLUMN reply_time_limit INTEGER DEFAULT 3");
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrate();
