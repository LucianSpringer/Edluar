import { DatabaseManager } from '../database/Database';

async function checkData() {
    const db = DatabaseManager.getInstance();
    try {
        console.log('Checking database content...');

        const jobs = await db.all("SELECT count(*) as count FROM job_openings");
        console.log(`Job Openings: ${jobs[0].count}`);

        const candidates = await db.all("SELECT count(*) as count FROM candidates");
        console.log(`Candidates: ${candidates[0].count}`);

        const applications = await db.all("SELECT count(*) as count FROM applications");
        console.log(`Applications: ${applications[0].count}`);

        const activities = await db.all("SELECT count(*) as count FROM activities");
        console.log(`Activities: ${activities[0].count}`);

    } catch (e: any) {
        console.error('Error checking data:', e.message);
    }
}
checkData();
