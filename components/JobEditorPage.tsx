import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Layout, CheckCircle2, ChevronDown, Settings, Calendar } from 'lucide-react';
import { ContentBuilder, ContentBlock } from './ContentBuilder';
import { Button } from './Button';

interface JobEditorPageProps {
    onNavigate: (page: string, params?: any) => void;
    jobId?: number;
}

export const JobEditorPage: React.FC<JobEditorPageProps> = ({ onNavigate, jobId }) => {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Full-time');
    const [closeDate, setCloseDate] = useState(''); // YYYY-MM-DD
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: '1', type: 'header', value: 'About the Role' },
        { id: '2', type: 'paragraph', value: 'We are looking for a talented individual to join our team...' }
    ]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Job Switcher State
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [isJobSwitcherOpen, setIsJobSwitcherOpen] = useState(false);

    // Settings Modal State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (jobId) {
            fetchJob(jobId);
        }
        fetchAllJobs();
    }, [jobId]);

    const fetchAllJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs');
            if (response.ok) {
                const data = await response.json();
                setAllJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch all jobs", error);
        }
    };

    const fetchJob = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
            if (response.ok) {
                const job = await response.json();
                setTitle(job.title);
                setDepartment(job.department || '');
                setLocation(job.location || '');
                setType(job.employment_type || 'Full-time');
                setCloseDate(job.close_date ? job.close_date.split('T')[0] : '');
                if (job.content_blocks) {
                    try {
                        setBlocks(JSON.parse(job.content_blocks));
                    } catch (e) {
                        console.error("Failed to parse blocks", e);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch job", error);
        }
    };

    const handleSave = async () => {
        if (!title) return;
        setSaving(true);

        try {
            const url = jobId ? `http://localhost:5000/api/jobs/${jobId}` : 'http://localhost:5000/api/jobs';
            const method = jobId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    department,
                    location,
                    type,
                    content_blocks: blocks,
                    close_date: closeDate || null
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    // Stay on page if editing, navigate if creating
                    if (!jobId) onNavigate('dashboard');
                    setSuccess(false);
                }, 1500);
            } else {
                console.error('Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-edluar-deep transition-colors duration-300" onClick={() => setIsJobSwitcherOpen(false)}>
            {/* Header */}
            <header className="bg-white dark:bg-edluar-surface border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>

                        {jobId ? (
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setIsJobSwitcherOpen(!isJobSwitcherOpen)}
                                    className="flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                        <Layout className="w-5 h-5 text-edluar-moss" />
                                        <span>{title || 'Untitled Job'}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform ${isJobSwitcherOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Job Switcher Dropdown */}
                                {isJobSwitcherOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-edluar-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                        <div className="p-2 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Switch Job</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                                            {allJobs.map(job => (
                                                <button
                                                    key={job.id}
                                                    onClick={() => {
                                                        onNavigate('job-editor', { jobId: job.id });
                                                        setIsJobSwitcherOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group ${job.id === jobId ? 'bg-edluar-moss/10 text-edluar-moss' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                >
                                                    <span className="truncate font-medium">{job.title}</span>
                                                    {job.id === jobId && <CheckCircle2 className="w-3 h-3" />}
                                                </button>
                                            ))}
                                            <div className="border-t border-gray-100 dark:border-white/5 mt-1 pt-1">
                                                <button
                                                    onClick={() => {
                                                        onNavigate('job-editor'); // Create new
                                                        setIsJobSwitcherOpen(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-edluar-moss hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                                >
                                                    <Layout className="w-3 h-3" />
                                                    Create New Job
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Layout className="w-5 h-5 text-edluar-moss" />
                                Create Job Opening
                            </h1>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                        {success && (
                            <span className="text-edluar-moss text-sm font-medium flex items-center gap-1 animate-fade-in">
                                <CheckCircle2 className="w-4 h-4" /> Saved!
                            </span>
                        )}
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={saving || !title}
                            className="flex items-center gap-2"
                        >
                            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> {jobId ? 'Update Job' : 'Publish Job'}</>}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Job Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-edluar-surface p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Job Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Senior Product Designer"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Product">Product</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="People">People</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Remote (EU)"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content Builder */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-edluar-surface p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm min-h-[600px]">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Description</h2>
                                <p className="text-sm text-gray-500">Build a rich job post using content blocks.</p>
                            </div>

                            <ContentBuilder
                                blocks={blocks}
                                onChange={setBlocks}
                                allowedTypes={['header', 'paragraph', 'image', 'list']}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-edluar-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5" /> Job Settings
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">✕</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-edluar-moss" /> Auto-Close Date
                                </label>
                                <p className="text-xs text-gray-500 mb-3">Automatically close this job and stop accepting applications after this date.</p>
                                <input
                                    type="date"
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Tip:</strong> Setting an auto-close date helps manage candidate expectations and keeps your pipeline fresh.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-end">
                            <Button variant="primary" onClick={() => setIsSettingsOpen(false)}>Done</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
