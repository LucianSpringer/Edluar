import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Layout, CheckCircle2 } from 'lucide-react';
import { ContentBuilder, ContentBlock } from './ContentBuilder';
import { Button } from './Button';

interface JobEditorPageProps {
    onNavigate: (page: string) => void;
    jobId?: number;
}

export const JobEditorPage: React.FC<JobEditorPageProps> = ({ onNavigate, jobId }) => {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Full-time');
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: '1', type: 'header', value: 'About the Role' },
        { id: '2', type: 'paragraph', value: 'We are looking for a talented individual to join our team...' }
    ]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (jobId) {
            fetchJob(jobId);
        }
    }, [jobId]);

    const fetchJob = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
            if (response.ok) {
                const job = await response.json();
                setTitle(job.title);
                setDepartment(job.department || '');
                setLocation(job.location || '');
                setType(job.employment_type || 'Full-time');
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
                    content_blocks: blocks
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onNavigate('dashboard');
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
        <div className="min-h-screen bg-gray-50 dark:bg-edluar-deep transition-colors duration-300">
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
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layout className="w-5 h-5 text-edluar-moss" />
                            {jobId ? 'Edit Job Opening' : 'Create Job Opening'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
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
        </div>
    );
};
