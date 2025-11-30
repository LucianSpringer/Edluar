
import { DatabaseManager } from '../database/Database';

async function checkSchema() {
    const db = DatabaseManager.getInstance();
    try {
        const schema = await db.all("PRAGMA table_info(job_openings)");
        const columns = schema.map((col: any) => col.name);
        console.log("Columns in job_openings:", columns);
    } catch (error) {
        console.error("Error checking schema:", error);
    }
}

checkSchema();
