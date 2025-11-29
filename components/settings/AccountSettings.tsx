import React, { useState } from 'react';
import { Bell, Moon, Sun, Globe, Coffee } from 'lucide-react';
import { Button } from '../Button';

export const AccountSettings: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({
    isDarkMode,
    toggleTheme,
}) => {
    const [notifications, setNotifications] = useState({
        emailOnApply: true,
        emailOnComment: false,
        dailyDigest: true,
        realtime: false,
    });

    const [timezone, setTimezone] = useState('America/Los_Angeles');
    const [oooMode, setOooMode] = useState(false);
    const [oooEndDate, setOooEndDate] = useState('');

    const handleSave = () => {
        alert('Preferences saved!');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                    Account Settings
                </h1>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
                    Configure how the application behaves for you
                </p>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Notifications
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl">
                        <div>
                            <p className="font-medium text-edluar-dark dark:text-edluar-cream">
                                Email me when a candidate applies
                            </p>
                            <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                Get instant notifications for new applications
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailOnApply}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, emailOnApply: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-edluar-moss/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edluar-moss"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl">
                        <div>
                            <p className="font-medium text-edluar-dark dark:text-edluar-cream">
                                Email me when a team member comments
                            </p>
                            <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                Stay updated on collaboration activity
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailOnComment}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, emailOnComment: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-edluar-moss/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edluar-moss"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl">
                        <div>
                            <p className="font-medium text-edluar-dark dark:text-edluar-cream">
                                Daily digest
                            </p>
                            <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                                Receive a summary email once per day
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.dailyDigest}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, dailyDigest: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-edluar-moss/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edluar-moss"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Theme */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Appearance
                </h2>
                <div className="flex items-center justify-between p-4 bg-edluar-cream/50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span className="font-medium text-edluar-dark dark:text-edluar-cream">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-edluar-moss text-white rounded-lg hover:bg-edluar-dark transition-colors"
                    >
                        Toggle
                    </button>
                </div>
            </div>

            {/* Timezone */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-4">
                    Timezone
                </h2>
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-edluar-moss" />
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="flex-1 px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                    >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                </div>
                <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 mt-2">
                    This ensures interview invites are sent in the correct time zone
                </p>
            </div>

            {/* Out of Office Mode */}
            <div className="bg-white dark:bg-edluar-surface rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-edluar-moss" />
                        <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream">
                            Out of Office Mode
                        </h2>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={oooMode}
                            onChange={(e) => setOooMode(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-edluar-moss/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edluar-moss"></div>
                    </label>
                </div>
                {oooMode && (
                    <div className="space-y-3">
                        <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">
                            Pauses notifications and auto-declines new interview requests
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-edluar-dark dark:text-edluar-cream mb-2">
                                Return Date
                            </label>
                            <input
                                type="date"
                                value={oooEndDate}
                                onChange={(e) => setOooEndDate(e.target.value)}
                                className="w-full px-4 py-2 bg-edluar-cream/50 dark:bg-black/20 border border-edluar-pale dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} variant="primary" size="md">
                    Save Preferences
                </Button>
            </div>
        </div>
    );
};
