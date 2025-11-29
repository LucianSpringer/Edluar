import { Request, Response } from 'express';
import { ReviewRepository } from '../repositories/ReviewRepository';

export class ReviewController {
    /**
     * Create a new review for an application
     * POST /api/applications/:id/reviews
     */
    static async create(req: Request, res: Response) {
        try {
            const { id } = req.params; // application_id
            const { reviewer_id, rating, comment } = req.body;

            if (!reviewer_id || !rating) {
                return res.status(400).json({ error: 'reviewer_id and rating are required' });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'rating must be between 1 and 5' });
            }

            // Check if reviewer already reviewed this application
            const existing = await ReviewRepository.findByReviewerAndApplication(
                reviewer_id,
                Number(id)
            );

            if (existing) {
                // Update existing review instead
                await ReviewRepository.update(existing.id!, { rating, comment });
                const updated = await ReviewRepository.findByApplicationId(Number(id));
                return res.json({ message: 'Review updated', reviews: updated });
            }

            // Create new review
            const review = await ReviewRepository.create({
                application_id: Number(id),
                reviewer_id,
                rating,
                comment
            });

            // Return all reviews for this application
            const reviews = await ReviewRepository.findByApplicationId(Number(id));
            const stats = await ReviewRepository.getAverageRating(Number(id));

            res.status(201).json({ review, reviews, stats });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Failed to create review' });
        }
    }

    /**
     * Get all reviews for an application
     * GET /api/applications/:id/reviews
     */
    static async getByApplication(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const reviews = await ReviewRepository.findByApplicationId(Number(id));
            const stats = await ReviewRepository.getAverageRating(Number(id));

            res.json({ reviews, stats });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }

    /**
     * Get average rating for an application
     * GET /api/applications/:id/reviews/average
     */
    static async getAverage(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const stats = await ReviewRepository.getAverageRating(Number(id));

            res.json(stats);
        } catch (error) {
            console.error('Error calculating average rating:', error);
            res.status(500).json({ error: 'Failed to calculate average rating' });
        }
    }

    /**
     * Update a review
     * PATCH /api/reviews/:id
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;

            await ReviewRepository.update(Number(id), { rating, comment });

            res.json({ message: 'Review updated successfully' });
        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ error: 'Failed to update review' });
        }
    }

    /**
     * Delete a review
     * DELETE /api/reviews/:id
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await ReviewRepository.delete(Number(id));

            res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ error: 'Failed to delete review' });
        }
    }
}
