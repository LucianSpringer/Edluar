import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface ScorecardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { skills: number; culture: number; takeaways: string }) => void;
    candidateName: string;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({ isOpen, onClose, onSubmit, candidateName }) => {
    const [scores, setScores] = useState({ skills: 0, culture: 0 });
    const [takeaways, setTakeaways] = useState('');

    if (!isOpen) return null;

    const handleStarClick = (category: 'skills' | 'culture', rating: number) => {
        setScores(prev => ({ ...prev, [category]: rating }));
    };

    const handleSubmit = () => {
        onSubmit({ ...scores, takeaways });
        // Reset form
        setScores({ skills: 0, culture: 0 });
        setTakeaways('');
    };

    const StarRating = ({ category, value }: { category: 'skills' | 'culture', value: number }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(category, star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                    <Star
                        className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-edluar-surface w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Interview Scorecard</h2>
                        <p className="text-sm text-gray-500">Evaluation for {candidateName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Section 1: Skills */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Technical Skills</label>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Rate competency</span>
                            <StarRating category="skills" value={scores.skills} />
                        </div>
                    </div>

                    {/* Section 2: Culture */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Culture Fit</label>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Rate values alignment</span>
                            <StarRating category="culture" value={scores.culture} />
                        </div>
                    </div>

                    {/* Section 3: Takeaways */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Takeaways</label>
                        <textarea
                            value={takeaways}
                            onChange={(e) => setTakeaways(e.target.value)}
                            className="w-full h-32 p-4 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 outline-none resize-none text-sm"
                            placeholder="What are the candidate's strengths and weaknesses? (Required)"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!scores.skills || !scores.culture || !takeaways.trim()}
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-edluar-moss hover:bg-edluar-moss/90 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Submit Scorecard
                    </button>
                </div>
            </div>
        </div>
    );
};
