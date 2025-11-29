import { DatabaseManager } from './database/Database';

async function verifyGroupScheduling() {
    const db = DatabaseManager.getInstance();

    console.log("Verifying Group Scheduling...");

    // 1. Get a user (recruiter)
    let user = await db.get('SELECT * FROM users LIMIT 1');
    if (!user) {
        console.error("No users found. Please seed DB first.");
        return;
    }

    // 2. Get an application
    let app = await db.get('SELECT * FROM applications LIMIT 1');
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("API Request Successful!");
            const data = await response.json() as any;
            const interview = data.interview;
            console.log("Created Interview ID:", interview.id);

            // 4. Verify DB
            const dbInterview = await db.get('SELECT * FROM interviews WHERE id = ?', [interview.id]);
            console.log("DB Interview:", dbInterview);

            const dbAttendees = await db.all('SELECT * FROM interview_attendees WHERE interview_id = ?', [interview.id]);
            console.log("DB Attendees:", dbAttendees);

            if (dbInterview.duration === 90 && dbAttendees.length === 1) {
                console.log("✅ VERIFICATION PASSED: Duration and Attendees saved correctly.");
            } else {
                console.error("❌ VERIFICATION FAILED: Data mismatch.");
            }

        } else {
            console.error("API Request Failed:", response.status, await response.text());
        }
    } catch (error: any) {
        console.error("API Request Error:", error.message);
    }
}

verifyGroupScheduling().catch(console.error);
