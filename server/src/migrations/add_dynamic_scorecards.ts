import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();
    try {
        console.log('Running Scorecard Migrations...');

        // 1. Add Config to Job (The Questions)
        try {
            await db.run("ALTER TABLE job_openings ADD COLUMN scorecard_config TEXT");
            console.log('✅ Added scorecard_config to job_openings');
        } catch (e) { console.log('ℹ️ scorecard_config likely exists'); }

        // 2. Add Ratings to Scorecard (The Answers)
        try {
            await db.run("ALTER TABLE scorecards ADD COLUMN ratings TEXT");
            console.log('✅ Added ratings to scorecards');
        } catch (e) { console.log('ℹ️ ratings column likely exists'); }

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
