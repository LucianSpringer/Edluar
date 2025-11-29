
import { DatabaseManager } from './database/Database';

async function applySchemaChanges() {
    const db = DatabaseManager.getInstance();

    console.log("Applying Schema Changes...");

    try {
        // 1. Add columns to interviews table (SQLite doesn't support adding multiple columns in one statement easily, so we do one by one)
        // We wrap in try-catch in case they already exist

        const columns = [
            "ALTER TABLE interviews ADD COLUMN duration INTEGER DEFAULT 60",
            "ALTER TABLE interviews ADD COLUMN title TEXT",
            "ALTER TABLE interviews ADD COLUMN description TEXT",
            "ALTER TABLE interviews ADD COLUMN location_link TEXT"
        ];

        for (const sql of columns) {
            try {
                await db.run(sql);
                console.log(`Executed: ${sql}`);
            } catch (e: any) {
                if (e.message.includes("duplicate column name")) {
                    console.log(`Column already exists: ${sql}`);
                } else {
                    console.error(`Error executing ${sql}:`, e);
                }
            }
        }

        // 2. Create interview_attendees table
        const createAttendeesTable = `
            CREATE TABLE IF NOT EXISTS interview_attendees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                interview_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(interview_id, user_id)
            );
        `;
        await db.run(createAttendeesTable);
        console.log("Created interview_attendees table.");

        // 3. Create Indexes
        await db.run("CREATE INDEX IF NOT EXISTS idx_interview_attendees_interview_id ON interview_attendees(interview_id)");
        await db.run("CREATE INDEX IF NOT EXISTS idx_interview_attendees_user_id ON interview_attendees(user_id)");
        console.log("Created indexes.");

    } catch (error) {
        console.error("Schema migration failed:", error);
    }
}

applySchemaChanges().catch(console.error);
