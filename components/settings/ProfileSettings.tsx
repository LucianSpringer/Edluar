import React, { useState, useEffect } from 'react';
import { User, Camera, Lock, Mail, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings: React.FC = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: (user as any)?.phone || '',
        jobTitle: (user as any)?.job_title || '',
        signature: (user as any)?.signature || '',
    });

    // Update form data when user context updates (e.g. initial load or after save)
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: (user as any).phone || '',
                jobTitle: (user as any).job_title || '',
                signature: (user as any).signature || '',
            }));
        }
    }, [user]);
    const [stats, setStats] = useState({
        candidatesHired: 0,
        avgResponseTime: '-',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/me/stats', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        candidatesHired: data.candidatesHired,
                        avgResponseTime: data.avgResponseTime
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleTriggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('jobTitle', formData.jobTitle);
            data.append('signature', formData.signature);

            if (selectedFile) {
                data.append('avatar', selectedFile);
            }

            // Note: Do NOT set Content-Type header when sending FormData
            const response = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: data,
            });

            if (response.ok) {
                // Fetch updated user data from server
                const authResponse = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });

                if (authResponse.ok) {
                    const authData = await authResponse.json();
                    // Update the context with fresh user data
                    updateUser(authData.user);
                }

                alert('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                    My Profile
                </h1>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
                    Manage your personal information and preferences
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-edluar-moss to-edluar-sage rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm opacity-90">Candidates Hired</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.candidatesHired}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm opacity-90">Avg. Response Time</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.avgResponseTime}</p>
                </div>
            </div>

            {/* Avatar & Personal Details */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-6">
                    Personal Information
                </h2>

                <div className="flex items-start gap-6 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-edluar-moss flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (user as any)?.avatar ? (
                                <img src={`http://localhost:5000${(user as any).avatar}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelected}
                        />
                        <button
                            onClick={handleTriggerFilePicker}
                            className="absolute bottom-0 right-0 p-2 bg-white dark:bg-edluar-surface rounded-full border-2 border-edluar-pale dark:border-white/10 hover:bg-edluar-pale dark:hover:bg-white/5 transition-colors"
                        >
                            <Camera className="w-4 h-4 text-edluar-dark dark:text-edluar-cream" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                                    placeholder="+1 555 0123"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                                Job Title
                            </label>
                            <input
                                type="text"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                                placeholder="e.g., Senior Recruiter"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Signature */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Email Signature
                </h2>
                <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 mb-4">
                    This signature will be automatically appended to all candidate emails
                </p>
                <textarea
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all resize-none"
                    placeholder="Best regards,&#10;Your Name&#10;Company Name"
                />
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Security
                </h2>
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl hover:bg-edluar-pale/50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-edluar-moss" />
                            <span className="font-medium text-edluar-dark dark:text-edluar-cream">
                                Change Password
                            </span>
                        </div>
                        <span className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                            Last changed 3 months ago
                        </span>
                    </button>

                    <div className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-edluar-moss" />
                            <span className="font-medium text-edluar-dark dark:text-edluar-cream">
                                Two-Factor Authentication
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-edluar-moss/50 dark:peer-focus:ring-edluar-moss/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-edluar-moss"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} variant="primary" size="md" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};
