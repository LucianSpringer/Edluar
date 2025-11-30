import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, Trash2, ChevronDown, ChevronUp,
    Type, Image as ImageIcon, Layout, Grid, List, Plus,
    AlignLeft, CheckSquare, Layers, Monitor, Briefcase,
    Sparkles, Loader2
} from 'lucide-react';
import { refineContent } from '../services/geminiService';

export type BlockType = 'header' | 'paragraph' | 'image' | 'list' | 'hero' | 'features' | 'steps' | 'gallery' | 'job_list' | 'bento_grid' | 'hero_collage';

export interface BentoItem {
    title: string;
    subtitle?: string;
    type: 'social' | 'image' | 'link' | 'stat';
    content: string;
    color: string;
    colSpan?: number;
    textColor?: string;
}

export interface ContentBlock {
    id: string;
    type: BlockType;
    value?: string;
    src?: string;
    items?: string[];
    level?: number;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    features?: { title: string; description: string; textColor?: string }[];
    steps?: { title: string; description: string; textColor?: string }[];
    images?: string[];
    bentoItems?: BentoItem[];
    bgColor?: string;
    textColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    variant?: 'default' | 'display';
    font?: string;
}

const MiniFontPicker = ({ value, onChange }: { value?: string, onChange: (font: string) => void }) => (
    <div className="flex items-center gap-2 mt-2 mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase w-12">Font</span>
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 p-1.5 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded focus:border-green-500 outline-none dark:text-white"
        >
            <option value="">Default (Theme)</option>
            <option value="Inter">Inter (Clean)</option>
            <option value="Merriweather">Merriweather (Serif)</option>
            <option value="Oswald">Oswald (Bold)</option>
            <option value="Courier New">Mono (Code)</option>
        </select>
    </div>
);

const MiniColorPicker = ({ label, value, onChange }: { label: string, value?: string, onChange: (c: string) => void }) => (
    <div className="flex items-center gap-2 mt-2 mb-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase w-12">{label}</span>
        <div className="flex gap-1 flex-1 flex-wrap">
            {/* Default / Reset */}
            <button
                onClick={() => onChange('')}
                className={`w-5 h-5 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center ${!value ? 'ring-2 ring-gray-400' : ''}`}
                title="Default Color"
            >
                <span className="w-4 h-0.5 bg-red-400 rotate-45"></span>
            </button>

            {/* Color Palette */}
            {['#111827', '#4B5563', '#9CA3AF', '#ffffff', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'].map(color => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={`w-5 h-5 rounded-full border border-gray-200 dark:border-white/10 ${value === color ? 'ring-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    </div>
);

const BuilderInput = ({ label, value, onChange, placeholder, type = "text" }: any) => {
    const [isRefining, setIsRefining] = useState(false);

    const handleRefine = async () => {
        if (!value) return;
        setIsRefining(true);
        const polished = await refineContent(value);
        onChange(polished);
        setIsRefining(false);
    };

    return (
        <div className="space-y-1.5 mb-3 relative">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                {value && (
                    <button
                        onClick={handleRefine}
                        disabled={isRefining}
                        className="text-[10px] text-edluar-moss hover:text-green-600 flex items-center gap-1 disabled:opacity-50"
                    >
                        {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {isRefining ? 'Polishing...' : 'AI Refine'}
                    </button>
                )}
            </div>
            {type === 'textarea' ? (
                <textarea
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none h-24 dark:text-white"
                />
            ) : (
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all dark:text-white"
                />
            )}
        </div>
    );
};

const BlockEditorCard = ({ id, type, children, onDelete, isOpen, onToggle, onUpdate, bgColor, textColor }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="group mb-3 bg-white dark:bg-edluar-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden hover:border-green-400 transition-colors">
            <div
                className={`flex items-center justify-between p-3 cursor-pointer ${isOpen ? 'bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/5' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <button {...listeners} {...attributes} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing p-1">
                        <GripVertical className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 dark:text-gray-400">
                            {type === 'header' && <Type className="w-3 h-3" />}
                            {type === 'paragraph' && <AlignLeft className="w-3 h-3" />}
                            {type === 'hero' && <Layout className="w-3 h-3" />}
                            {type === 'bento_grid' && <Grid className="w-3 h-3" />}
                            {type === 'hero_collage' && <Monitor className="w-3 h-3" />}
                            {type === 'features' && <CheckSquare className="w-3 h-3" />}
                            {type === 'steps' && <Layers className="w-3 h-3" />}
                            {type === 'gallery' && <ImageIcon className="w-3 h-3" />}
                            {type === 'job_list' && <Briefcase className="w-3 h-3" />}
                            {type === 'image' && <ImageIcon className="w-3 h-3" />}
                            {type === 'list' && <List className="w-3 h-3" />}
                        </span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">{type.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1 text-gray-400">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 bg-white dark:bg-edluar-surface animate-slide-down">
                    {/* Color Picker */}
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <MiniColorPicker label="BG" value={bgColor} onChange={(c) => onUpdate({ bgColor: c })} />
                        </div>
                        <div className="flex-1">
                            <MiniColorPicker label="Text" value={textColor} onChange={(c) => onUpdate({ textColor: c })} />
                        </div>
                    </div>
                    {children}
                </div>
            )}
        </div>
    );
};



interface ContentBuilderProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
    allowedTypes?: BlockType[];
}

export const ContentBuilder: React.FC<ContentBuilderProps> = ({ blocks, onChange, allowedTypes }) => {
    const [openBlockId, setOpenBlockId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const toggleBlock = (id: string) => setOpenBlockId(openBlockId === id ? null : id);
    const updateBlock = (id: string, data: Partial<ContentBlock>) => onChange(blocks.map(b => b.id === id ? { ...b, ...data } : b));
    const deleteBlock = (id: string) => onChange(blocks.filter(b => b.id !== id));
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            onChange(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    const tools = [
        { type: 'header', icon: Type, label: 'Header' },
        { type: 'paragraph', icon: AlignLeft, label: 'Text' },
        { type: 'hero', icon: Layout, label: 'Hero' },
        { type: 'bento_grid', icon: Grid, label: 'Bento' },
        { type: 'hero_collage', icon: Monitor, label: 'Collage' },
        { type: 'features', icon: CheckSquare, label: 'Features' },
        { type: 'steps', icon: Layers, label: 'Steps' },
        { type: 'gallery', icon: ImageIcon, label: 'Gallery' },
        { type: 'image', icon: ImageIcon, label: 'Image' },
        { type: 'job_list', icon: Briefcase, label: 'Jobs' },
    ].filter(t => !allowedTypes || allowedTypes.includes(t.type as BlockType));

    const addBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            value: '',
            items: [],
            src: '',
            features: type === 'features' ? [{ title: '', description: '' }] : undefined,
            steps: type === 'steps' ? [{ title: '', description: '' }] : undefined,
            images: type === 'gallery' || type === 'hero_collage' ? (type === 'hero_collage' ? ['', '', '', ''] : []) : undefined,
            bentoItems: type === 'bento_grid' ? [
                { title: 'Team', subtitle: 'Meet the crew', type: 'image', content: '', color: 'bg-blue-500' },
                { title: 'Rating', subtitle: 'Glassdoor', type: 'stat', content: '4.9', color: 'bg-edluar-moss' },
                { title: 'Instagram', subtitle: 'Follow us', type: 'social', content: '@edluar', color: 'bg-pink-500' },
                { title: 'Blog', subtitle: 'Latest updates', type: 'link', content: '#', color: 'bg-gray-900' }
            ] : undefined
        };
        onChange([...blocks, newBlock]);
        setOpenBlockId(newBlock.id);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Add Content</h3>
                <div className="grid grid-cols-3 gap-2">
                    {tools.map((t) => (
                        <button
                            key={t.type}
                            onClick={() => addBlock(t.type as BlockType)}
                            className="flex flex-col items-center justify-center p-2 bg-white dark:bg-edluar-surface border border-gray-200 dark:border-white/10 rounded-lg hover:border-green-500 hover:shadow-sm transition-all group"
                        >
                            <t.icon className="w-4 h-4 mb-1.5 text-gray-500 dark:text-gray-400 group-hover:text-green-600" />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30 dark:bg-black/20">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Page Structure</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {blocks.map((block) => (
                            <BlockEditorCard
                                key={block.id}
                                id={block.id}
                                type={block.type}
                                onDelete={() => deleteBlock(block.id)}
                                isOpen={openBlockId === block.id}
                                onToggle={() => toggleBlock(block.id)}
                                onUpdate={(data: any) => updateBlock(block.id, data)}
                                bgColor={block.bgColor}
                                textColor={block.textColor}
                            >
                                {block.type === 'header' && (
                                    <>

                                        <BuilderInput label="Heading Text" value={block.value} onChange={(v: string) => updateBlock(block.id, { value: v })} />
                                        <MiniFontPicker value={block.font} onChange={(f) => updateBlock(block.id, { font: f })} />
                                        <div className="space-y-1.5 mb-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Style Variant</label>
                                            <select
                                                value={block.variant || 'default'}
                                                onChange={(e) => updateBlock(block.id, { variant: e.target.value as any })}
                                                className="w-full p-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all dark:text-white"
                                            >
                                                <option value="default">Default</option>
                                                <option value="display">Display (Huge)</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {block.type === 'paragraph' && (
                                    <>
                                        <BuilderInput label="Content" value={block.value} onChange={(v: string) => updateBlock(block.id, { value: v })} type="textarea" />
                                        <MiniFontPicker value={block.font} onChange={(f) => updateBlock(block.id, { font: f })} />
                                    </>
                                )}
                                {block.type === 'hero' && (
                                    <>
                                        <BuilderInput label="Headline" value={block.value} onChange={(v: string) => updateBlock(block.id, { value: v })} />
                                        <MiniFontPicker value={block.font} onChange={(f) => updateBlock(block.id, { font: f })} />
                                        <MiniColorPicker label="Color" value={block.titleColor} onChange={(c) => updateBlock(block.id, { titleColor: c })} />

                                        <BuilderInput label="Subtitle" value={block.subtitle} onChange={(v: string) => updateBlock(block.id, { subtitle: v })} type="textarea" />
                                        <MiniColorPicker label="Color" value={block.subtitleColor} onChange={(c) => updateBlock(block.id, { subtitleColor: c })} />

                                        <div className="grid grid-cols-2 gap-2">
                                            <BuilderInput label="CTA Text" value={block.ctaText} onChange={(v: string) => updateBlock(block.id, { ctaText: v })} />
                                            <BuilderInput label="CTA Link" value={block.ctaLink} onChange={(v: string) => updateBlock(block.id, { ctaLink: v })} />
                                        </div>
                                    </>
                                )}
                                {block.type === 'hero_collage' && (
                                    <>
                                        <BuilderInput label="Headline" value={block.value} onChange={(v: string) => updateBlock(block.id, { value: v })} />
                                        <MiniColorPicker label="Color" value={block.titleColor} onChange={(c) => updateBlock(block.id, { titleColor: c })} />

                                        <BuilderInput label="Subtitle" value={block.subtitle} onChange={(v: string) => updateBlock(block.id, { subtitle: v })} type="textarea" />
                                        <MiniColorPicker label="Color" value={block.subtitleColor} onChange={(c) => updateBlock(block.id, { subtitleColor: c })} />

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Collage Images (4)</label>
                                            {(block.images || []).map((img, idx) => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    value={img}
                                                    onChange={(e) => {
                                                        const newImages = [...(block.images || [])];
                                                        newImages[idx] = e.target.value;
                                                        updateBlock(block.id, { images: newImages });
                                                    }}
                                                    placeholder={`Image URL ${idx + 1}`}
                                                    className="w-full p-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg mb-1 dark:text-white"
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {block.type === 'bento_grid' && (
                                    <div className="space-y-4">
                                        {(block.bentoItems || []).map((item, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-xs font-bold text-gray-500">Tile {idx + 1}</span>
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => {
                                                            const newItems = [...(block.bentoItems || [])];
                                                            newItems[idx].type = e.target.value as any;
                                                            updateBlock(block.id, { bentoItems: newItems });
                                                        }}
                                                        className="text-xs bg-transparent border-none p-0 text-gray-500"
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="stat">Stat</option>
                                                        <option value="social">Social</option>
                                                        <option value="link">Link</option>
                                                    </select>
                                                </div>
                                                <input
                                                    className="w-full mb-1 bg-transparent border-b border-gray-200 dark:border-white/10 text-sm"
                                                    placeholder="Title"
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const newItems = [...(block.bentoItems || [])];
                                                        newItems[idx].title = e.target.value;
                                                        updateBlock(block.id, { bentoItems: newItems });
                                                    }}
                                                />
                                                <input
                                                    className="w-full mb-1 bg-transparent border-b border-gray-200 dark:border-white/10 text-sm"
                                                    placeholder="Subtitle"
                                                    value={item.subtitle}
                                                    onChange={(e) => {
                                                        const newItems = [...(block.bentoItems || [])];
                                                        newItems[idx].subtitle = e.target.value;
                                                        updateBlock(block.id, { bentoItems: newItems });
                                                    }}
                                                />
                                                <input
                                                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 text-sm"
                                                    placeholder="Content/URL"
                                                    value={item.content}
                                                    onChange={(e) => {
                                                        const newItems = [...(block.bentoItems || [])];
                                                        newItems[idx].content = e.target.value;
                                                        updateBlock(block.id, { bentoItems: newItems });
                                                    }}
                                                />
                                                <MiniColorPicker
                                                    label="Text"
                                                    value={item.textColor}
                                                    onChange={(c) => {
                                                        const newItems = [...(block.bentoItems || [])];
                                                        newItems[idx].textColor = c;
                                                        updateBlock(block.id, { bentoItems: newItems });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {block.type === 'features' && (
                                    <div className="space-y-2">
                                        {(block.features || []).map((feature, idx) => (
                                            <div key={idx} className="p-2 border border-gray-100 dark:border-white/5 rounded bg-gray-50 dark:bg-white/5">
                                                <input
                                                    className="w-full font-bold bg-transparent mb-1 text-sm"
                                                    placeholder="Feature Title"
                                                    value={feature.title}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(block.features || [])];
                                                        newFeatures[idx].title = e.target.value;
                                                        updateBlock(block.id, { features: newFeatures });
                                                    }}
                                                />
                                                <textarea
                                                    className="w-full bg-transparent text-xs resize-none"
                                                    placeholder="Description"
                                                    value={feature.description}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(block.features || [])];
                                                        newFeatures[idx].description = e.target.value;
                                                        updateBlock(block.id, { features: newFeatures });
                                                    }}
                                                />
                                                <MiniColorPicker
                                                    label="Text"
                                                    value={feature.textColor}
                                                    onChange={(c) => {
                                                        const newFeatures = [...(block.features || [])];
                                                        newFeatures[idx].textColor = c;
                                                        updateBlock(block.id, { features: newFeatures });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => updateBlock(block.id, { features: [...(block.features || []), { title: '', description: '' }] })}
                                            className="text-xs text-green-600 font-bold flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Feature
                                        </button>
                                    </div>
                                )}
                                {block.type === 'steps' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-400">Manage your hiring steps here.</p>

                                        {/* RENDER EXISTING STEPS */}
                                        {(block.steps || []).map((step, index) => (
                                            <div key={index} className="p-3 bg-gray-50 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 relative group">
                                                <div className="absolute right-2 top-2 cursor-pointer text-gray-300 hover:text-red-500"
                                                    onClick={() => {
                                                        const newSteps = [...(block.steps || [])];
                                                        newSteps.splice(index, 1);
                                                        updateBlock(block.id, { steps: newSteps });
                                                    }}>
                                                    <Trash2 className="w-3 h-3" />
                                                </div>

                                                <div className="mb-2">
                                                    <label className="text-[10px] font-bold uppercase text-gray-400">Step {index + 1} Title</label>
                                                    <input
                                                        value={step.title}
                                                        onChange={(e) => {
                                                            const newSteps = [...(block.steps || [])];
                                                            newSteps[index].title = e.target.value;
                                                            updateBlock(block.id, { steps: newSteps });
                                                        }}
                                                        className="w-full text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 p-1 rounded dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                                                    <textarea
                                                        value={step.description}
                                                        onChange={(e) => {
                                                            const newSteps = [...(block.steps || [])];
                                                            newSteps[index].description = e.target.value;
                                                            updateBlock(block.id, { steps: newSteps });
                                                        }}
                                                        className="w-full text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 p-1 rounded resize-none h-16 dark:text-white"
                                                    />
                                                </div>
                                                <MiniColorPicker
                                                    label="Text"
                                                    value={step.textColor}
                                                    onChange={(c) => {
                                                        const newSteps = [...(block.steps || [])];
                                                        newSteps[index].textColor = c;
                                                        updateBlock(block.id, { steps: newSteps });
                                                    }}
                                                />
                                            </div>
                                        ))}

                                        {/* ADD NEW STEP BUTTON */}
                                        <button
                                            onClick={() => {
                                                const newSteps = [...(block.steps || []), { title: 'New Step', description: 'Description here' }];
                                                updateBlock(block.id, { steps: newSteps });
                                            }}
                                            className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 text-xs font-bold rounded hover:border-green-500 hover:text-green-500 transition-colors"
                                        >
                                            + Add Step
                                        </button>
                                    </div>
                                )}
                                {block.type === 'image' && (
                                    <BuilderInput label="Image URL" value={block.src} onChange={(v: string) => updateBlock(block.id, { src: v })} />
                                )}
                                {block.type === 'job_list' && (
                                    <p className="text-xs text-gray-400 italic">This block automatically renders the list of open jobs.</p>
                                )}
                            </BlockEditorCard>
                        ))}
                    </SortableContext>
                </DndContext>
                {
                    blocks.length === 0 && (
                        <div className="text-center py-10 opacity-50 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                            <p className="text-sm text-gray-400">Your page is empty.</p>
                            <p className="text-xs text-gray-400">Click a block above to start.</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
