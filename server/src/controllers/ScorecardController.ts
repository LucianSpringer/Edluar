import { Request, Response } from 'express';
import { ScorecardRepository } from '../repositories/ScorecardRepository';

export class ScorecardController {
    /**
     * Create a new scorecard for an application
     * POST /api/applications/:id/scorecards
     */
    static async create(req: Request, res: Response) {
        try {
            const { id } = req.params; // application_id
            const { reviewer_id, reviewer_name, skills_rating, culture_rating, ratings, takeaways } = req.body;

            if (!reviewer_id || !takeaways) {
                return res.status(400).json({ error: 'reviewer_id and takeaways are required' });
            }

            if (skills_rating < 1 || skills_rating > 5 || culture_rating < 1 || culture_rating > 5) {
                return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
            }

            // Check if reviewer already submitted scorecard for this application
            const existing = await ScorecardRepository.findByReviewerAndApplication(
                reviewer_id,
                Number(id)
            );

            if (existing) {
                // Update existing scorecard instead
                await ScorecardRepository.update(existing.id!, {
                    skills_rating: skills_rating || 0,
                    culture_rating: culture_rating || 0,
                    ratings: JSON.stringify(ratings || {}),
                    takeaways
                });
                const updated = await ScorecardRepository.findByApplicationId(Number(id));
                return res.json({ message: 'Scorecard updated', scorecards: updated });
            }

            // Create new scorecard
            const scorecard = await ScorecardRepository.create({
                application_id: Number(id),
                reviewer_id,
                reviewer_name,
                skills_rating: skills_rating || 0,
                culture_rating: culture_rating || 0,
                ratings: JSON.stringify(ratings || {}),
                takeaways
            });

            // Return all scorecards for this application
            const scorecards = await ScorecardRepository.findByApplicationId(Number(id));
            const averages = await ScorecardRepository.getAverageRatings(Number(id));

            res.status(201).json({ scorecard, scorecards, averages });
        } catch (error) {
            console.error('Error creating scorecard:', error);
            res.status(500).json({ error: 'Failed to create scorecard' });
        }
    }

    /**
     * Get all scorecards for an application
     * GET /api/applications/:id/scorecards
     */
    static async getByApplication(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const scorecards = await ScorecardRepository.findByApplicationId(Number(id));
            const averages = await ScorecardRepository.getAverageRatings(Number(id));

            res.json({ scorecards, averages });
        } catch (error) {
            console.error('Error fetching scorecards:', error);
            res.status(500).json({ error: 'Failed to fetch scorecards' });
        }
    }

    /**
     * Get average ratings for an application
     * GET /api/applications/:id/scorecards/average
     */
    static async getAverage(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const averages = await ScorecardRepository.getAverageRatings(Number(id));

            res.json(averages);
        } catch (error) {
            console.error('Error calculating average ratings:', error);
            res.status(500).json({ error: 'Failed to calculate average ratings' });
        }
    }

    /**
     * Update a scorecard
     * PATCH /api/scorecards/:id
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { skills_rating, culture_rating, ratings, takeaways } = req.body;

            await ScorecardRepository.update(Number(id), {
                skills_rating,
                culture_rating,
                ratings: ratings ? JSON.stringify(ratings) : undefined,
                takeaways
            });

            res.json({ message: 'Scorecard updated successfully' });
        } catch (error) {
            console.error('Error updating scorecard:', error);
            res.status(500).json({ error: 'Failed to update scorecard' });
        }
    }

    /**
     * Delete a scorecard
     * DELETE /api/scorecards/:id
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await ScorecardRepository.delete(Number(id));

            res.json({ message: 'Scorecard deleted successfully' });
        } catch (error) {
            console.error('Error deleting scorecard:', error);
            res.status(500).json({ error: 'Failed to delete scorecard' });
        }
    }
}
