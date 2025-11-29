import { Request, Response } from 'express';
import { InterviewRepository } from '../repositories/InterviewRepository';
import { randomBytes } from 'crypto';

export class InterviewController {
    /**
     * Schedule an interview
     * POST /api/applications/:id/interviews
     */
    static async create(req: Request, res: Response) {
        try {
            const { id } = req.params; // application_id (optional)
            const { scheduled_by, interview_date, location, duration, title, description, location_link, attendees, event_type } = req.body;

            if (!scheduled_by || !interview_date || !location) {
                return res.status(400).json({ error: 'scheduled_by, interview_date, and location are required' });
            }

            // Validate future date - REMOVED to allow backdating
            // if (new Date(interview_date) < new Date()) {
            //     return res.status(400).json({ error: 'Interview date must be in the future' });
            // }

            // Generate confirmation token
            const confirmation_token = randomBytes(16).toString('hex');

            const interview = await InterviewRepository.create({
                application_id: id ? Number(id) : null, // Handle optional application_id
                scheduled_by,
                interview_date,
                location,
                duration: duration || 60,
                title: title || 'Interview',
                description: description || '',
                location_link: location_link || '',
                confirmation_token,
                attendees: attendees || [],
                event_type: event_type || 'interview'
            });

            // --- ICS GENERATION (Mock) ---
            const startDate = new Date(interview_date);
            const endDate = new Date(startDate.getTime() + (duration || 60) * 60000);

            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Edluar ATS//EN
BEGIN:VEVENT
UID:${confirmation_token}@edluar.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${title || 'Interview'}
DESCRIPTION:${description || ''}
LOCATION:${location_link || location}
END:VEVENT
END:VCALENDAR`;

            console.log("--- MOCK EMAIL SENT ---");
            console.log(`To: Candidate & Attendees (${attendees?.length || 0})`);
            console.log("Subject: Interview Invitation: " + (title || 'Interview'));
            console.log("Attachment: invite.ics");
            console.log(icsContent);
            console.log("-----------------------");

            // In a real app, we would send the email here.
            // For this demo, we'll return the confirmation link so the frontend can display it or use it in a mailto link.
            const confirmationLink = `http://localhost:5000/api/interviews/confirm/${confirmation_token}`;

            res.status(201).json({
                message: 'Interview scheduled',
                interview,
                confirmationLink
            });
        } catch (error) {
            console.error('Error scheduling interview:', error);
            res.status(500).json({ error: 'Failed to schedule interview' });
        }
    }

    /**
     * Confirm an interview
     * GET /api/interviews/confirm/:token
     */
    static async confirm(req: Request, res: Response) {
        try {
            const { token } = req.params;

            const interview = await InterviewRepository.findByToken(token);

            if (!interview) {
                return res.status(404).send('Invalid confirmation token');
            }

            if (interview.confirmed) {
                return res.send('Interview already confirmed');
            }

            await InterviewRepository.confirm(interview.id!);

            // Redirect to a success page or show a simple success message
            res.send(`
                <html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #4A7C59;">Interview Confirmed! ✅</h1>
                        <p>Thank you for confirming your interview.</p>
                        <p>We look forward to meeting you on <strong>${new Date(interview.interview_date).toLocaleString()}</strong>.</p>
                    </body>
                </html>
            `);
        } catch (error) {
            console.error('Error confirming interview:', error);
            res.status(500).send('Failed to confirm interview');
        }
    }

    /**
     * Get upcoming interviews
     * GET /api/interviews/upcoming
     */
    static async getUpcoming(req: Request, res: Response) {
        try {
            const interviews = await InterviewRepository.getUpcoming();
            res.json(interviews);
        } catch (error) {
            console.error('Error fetching upcoming interviews:', error);
            res.status(500).json({ error: 'Failed to fetch upcoming interviews' });
        }
    }
    /**
     * Cancel/Delete an interview
     * DELETE /api/interviews/:id
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const interviewId = Number(id);

            // 1. Fetch for "Mock Notification"
            const interview = await InterviewRepository.findById(interviewId);
            if (!interview) return res.status(404).json({ error: "Interview not found" });

            // Mock Email Log
            console.log("--- MOCK CANCELLATION EMAIL SENT ---");
            console.log(`To: Attendees`);
            console.log(`Subject: CANCELED: ${interview.title}`);
            console.log("------------------------------------");

            // 2. Delete
            await InterviewRepository.delete(interviewId);

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting interview:', error);
            res.status(500).json({ error: 'Failed to delete interview' });
        }
    }
}
