import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Layout, CheckCircle2, Globe, Smartphone, Monitor, Palette, Layers, Eye } from 'lucide-react';
import { ContentBuilder, ContentBlock } from './ContentBuilder';
import { JobBlockRenderer } from './JobBlockRenderer';
import { Button } from './Button';
import { SITE_TEMPLATES } from '../src/data/templates';

interface CompanyPageEditorProps {
    onNavigate: (page: string) => void;
}

export const CompanyPageEditor: React.FC<CompanyPageEditorProps> = ({ onNavigate }) => {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [pageTitle, setPageTitle] = useState('Careers Page');

    // New State for Redesign
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [theme, setTheme] = useState({
        font: 'Inter',
        primaryColor: '#10B981', // Edluar Moss
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
                setBlocks(selected.config.blocks);
            }
        }
    };

    useEffect(() => {
        // Fetch existing page content
        fetch('http://localhost:5000/api/pages/careers')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Page not found');
            })
            .then(data => {
                setPageTitle(data.title);
                if (data.content_blocks) {
                    try {
                        setBlocks(JSON.parse(data.content_blocks));
                    } catch (e) {
                        console.error("Failed to parse blocks", e);
                    }
                }
            })
            .catch(err => {
                console.log("No existing page found, starting fresh", err);
                // Initialize with some default blocks if fresh
                setBlocks([
                    {
                        id: 'hero-1',
                        type: 'hero',
                        value: 'Join Our Mission',
                        subtitle: 'We are building the future of work.',
                        ctaText: 'View Open Roles',
                        ctaLink: '#jobs'
                    }
                ]);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: 'careers', // Hardcoded for now as we're building the main careers page
                    title: pageTitle,
                    content_blocks: blocks,
                    theme_config: theme // Save theme config
                })
            });

            if (!response.ok) throw new Error('Failed to save');

            setLastSaved(new Date());
            setTimeout(() => setLastSaved(null), 3000);
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Failed to save page changes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans text-gray-900">

            {/* 1. TOP BAR (Navigation & Device Toggles) */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="font-bold text-gray-700 dark:text-gray-200">Career Site Builder</span>
                </div>

                {/* Device Toggles */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow dark:bg-gray-600 text-black dark:text-white' : 'text-gray-400'}`}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow dark:bg-gray-600 text-black dark:text-white' : 'text-gray-400'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {lastSaved && (
                        <span className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Saved
                        </span>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={() => window.open('http://localhost:5173/careers', '_blank')}>
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="min-w-[100px] shadow-lg"
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Publish
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* 2. MAIN CANVAS (The Live Preview) */}
            <div className="flex-1 pt-16 flex items-center justify-center bg-gray-200/50 dark:bg-black/50 overflow-hidden">
                <div
                    className={`
                        transition-all duration-500 ease-in-out shadow-2xl overflow-y-auto
                        ${viewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800'}
                    `}
                    style={{ backgroundColor: theme.bg }}
                >
                    {/* Pass theme config to renderer so fonts/colors update live */}
                    <div style={{ fontFamily: theme.font }} className="min-h-full">
                        <JobBlockRenderer blocks={blocks} theme={theme} />
                    </div>
                </div>
            </div>

            {/* 3. SIDEBAR (The Editor) */}
            <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 pt-16 flex flex-col z-40 shadow-xl">

                {/* Sidebar Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'content' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        <Layers className="w-4 h-4" /> Blocks
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'design' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        <Palette className="w-4 h-4" /> Design
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeTab === 'content' ? (
                        <div className="space-y-6">
                            <div className="pb-4 border-b border-gray-100 dark:border-white/5">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Page Title</label>
                                <input
                                    type="text"
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    className="w-full text-lg font-bold border-none p-0 focus:ring-0 bg-transparent placeholder-gray-300 dark:text-white"
                                    placeholder="Page Title"
                                />
                            </div>
                            <ContentBuilder
                                blocks={blocks}
                                onChange={setBlocks}
                                allowedTypes={['hero', 'hero_collage', 'features', 'bento_grid', 'steps', 'gallery', 'job_list', 'header', 'paragraph', 'image']}
                            />
                        </div>
                    ) : (
                        // NEW DESIGN TAB
                        <div className="space-y-6 animate-fade-in">

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
                                            {/* Thumbnail Image */}
                                            <img
                                                src={template.thumbnail}
                                                alt={template.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Hover Overlay Name */}
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
                                        onClick={() => setTheme({ ...theme, bg: '#F3F4F6' })} // Gray-100
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
                </div>
            </div>
        </div>
    );
};
