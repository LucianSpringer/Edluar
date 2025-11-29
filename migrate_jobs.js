import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'server/data/edluar.db');
const db = new sqlite3.Database(dbPath);

console.log(`Migrating database at ${dbPath}...`);

db.run("ALTER TABLE job_openings ADD COLUMN content_blocks TEXT", (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column content_blocks already exists.');
        } else {
            console.error('Error adding column:', err);
        }
    } else {
        console.log('Successfully added content_blocks column to job_openings.');
    }
    db.close();
});
