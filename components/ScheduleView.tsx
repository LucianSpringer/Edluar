import React, { useState, useEffect, useCallback } from 'react';
import { addMinutes, startOfHour, addHours } from 'date-fns';
import { DateNavigator } from './schedule/DateNavigator';
import { CalendarGrid } from './schedule/CalendarGrid';
import { EventForm } from './schedule/EventForm';
import { CalendarEvent, EventType, DraftEvent } from './schedule/types';
import { toUTC } from '../src/utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export const ScheduleView = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Split State for Performance
    const [draftTime, setDraftTime] = useState<{ start: Date; durationMinutes: number } | null>(null);
    const [draftMeta, setDraftMeta] = useState<{ title: string; type: EventType; description: string }>({
        title: '',
        type: EventType.INTERVIEW,
        description: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/interviews/upcoming');
            const data = await response.json();

            // Map API response to CalendarEvent
            const mappedEvents: CalendarEvent[] = (Array.isArray(data) ? data : []).map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                start: item.interview_date,
                end: addMinutes(new Date(item.interview_date), item.duration || 60).toISOString(),
                type: item.event_type as EventType,
                candidate_id: item.candidate_id,
                candidate_name: item.candidate_name,
                job_id: item.job_id,
                job_title: item.job_title
            }));

            setEvents(mappedEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSlotClick = (date: Date) => {
        // Default to 1 hour duration
        setDraftTime({
            start: date,
            durationMinutes: 60
        });
        // Reset meta
        setDraftMeta({
            title: '',
            type: EventType.INTERVIEW,
            description: ''
        });
    };

    const handleEventClick = (event: CalendarEvent) => {
        // Edit mode
        setDraftTime({
            start: new Date(event.start), // Convert UTC string to Date object (handled by new Date() automatically if ISO)
            // Actually event.start is UTC ISO string. new Date(iso) gives local date. Correct.
            durationMinutes: (new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000
        });
        setDraftMeta({
            title: event.title,
            type: event.type,
            description: event.description || ''
        });
    };

    const { user } = useAuth();

    const handleSave = async () => {
        if (!draftTime || !draftMeta.title) return;

        // Validation: Ensure we have a user ID
        const userId = user?.id || 1; // Fallback to 1 for dev, but ideally should block
        if (!user?.id) {
            console.warn("⚠️ No authenticated user found, defaulting to ID 1 for dev.");
        }

        setIsSaving(true);
        try {
            const startUTC = toUTC(draftTime.start);

            const payload = {
                title: draftMeta.title,
                description: draftMeta.description,
                interview_date: startUTC,
                duration: draftTime.durationMinutes,
                event_type: draftMeta.type,
                candidate_id: null,
                job_id: null,
                scheduled_by: userId,
                location: 'Remote'
            };

            const response = await fetch('http://localhost:5000/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchEvents();
                setDraftTime(null); // Close form
                alert("✅ Event saved successfully!");
            } else {
                const errorData = await response.json();
                console.error("Failed to save event:", errorData);
                alert(`❌ Failed to save event: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error saving event:", error);
            alert(`❌ Network or Logic Error: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    const draftEvent: DraftEvent | null = draftTime ? {
        ...draftTime,
        ...draftMeta
    } : null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0B100D] animate-fade-in overflow-hidden">
            {/* Header */}
            <DateNavigator
                currentDate={currentWeekStart}
                onDateChange={setCurrentWeekStart}
            />

            {/* Body - Split Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Form (Slide in) */}
                <div
                    className={`
                        absolute inset-y-0 left-0 z-20 w-[400px] transform transition-transform duration-300 ease-in-out shadow-2xl
                        ${draftTime ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {draftTime && (
                        <EventForm
                            draftTime={draftTime}
                            draftMeta={draftMeta}
                            onTimeChange={setDraftTime}
                            onMetaChange={setDraftMeta}
                            onSave={handleSave}
                            onCancel={() => setDraftTime(null)}
                            isSaving={isSaving}
                        />
                    )}
                </div>

                {/* Right Panel - Calendar Grid */}
                <div
                    className={`
                        flex-1 transition-all duration-300 ease-in-out h-full flex flex-col
                        ${draftTime ? 'ml-[400px]' : 'ml-0'}
                    `}
                >
                    <CalendarGrid
                        currentWeekStart={currentWeekStart}
                        events={events}
                        draftEvent={draftEvent}
                        onEventClick={handleEventClick}
                        onSlotClick={handleSlotClick}
                    />
                </div>
            </div>
        </div>
    );
};
