import React, { useState } from 'react';
import { UserPlus, Shield, Palette, CreditCard, Circle } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../context/AuthContext';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'recruiter' | 'interviewer';
    avatar: string;
}

export const WorkspaceSettings: React.FC = () => {
    const { user } = useAuth();
    const [teamMembers] = useState<TeamMember[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'recruiter', avatar: 'JS' },
    ]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [brandColor, setBrandColor] = useState('#4A7C59');

    // Admin-only check
    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Shield className="w-16 h-16 text-edluar-dark/20 dark:text-edluar-cream/20 mb-4" />
                <h2 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                    Access Denied
                </h2>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
                    Only workspace administrators can access this page
                </p>
            </div>
        );
    }

    const handleInvite = () => {
        if (inviteEmail) {
            alert(`Invitation sent to ${inviteEmail}`);
            setInviteEmail('');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                    Workspace Admin
                </h1>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
                    Manage your company, team, and billing
                </p>
            </div>

            {/* Team Management */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Team Management
                </h2>

                {/* Invite Member */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1 px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                    />
                    <Button onClick={handleInvite} variant="primary" size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                    </Button>
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-edluar-moss text-white flex items-center justify-center font-bold">
                                    {member.avatar}
                                </div>
                                <div>
                                    <p className="font-medium text-edluar-dark dark:text-edluar-cream">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                            <select
                                value={member.role}
                                className="px-3 py-1 bg-white dark:bg-edluar-surface border border-edluar-pale dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-edluar-moss/50"
                            >
                                <option value="admin">Admin</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="interviewer">Interviewer</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Company Branding */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Company Branding
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Company Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-edluar-pale dark:bg-white/10 flex items-center justify-center">
                                <Palette className="w-8 h-8 text-edluar-moss" />
                            </div>
                            <Button variant="outline" size="sm">
                                Upload Logo
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                            Brand Color
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="w-16 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="flex-1 px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50"
                            />
                        </div>
                        <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 mt-2">
                            This color will be used across all your job posts
                        </p>
                    </div>
                </div>
            </div>

            {/* Billing */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Billing & Plan
                </h2>
                <div className="p-4 bg-gradient-to-br from-edluar-moss to-edluar-sage text-white rounded-xl mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm opacity-90">Current Plan</span>
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold">Pro</p>
                    <p className="text-sm opacity-90">5 Active Jobs • Unlimited Candidates</p>
                </div>
                <Button variant="outline" size="sm">
                    Upgrade Plan
                </Button>
            </div>

            {/* Integration Status */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Integration Status
                </h2>
                <div className="space-y-3">
                    {[
                        { name: 'LinkedIn Integration', connected: true },
                        { name: 'Google Calendar', connected: true },
                        { name: 'Slack Notifications', connected: false },
                    ].map((integration, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <Circle
                                    className={`w-3 h-3 ${integration.connected
                                            ? 'text-green-500 fill-green-500'
                                            : 'text-red-500 fill-red-500'
                                        }`}
                                />
                                <span className="font-medium text-edluar-dark dark:text-edluar-cream">
                                    {integration.name}
                                </span>
                            </div>
                            <button className="text-sm text-edluar-moss hover:underline">
                                {integration.connected ? 'Re-auth' : 'Connect'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button variant="primary" size="md">
                    Save Workspace Settings
                </Button>
            </div>
        </div>
    );
};
