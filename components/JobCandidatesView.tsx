import React from 'react';
import { Search, Filter, Clock, MoreHorizontal, Plus } from 'lucide-react';

export const JobCandidatesView = ({ jobId }: { jobId?: number }) => {
    // Mock Data matching your screenshot
    const allCandidates = [
        {
            id: 1,
            name: "Esther Howard",
            role: "Product Designer",
            stage: "Screening",
            date: "Applied 2d ago",
            avatar: "https://i.pravatar.cc/150?u=1",
            rating: 4,
            jobId: 1
        },
        {
            id: 2,
            name: "Cameron Williamson",
            role: "Product Designer",
            stage: "New",
            date: "Applied 1d ago",
            avatar: "https://i.pravatar.cc/150?u=2",
            rating: 0,
            jobId: 1
        },
        {
            id: 3,
            name: "Robert Fox",
            role: "Marketing Manager",
            stage: "Interview",
            date: "Applied 5d ago",
            avatar: "https://i.pravatar.cc/150?u=3",
            rating: 5,
            jobId: 2
        }
    ];

    // Filter candidates by jobId if provided
    const filteredCandidates = jobId
        ? allCandidates.filter(c => c.jobId === jobId)
        : allCandidates;

    const candidateGroups = [
        {
            title: "New",
            count: filteredCandidates.filter(c => c.stage === 'New').length,
            candidates: filteredCandidates.filter(c => c.stage === 'New')
        },
        {
            title: "Screening",
            count: filteredCandidates.filter(c => c.stage === 'Screening').length,
            candidates: filteredCandidates.filter(c => c.stage === 'Screening')
        },
        {
            title: "Interview",
            count: filteredCandidates.filter(c => c.stage === 'Interview').length,
            candidates: filteredCandidates.filter(c => c.stage === 'Interview')
        },
        {
            title: "Offer",
            count: filteredCandidates.filter(c => c.stage === 'Offer').length,
            candidates: filteredCandidates.filter(c => c.stage === 'Offer')
        },
        {
            title: "Hired",
            count: filteredCandidates.filter(c => c.stage === 'Hired').length,
            candidates: filteredCandidates.filter(c => c.stage === 'Hired')
        }
    ];

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* TOOLBAR */}
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 w-64 dark:text-white"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="text-sm font-bold text-gray-800 dark:text-white bg-transparent outline-none cursor-pointer">
                        <option>Last updated</option>
                        <option>Date applied</option>
                        <option>Rating</option>
                    </select>
                </div>
            </div>

            {/* KANBAN / LIST AREA */}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-6 h-full min-w-max">
                    {candidateGroups.map((group) => (
                        <div key={group.title} className="w-80 flex flex-col gap-4">
                            {/* COLUMN HEADER */}
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200">{group.title}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">{group.count}</span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>

                            {/* CARDS */}
                            <div className="flex-1 space-y-3">
                                {group.candidates.map((candidate) => (
                                    <div key={candidate.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{candidate.name}</h4>
                                                    <p className="text-xs text-gray-500">{candidate.role}</p>
                                                </div>
                                            </div>
                                            {candidate.rating > 0 && (
                                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                                    <span>★</span> {candidate.rating}.0
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {candidate.date}
                                            </div>
                                            {/* Hover Action */}
                                            <button className="opacity-0 group-hover:opacity-100 text-green-600 font-bold hover:underline">Review</button>
                                        </div>
                                    </div>
                                ))}
                                {/* Add Button Placeholder */}
                                <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 text-sm hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Candidate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
