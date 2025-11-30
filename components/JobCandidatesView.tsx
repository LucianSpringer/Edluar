import React from 'react';
import { Search, Filter, Clock, MoreHorizontal, Plus, XCircle } from 'lucide-react';
import { CandidateProfileModal } from './CandidateProfileModal';
import { useAuth } from '../context/AuthContext';

export const JobCandidatesView = ({ jobId }: { jobId?: number }) => {
    const [candidates, setCandidates] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [job, setJob] = React.useState<any>(null);
    const [rejectModal, setRejectModal] = React.useState<{ isOpen: boolean; candidateId: number | null }>({ isOpen: false, candidateId: null });

    React.useEffect(() => {
        if (jobId) {
            fetchCandidates();
            fetchJobDetails();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setJob(data);
            }
        } catch (err) {
            console.error("Failed to fetch job details", err);
        }
    };

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

    const getOverdueStatus = (candidate: any, limitDays: number = 3) => {
        // 1. Safety Check: Only active stages
        if (['hired', 'offer', 'rejected', 'disqualified'].includes(candidate.stage)) return false;

        // 2. Calculate Days Difference
        const lastUpdate = new Date(candidate.updated_at || candidate.applied_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > limitDays;
        return diffDays > limitDays;
    };

    const handleReject = async (id: number, reason: string) => {
        try {
            await fetch(`http://localhost:5000/api/applications/${id}/reject`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });
            setRejectModal({ isOpen: false, candidateId: null });
            fetchCandidates(); // Refresh list
        } catch (error) {
            console.error("Failed to reject candidate", error);
        }
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

    const [selectedCandidate, setSelectedCandidate] = React.useState<any>(null);
    const { user } = useAuth();

    // ... (existing code)

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* TOOLBAR */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none dark:text-white"
                        />
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" /> Add Candidate
                    </button>
                </div>
            </div>

            {/* KANBAN / LIST AREA */}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-6 h-full min-w-max">
                    {candidateGroups.map((group) => (
                        <div key={group.title} className="w-80 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">{group.title}</h3>
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {group.count}
                                </span>
                            </div>

                            {/* CARDS */}
                            <div className="flex-1 space-y-3">
                                {group.candidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        onClick={() => setSelectedCandidate(candidate)}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{candidate.name}</h4>
                                                    <p className="text-xs text-gray-500">{candidate.role}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= (candidate.rating || 0) ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {candidate.date}
                                            </div>
                                            {/* Hover Action */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCandidate(candidate);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-green-600 font-bold hover:underline"
                                            >
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 hover:text-green-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                                    <Plus className="w-4 h-4" /> Add Candidate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disqualification Modal */}
            {rejectModal.isOpen && (
                // ... (existing modal content)
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" /> Disqualify Candidate
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Please select a reason for disqualification:</p>
                        <div className="space-y-2 mb-6">
                            {['Skillset Mismatch', 'Culture Fit', 'Salary Expectations', 'Unresponsive', 'Other'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => rejectModal.candidateId && handleReject(rejectModal.candidateId, r)}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setRejectModal({ isOpen: false, candidateId: null })}
                            className="w-full py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Candidate Profile Modal */}
            {selectedCandidate && (
                <CandidateProfileModal
                    application={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                    currentUserId={user?.id || 0}
                />
            )}
        </div>
    );
};
