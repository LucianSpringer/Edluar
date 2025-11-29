import { DatabaseManager } from '../database/Database';

/**
 * Migration: Add todos table for task management
 * Run this script to add the todos table to existing databases
 */
async function createTodosTable() {
    const db = DatabaseManager.getInstance();

    console.log("Creating todos table...\n");

    try {
        // Create todos table
        await db.run(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                assignee_id INTEGER NOT NULL,
                candidate_id INTEGER,
                job_id INTEGER,
                due_date DATE,
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
                created_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                
                FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES applications(id) ON DELETE CASCADE,
                FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Created `todos` table");

        // Create indexes
        await db.run(`CREATE INDEX IF NOT EXISTS idx_todos_assignee ON todos(assignee_id)`);
        console.log("✅ Created index: idx_todos_assignee");

        await db.run(`CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status)`);
        console.log("✅ Created index: idx_todos_status");

        await db.run(`CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date)`);
        console.log("✅ Created index: idx_todos_due_date");

        await db.run(`CREATE INDEX IF NOT EXISTS idx_todos_candidate ON todos(candidate_id)`);
        console.log("✅ Created index: idx_todos_candidate");

        await db.run(`CREATE INDEX IF NOT EXISTS idx_todos_job ON todos(job_id)`);
        console.log("✅ Created index: idx_todos_job");

        console.log("\n✅ Migration complete!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
}

createTodosTable().catch(console.error);
