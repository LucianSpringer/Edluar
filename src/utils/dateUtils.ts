/**
 * Date Utility Functions
 * Ensures consistent timezone handling across the application.
 * 
 * Rule: 
 * - All data sent to DB/API must be UTC.
 * - All data displayed in UI must be Local.
 */

import { format, parseISO } from 'date-fns';

/**
 * Converts a local Date object to a UTC ISO string for storage.
 * @param date Local Date object
 * @returns ISO string (e.g., "2023-11-29T14:00:00.000Z")
 */
export const toUTC = (date: Date): string => {
    return date.toISOString();
};

/**
 * Converts a UTC ISO string from the DB to a local Date object for display.
 * @param isoString UTC ISO string
 * @returns Local Date object
 */
export const toLocal = (isoString: string): Date => {
    return new Date(isoString);
};

/**
 * Formats a date for display (e.g., "9:00 AM")
 * @param date Date object or ISO string
 * @param formatStr date-fns format string
 */
export const formatDate = (date: Date | string, formatStr: string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, formatStr);
};

/**
 * Combines a date and a time string into a single Date object
 * @param date Date object representing the day
 * @param timeStr Time string in "HH:mm" 24h format
 */
export const combineDateTime = (date: Date, timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};
