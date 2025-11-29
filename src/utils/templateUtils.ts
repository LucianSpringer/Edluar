import { EventTemplate } from '../types/EventTemplate';

interface TemplateContext {
    candidate?: {
        firstName: string;
        lastName: string;
    };
    recruiter?: {
        name: string;
        email: string;
    };
    job?: {
        title: string;
    };
}

export const parseTemplate = (text: string, context: TemplateContext): string => {
    let result = text;

    if (context.candidate) {
        result = result
            .replace(/\[first_name\]/g, context.candidate.firstName)
            .replace(/\[last_name\]/g, context.candidate.lastName)
            .replace(/\[candidate_name\]/g, `${context.candidate.firstName} ${context.candidate.lastName}`);
    }

    if (context.recruiter) {
        result = result
            .replace(/\[sender_name\]/g, context.recruiter.name)
            .replace(/\[sender_email\]/g, context.recruiter.email);
    }

    if (context.job) {
        result = result
            .replace(/\[job_title\]/g, context.job.title);
    }

    result = result.replace(/\[company_name\]/g, 'Edluar'); // Hardcoded for now

    return result;
};
