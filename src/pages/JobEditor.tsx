import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Layout, FileText, Users, Palette, Layers, ExternalLink } from 'lucide-react';
import { SITE_TEMPLATES } from '../data/templates';
import { ContentBuilder, ContentBlock } from '../../components/ContentBuilder';
import { ApplyFormControls, FormConfig } from '../../components/ApplyFormControls';
import { ApplyFormPreview } from '../../components/ApplyFormPreview';
import { JobCandidatesView } from '../../components/JobCandidatesView';
import { JobBlockRenderer } from '../../components/JobBlockRenderer';

interface JobEditorProps {
    jobId: number;
    onBack: () => void;
    onNavigate: (page: string, params?: any) => void;
    initialTab?: 'post' | 'form' | 'candidates' | 'design';
}

export const JobEditor: React.FC<JobEditorProps> = ({ jobId, onBack, onNavigate, initialTab = 'post' }) => {
    const [activeTab, setActiveTab] = useState<'post' | 'form' | 'candidates' | 'design'>(initialTab);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // State for Form Config (Lifted from ApplyFormBuilder)
    const [formConfig, setFormConfig] = useState<FormConfig>({
        personalInfo: {
            name: true,
            email: true,
            phone: true,
            linkedin: true,
            portfolio: true,
            education: false,
            resume: true,
            coverLetter: true
        },
        questions: []
    });

    // Theme State (Migrated from CompanyPageEditor)
    const [theme, setTheme] = useState({
        font: 'Inter',
        primaryColor: '#10B981',
        bg: '#ffffff',
        buttonShape: 'rounded-md'
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
            // Optional: Replace blocks if you want the template content
            if (selected.config.blocks) {
                // @ts-ignore
                setJob(prev => ({ ...prev, content_blocks: selected.config.blocks }));
            }
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
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
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content_blocks: JSON.stringify(job.content_blocks),
                    application_form_config: JSON.stringify(formConfig),
                    theme_config: JSON.stringify(theme)
                })
            });

            if (res.ok) {
                alert('Job saved successfully!');
            }
        } catch (err) {
            console.error("Failed to save job", err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading job...</div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* HEADER */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white">{job.title}</h1>
                        <span className="text-xs text-gray-500">{job.department} • {job.location}</span>
                    </div>
                </div>

                {/* MODE SWITCHER (TABS) */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('post')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'post' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <Layout className="w-4 h-4" /> Job Post
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'design' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <Palette className="w-4 h-4" /> Design
                    </button>
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'form' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <FileText className="w-4 h-4" /> Apply Form
                    </button>
                    <button
                        onClick={() => setActiveTab('candidates')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'candidates' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <Users className="w-4 h-4" /> Candidates
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.open(`${window.location.origin}?mode=public&jobId=${jobId}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-2"
                        title="Simulate Candidate View (New Tab)"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span className="text-xs font-medium hidden sm:inline">Simulate View</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-hidden">

                {/* CANDIDATES VIEW (Full Screen) */}
                {activeTab === 'candidates' ? (
                    <JobCandidatesView jobId={jobId} />
                ) : (
                    /* EDITOR LAYOUT (Split View) */
                    <div className="h-full flex">
                        {/* LEFT SIDEBAR: DYNAMIC CONTENT */}
                        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full overflow-y-auto custom-scrollbar">

                            {/* 1. BLOCKS EDITOR */}
                            {activeTab === 'post' && (
                                <ContentBuilder
                                    blocks={job.content_blocks || []}
                                    onChange={(newBlocks) => setJob({ ...job, content_blocks: newBlocks })}
                                />
                            )}

                            {/* 2. DESIGN CONTROLS */}
                            {activeTab === 'design' && (
                                <div className="p-6 space-y-6 animate-fade-in">
                                    {/* 0. TEMPLATE PICKER */}
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

                                    {/* 3. PAGE BACKGROUND */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Page Background</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setTheme({ ...theme, bg: '#ffffff' })}
                                                className={`p-2 text-xs border rounded transition-all ${theme.bg === '#ffffff' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            >
                                                White (Clean)
                                            </button>
                                            <button
                                                onClick={() => setTheme({ ...theme, bg: '#F3F4F6' })}
                                                className={`p-2 text-xs border rounded transition-all ${theme.bg === '#F3F4F6' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            >
                                                Light Gray (Soft)
                                            </button>
                                        </div>
                                    </div>

                                    {/* 4. BUTTON STYLE */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Button Shape</label>
                                        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                                            {['rounded-md', 'rounded-full', 'rounded-none'].map(shape => (
                                                <button
                                                    key={shape}
                                                    onClick={() => setTheme({ ...theme, buttonShape: shape })}
                                                    className={`flex-1 py-1.5 text-xs capitalize rounded transition-all ${theme.buttonShape === shape ? 'bg-white dark:bg-gray-600 shadow text-black dark:text-white font-medium' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                                >
                                                    {shape.replace('rounded-', '')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. FORM CONTROLS */}
                            {activeTab === 'form' && (
                                <ApplyFormControls
                                    config={formConfig}
                                    onChange={setFormConfig}
                                />
                            )}
                        </div>

                        {/* RIGHT CANVAS: SHARED PREVIEW AREA */}
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
        </div>
    );
};
