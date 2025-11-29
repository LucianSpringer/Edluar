export enum EventType {
    INTERVIEW = 'interview',
    SCREENING = 'screening',
    TEAM_SYNC = 'team_sync',
    BLOCKED = 'blocked'
}

export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    start: string; // ISO string (UTC)
    end: string;   // ISO string (UTC)
    type: EventType;
    candidate_id?: number;
    candidate_name?: string;
    job_id?: number;
    job_title?: string;

    // Layout properties (calculated on frontend)
    layout?: {
        top: number;    // pixels
        height: number; // pixels
        left: number;   // percentage (0-100)
        width: number;  // percentage (0-100)
    };
}

export interface DraftEvent {
    start: Date;
    durationMinutes: number;
    title: string;
    type: EventType;
    description: string;
}
