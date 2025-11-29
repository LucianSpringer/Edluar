import React from 'react';
import { Upload, CheckSquare, Type, List, User, Mail, Linkedin, FileText, GraduationCap } from 'lucide-react';
import { FormConfig } from './ApplyFormControls';

export const ApplyFormPreview = ({ config }: { config: FormConfig }) => {
    return (
        <div className="w-full max-w-lg bg-white dark:bg-edluar-surface rounded-xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Apply for this position</h2>
                <p className="text-sm text-gray-500">Please fill out the form below to submit your application.</p>
            </div>

            <div className="p-6 space-y-6">

                {/* Personal Info Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personal Information</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {(config.personalInfo.name || (config.personalInfo as any).fullName) && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="John Doe" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.email && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="john@example.com" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.phone && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">📞</div>
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.linkedin && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn Profile</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="linkedin.com/in/johndoe" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.portfolio && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio URL</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">🌐</div>
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="https://myportfolio.com" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.education && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Education</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="University, Degree, Year" />
                                </div>
                            </div>
                        )}

                        {config.personalInfo.resume && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume / CV <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-white/5">
                                    <FileText className="w-6 h-6 mb-2" />
                                    <span className="text-xs">Upload Resume (PDF, DOCX)</span>
                                </div>
                            </div>
                        )}

                        {config.personalInfo.coverLetter && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter</label>
                                <textarea disabled className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm h-24 resize-none" placeholder="Tell us why you're a great fit..." />
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Questions Section */}
                {config.questions.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Additional Questions</h3>

                        <div className="space-y-4">
                            {config.questions.map((q) => (
                                <div key={q.id} className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {q.label || "Untitled Question"}
                                        {q.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>

                                    {q.type === 'text' && (
                                        <input disabled className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm" placeholder="Your answer..." />
                                    )}

                                    {q.type === 'yes_no' && (
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <input type="radio" disabled name={`q-${q.id}`} /> Yes
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <input type="radio" disabled name={`q-${q.id}`} /> No
                                            </label>
                                        </div>
                                    )}

                                    {q.type === 'file' && (
                                        <div className="border border-gray-200 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 bg-gray-50/50 dark:bg-white/5 text-gray-400">
                                            <Upload className="w-4 h-4" />
                                            <span className="text-xs">Choose file...</span>
                                        </div>
                                    )}

                                    {q.type === 'multiple_choice' && (
                                        <select disabled className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-500">
                                            <option>Select an option</option>
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button disabled className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg shadow-sm opacity-50 cursor-not-allowed">
                        Submit Application
                    </button>
                </div>

            </div>
        </div>
    );
};
