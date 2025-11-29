const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/edluar.db');
const db = new sqlite3.Database(dbPath);

const migrate = () => {
    console.log('Starting migration: Update applications status check constraint...');

    db.serialize(() => {
        // 1. Rename existing table
        db.run("ALTER TABLE applications RENAME TO applications_old", (err) => {
            if (err) {
                console.log("Renaming failed (might not exist or already renamed):", err.message);
            } else {
                console.log("Renamed applications to applications_old");
            }

            // 2. Create new table with updated CHECK constraint
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS applications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    job_id INTEGER NOT NULL,
                    candidate_id INTEGER NOT NULL,
                    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'phone_screen', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')),
                    source TEXT DEFAULT 'Direct',
                    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE CASCADE,
                    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
                    UNIQUE(job_id, candidate_id)
                );
            `;

            db.run(createTableQuery, (err) => {
                if (err) {
                    console.error("Error creating new table:", err);
                    return;
                }
                console.log("Created new applications table");

                // 3. Copy data from old table to new table
                const copyDataQuery = `
                    INSERT INTO applications (id, job_id, candidate_id, status, source, applied_at, updated_at)
                    SELECT id, job_id, candidate_id, status, source, applied_at, updated_at FROM applications_old;
                `;

                db.run(copyDataQuery, (err) => {
                    if (err) {
                        console.log("Copying data failed (maybe applications_old doesn't exist?):", err.message);
                    } else {
                        console.log("Copied data to new table");

                        // 4. Drop old table
                        db.run("DROP TABLE applications_old", (err) => {
                            if (err) console.error("Error dropping old table:", err);
                            else console.log("Dropped applications_old table");
                        });
                    }

                    // 5. Recreate Indices
                    db.run("CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)");

                    console.log("Migration steps finished.");
                });
            });
        });
    });
};

migrate();
