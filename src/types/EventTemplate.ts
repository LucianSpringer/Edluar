export interface EventTemplate {
    id: string;
    name: string; // Internal name (e.g. "Intro Call")
    eventTitle: string; // The invite title (e.g. "Intro with [candidate_name]")
    duration: number; // Minutes
    location: string; // "Google Meet" or "Room 2"
    description: string; // The email body with [placeholders]
    type: 'interview' | 'screening' | 'team_sync' | 'blocked';
}
