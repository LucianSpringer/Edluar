import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, differenceInMinutes, startOfDay, addMinutes } from 'date-fns';
import { CalendarEvent, DraftEvent, EventType } from './types';
import { toLocal } from '../../src/utils/dateUtils';

interface CalendarGridProps {
    currentWeekStart: Date;
    events: CalendarEvent[];
    draftEvent: DraftEvent | null;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick: (date: Date) => void;
}

const HOUR_HEIGHT = 80;
const START_HOUR = 8;
const END_HOUR = 24;

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    currentWeekStart,
    events,
    draftEvent,
    onEventClick,
    onSlotClick
}) => {
    const weekDays = useMemo(() => {
        const start = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [currentWeekStart]);

    const timeSlots = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

    // --- COLLISION DETECTION ALGORITHM ---
    const processedEvents = useMemo(() => {
        // 1. Convert all events to local time and calculate raw positions
        const localEvents = events.map(event => {
            const start = toLocal(event.start);
            const end = toLocal(event.end);
            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const endMinutes = end.getHours() * 60 + end.getMinutes();
            const duration = differenceInMinutes(end, start);

            const top = ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;
            const height = (duration / 60) * HOUR_HEIGHT;

            return { ...event, _start: startMinutes, _end: endMinutes, layout: { top, height, left: 0, width: 100 } };
        }).filter(e => e._start >= START_HOUR * 60 && e._start < END_HOUR * 60);

        // 2. Group by Day
        const eventsByDay = new Map<string, typeof localEvents>();
        localEvents.forEach(event => {
            const dateKey = format(toLocal(event.start), 'yyyy-MM-dd');
            if (!eventsByDay.has(dateKey)) eventsByDay.set(dateKey, []);
            eventsByDay.get(dateKey)?.push(event);
        });

        // 3. Calculate Clusters per Day
        const finalEvents: typeof localEvents = [];

        eventsByDay.forEach((dayEvents) => {
            // Sort by start time
            dayEvents.sort((a, b) => a._start - b._start);

            const clusters: (typeof localEvents)[] = [];

            dayEvents.forEach(event => {
                // Find a cluster this event belongs to
                // A cluster is a group of overlapping events
                let added = false;
                for (const cluster of clusters) {
                    const clusterEnd = Math.max(...cluster.map(e => e._end));
                    // If event starts before cluster ends, it overlaps
                    if (event._start < clusterEnd) {
                        cluster.push(event);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    clusters.push([event]);
                }
            });

            // 4. Assign Layout props
            clusters.forEach(cluster => {
                const width = 100 / cluster.length;
                cluster.forEach((event, index) => {
                    event.layout.width = width;
                    event.layout.left = index * width;
                    finalEvents.push(event);
                });
            });
        });

        return finalEvents;
    }, [events]);

    const getEventColor = (type: EventType) => {
        switch (type) {
            case EventType.INTERVIEW: return 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300';
            case EventType.SCREENING: return 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300';
            case EventType.TEAM_SYNC: return 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300';
            case EventType.BLOCKED: return 'bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 striped-bg';
            default: return 'bg-gray-100 border-gray-200 text-gray-700';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white dark:bg-[#0B100D]">
            <div className="flex min-w-[800px]">
                {/* Time Column */}
                <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B100D] z-10 sticky left-0">
                    <div className="h-10 border-b border-gray-200 dark:border-white/5"></div>
                    {timeSlots.map(hour => (
                        <div key={hour} className="h-20 border-b border-gray-100 dark:border-white/5 text-xs text-gray-400 text-right pr-2 pt-2" style={{ height: HOUR_HEIGHT }}>
                            {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'pm' : 'am'}
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                {weekDays.map(day => {
                    const isToday = isSameDay(day, new Date());
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayEvents = processedEvents.filter(e => format(toLocal(e.start), 'yyyy-MM-dd') === dateKey);

                    return (
                        <div key={day.toISOString()} className="flex-1 min-w-[100px] border-r border-gray-200 dark:border-white/5 relative group">
                            {/* Day Header */}
                            <div className={`h-10 border-b border-gray-200 dark:border-white/5 flex items-center justify-center sticky top-0 bg-white dark:bg-[#0B100D] z-10 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                <div className="text-center">
                                    <div className={`text-xs font-medium uppercase mb-0.5 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {format(day, 'EEE')}
                                    </div>
                                    <div className={`text-lg font-bold leading-none ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            </div>

                            {/* Grid Slots */}
                            <div className="relative">
                                {timeSlots.map(hour => (
                                    <div
                                        key={hour}
                                        className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        style={{ height: HOUR_HEIGHT }}
                                        onClick={() => {
                                            const clickedDate = new Date(day);
                                            clickedDate.setHours(hour, 0, 0, 0);
                                            onSlotClick(clickedDate);
                                        }}
                                    />
                                ))}

                                {/* Render Events */}
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                                        className={`absolute rounded-lg border px-2 py-1 text-xs cursor-pointer hover:brightness-95 transition-all shadow-sm overflow-hidden ${getEventColor(event.type)}`}
                                        style={{
                                            top: `${event.layout.top}px`,
                                            height: `${event.layout.height}px`,
                                            left: `${event.layout.left}%`,
                                            width: `${event.layout.width}%`,
                                            zIndex: 10
                                        }}
                                    >
                                        <div className="font-semibold truncate">{event.title}</div>
                                        {event.layout.height > 30 && (
                                            <div className="opacity-80 truncate">
                                                {format(toLocal(event.start), 'h:mm')} - {format(toLocal(event.end), 'h:mm a')}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Render Ghost Event */}
                                {draftEvent && isSameDay(day, draftEvent.start) && (
                                    <div
                                        className={`absolute rounded-lg border-2 border-dashed border-edluar-moss/50 bg-edluar-moss/10 px-2 py-1 text-xs pointer-events-none z-20 animate-pulse`}
                                        style={{
                                            top: `${((draftEvent.start.getHours() * 60 + draftEvent.start.getMinutes() - START_HOUR * 60) / 60) * HOUR_HEIGHT}px`,
                                            height: `${(draftEvent.durationMinutes / 60) * HOUR_HEIGHT}px`,
                                            left: '0%',
                                            width: '100%'
                                        }}
                                    >
                                        <div className="font-semibold text-edluar-moss truncate">New Event</div>
                                        <div className="text-edluar-moss/80 truncate">
                                            {format(draftEvent.start, 'h:mm')} - {format(addMinutes(draftEvent.start, draftEvent.durationMinutes), 'h:mm a')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
