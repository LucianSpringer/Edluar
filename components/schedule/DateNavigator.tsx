import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks
} from 'date-fns';

interface DateNavigatorProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onDateChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(currentDate); // For the mini-calendar navigation
    const containerRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync viewDate when popover opens
    useEffect(() => {
        if (isOpen) {
            setViewDate(currentDate);
        }
    }, [isOpen, currentDate]);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(subMonths(viewDate, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(addMonths(viewDate, 1));
    };

    const handleDateClick = (date: Date) => {
        onDateChange(date);
        setIsOpen(false);
    };

    const handlePrevWeek = () => {
        onDateChange(subWeeks(currentDate, 1));
    };

    const handleNextWeek = () => {
        onDateChange(addWeeks(currentDate, 1));
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    // Generate calendar grid
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    return (
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B100D]">
            <div className="flex items-center gap-4" ref={containerRef}>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-edluar-surface rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-4 z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {format(viewDate, 'MMMM yyyy')}
                                </span>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, idx) => {
                                    const isSelected = isSameDay(day, currentDate);
                                    const isCurrentMonth = isSameMonth(day, viewDate);
                                    const isToday = isSameDay(day, new Date());

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleDateClick(day)}
                                            className={`
                                                h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
                                                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
                                                ${isSelected ? 'bg-edluar-moss text-white hover:bg-edluar-moss/90' : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                                                ${isToday && !isSelected ? 'border border-edluar-moss text-edluar-moss' : ''}
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleToday}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors border border-gray-200 dark:border-white/10"
                >
                    Today
                </button>
                <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent">
                    <button
                        onClick={handlePrevWeek}
                        className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 border-r border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
