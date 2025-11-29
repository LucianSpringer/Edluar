import { EventTemplate } from '../types/EventTemplate';

export const defaultEventTemplates: EventTemplate[] = [
    {
        id: '1',
        name: 'First Interview',
        eventTitle: 'Interview with [candidate_name]',
        duration: 60,
        location: 'Google Meet',
        description: `Hi [first_name],

I'm looking forward to our chat about the [job_title] role at [company_name].

Best,
[sender_name]`,
        type: 'interview'
    },
    {
        id: '2',
        name: 'Screening Call',
        eventTitle: 'Screening: [candidate_name]',
        duration: 30,
        location: 'Phone Call',
        description: `Hi [first_name],

This is a quick screening call for the [job_title] position.

Talk soon,
[sender_name]`,
        type: 'screening'
    },
    {
        id: '3',
        name: 'Team Sync',
        eventTitle: 'Team Sync: [job_title]',
        duration: 45,
        location: 'Conference Room A',
        description: `Weekly sync to discuss candidates for [job_title].`,
        type: 'team_sync'
    }
];
