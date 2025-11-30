import React, { useState } from 'react';
import { Star, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { generateInterviewQuestions } from '../services/geminiService';

interface ScorecardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { skills: number; culture: number; ratings: Record<string, number>; takeaways: string }) => void;
    candidateName: string;
    criteria?: string[];
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
    isOpen, onClose, onSubmit, candidateName,
    criteria = ['Technical Skills', 'Culture Fit'] // Default fallback
}) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [takeaways, setTakeaways] = useState('');
    const [aiQuestions, setAiQuestions] = useState<string[]>([]);
    const [isGeneratingQs, setIsGeneratingQs] = useState(false);

    const handleGenerateQuestions = async () => {
        setIsGeneratingQs(true);
        // In a real app, fetch resume text and job desc from props/API
        const questions = await generateInterviewQuestions(
            "Senior Frontend Developer with React and Node experience", // Mock Job Desc
            "Junior developer with 1 year of HTML/CSS experience" // Mock Candidate
        );
        setAiQuestions(questions);
        setIsGeneratingQs(false);
    };

    if (!isOpen) return null;

    const handleStarClick = (criterion: string, rating: number) => {
        setRatings(prev => ({ ...prev, [criterion]: rating }));
    };

    const handleSubmit = () => {
        // Calculate legacy scores for backward compatibility if needed, or just pass 0
        // For now, let's try to map "Technical Skills" and "Culture Fit" if they exist, otherwise 0
        const skills = ratings['Technical Skills'] || 0;
        const culture = ratings['Culture Fit'] || 0;

        onSubmit({ skills, culture, ratings, takeaways });
        // Reset form
        setRatings({});
        setTakeaways('');
    };

    const StarRating = ({ criterion, value }: { criterion: string, value: number }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(criterion, star)}
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
                    {/* Dynamic Criteria Sections */}
                    {criteria.map((criterion) => (
                        <div key={criterion} className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{criterion}</label>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Rate competency</span>
                                <StarRating criterion={criterion} value={ratings[criterion] || 0} />
                            </div>
                        </div>
                    ))}

                    {/* Section 3: Takeaways */}
                    <div className="space-y-3 border-t border-gray-100 dark:border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Questions</label>
                            <button
                                onClick={handleGenerateQuestions}
                                className="text-xs flex items-center gap-1 text-edluar-moss hover:underline"
                                disabled={isGeneratingQs}
                            >
                                {isGeneratingQs ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                Generate with AI
                            </button>
                        </div>

                        {aiQuestions.length > 0 && (
                            <div className="bg-edluar-cream/50 dark:bg-white/5 p-3 rounded-lg space-y-2">
                                {aiQuestions.map((q, i) => (
                                    <div key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2 items-start group cursor-pointer" onClick={() => setTakeaways(prev => prev + "\n- " + q)}>
                                        <span className="text-edluar-moss font-bold">{i + 1}.</span>
                                        <span>{q}</span>
                                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 ml-auto">Click to add</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
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
                            disabled={criteria.some(c => !ratings[c]) || !takeaways.trim()}
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-edluar-moss hover:bg-edluar-moss/90 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Submit Scorecard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
