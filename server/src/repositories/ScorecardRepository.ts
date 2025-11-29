import { DatabaseManager } from '../database/Database';

export interface Scorecard {
    id?: number;
    application_id: number;
    reviewer_id: number;
    reviewer_name?: string;
    skills_rating: 1 | 2 | 3 | 4 | 5;
    culture_rating: 1 | 2 | 3 | 4 | 5;
    ratings?: string; // JSON string
    takeaways: string;
    created_at?: string;
    updated_at?: string;
}

export interface ScorecardWithReviewer extends Scorecard {
    reviewer_name: string;
}

export class ScorecardRepository {
    /**
     * Create a new scorecard
     */
    static async create(data: Omit<Scorecard, 'id' | 'created_at' | 'updated_at'>): Promise<Scorecard> {
        const db = DatabaseManager.getInstance();

        const result = await db.run(
            `INSERT INTO scorecards (application_id, reviewer_id, reviewer_name, skills_rating, culture_rating, ratings, takeaways) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.application_id,
                data.reviewer_id,
                data.reviewer_name || null,
                data.skills_rating,
                data.culture_rating,
                data.ratings || null,
                data.takeaways
            ]
        );

        return {
            id: result.lastID,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    /**
     * Get all scorecards for an application with reviewer names
     */
    static async findByApplicationId(applicationId: number): Promise<ScorecardWithReviewer[]> {
        const db = DatabaseManager.getInstance();

        const scorecards = await db.all(
            `SELECT 
                s.*,
                u.name as reviewer_name
             FROM scorecards s
             LEFT JOIN users u ON s.reviewer_id = u.id
             WHERE s.application_id = ?
             ORDER BY s.created_at DESC`,
            [applicationId]
        ) as ScorecardWithReviewer[];

        return scorecards;
    }

    /**
     * Get average ratings for an application
     */
    static async getAverageRatings(applicationId: number): Promise<{ skills_avg: number; culture_avg: number; count: number }> {
        const db = DatabaseManager.getInstance();

        const result = await db.get(
            `SELECT 
                COALESCE(AVG(skills_rating), 0) as skills_avg,
                COALESCE(AVG(culture_rating), 0) as culture_avg,
                COUNT(*) as count
             FROM scorecards
             WHERE application_id = ?`,
            [applicationId]
        ) as { skills_avg: number; culture_avg: number; count: number } | undefined;

        return {
            skills_avg: result?.skills_avg ? Math.round(result.skills_avg * 10) / 10 : 0,
            culture_avg: result?.culture_avg ? Math.round(result.culture_avg * 10) / 10 : 0,
            count: result?.count || 0
        };
    }

    /**
     * Update a scorecard
     */
    static async update(id: number, data: Partial<Pick<Scorecard, 'skills_rating' | 'culture_rating' | 'ratings' | 'takeaways'>>): Promise<void> {
        const db = DatabaseManager.getInstance();

        const updates: string[] = [];
        const values: any[] = [];

        if (data.skills_rating !== undefined) {
            updates.push('skills_rating = ?');
            values.push(data.skills_rating);
        }

        if (data.culture_rating !== undefined) {
            updates.push('culture_rating = ?');
            values.push(data.culture_rating);
        }

        if (data.ratings !== undefined) {
            updates.push('ratings = ?');
            values.push(data.ratings);
        }

        if (data.takeaways !== undefined) {
            updates.push('takeaways = ?');
            values.push(data.takeaways);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await db.run(
            `UPDATE scorecards SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    /**
     * Delete a scorecard
     */
    static async delete(id: number): Promise<void> {
        const db = DatabaseManager.getInstance();
        await db.run('DELETE FROM scorecards WHERE id = ?', [id]);
    }

    /**
     * Find scorecard by reviewer and application (to prevent duplicates)
     */
    static async findByReviewerAndApplication(reviewerId: number, applicationId: number): Promise<Scorecard | null> {
        const db = DatabaseManager.getInstance();

        const scorecard = await db.get(
            'SELECT * FROM scorecards WHERE reviewer_id = ? AND application_id = ?',
            [reviewerId, applicationId]
        ) as Scorecard | undefined;

        return scorecard || null;
    }
}
