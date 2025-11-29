import React, { useState, useEffect } from 'react';
import { X, Calendar, User as UserIcon, Link as LinkIcon } from 'lucide-react';

interface CreateTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        candidate_id?: number;
        candidate_name?: string;
        job_id?: number;
        job_title?: string;
    };
    onTaskCreated?: () => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onTaskCreated
}) => {
    const [formData, setFormData] = useState({
        task: '',
        assignee_id: 1, // Default to current user
        candidate_id: initialData?.candidate_id || null,
        job_id: initialData?.job_id || null,
        due_date: ''
    });
    const [users, setUsers] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const response = await fetch('http://localhost:5000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]); // Ensure users is always an array
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onTaskCreated?.(); // Trigger dashboard refresh
                onClose();
                // Reset form
                setFormData({
                    task: '',
                    assignee_id: 1,
                    candidate_id: null,
                    job_id: null,
                    due_date: ''
                });
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-edluar-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream">
                        Create Task
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Context Link Indicator */}
                {(initialData?.candidate_name || initialData?.job_title) && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <LinkIcon className="w-4 h-4" />
                            <span className="font-medium">
                                {initialData.candidate_name && `Linked to ${initialData.candidate_name}`}
                                {initialData.job_title && ` • ${initialData.job_title}`}
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task Input */}
                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Task Description *
                        </label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                            placeholder="e.g., Review portfolio, Schedule call..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Assignee Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            <UserIcon className="w-4 h-4 inline mr-1" />
                            Assign To *
                        </label>
                        <select
                            value={formData.assignee_id}
                            onChange={(e) => setFormData({ ...formData, assignee_id: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                            required
                            disabled={isLoadingUsers}
                        >
                            {isLoadingUsers ? (
                                <option>Loading users...</option>
                            ) : !Array.isArray(users) || users.length === 0 ? (
                                <option>No users available</option>
                            ) : (
                                users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-edluar-deep text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss focus:border-transparent"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg text-edluar-dark dark:text-edluar-cream hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-edluar-moss text-white rounded-lg hover:bg-edluar-moss/90 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
