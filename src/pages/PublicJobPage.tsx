import React, { useState, useEffect } from 'react';
import { Upload, User, Mail, Linkedin, FileText, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { JobBlockRenderer } from '../../components/JobBlockRenderer';
import { FormConfig } from '../../components/ApplyFormControls';

interface PublicJobPageProps {
    jobId: number;
}

export const PublicJobPage: React.FC<PublicJobPageProps> = ({ jobId }) => {
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>({});
    const [formConfig, setFormConfig] = useState<FormConfig>({
        personalInfo: {
            name: true,
            email: true,
            linkedin: true,
            education: false,
            resume: true,
            coverLetter: true
        },
        questions: []
    });

    // Theme State
    const [theme, setTheme] = useState({
        font: 'Inter',
        primaryColor: '#10B981',
        bg: '#ffffff',
        buttonShape: 'rounded-md'
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
                if (!res.ok) throw new Error('Job not found');
                const data = await res.json();

                // Parse content_blocks
                if (data.content_blocks && typeof data.content_blocks === 'string') {
                    try {
                        data.content_blocks = JSON.parse(data.content_blocks);
                    } catch (e) {
                        data.content_blocks = [];
                    }
                }

                // Parse application_form_config
                if (data.application_form_config && typeof data.application_form_config === 'string') {
                    try {
                        const parsedConfig = JSON.parse(data.application_form_config);
                        setFormConfig(parsedConfig);
                    } catch (e) {
                        console.error("Failed to parse form config", e);
                    }
                }

                // Parse theme_config
                if (data.theme_config && typeof data.theme_config === 'string') {
                    try {
                        const parsedTheme = JSON.parse(data.theme_config);
                        setTheme(parsedTheme);
                    } catch (e) {
                        console.error("Failed to parse theme config", e);
                    }
                } else if (data.theme_config && typeof data.theme_config === 'object') {
                    setTheme(data.theme_config);
                }

                setJob(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch job", err);
                setError("Job not found or unavailable.");
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Basic validation
            if (formConfig.personalInfo.name && !formData.firstName) throw new Error("Name is required");
            if (formConfig.personalInfo.email && !formData.email) throw new Error("Email is required");

            // Split name if needed
            let firstName = formData.firstName;
            let lastName = formData.lastName || '';

            if (formData.fullName) {
                const parts = formData.fullName.split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }

            const payload = {
                jobId,
                firstName,
                lastName,
                email: formData.email,
                phone: formData.phone,
                resumeUrl: formData.resumeUrl || 'https://example.com/resume.pdf', // Mock for now
                source: 'Career Page',
                tags: ['Applied Online'],
                // Add custom answers if needed by backend
            };

            const res = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to submit application');
            }

            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.error("Submission error", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md px-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h1>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" style={{ fontFamily: theme.font }}>
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-green-100 dark:border-green-900/30">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Received!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Thanks for applying to <strong>{job.title}</strong>. We've sent a confirmation email to <strong>{formData.email}</strong>.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                >
                    Submit another application
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20" style={{ fontFamily: theme.font, backgroundColor: theme.bg }}>
            {/* HERO / HEADER */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-gray-900 dark:text-white">Edluar</div>
                    <a href="#apply"
                        className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                        style={{ backgroundColor: theme.primaryColor, borderRadius: theme.buttonShape === 'rounded-full' ? '9999px' : theme.buttonShape === 'rounded-none' ? '0px' : '0.375rem' }}
                    >
                        Apply Now
                    </a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* JOB CONTENT */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-12">
                    <JobBlockRenderer blocks={job.content_blocks || []} theme={theme} />
                </div>

                {/* APPLICATION FORM */}
                <div id="apply" className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Apply for this position</h2>
                            <p className="text-gray-500 dark:text-gray-400">Please fill out the form below to submit your application.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personal Information</h3>

                                <div className="grid grid-cols-1 gap-5">
                                    {formConfig.personalInfo.name && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                                    placeholder="John Doe"
                                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {formConfig.personalInfo.email && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    required
                                                    type="email"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                                    placeholder="john@example.com"
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {formConfig.personalInfo.linkedin && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn Profile</label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                                    placeholder="linkedin.com/in/johndoe"
                                                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {formConfig.personalInfo.resume && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume / CV <span className="text-red-500">*</span></label>
                                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group">
                                                <FileText className="w-8 h-8 mb-3 text-gray-300 group-hover:text-green-500 transition-colors" />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload resume</span>
                                                <span className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</span>
                                                {/* Hidden input for now */}
                                                <input type="hidden" name="resumeUrl" value="https://example.com/resume.pdf" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Custom Questions */}
                            {formConfig.questions.length > 0 && (
                                <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Additional Questions</h3>
                                    <div className="space-y-5">
                                        {formConfig.questions.map((q) => (
                                            <div key={q.id} className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {q.label || "Untitled Question"}
                                                    {q.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>

                                                {q.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        required={q.required}
                                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                                        placeholder="Your answer..."
                                                    />
                                                )}

                                                {q.type === 'yes_no' && (
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                                            <input type="radio" name={`q-${q.id}`} className="text-green-600 focus:ring-green-500" /> Yes
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                                            <input type="radio" name={`q-${q.id}`} className="text-green-600 focus:ring-green-500" /> No
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                    style={{ backgroundColor: theme.primaryColor, borderRadius: theme.buttonShape === 'rounded-full' ? '9999px' : theme.buttonShape === 'rounded-none' ? '0px' : '0.375rem' }}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>Submit Application <CheckCircle2 className="w-5 h-5" /></>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    By submitting, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
