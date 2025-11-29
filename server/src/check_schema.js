const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../server/data/edluar.db');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(job_openings)", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));

    // Check if scorecard_config exists
    const hasScorecardConfig = rows.some(row => row.name === 'scorecard_config');
    console.log(`Has scorecard_config: ${hasScorecardConfig}`);
});

db.close();
