
import { DatabaseManager } from './database/Database';

async function seedInterviews() {
    const db = DatabaseManager.getInstance();

    console.log("Seeding Interviews...");

    // 1. Get a user (recruiter)
    let user = await db.get('SELECT * FROM users LIMIT 1');
    if (!user) {
        console.log("No users found. Creating one...");
        await db.run(`INSERT INTO users (name, email, password_hash, role) VALUES ('Test Recruiter', 'recruiter@edluar.com', 'hash', 'recruiter')`);
        user = await db.get('SELECT * FROM users LIMIT 1');
    }

    // 2. Get a job
    let job = await db.get('SELECT * FROM jobs LIMIT 1');
    if (!job) {
        console.log("No jobs found. Creating one...");
        await db.run(`INSERT INTO jobs (title, department, location, type, status) VALUES ('Senior Frontend Engineer', 'Engineering', 'Remote', 'Full-time', 'active')`);
        job = await db.get('SELECT * FROM jobs LIMIT 1');
    }

    // 3. Get an application
    let app = await db.get('SELECT * FROM applications LIMIT 1');
    if (!app) {
        console.log("No applications found. Creating one...");
        await db.run(`INSERT INTO applications (job_id, first_name, last_name, email, status) VALUES (?, 'Liam', 'Chen', 'liam@example.com', 'interview')`, [job.id]);
        app = await db.get('SELECT * FROM applications LIMIT 1');
    }

    // 4. Create Interviews (Tomorrow and Day After)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(14, 0, 0, 0);

    console.log(`Creating interview for ${tomorrow.toISOString()}`);
    await db.run(
        `INSERT INTO interviews (application_id, scheduled_by, interview_date, location, confirmation_token) VALUES (?, ?, ?, ?, ?)`,
        [app.id, user.id, tomorrow.toISOString(), 'Zoom Link: https://zoom.us/j/123456', 'token123']
    );

    console.log(`Creating interview for ${dayAfter.toISOString()}`);
    await db.run(
        `INSERT INTO interviews (application_id, scheduled_by, interview_date, location, confirmation_token) VALUES (?, ?, ?, ?, ?)`,
        [app.id, user.id, dayAfter.toISOString(), 'Office Meeting Room A', 'token456']
    );

    console.log("Seeding Complete!");
}

seedInterviews().catch(console.error);
