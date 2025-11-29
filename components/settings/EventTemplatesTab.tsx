import React, { useState } from 'react';
import { EventTemplate } from '../../src/types/EventTemplate';
import { defaultEventTemplates } from '../../src/data/eventTemplates';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export const EventTemplatesTab = () => {
    const [templates, setTemplates] = useState<EventTemplate[]>(defaultEventTemplates);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<EventTemplate>>({});

    const handleEdit = (template: EventTemplate) => {
        setEditingId(template.id);
        setEditForm(template);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = () => {
        if (!editForm.name || !editForm.eventTitle) return;

        if (editingId === 'new') {
            const newTemplate: EventTemplate = {
                ...editForm as EventTemplate,
                id: Date.now().toString()
            };
            setTemplates([...templates, newTemplate]);
        } else {
            setTemplates(templates.map(t => t.id === editingId ? { ...t, ...editForm } as EventTemplate : t));
        }
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleAddNew = () => {
        setEditingId('new');
        setEditForm({
            name: 'New Template',
            eventTitle: 'Interview with [candidate_name]',
            duration: 60,
            location: 'Google Meet',
            description: '',
            type: 'interview'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Event Templates</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage templates for quick scheduling.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Add Template
                </button>
            </div>

            <div className="grid gap-4">
                {editingId === 'new' && (
                    <div className="bg-white dark:bg-[#1A1D1B] border border-blue-500 rounded-xl p-4 shadow-lg animate-fade-in">
                        <h3 className="font-medium text-blue-600 mb-4">New Template</h3>
                        <TemplateForm form={editForm} onChange={setEditForm} onSave={handleSave} onCancel={handleCancel} />
                    </div>
                )}

                {templates.map(template => (
                    <div key={template.id} className="bg-white dark:bg-[#1A1D1B] border border-gray-200 dark:border-white/5 rounded-xl p-4 transition-all hover:shadow-md">
                        {editingId === template.id ? (
                            <TemplateForm form={editForm} onChange={setEditForm} onSave={handleSave} onCancel={handleCancel} />
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                            ${template.type === 'interview' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                template.type === 'screening' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            {template.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{template.eventTitle}</p>
                                    <div className="flex gap-4 text-xs text-gray-400">
                                        <span>⏱ {template.duration} min</span>
                                        <span>📍 {template.location}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(template)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(template.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TemplateForm = ({ form, onChange, onSave, onCancel }: { form: Partial<EventTemplate>, onChange: (f: Partial<EventTemplate>) => void, onSave: () => void, onCancel: () => void }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Template Name</label>
                    <input
                        type="text"
                        value={form.name || ''}
                        onChange={e => onChange({ ...form, name: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Intro Call"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label>
                    <select
                        value={form.type || 'interview'}
                        onChange={e => onChange({ ...form, type: e.target.value as any })}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="interview">Interview</option>
                        <option value="screening">Screening</option>
                        <option value="team_sync">Team Sync</option>
                        <option value="blocked">Blocked Time</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Event Title (supports [placeholders])</label>
                <input
                    type="text"
                    value={form.eventTitle || ''}
                    onChange={e => onChange({ ...form, eventTitle: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    placeholder="Interview with [candidate_name]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duration (min)</label>
                    <input
                        type="number"
                        value={form.duration || 60}
                        onChange={e => onChange({ ...form, duration: parseInt(e.target.value) })}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                    <input
                        type="text"
                        value={form.location || ''}
                        onChange={e => onChange({ ...form, location: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="Google Meet"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description (supports [placeholders])</label>
                <textarea
                    value={form.description || ''}
                    onChange={e => onChange({ ...form, description: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
                    placeholder="Hi [first_name]..."
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Cancel
                </button>
                <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <Save size={14} />
                    Save Template
                </button>
            </div>
        </div>
    );
};
