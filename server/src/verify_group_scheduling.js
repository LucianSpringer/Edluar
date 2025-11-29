
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/edluar.db');
const db = new sqlite3.Database(dbPath);

async function verifyGroupScheduling() {
    console.log("Verifying Group Scheduling (JS)...");

    // Helper to query DB
    const get = (sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
    const all = (sql, params = []) => new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });

    // 1. Get a user (recruiter)
    let user = await get('SELECT * FROM users LIMIT 1');
    if (!user) {
        console.error("No users found. Please seed DB first.");
        return;
    }

    // 2. Get an application
    let app = await get('SELECT * FROM applications LIMIT 1');
    if (!app) {
        console.error("No applications found. Please seed DB first.");
        return;
    }

    // 3. Create an interview via API
    const payload = {
        scheduled_by: user.id,
        interview_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        location: 'Zoom',
        duration: 90,
        title: 'Final Round Interview',
        description: 'Deep dive into system design.',
        location_link: 'https://zoom.us/j/999',
        attendees: [user.id] // Adding self as attendee for test
    };

    try {
        console.log("Sending API Request...");
        const response = await fetch(`http://localhost:5000/api/applications/${app.id}/interviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("API Request Successful!");
            const data = await response.json();
            const interview = data.interview;
            console.log("Created Interview ID:", interview.id);

            // 4. Verify DB
            const dbInterview = await get('SELECT * FROM interviews WHERE id = ?', [interview.id]);
            console.log("DB Interview:", dbInterview);

            const dbAttendees = await all('SELECT * FROM interview_attendees WHERE interview_id = ?', [interview.id]);
            console.log("DB Attendees:", dbAttendees);

            if (dbInterview.duration === 90 && dbAttendees.length === 1) {
                console.log("✅ VERIFICATION PASSED: Duration and Attendees saved correctly.");
            } else {
                console.error("❌ VERIFICATION FAILED: Data mismatch.");
            }

        } else {
            console.error("API Request Failed:", response.status, await response.text());
        }
    } catch (error) {
        console.error("API Request Error:", error);
    } finally {
        db.close();
    }
}

verifyGroupScheduling().catch(console.error);
