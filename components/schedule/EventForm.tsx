import React, { useState } from 'react';
import { X, Clock, Calendar as CalendarIcon, AlignLeft, Type, FileText, ChevronDown } from 'lucide-react';
import { EventType } from './types';
import { format, addMinutes, parse } from 'date-fns';
import { defaultEventTemplates } from '../../src/data/eventTemplates';
import { parseTemplate } from '../../src/utils/templateUtils';
import { useAuth } from '../../context/AuthContext';

interface EventFormProps {
    draftTime: { start: Date; durationMinutes: number };
    draftMeta: { title: string; type: EventType; description: string };
    onTimeChange: (time: { start: Date; durationMinutes: number }) => void;
    onMetaChange: (meta: { title: string; type: EventType; description: string }) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
    draftTime,
    draftMeta,
    onTimeChange,
    onMetaChange,
    onSave,
    onCancel,
    isSaving
}) => {
    const { user } = useAuth();
    const [showTemplates, setShowTemplates] = useState(false);

    const handleTemplateSelect = (templateId: string) => {
        const template = defaultEventTemplates.find(t => t.id === templateId);
        if (!template) return;

        // Mock context - in a real app, this would come from the selected candidate/job
        const context = {
            recruiter: {
                name: user?.name || 'Recruiter',
                email: user?.email || 'recruiter@edluar.com'
            },
            candidate: {
                firstName: 'Sarah', // Mock for demo
                lastName: 'Candidate'
            },
            job: {
                title: 'Senior Developer' // Mock for demo
            }
        };

        const parsedTitle = parseTemplate(template.eventTitle, context);
        const parsedDescription = parseTemplate(template.description, context);

        onMetaChange({
            ...draftMeta,
            title: parsedTitle,
            type: template.type as EventType,
            description: parsedDescription
        });

        onTimeChange({
            ...draftTime,
            durationMinutes: template.duration
        });

        setShowTemplates(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value;
        if (!timeStr) return;

        const [hours, minutes] = timeStr.split(':').map(Number);
        const newStart = new Date(draftTime.start);
        newStart.setHours(hours, minutes);

        onTimeChange({ ...draftTime, start: newStart });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        if (!dateStr) return;

        const newDate = new Date(dateStr);
        const newStart = new Date(draftTime.start);
        newStart.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());

        onTimeChange({ ...draftTime, start: newStart });
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-edluar-surface border-r border-gray-200 dark:border-white/5 shadow-xl z-20 animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {draftMeta.title ? 'Edit Event' : 'New Event'}
                </h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            <FileText size={16} />
                            Templates
                            <ChevronDown size={14} />
                        </button>

                        {showTemplates && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1A1D1B] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                                <div className="p-2">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">SELECT TEMPLATE</div>
                                    {defaultEventTemplates.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleTemplateSelect(template.id)}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 transition-colors flex flex-col"
                                        >
                                            <span className="font-medium">{template.name}</span>
                                            <span className="text-xs text-gray-400">{template.duration} min • {template.type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Title
                    </label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={draftMeta.title}
                            onChange={(e) => onMetaChange({ ...draftMeta, title: e.target.value })}
                            placeholder="e.g., Product Review"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-gray-900 dark:text-white focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(EventType).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => onMetaChange({ ...draftMeta, type })}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium border transition-all
                                    ${draftMeta.type === type
                                        ? 'border-edluar-moss bg-edluar-moss/10 text-edluar-moss'
                                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}
                                `}
                            >
                                {type.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={format(draftTime.start, 'yyyy-MM-dd')}
                                onChange={handleDateChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-gray-900 dark:text-white focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="time"
                                value={format(draftTime.start, 'HH:mm')}
                                onChange={handleTimeChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-gray-900 dark:text-white focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                    </label>
                    <select
                        value={draftTime.durationMinutes}
                        onChange={(e) => onTimeChange({ ...draftTime, durationMinutes: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-gray-900 dark:text-white focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                    >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                    </label>
                    <div className="relative">
                        <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            value={draftMeta.description}
                            onChange={(e) => onMetaChange({ ...draftMeta, description: e.target.value })}
                            rows={4}
                            placeholder="Add details..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-gray-900 dark:text-white focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/5 flex gap-3 bg-gray-50 dark:bg-black/20">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving || !draftMeta.title}
                    className="flex-1 px-4 py-2 bg-edluar-moss text-white rounded-lg hover:bg-edluar-moss/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Event'}
                </button>
            </div>
        </div>
    );
};
