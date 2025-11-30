import { DatabaseManager } from '../database/Database';

export async function up(db: DatabaseManager): Promise<void> {
    try {
        console.log('🔄 Migrating: Adding disqualification support...');
        await db.run("PRAGMA foreign_keys = OFF");
        await db.run("BEGIN TRANSACTION");

        // 1. Rename old table
        await db.run("ALTER TABLE applications RENAME TO applications_old");

        // 2. Create NEW table with 'rejected' in CHECK and new column
        await db.run(`
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'phone_screen', 'interview', 'offer', 'hired', 'rejected')),
                disqualification_reason TEXT,
                source TEXT DEFAULT 'Direct',
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                ai_analysis TEXT,
                FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
                UNIQUE(job_id, candidate_id)
            )
        `);

        // 3. Copy Data (Explicit columns to be safe)
        // Note: We need to check if ai_analysis exists in the old table before selecting it
        // But since we know we added it in a previous migration, we can assume it's there.
        // However, to be safe against partial migrations, we should check.
        // For this specific flow, we know ai_analysis was added.

        await db.run(`
            INSERT INTO applications (id, job_id, candidate_id, status, source, applied_at, updated_at, ai_analysis)
            SELECT id, job_id, candidate_id, status, source, applied_at, updated_at, ai_analysis
            FROM applications_old
        `);

        // 4. Recreate Indexes
        await db.run("CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)");
        await db.run("CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id)");
        await db.run("CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)");

        // 5. Cleanup
        await db.run("DROP TABLE applications_old");

        await db.run("COMMIT");
        await db.run("PRAGMA foreign_keys = ON");
        console.log('✅ Migration successful: Added "rejected" status and reason column.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        await db.run("ROLLBACK");
        throw error;
    }
}

export async function down(db: DatabaseManager): Promise<void> {
    // Reverting this complex migration is risky and typically not needed for forward-only dev.
    // But we can implement a reverse if strictly necessary.
    console.log('⚠️ Down migration for table recreation is not implemented to prevent data loss.');
}
