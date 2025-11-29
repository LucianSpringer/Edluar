import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Tag, Star, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { StarRating } from './StarRating';
import { Review, ReviewStats } from '../types/review';
import { ScorecardModal } from './ScorecardModal';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

interface CandidateProfileModalProps {
    application: any;
    onClose: () => void;
    currentUserId: number;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
    application,
    onClose,
    currentUserId
}) => {
    const [activeTab, setActiveTab] = useState<'resume' | 'reviews' | 'messages'>('resume');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0 });
    const [activities, setActivities] = useState<any[]>([]);
    const [newRating, setNewRating] = useState<number>(0);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [showScorecardModal, setShowScorecardModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scorecards, setScorecards] = useState<any[]>([]);
    const [scorecardAverages, setScorecardAverages] = useState<{ skills_avg: number; culture_avg: number; count: number }>({ skills_avg: 0, culture_avg: 0, count: 0 });
    const [history, setHistory] = useState<any[]>([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    useEffect(() => {
        fetchReviews();
        fetchActivities();
        fetchScorecards();
        fetchHistory();
    }, [application.id]);

    const fetchHistory = async () => {
        if (!application?.candidate_id) return;
        try {
            const res = await fetch(`http://localhost:5000/api/candidates/${application.candidate_id}/history`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error("History fetch failed", e);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/reviews`);
            const data = await response.json();
            setReviews(data.reviews || []);
            setStats(data.stats || { average: 0, count: 0 });

            // Check if current user already reviewed
            const userReview = data.reviews?.find((r: Review) => r.reviewer_id === currentUserId);
            if (userReview) {
                setNewRating(userReview.rating);
                setNewComment(userReview.comment || '');
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/activities`);
            const data = await response.json();
            setActivities(data || []);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    };

    const fetchScorecards = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/scorecards`);
            const data = await response.json();
            setScorecards(data.scorecards || []);
            setScorecardAverages(data.averages || { skills_avg: 0, culture_avg: 0, count: 0 });
        } catch (error) {
            console.error('Failed to fetch scorecards:', error);
        }
    };

    const handleScorecardSubmit = async (data: { skills: number; culture: number; takeaways: string }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/scorecards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewer_id: currentUserId,
                    reviewer_name: 'Current User', // In a real app, this would come from auth context
                    skills_rating: data.skills,
                    culture_rating: data.culture,
                    takeaways: data.takeaways
                })
            });

            if (response.ok) {
                await fetchScorecards();
                setShowScorecardModal(false);
                alert('Scorecard submitted successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to submit scorecard: ${error.error}`);
            }
        } catch (error) {
            console.error('Failed to submit scorecard:', error);
            alert('Failed to submit scorecard');
        }
    };

    const handleScheduleSubmit = async (data: { date: string; location: string }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/interviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scheduled_by: currentUserId,
                    event_type: 'interview', // Default type, can be overridden if passed in data
                    ...data
                })
            });

            const result = await response.json();

            if (response.ok) {
                setShowScheduleModal(false);
                alert(`Interview Scheduled! Confirmation Link: ${result.confirmationLink}`);
                await fetchActivities();
            } else {
                alert(`Failed to schedule interview: ${result.error}`);
            }
        } catch (error) {
            console.error('Failed to schedule interview:', error);
            alert('Failed to schedule interview');
        }
    };

    const handleSubmitReview = async () => {
        if (newRating === 0) {
            alert('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewer_id: currentUserId,
                    rating: newRating,
                    comment: newComment
                })
            });

            const data = await response.json();

            if (response.ok) {
                await fetchReviews();
                alert('Review submitted successfully!');
            } else {
                alert(`Failed to submit review: ${data.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Failed to submit review:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'note': return <Tag className="w-4 h-4" />;
            case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
            case 'status_change': return <Star className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Message templates
    const messageTemplates = [
        {
            id: 'interview',
            label: 'Interview Invitation',
            content: `Hi ${application.first_name}, we'd like to invite you for an interview for the position you applied for. Are you available this week?`
        },
        {
            id: 'offer',
            label: 'Offer Letter',
            content: `Congratulations ${application.first_name}! We're excited to offer you the position at Edluar.`
        },
        {
            id: 'followup',
            label: 'Follow-up',
            content: `Hi ${application.first_name}, just following up on your application. Do you have any questions?`
        },
        {
            id: 'rejection',
            label: 'Polite Rejection',
            content: `Hi ${application.first_name}, thank you for your interest in joining our team. After careful consideration, we've decided to move forward with other candidates. We appreciate your time and wish you the best in your job search.`
        }
    ];

    const handleTemplateSelect = (templateId: string) => {
        const template = messageTemplates.find(t => t.id === templateId);
        if (template) {
            setNewMessage(template.content);
            setSelectedTemplate(templateId);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/applications/${application.id}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'email',
                    content: newMessage
                })
            });

            if (response.ok) {
                await fetchActivities();
                setNewMessage('');
                setSelectedTemplate('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-6xl h-[90vh] bg-white dark:bg-edluar-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-edluar-moss/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-edluar-moss to-edluar-pale flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {application.first_name?.[0]}{application.last_name?.[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                {application.first_name} {application.last_name}
                            </h2>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-500 text-sm">{application.email}</p>
                                {stats.count > 0 && (
                                    <div className="flex items-center gap-1">
                                        <StarRating rating={stats.average} readonly size="sm" />
                                        <span className="text-xs text-gray-400">({stats.count})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Calendar className="w-4 h-4" />
                            Schedule
                        </button>
                        {application.stage === 'interview' && (
                            <button
                                onClick={() => setShowScorecardModal(true)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Fill Scorecard
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Repeat Candidate Warning Banner */}
                {history.filter(h => h.id !== application.id).length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 px-6 py-3 flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-medium">
                                <span className="font-bold">Repeat Candidate:</span> This applicant has applied to {history.filter(h => h.id !== application.id).length} other position{history.filter(h => h.id !== application.id).length > 1 ? 's' : ''}.
                            </span>
                        </div>
                        <button
                            onClick={() => setShowHistoryModal(true)}
                            className="text-xs font-bold uppercase tracking-wider text-yellow-700 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 flex items-center gap-1"
                        >
                            View History <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-white/10 px-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('resume')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'resume'
                                ? 'border-edluar-moss text-edluar-moss font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Resume & Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'reviews'
                                ? 'border-edluar-moss text-edluar-moss font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Reviews {stats.count > 0 && `(${stats.count})`}
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'messages'
                                ? 'border-edluar-moss text-edluar-moss font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Messages
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'resume' && (
                        <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Resume PDF Viewer */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-bold uppercase text-gray-400 mb-3">Resume</h3>
                                {application.resume_url ? (
                                    <div className="bg-white dark:bg-black/20 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                        <iframe
                                            src={application.resume_url}
                                            className="w-full h-[500px]"
                                            title="Resume"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-[500px] flex items-center justify-center bg-white dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-white/10">
                                        <p className="text-gray-400">No resume uploaded</p>
                                    </div>
                                )}
                            </div>

                            {/* Candidate Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase text-gray-400">Email</span>
                                    </div>
                                    <p className="text-sm font-medium">{application.email}</p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase text-gray-400">Phone</span>
                                    </div>
                                    <p className="text-sm font-medium">{application.phone || 'N/A'}</p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase text-gray-400">Applied</span>
                                    </div>
                                    <p className="text-sm font-medium">{new Date(application.applied_at).toLocaleDateString()}</p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase text-gray-400">Source</span>
                                    </div>
                                    <p className="text-sm font-medium">{application.source || 'Direct'}</p>
                                </div>
                            </div>

                            {/* Tags */}
                            {application.tags && (
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase text-gray-400">Skills & Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {application.tags.split(',').map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-edluar-moss/10 text-edluar-moss text-xs font-medium rounded-full">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Scorecards Section */}
                            {scorecards.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300">Interview Scorecards ({scorecards.length})</h3>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <div>Skills Avg: <span className="font-bold text-gray-900 dark:text-white">{scorecardAverages.skills_avg}</span></div>
                                            <div>Culture Avg: <span className="font-bold text-gray-900 dark:text-white">{scorecardAverages.culture_avg}</span></div>
                                        </div>
                                    </div>
                                    <div className="grid gap-4">
                                        {scorecards.map((scorecard) => (
                                            <div key={scorecard.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{scorecard.reviewer_name || 'Interviewer'}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(scorecard.created_at)}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="text-center">
                                                            <div className="text-xs text-gray-500 uppercase">Skills</div>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-bold text-sm">{scorecard.skills_rating}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-xs text-gray-500 uppercase">Culture</div>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-bold text-sm">{scorecard.culture_rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 italic">
                                                    "{scorecard.takeaways}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Bar */}
                            <div className="bg-gradient-to-br from-edluar-moss/5 to-edluar-pale/5 rounded-xl p-4 border border-edluar-moss/20">
                                <h3 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300 mb-3">Your Review</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Rating</label>
                                        <StarRating
                                            rating={newRating}
                                            onChange={setNewRating}
                                            size="lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Comment for the team</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts about this candidate..."
                                            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm resize-none focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                            rows={3}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={newRating === 0 || loading}
                                        className="w-full px-4 py-2 bg-edluar-moss text-white rounded-lg font-medium text-sm hover:bg-edluar-moss/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </div>

                            {/* Team Reviews */}
                            {reviews.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-3">Team Reviews ({reviews.length})</h3>
                                    <div className="space-y-3">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium text-sm">{review.reviewer_name || 'Anonymous'}</p>
                                                        <StarRating rating={review.rating} readonly size="sm" />
                                                    </div>
                                                    <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Timeline */}
                            <div>
                                <h3 className="text-sm font-bold uppercase text-gray-400 mb-3">Activity Timeline</h3>
                                <div className="space-y-2">
                                    {activities.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">No activities yet</p>
                                    ) : (
                                        activities.map((activity) => (
                                            <div key={activity.id} className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-gray-500">
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{formatDate(activity.created_at)}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div className="h-full flex flex-col">
                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                                {activities.filter(a => a.type === 'email').length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
                                ) : (
                                    activities.filter(a => a.type === 'email').map((activity) => (
                                        <div key={activity.id} className={`flex ${activity.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${activity.sender === 'recruiter'
                                                ? 'bg-edluar-moss text-white'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                                }`}>
                                                <p className="text-sm">{activity.content}</p>
                                                <span className={`text-xs mt-1 block ${activity.sender === 'recruiter' ? 'text-white/70' : 'text-gray-400'
                                                    }`}>
                                                    {formatDate(activity.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                                <div className="space-y-3">
                                    {/* Template Selector */}
                                    <select
                                        value={selectedTemplate}
                                        onChange={(e) => handleTemplateSelect(e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                    >
                                        <option value="">Select a template...</option>
                                        {messageTemplates.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>

                                    {/* Message Textarea */}
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm resize-none focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                        rows={3}
                                    />

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="w-full px-4 py-2 bg-edluar-moss text-white rounded-lg font-medium text-sm hover:bg-edluar-moss/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ScorecardModal
                isOpen={showScorecardModal}
                onClose={() => setShowScorecardModal(false)}
                onSubmit={handleScorecardSubmit}
                candidateName={`${application.first_name} ${application.last_name}`}
            />

            <ScheduleInterviewModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onSubmit={handleScheduleSubmit}
                candidateName={`${application.first_name} ${application.last_name}`}
            />

            {/* History Modal Overlay */}
            {showHistoryModal && (
                <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-edluar-surface w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Application History</h3>
                            <button onClick={() => setShowHistoryModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {history.map((h) => (
                                        <tr key={h.id} className={h.id === application.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {h.job_title}
                                                {h.id === application.id && <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Current</span>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(h.applied_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                                                    {h.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
