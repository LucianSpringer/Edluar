import React, { useState } from 'react';
import { Search, Send, Activity, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '../Button';

export const SupportSettings: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [supportForm, setSupportForm] = useState({
        subject: '',
        message: '',
        severity: 'low',
    });
    const [feedbackText, setFeedbackText] = useState('');

    const handleSearchDocs = () => {
        alert(`Searching docs for: ${searchQuery}`);
    };

    const handleContactSupport = () => {
        alert('Support request submitted!');
        setSupportForm({ subject: '', message: '', severity: 'low' });
    };

    const handleSubmitFeedback = () => {
        alert('Thank you for your feedback!');
        setFeedbackText('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                    Help & Support
                </h1>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
                    Get help and share your ideas
                </p>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-1">
                            System Status
                        </h2>
                        <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                            All systems operational
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium text-sm">Healthy</span>
                    </div>
                </div>
            </div>

            {/* Documentation Search */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Search Documentation
                </h2>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-edluar-dark/40 dark:text-edluar-cream/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help articles..."
                            className="w-full pl-10 pr-4 py-3 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                        />
                    </div>
                    <Button onClick={handleSearchDocs} variant="primary" size="sm">
                        Search
                    </Button>
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Contact Support
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={supportForm.subject}
                            onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                            placeholder="Brief description of your issue"
                            className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Severity
                        </label>
                        <select
                            value={supportForm.severity}
                            onChange={(e) => setSupportForm({ ...supportForm, severity: e.target.value })}
                            className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                        >
                            <option value="low">Low - General inquiry</option>
                            <option value="medium">Medium - Feature request</option>
                            <option value="high">High - System issue</option>
                            <option value="critical">Critical - Service down</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Message
                        </label>
                        <textarea
                            value={supportForm.message}
                            onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                            rows={4}
                            placeholder="Describe your issue in detail..."
                            className="w-full px-4 py-3 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all resize-none"
                        />
                    </div>

                    <Button onClick={handleContactSupport} variant="primary" size="md">
                        <Send className="w-4 h-4 mr-2" />
                        Send Request
                    </Button>
                </div>
            </div>

            {/* Give Feedback Widget */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4 mb-4">
                    <ThumbsUp className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold mb-2">Give Feedback</h2>
                        <p className="text-white/90 text-sm">
                            What feature is Edluar missing? Your input shapes our roadmap!
                        </p>
                    </div>
                </div>
                <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={3}
                    placeholder="I wish Edluar had..."
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl placeholder-white/60 text-white focus:ring-2 focus:ring-white/50 transition-all resize-none mb-3"
                />
                <button
                    onClick={handleSubmitFeedback}
                    className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Submit Feedback
                </button>
            </div>
        </div>
    );
};
