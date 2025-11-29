const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log('Running migration: Add close_date to job_openings');

    db.run(`ALTER TABLE job_openings ADD COLUMN close_date DATETIME`, (err) => {
        if (err) {
            // Ignore error if column already exists
            if (err.message.includes('duplicate column name')) {
                console.log('Column close_date already exists.');
            } else {
                console.error('Error adding column:', err.message);
            }
        } else {
            console.log('Successfully added close_date column.');
        }
    });
});

db.close();
