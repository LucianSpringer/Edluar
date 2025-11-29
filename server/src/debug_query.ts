
import { DatabaseManager } from './database/Database';

async function debugQuery() {
    const db = DatabaseManager.getInstance();

    try {
        console.log("Testing simple select...");
        await db.all('SELECT 1');
        console.log("Simple select passed.");

        console.log("Testing Upcoming Interviews Query...");
        const query = `
            SELECT 
                i.*,
                a.first_name || ' ' || a.last_name as candidate_name,
                a.email as candidate_email,
                u.name as interviewer_name,
                j.title as job_title
            FROM interviews i
            JOIN applications a ON i.application_id = a.id
            JOIN users u ON i.scheduled_by = u.id
            JOIN job_openings j ON a.job_id = j.id
            WHERE i.interview_date > datetime('now')
            ORDER BY i.interview_date ASC
        `;
        const result = await db.all(query);
        console.log("Query success!", result);
    } catch (error) {
        console.error("Query FAILED:", error);
    }
}

debugQuery();
