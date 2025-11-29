import { Request, Response } from 'express';
import { JobOpeningRepository } from '../repositories/JobOpeningRepository';
import fs from 'fs';
import path from 'path';

export class JobController {
    /**
     * Create a new job opening
     */
    static async create(req: Request, res: Response) {
        try {
            const { title, type, department, location, status, content_blocks, application_form_config, theme_config } = req.body;

            // Basic validation
            if (!title) {
                return res.status(400).json({ error: 'Job title is required' });
            }

            // In a real app, we'd get the user ID from the authenticated session
            // For now, we'll assume a default user ID or extract it if available in the request
            // Since we don't have full auth middleware context in this snippet, let's default to 1
            // or expect it in the body for testing purposes if not present.
            const userId = (req as any).user?.id || 1;

            const job = await JobOpeningRepository.create({
                userId,
                title,
                employmentType: type, // Mapping 'type' from frontend to 'employmentType' in DB
                department,
                location,
                status: status || 'active',
                content_blocks: content_blocks ? JSON.stringify(content_blocks) : undefined,
                application_form_config: application_form_config ? JSON.stringify(application_form_config) : undefined,
                theme_config: theme_config ? JSON.stringify(theme_config) : undefined
            });

            res.status(201).json(job);
        } catch (error) {
            console.error('Error creating job:', error);
            const logPath = 'c:/Users/valen/Downloads/edluar-ats/server/error.log';
            fs.appendFileSync(logPath, `${new Date().toISOString()} - Error creating job: ${error}\n`);
            res.status(500).json({ error: 'Failed to create job opening' });
        }
    }

    /**
     * Get all jobs for the current user
     */
    static async getAll(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id || 1;
            const jobs = await JobOpeningRepository.findByUserId(userId);
            res.json(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    }

    /**
     * Get job by ID
     */
    static async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid job ID' });
            }

            const job = await JobOpeningRepository.findById(id);
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.json(job);
        } catch (error) {
            console.error('Error fetching job:', error);
            res.status(500).json({ error: 'Failed to fetch job' });
        }
    }

    /**
     * Update job
     */
    static async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid job ID' });
            }

            const { title, type, department, location, status, content_blocks, application_form_config, theme_config } = req.body;

            const job = await JobOpeningRepository.update(id, {
                title,
                employmentType: type,
                department,
                location,
                status,
                content_blocks: content_blocks ? (typeof content_blocks === 'string' ? content_blocks : JSON.stringify(content_blocks)) : undefined,
                application_form_config: application_form_config ? (typeof application_form_config === 'string' ? application_form_config : JSON.stringify(application_form_config)) : undefined,
                theme_config: theme_config ? (typeof theme_config === 'string' ? theme_config : JSON.stringify(theme_config)) : undefined
            });

            res.json(job);
        } catch (error) {
            console.error('Error updating job:', error);
            res.status(500).json({ error: 'Failed to update job' });
        }
    }

    /**
     * Delete job opening
     */
    static async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }

            const success = await JobOpeningRepository.delete(id);
            if (!success) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.json({ message: 'Job deleted successfully' });
        } catch (error) {
            console.error('Failed to delete job:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
