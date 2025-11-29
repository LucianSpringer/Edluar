import React, { useState } from 'react';
import { EventTemplatesTab } from './settings/EventTemplatesTab';
import { User, Bell, Building2, HelpCircle, ChevronLeft, Calendar } from 'lucide-react';
import { ProfileSettings } from './settings/ProfileSettings';
import { AccountSettings } from './settings/AccountSettings';
import { WorkspaceSettings } from './settings/WorkspaceSettings';
import { SupportSettings } from './settings/SupportSettings';

interface SettingsLayoutProps {
    onBack: () => void;
    initialTab?: string;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

type SettingsTab = 'profile' | 'account' | 'workspace' | 'support' | 'templates';

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
    onBack,
    initialTab = 'profile',
    isDarkMode,
    toggleTheme
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab as SettingsTab);

    const tabs = [
        { id: 'profile' as SettingsTab, label: 'My Profile', icon: User },
        { id: 'account' as SettingsTab, label: 'Account Settings', icon: Bell },
        { id: 'workspace' as SettingsTab, label: 'Workspace Admin', icon: Building2 },
        { id: 'templates' as SettingsTab, label: 'Event Templates', icon: Calendar },
        { id: 'support' as SettingsTab, label: 'Help & Support', icon: HelpCircle },
    ];

    return (
        <div className="flex h-screen bg-edluar-cream dark:bg-edluar-deep">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-black/20 border-r border-edluar-pale/50 dark:border-white/5 flex flex-col">
                <div className="p-6 border-b border-edluar-pale/50 dark:border-white/5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-edluar-dark/60 dark:text-edluar-cream/60 hover:text-edluar-moss transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-edluar-moss text-white shadow-lg shadow-edluar-moss/20'
                                : 'text-edluar-dark/60 dark:text-edluar-cream/60 hover:bg-edluar-pale/30 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-8">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'account' && <AccountSettings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
                    {activeTab === 'workspace' && <WorkspaceSettings />}
                    {activeTab === 'templates' && <EventTemplatesTab />}
                    {activeTab === 'support' && <SupportSettings />}
                </div>
            </main>
        </div>
    );
};
