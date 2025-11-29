// Place these components BEFORE ATSView in DashboardPage.tsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Droppable Column Component
export const DroppableColumn = ({ id, title, color, count, children }: { id: string; title: string; color: string; count: number; children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="w-72 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`}></span> {title}
                </span>
                <span className="text-xs text-gray-400 font-medium">{count}</span>
            </div>
            <div className="flex-1 bg-gray-100/50 dark:bg-white/[0.02] rounded-xl p-2 space-y-3 overflow-y-auto custom-scrollbar border border-dashed border-gray-200 dark:border-white/5">
                {children}
            </div>
        </div>
    );
};

// Draggable Candidate Component
export const DraggableCandidate = ({
    id,
    application,
    onClick,
    rating,
    onQuickAdvance
}: {
    id: number;
    application: any;
    onClick: () => void;
    rating?: { average: number; count: number };
    onQuickAdvance?: () => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id.toString() });
    const [isHovered, setIsHovered] = React.useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Import Star and ArrowRight icons
    const Star = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    const ArrowRight = ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative bg-white dark:bg-edluar-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 group"
        >
            {/* Quick Action Button */}
            {onQuickAdvance && (
                <div className={`absolute top-2 right-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdvance();
                        }}
                        className="p-2 bg-edluar-moss text-white rounded-lg hover:bg-edluar-moss/90 shadow-lg transition-all hover:scale-110"
                        title="Move to next stage"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                    {application.first_name?.[0]}{application.last_name?.[0]}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{application.first_name} {application.last_name}</h4>
                    <p className="text-xs text-gray-500">{application.email}</p>
                </div>
            </div>

            {/* Star Rating Display */}
            {rating && rating.count > 0 ? (
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating.average.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</span>
                </div>
            ) : (
                <div className="text-xs text-gray-400 mb-2">No reviews yet</div>
            )}

            <div className="flex gap-1 flex-wrap">
                {(JSON.parse(application.tags || '[]') as string[]).map((t: string) =>
                    <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-[10px] rounded">{t}</span>
                )}
            </div>
            <div className="mt-2 text-xs text-gray-400">
                Source: {application.source} • {new Date(application.applied_at).toLocaleDateString()}
            </div>
        </div>
    );
};

