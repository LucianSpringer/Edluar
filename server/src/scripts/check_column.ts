
import { DatabaseManager } from '../database/Database';

async function checkColumn() {
    const db = DatabaseManager.getInstance();
    try {
        const schema = await db.all("PRAGMA table_info(job_openings)");
        const hasColumn = schema.some((col: any) => col.name === 'reply_time_limit');
        console.log("Has reply_time_limit:", hasColumn);
    } catch (error) {
        console.error("Error checking schema:", error);
    }
}

checkColumn();
