// Activity Types for Timeline/Inbox/Schedule

export type ActivityType = 'note' | 'email' | 'interview_scheduled' | 'status_change';

export interface Activity {
    id: number;
    application_id: number;
    type: ActivityType;
    content: string | null;
    scheduled_at: string | null;
    created_at: string;
}

export interface CreateActivityPayload {
    applicationId: number;
    type: ActivityType;
    content?: string;
    scheduledAt?: string;
}

export interface CommunicationActivity extends Activity {
    type: 'note' | 'email' | 'interview_scheduled';
}
