import React from 'react';
import { Search, Filter, Clock, MoreHorizontal, Plus } from 'lucide-react';

export const JobCandidatesView = ({ jobId }: { jobId?: number }) => {
    const [candidates, setCandidates] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (jobId) {
            fetchCandidates();
        }
    }, [jobId]);

    const fetchCandidates = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/applications/job/${jobId}`);
            const data = await res.json();
            // The API returns an object { applied: [], phone_screen: [], ... }
            // We need to flatten it or use it directly. 
            // Let's flatten it for easier filtering/mapping if we want to keep the existing structure,
            // OR better yet, let's use the object keys directly to map to columns.

            // Flattening for now to match the existing "allCandidates" structure if possible, 
            // but actually the API returns arrays by status.
            // Let's just store the raw data and map it in the render.

            // Wait, the API returns { applied: [...], ... }.
            // The current component expects a flat list `allCandidates` and then filters it.
            // Let's adapt the component to use the API response structure directly.

            // Actually, let's flatten it to make it easier to work with the existing "filteredCandidates" logic if we want to keep it simple,
            // or just rewrite the grouping logic.

            const flatList: any[] = [];
            Object.keys(data).forEach(status => {
                data[status].forEach((c: any) => {
                    flatList.push({
                        ...c,
                        stage: status, // 'applied', 'phone_screen', etc.
                        name: `${c.first_name} ${c.last_name || ''}`,
                        role: 'Candidate', // We don't have role in application, maybe fetch job title or just generic
                        date: new Date(c.applied_at).toLocaleDateString(),
                        avatar: c.avatar || `https://ui-avatars.com/api/?name=${c.first_name}+${c.last_name}&background=random`,
                        rating: 0 // Default for now
                    });
                });
            });
            setCandidates(flatList);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch candidates", err);
            setLoading(false);
        }
    };

    // Status Mapping
    const statusMap: Record<string, string> = {
        'applied': 'New',
        'phone_screen': 'Screening',
        'interview': 'Interview',
        'offer': 'Offer',
        'hired': 'Hired'
    };

    const [searchQuery, setSearchQuery] = React.useState('');

    // ... (fetchCandidates logic)

    // Filter Logic
    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update Groups to use 'filteredCandidates'
    const candidateGroups = [
        {
            title: "New",
            count: filteredCandidates.filter(c => statusMap[c.stage] === 'New' || c.stage === 'applied').length,
            candidates: filteredCandidates.filter(c => statusMap[c.stage] === 'New' || c.stage === 'applied')
        },
        {
            title: "Screening",
            count: filteredCandidates.filter(c => statusMap[c.stage] === 'Screening' || c.stage === 'phone_screen').length,
            candidates: filteredCandidates.filter(c => statusMap[c.stage] === 'Screening' || c.stage === 'phone_screen')
        },
        {
            title: "Interview",
            count: filteredCandidates.filter(c => statusMap[c.stage] === 'Interview' || c.stage === 'interview').length,
            candidates: filteredCandidates.filter(c => statusMap[c.stage] === 'Interview' || c.stage === 'interview')
        },
        {
            title: "Offer",
            count: filteredCandidates.filter(c => statusMap[c.stage] === 'Offer' || c.stage === 'offer').length,
            candidates: filteredCandidates.filter(c => statusMap[c.stage] === 'Offer' || c.stage === 'offer')
        },
        {
            title: "Hired",
            count: filteredCandidates.filter(c => statusMap[c.stage] === 'Hired' || c.stage === 'hired').length,
            candidates: filteredCandidates.filter(c => statusMap[c.stage] === 'Hired' || c.stage === 'hired')
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
