import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();

    try {
        console.log('Migrating interviews table to make application_id nullable...');

        // 1. Disable Foreign Keys
        await db.run("PRAGMA foreign_keys = OFF");

        // 2. Begin Transaction
        await db.run("BEGIN TRANSACTION");

        // 3. Create new table with nullable application_id
        // Note: We also include the new event_type column here
        await db.run(`
            CREATE TABLE IF NOT EXISTS interviews_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_id INTEGER, -- Removed NOT NULL
                scheduled_by INTEGER NOT NULL,
                interview_date DATETIME NOT NULL,
                duration INTEGER DEFAULT 60,
                title TEXT,
                description TEXT,
                location_link TEXT,
                location TEXT,
                confirmed BOOLEAN DEFAULT 0,
                confirmation_token TEXT UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                event_type TEXT DEFAULT 'interview' CHECK (event_type IN ('interview', 'screening', 'team_sync', 'blocked')),
                FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
                FOREIGN KEY (scheduled_by) REFERENCES users(id)
            )
        `);

        // 4. Copy data
        // We need to list columns explicitly to ensure safety
        await db.run(`
            INSERT INTO interviews_new (id, application_id, scheduled_by, interview_date, duration, title, description, location_link, location, confirmed, confirmation_token, created_at, event_type)
            SELECT id, application_id, scheduled_by, interview_date, duration, title, description, location_link, location, confirmed, confirmation_token, created_at, event_type
            FROM interviews
        `);

        // 5. Drop old table
        await db.run("DROP TABLE interviews");

        // 6. Rename new table
        await db.run("ALTER TABLE interviews_new RENAME TO interviews");

        // 7. Recreate Indices
        await db.run("CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id)");
        await db.run("CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(interview_date)");

        // 8. Commit
        await db.run("COMMIT");

        // 9. Re-enable Foreign Keys
        await db.run("PRAGMA foreign_keys = ON");

        console.log('✅ Migration successful: application_id is now nullable');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        await db.run("ROLLBACK");
        process.exit(1);
    }
}

migrate();
