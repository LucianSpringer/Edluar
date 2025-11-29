import { DatabaseManager } from '../database/Database';

export interface Review {
    id?: number;
    application_id: number;
    reviewer_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ReviewWithReviewer extends Review {
    reviewer_name: string;
}

export class ReviewRepository {
    /**
     * Create a new review
     */
    static async create(data: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
        const db = DatabaseManager.getInstance();

        const result = await db.run(
            `INSERT INTO reviews (application_id, reviewer_id, rating, comment) 
             VALUES (?, ?, ?, ?)`,
            [data.application_id, data.reviewer_id, data.rating, data.comment || null]
        );

        return {
            id: result.lastID,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    /**
     * Get all reviews for an application with reviewer names
     */
    static async findByApplicationId(applicationId: number): Promise<ReviewWithReviewer[]> {
        const db = DatabaseManager.getInstance();

        const reviews = await db.all(
            `SELECT 
                r.*,
                u.name as reviewer_name
             FROM reviews r
             LEFT JOIN users u ON r.reviewer_id = u.id
             WHERE r.application_id = ?
             ORDER BY r.created_at DESC`,
            [applicationId]
        ) as ReviewWithReviewer[];

        return reviews;
    }

    /**
     * Get average rating for an application
     */
    static async getAverageRating(applicationId: number): Promise<{ average: number; count: number }> {
        const db = DatabaseManager.getInstance();

        const result = await db.get(
            `SELECT 
                COALESCE(AVG(rating), 0) as average,
                COUNT(*) as count
             FROM reviews
             WHERE application_id = ?`,
            [applicationId]
        ) as { average: number; count: number } | undefined;

        return {
            average: result?.average ? Math.round(result.average * 10) / 10 : 0,
            count: result?.count || 0
        };
    }

    /**
     * Update a review
     */
    static async update(id: number, data: Partial<Pick<Review, 'rating' | 'comment'>>): Promise<void> {
        const db = DatabaseManager.getInstance();

        const updates: string[] = [];
        const values: any[] = [];

        if (data.rating !== undefined) {
            updates.push('rating = ?');
            values.push(data.rating);
        }

        if (data.comment !== undefined) {
            updates.push('comment = ?');
            values.push(data.comment);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await db.run(
            `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    /**
     * Delete a review
     */
    static async delete(id: number): Promise<void> {
        const db = DatabaseManager.getInstance();
        await db.run('DELETE FROM reviews WHERE id = ?', [id]);
    }

    /**
     * Find review by reviewer and application (to prevent duplicates)
     */
    static async findByReviewerAndApplication(reviewerId: number, applicationId: number): Promise<Review | null> {
        const db = DatabaseManager.getInstance();

        const review = await db.get(
            'SELECT * FROM reviews WHERE reviewer_id = ? AND application_id = ?',
            [reviewerId, applicationId]
        ) as Review | undefined;

        return review || null;
    }
}
