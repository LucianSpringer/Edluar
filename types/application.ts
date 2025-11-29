// Application Types for ATS System

export type ApplicationStage = 'applied' | 'phone_screen' | 'interview' | 'offer' | 'hired';

export interface Application {
    id: number;
    job_id: number;
    candidate_id: number;
    status: ApplicationStage;
    source: string;
    applied_at: string;
    updated_at: string;

    // Joined data from candidates table
    first_name?: string;
    last_name?: string;
    email?: string;
    resume_url?: string;
    tags?: string[];
}

export interface CreateApplicationPayload {
    jobId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    resumeUrl?: string;
    source?: string;
    tags?: string[];
}

export interface UpdateStagePayload {
    newStage: ApplicationStage;
}

export interface UpdateStageResponse {
    success: boolean;
    suggestAction?: 'OPEN_INBOX' | 'OPEN_SCHEDULER_MODAL' | 'JOB_CLOSED' | null;
    application: Application;
}

export interface GroupedApplications {
    applied: Application[];
    phone_screen: Application[];
    interview: Application[];
    offer: Application[];
    hired: Application[];
}
