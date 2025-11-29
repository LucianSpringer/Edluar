import React, { useState, useEffect } from 'react';
import { Search, X, User as UserIcon, Check } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
}

interface TeamPickerProps {
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}

export const TeamPicker: React.FC<TeamPickerProps> = ({ selectedIds, onChange }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleUser = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(uid => uid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const selectedUsers = users.filter(u => selectedIds.includes(u.id));

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interviewers</label>

            {/* Selected Users List */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedUsers.map(user => (
                        <div key={user.id} className="flex items-center gap-2 bg-edluar-moss/10 text-edluar-moss px-3 py-1.5 rounded-full text-sm font-medium">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-edluar-moss text-white flex items-center justify-center text-[10px] font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <span>{user.name}</span>
                            <button onClick={() => toggleUser(user.id)} className="hover:bg-edluar-moss/20 rounded-full p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Add team members..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 outline-none text-sm"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="relative">
                    <div className="absolute top-2 left-0 right-0 bg-white dark:bg-edluar-surface border border-gray-100 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                        {loading ? (
                            <div className="p-4 text-center text-gray-400 text-sm">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">No users found</div>
                        ) : (
                            <div className="p-1">
                                {filteredUsers.map(user => {
                                    const isSelected = selectedIds.includes(user.id);
                                    return (
                                        <button
                                            key={user.id}
                                            onClick={() => toggleUser(user.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isSelected ? 'bg-edluar-moss/5 text-edluar-moss' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {/* Click outside listener could be added here or handled by parent */}
                        <div className="p-2 border-t border-gray-100 dark:border-white/5">
                            <button onClick={() => setIsOpen(false)} className="w-full py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
