export interface Review {
    id: number;
    application_id: number;
    reviewer_id: number;
    reviewer_name?: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    created_at: string;
    updated_at: string;
}

export interface ReviewStats {
    average: number;
    count: number;
}

export interface CreateReviewRequest {
    reviewer_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
}
