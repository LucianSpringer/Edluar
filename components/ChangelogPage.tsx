<<<<<<< HEAD
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ChangelogPageProps {
    onNavigate: (page: string) => void;
}

export const ChangelogPage: React.FC<ChangelogPageProps> = ({ onNavigate }) => {
    const updates = [
        {
            version: '2.1.0',
            date: 'November 2025',
            title: 'AI-Powered Screening',
            items: [
                'New AI-driven candidate matching algorithm',
                'Enhanced job description generator with industry-specific templates',
                'Automated skill assessment scoring'
            ]
        },
        {
            version: '2.0.0',
            date: 'October 2025',
            title: 'Dashboard Redesign',
            items: [
                'Completely redesigned dashboard with dark mode support',
                'Real-time pipeline analytics',
                'Improved mobile responsiveness',
                'New integrations with Jira and Asana'
            ]
        },
        {
            version: '1.5.0',
            date: 'September 2025',
            title: 'Collaboration Features',
            items: [
                'Team collaboration tools',
                'Shared interview notes',
                'Calendar integration improvements'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <Button
                    variant="outline"
                    onClick={() => onNavigate('home')}
                    className="mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Changelog
                </h1>
                <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60 mb-12">
                    Stay up to date with the latest features and improvements.
                </p>

                <div className="space-y-8">
                    {updates.map((update, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-edluar-surface rounded-2xl p-8 border border-edluar-pale dark:border-edluar-moss/20 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-edluar-pale dark:bg-edluar-moss/30 text-edluar-dark dark:text-edluar-cream">
                                    {update.version}
                                </span>
                                <span className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                    {update.date}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                                {update.title}
                            </h2>
                            <ul className="space-y-2">
                                {update.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex items-start text-edluar-dark/80 dark:text-edluar-cream/80"
                                    >
                                        <span className="text-edluar-moss dark:text-edluar-sage mr-2">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
=======
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ChangelogPageProps {
    onNavigate: (page: string) => void;
}

export const ChangelogPage: React.FC<ChangelogPageProps> = ({ onNavigate }) => {
    const updates = [
        {
            version: '2.1.0',
            date: 'November 2025',
            title: 'AI-Powered Screening',
            items: [
                'New AI-driven candidate matching algorithm',
                'Enhanced job description generator with industry-specific templates',
                'Automated skill assessment scoring'
            ]
        },
        {
            version: '2.0.0',
            date: 'October 2025',
            title: 'Dashboard Redesign',
            items: [
                'Completely redesigned dashboard with dark mode support',
                'Real-time pipeline analytics',
                'Improved mobile responsiveness',
                'New integrations with Jira and Asana'
            ]
        },
        {
            version: '1.5.0',
            date: 'September 2025',
            title: 'Collaboration Features',
            items: [
                'Team collaboration tools',
                'Shared interview notes',
                'Calendar integration improvements'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <Button
                    variant="outline"
                    onClick={() => onNavigate('home')}
                    className="mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Changelog
                </h1>
                <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60 mb-12">
                    Stay up to date with the latest features and improvements.
                </p>

                <div className="space-y-8">
                    {updates.map((update, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-edluar-surface rounded-2xl p-8 border border-edluar-pale dark:border-edluar-moss/20 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-edluar-pale dark:bg-edluar-moss/30 text-edluar-dark dark:text-edluar-cream">
                                    {update.version}
                                </span>
                                <span className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                    {update.date}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                                {update.title}
                            </h2>
                            <ul className="space-y-2">
                                {update.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex items-start text-edluar-dark/80 dark:text-edluar-cream/80"
                                    >
                                        <span className="text-edluar-moss dark:text-edluar-sage mr-2">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
>>>>>>> 1428845e0c04fcca289181b61e0cb7f4ada244b8
