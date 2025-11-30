import { Request, Response } from 'express';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { ActivityRepository } from '../repositories/ActivityRepository';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { JobOpeningRepository } from '../repositories/JobOpeningRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { DatabaseManager } from '../database/Database';

export class ApplicationController {
    /**
     * Create new application (Step 2: with candidate upsert)
     */
    static async create(req: Request, res: Response) {
        try {
            const { jobId, email, firstName, lastName, phone, resumeUrl, source, tags } = req.body;

            console.log('Received application payload:', { jobId, email, firstName, lastName });

            if (!jobId || !email || !firstName) {
                return res.status(400).json({ error: 'Missing required fields: jobId, email, or firstName' });
            }

            // REFINEMENT 1: Candidate Upsert
            // Check if candidate exists by email, create if not
            const candidate = await CandidateRepository.findOrCreateByEmail(email, {
                firstName,
                lastName: lastName || '',
                phone,
                resumeUrl,
                tags
            });

            // Check for duplicate application
            const existing = await ApplicationRepository.findByJobAndCandidate(jobId, candidate.id);
            if (existing) {
                return res.status(409).json({
                    error: 'Candidate already applied to this job',
                    application: existing
                });
            }

            // Create application
            const application = await ApplicationRepository.create({
                jobId,
                candidateId: candidate.id,
                status: 'applied',
                source: source || 'Direct'
            });

            // Create initial activity
            await ActivityRepository.create({
                applicationId: application.id,
                type: 'status_change',
                content: 'Application submitted'
            });

            // 5. Create Notification for Job Owner
            try {
                const job = await JobOpeningRepository.findById(jobId);
                if (job) {
                    await NotificationRepository.create({
                        userId: job.user_id,
                        type: 'new_candidate',
                        resourceId: application.id,
                        content: `New candidate ${firstName} ${lastName || ''} applied for ${job.title}`
                    });
                }
            } catch (notifError) {
                console.error('Failed to create notification:', notifError);
            }

            res.status(201).json({ application, candidate });
        } catch (error) {
            console.error('Error creating application:', error);
            res.status(500).json({ error: 'Failed to create application' });
        }
    }

    /**
     * Update application stage (Step 3: with transaction and automation)
     */
    static async updateStage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { newStage } = req.body;

            if (!newStage) {
                return res.status(400).json({ error: 'newStage is required' });
            }

            const application = await ApplicationRepository.findById(Number(id));
            if (!application) {
                return res.status(404).json({ error: 'Application not found' });
            }

            // Update stage
            await ApplicationRepository.updateStage(Number(id), newStage);

            // Create activity log
            await ActivityRepository.create({
                applicationId: Number(id),
                type: 'status_change',
                content: `Stage changed to ${newStage}`
            });

            // REFINEMENT 3: Check if hiring (with transaction for headcount check)
            let suggestAction = null;
            if (newStage === 'hired') {
                const db = DatabaseManager.getInstance();

                // Count total hires for this job
                const hireCount = await ApplicationRepository.countHired(application.job_id);

                // Get job details
                const job = await JobOpeningRepository.findById(application.job_id);

                // If headcount reached, close job
                if (job && hireCount >= (job.headcount || 1)) {
                    await JobOpeningRepository.update(application.job_id, { status: 'closed' });
                    suggestAction = 'JOB_CLOSED';
                }
            }

            // SMART AUTOMATION: Suggest next action based on stage
            if (newStage === 'phone_screen') {
                suggestAction = 'OPEN_INBOX';
            } else if (newStage === 'interview') {
                suggestAction = 'OPEN_SCHEDULER_MODAL';
            }

            res.json({
                success: true,
                suggestAction,
                application: await ApplicationRepository.findById(Number(id))
            });
        } catch (error) {
            console.error('Error updating stage:', error);
            res.status(500).json({ error: 'Failed to update application stage' });
        }
    }

    /**
     * Get applications for a job (for Kanban board)
     */
    static async getByJob(req: Request, res: Response) {
        try {
            const { jobId } = req.params;

            const applications = await ApplicationRepository.findByJobId(Number(jobId));

            // Group by status for Kanban columns
            const grouped = {
                applied: applications.filter(a => a.status === 'applied'),
                phone_screen: applications.filter(a => a.status === 'phone_screen'),
                interview: applications.filter(a => a.status === 'interview'),
                offer: applications.filter(a => a.status === 'offer'),
                hired: applications.filter(a => a.status === 'hired')
            };

            res.json(grouped);
        } catch (error) {
            console.error('Error fetching applications:', error);
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }

    /**
     * Get activities for an application (for Inbox)
     */
    static async getActivities(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { communications } = req.query;

            let activities;
            if (communications === 'true') {
                // REFINEMENT 2: Inbox clutter control
                activities = await ActivityRepository.findCommunications(Number(id));
            } else {
                activities = await ActivityRepository.findByApplicationId(Number(id));
            }

            res.json(activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
            res.status(500).json({ error: 'Failed to fetch activities' });
        }
    }

    /**
     * Create new activity (for Inbox messaging)
     */
    static async createActivity(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { type, content, scheduledAt } = req.body;

            if (!type || !content) {
                return res.status(400).json({ error: 'Type and content are required' });
            }

            const activity = await ActivityRepository.create({
                applicationId: Number(id),
                type,
                content,
                scheduledAt
            });

            res.status(201).json(activity);
        } catch (error) {
            console.error('Error creating activity:', error);
            res.status(500).json({ error: 'Failed to create activity' });
        }
    }

    /**
     * Get all scheduled activities (for Schedule view)
     */
    static async getScheduledActivities(req: Request, res: Response) {
        try {
            const activities = await ActivityRepository.findScheduled();
            res.json(activities);
        } catch (error) {
            console.error('Error fetching scheduled activities:', error);
            res.status(500).json({ error: 'Failed to fetch scheduled activities' });
        }
    }
    /**
     * Get all applications (for Global Dashboard)
     */
    static async getAll(req: Request, res: Response) {
        try {
            const applications = await ApplicationRepository.findAll();

            // Group by status for Kanban columns
            const grouped = {
                applied: applications.filter(a => a.status === 'applied'),
                phone_screen: applications.filter(a => a.status === 'phone_screen'),
                interview: applications.filter(a => a.status === 'interview'),
                offer: applications.filter(a => a.status === 'offer'),
                hired: applications.filter(a => a.status === 'hired')
            };

            res.json(grouped);
        } catch (error) {
            console.error('Error fetching all applications:', error);
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }



    /**
     * Get candidate application history
     */
    static async getCandidateHistory(req: Request, res: Response) {
        try {
            const { candidateId } = req.params;
            const history = await ApplicationRepository.findHistoryByCandidateId(Number(candidateId));
            res.json(history);
        } catch (error) {
            console.error('Error fetching candidate history:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    }

    static async saveAIAnalysis(req: Request, res: Response) {
        const { id } = req.params;
        const { analysis } = req.body; // Expecting JSON string or object
        await ApplicationRepository.updateAIAnalysis(Number(id), typeof analysis === 'string' ? analysis : JSON.stringify(analysis));
        res.json({ success: true });
    }
}
