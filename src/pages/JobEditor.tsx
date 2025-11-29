import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Eye, Layout, FileText, Users, Palette, ChevronDown, Check, Settings, Calendar } from 'lucide-react';
import { SITE_TEMPLATES } from '../data/templates';
import { ContentBuilder } from '../../components/ContentBuilder';
import { ApplyFormControls, FormConfig } from '../../components/ApplyFormControls';
import { ApplyFormPreview } from '../../components/ApplyFormPreview';
import { JobCandidatesView } from '../../components/JobCandidatesView';
import { JobBlockRenderer } from '../../components/JobBlockRenderer';
import { Button } from '../../components/Button';

interface JobEditorProps {
    jobId: number;
    onBack: () => void;
    // Function to tell parent to switch jobs
    onSwitchJob: (newId: number) => void;
}

export const JobEditor: React.FC<JobEditorProps> = ({ jobId, onBack, onSwitchJob }) => {
    const [activeTab, setActiveTab] = useState<'post' | 'form' | 'candidates' | 'design'>('post');
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [closeDate, setCloseDate] = useState(''); // YYYY-MM-DD
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- JOB SWITCHER STATE ---
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [isJobSwitcherOpen, setIsJobSwitcherOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    // Close switcher when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsJobSwitcherOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch ALL jobs for the switcher
    useEffect(() => {
        fetch('http://localhost:5000/api/jobs')
            .then(res => res.json())
            .then(data => setAllJobs(data))
            .catch(err => console.error("Failed to fetch job list", err));
    }, []);
    // -------------------------------

    // State for Form Config
    const [formConfig, setFormConfig] = useState<FormConfig>({
        personalInfo: { name: true, email: true, linkedin: true, education: false, resume: true, coverLetter: true, phone: true, portfolio: true },
        questions: []
    });

    // Theme State
    const [theme, setTheme] = useState({
        font: 'Inter', primaryColor: '#10B981', bg: '#ffffff', buttonShape: 'rounded-md'
    });

    const applyTemplate = (templateId: string) => {
        const selected = SITE_TEMPLATES.find(t => t.id === templateId);
        if (selected) {
            setTheme({
                font: selected.config.font,
                primaryColor: selected.config.primaryColor,
                bg: selected.config.bg,
                buttonShape: selected.config.buttonShape
            });
            if (selected.config.blocks) {
                // @ts-ignore
                setJob(prev => ({ ...prev, content_blocks: selected.config.blocks }));
            }
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true); // Reset loading state on ID change
            try {
                const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
                const data = await res.json();

                // Parsing logic (Safety Checks)
                const parseJSON = (str: any, fallback: any) => {
                    try { return typeof str === 'string' ? JSON.parse(str) : str || fallback; }
                    catch { return fallback; }
                };

                data.content_blocks = parseJSON(data.content_blocks, []);
                setFormConfig(parseJSON(data.application_form_config, formConfig));
                setTheme(parseJSON(data.theme_config, theme));
                setCloseDate(data.close_date ? data.close_date.split('T')[0] : '');

                setJob(data);
            } catch (err) {
                console.error("Failed to fetch job", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]); // Re-run when jobId changes

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content_blocks: JSON.stringify(job.content_blocks),
                    application_form_config: JSON.stringify(formConfig),
                    theme_config: JSON.stringify(theme),
                    close_date: closeDate || null
                })
            });
            if (res.ok) alert('Job saved successfully!');
        } catch (err) {
            console.error("Failed to save job", err);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* HEADER */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-800 relative z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* --- JOB SWITCHER DROPDOWN --- */}
                    <div className="relative" ref={switcherRef}>
                        <div
                            onClick={() => setIsJobSwitcherOpen(!isJobSwitcherOpen)}
                            className="cursor-pointer flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 py-1 px-2 rounded-lg transition-colors"
                        >
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {job.title}
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isJobSwitcherOpen ? 'rotate-180' : ''}`} />
                                </h1>
                                <span className="text-xs text-gray-500">{job.department} • {job.location}</span>
                            </div>
                        </div>

                        {isJobSwitcherOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <div className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Switch Job</div>
                                    {allJobs.map((j) => (
                                        <button
                                            key={j.id}
                                            onClick={() => {
                                                onSwitchJob(j.id);
                                                setIsJobSwitcherOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group ${j.id === job.id ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                                        >
                                            <span className="truncate font-medium">{j.title}</span>
                                            {j.id === job.id && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-black/20">
                                    <button onClick={onBack} className="w-full py-2 text-xs font-bold text-center text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ----------------------------- */}
                </div>

                {/* MODE SWITCHER (TABS) */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {[
                        { id: 'post', icon: Layout, label: 'Job Post' },
                        { id: 'design', icon: Palette, label: 'Design' },
                        { id: 'form', icon: FileText, label: 'Apply Form' },
                        { id: 'candidates', icon: Users, label: 'Candidates' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 lg:px-4 py-1.5 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <tab.icon className="w-4 h-4" /> <span className="hidden lg:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

            {/* ... REST OF YOUR RENDER LOGIC (Sidebar/Content) ... */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'candidates' ? (
                    <JobCandidatesView jobId={jobId} />
                ) : (
                    <div className="h-full flex">
                        {/* LEFT SIDEBAR */}
                        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full overflow-y-auto custom-scrollbar">
                            {activeTab === 'post' && (
                                <ContentBuilder
                                    blocks={job.content_blocks || []}
                                    onChange={(newBlocks) => setJob({ ...job, content_blocks: newBlocks })}
                                />
                            )}
                            {activeTab === 'design' && (
                                <div className="p-6 space-y-6 animate-fade-in">
                                    {/* ... (Your Existing Design Tab Code) ... */}
                                    {/* Template Picker, Typography, Brand Color, etc. */}
                                    <div className="space-y-4 mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Choose a Template</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {SITE_TEMPLATES.map(template => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => applyTemplate(template.id)}
                                                    className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-green-500 transition-all text-left"
                                                >
                                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold text-center px-2">{template.name}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ... rest of design controls from your previous code ... */}
                                    {/* 1. TYPOGRAPHY */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Typography</label>
                                        <select
                                            value={theme.font}
                                            onChange={(e) => setTheme({ ...theme, font: e.target.value })}
                                            className="w-full p-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-green-500 dark:text-white"
                                        >
                                            <option value="Inter">Inter (Clean)</option>
                                            <option value="Merriweather">Merriweather (Serif)</option>
                                            <option value="Oswald">Oswald (Bold)</option>
                                        </select>
                                    </div>

                                    {/* 2. BRAND COLOR */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Brand Color</label>
                                        <div className="flex gap-2">
                                            {['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'].map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setTheme({ ...theme, primaryColor: color })}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all ${theme.primaryColor === color ? 'border-white ring-2 ring-gray-400 scale-110' : 'border-transparent hover:scale-105'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'form' && (
                                <ApplyFormControls config={formConfig} onChange={setFormConfig} />
                            )}
                        </div>

                        {/* RIGHT PREVIEW */}
                        <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-y-auto">
                            {activeTab === 'form' ? (
                                <div className="p-10 w-full flex justify-center">
                                    <ApplyFormPreview config={formConfig} />
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl min-h-[800px] bg-white dark:bg-black shadow-xl my-10 rounded-xl overflow-hidden" style={{ backgroundColor: theme.bg }}>
                                    <div style={{ fontFamily: theme.font }} className="min-h-full">
                                        <JobBlockRenderer blocks={job.content_blocks || []} theme={theme} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5" /> Job Settings
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">✕</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-500" /> Auto-Close Date
                                </label>
                                <p className="text-xs text-gray-500 mb-3">Automatically close this job and stop accepting applications after this date.</p>
                                <input
                                    type="date"
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-green-500/50 outline-none transition-all dark:text-white"
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
