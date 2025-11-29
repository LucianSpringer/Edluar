import React, { useState } from 'react';
import { Calendar, MapPin, X, CheckCircle2, Clock, AlignLeft, Users, Link as LinkIcon } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { TeamPicker } from './TeamPicker';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    candidateName: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, onSubmit, candidateName }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [title, setTitle] = useState('Interview');
    const [description, setDescription] = useState('');
    const [locationLink, setLocationLink] = useState('');
    const [location, setLocation] = useState(''); // Physical location or general text
    const [attendees, setAttendees] = useState<number[]>([]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!date || !time || !location) return;

        const dateTime = new Date(`${date}T${time}`);

        onSubmit({
            interview_date: dateTime.toISOString(),
            location,
            duration,
            title,
            description,
            location_link: locationLink,
            attendees
        });
    };

    const startDateTime = date && time ? new Date(`${date}T${time}`) : new Date();
    const endDateTime = addMinutes(startDateTime, duration);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-edluar-surface w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col md:flex-row h-[90vh]" onClick={(e) => e.stopPropagation()}>

                {/* Left Side: Form */}
                <div className="p-8 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Schedule Interview</h2>
                        <p className="text-sm text-gray-500">Send an invite to {candidateName}</p>
                    </div>

                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Event Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Date */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                    />
                                </div>
                            </div>

                            {/* Time */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Start Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Duration</label>
                            <div className="flex gap-2">
                                {[30, 45, 60, 90, 120].map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => setDuration(mins)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${duration === mins ? 'bg-edluar-moss text-white border-edluar-moss' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Team Picker */}
                        <TeamPicker selectedIds={attendees} onChange={setAttendees} />

                        {/* Location */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Location (Physical)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Meeting Room A"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Video Link (Optional)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={locationLink}
                                        onChange={(e) => setLocationLink(e.target.value)}
                                        placeholder="e.g. Zoom / Google Meet URL"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Agenda / Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter interview agenda..."
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 ring-edluar-moss/20 focus:border-edluar-moss resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!date || !time || !location}
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-edluar-moss hover:bg-edluar-moss/90 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            Send Invite
                        </button>
                    </div>
                </div>

                {/* Right Side: Preview Card */}
                <div className="bg-gray-50 dark:bg-black/20 p-8 w-full md:w-96 flex flex-col justify-center items-center border-l border-gray-100 dark:border-white/5 overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Candidate Preview</h3>

                    <div className="bg-white dark:bg-edluar-surface border border-gray-200 dark:border-white/10 rounded-xl p-0 w-full shadow-xl relative overflow-hidden group">
                        {/* Header */}
                        <div className="bg-edluar-moss p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Calendar className="w-24 h-24 transform rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-edluar-pale text-xs font-bold uppercase tracking-wider mb-1">Invitation</div>
                                <h4 className="text-lg font-bold">{title}</h4>
                                <p className="text-white/80 text-sm mt-1">with {candidateName}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">When</div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {date ? format(startDateTime, 'EEEE, MMM do') : '--'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {time ? `${format(startDateTime, 'h:mm a')} - ${format(endDateTime, 'h:mm a')}` : '--:--'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">Where</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{location || 'TBD'}</div>
                                    {locationLink && <div className="text-xs text-blue-500 truncate max-w-[200px]">{locationLink}</div>}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg">
                                    <Users className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">Attendees</div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        You + {attendees.length} others
                                    </div>
                                </div>
                            </div>

                            {description && (
                                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Agenda</div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                                        {description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-center text-gray-400 mt-6">
                        An email with a .ics calendar file will be sent to all participants.
                    </p>
                </div>
            </div>
        </div>
    );
};
