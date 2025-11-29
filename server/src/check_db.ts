
import { DatabaseManager } from './database/Database';

async function checkInterviews() {
    const db = DatabaseManager.getInstance();

    console.log("Checking Interviews...");
    const interviews = await db.all('SELECT * FROM interviews');
    console.log(`Found ${interviews.length} interviews.`);
    console.log(JSON.stringify(interviews, null, 2));

    if (interviews.length > 0) {
        console.log("\nChecking related data for the first interview:");
        const first = interviews[0];

        const application = await db.get('SELECT * FROM applications WHERE id = ?', [first.application_id]);
        console.log("Application:", application ? "Found" : "MISSING");

        const user = await db.get('SELECT * FROM users WHERE id = ?', [first.scheduled_by]);
        console.log("User (Scheduled By):", user ? "Found" : "MISSING");

        if (application) {
            const job = await db.get('SELECT * FROM jobs WHERE id = ?', [application.job_id]);
            console.log("Job:", job ? "Found" : "MISSING");
        }
    }

    console.log("\nChecking Upcoming Query:");
    const upcoming = await db.all(`
        SELECT 
            i.*,
            a.first_name || ' ' || a.last_name as candidate_name,
            a.email as candidate_email,
            u.name as interviewer_name,
            j.title as job_title
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN users u ON i.scheduled_by = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE i.interview_date > datetime('now')
        ORDER BY i.interview_date ASC
    `);
    console.log(`Found ${upcoming.length} upcoming interviews via query.`);
    console.log(JSON.stringify(upcoming, null, 2));
}

checkInterviews().catch(console.error);
