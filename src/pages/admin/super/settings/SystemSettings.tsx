import React, { useState } from 'react';
import {
    HiSave,
    HiGlobeAlt,
    HiShieldCheck,
    HiDatabase,
    HiRefresh
} from 'react-icons/hi';

const SystemSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        siteName: 'Faith Assembly Intranet',
        maintenanceMode: false,
        allowRegistration: true,
        defaultMetaTitle: 'Faith Assembly | Welcome Home',
        defaultMetaDesc: 'Join us for service this Sunday.',
        forcePasswordReset: false,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Mock API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const handleBackup = () => {
        alert('Starting database backup download...');
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <p className="text-slate-500">Configure global application parameters.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm disabled:opacity-70"
                >
                    {isSaving ? <HiRefresh className="w-5 h-5 animate-spin" /> : <HiSave className="w-5 h-5" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                            <HiGlobeAlt className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">General</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-800">Maintenance Mode</label>
                                <p className="text-xs text-slate-500">Disable access for non-admins.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-800">Public Registration</label>
                                <p className="text-xs text-slate-500">Allow new users to sign up.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="allowRegistration"
                                    checked={settings.allowRegistration}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security & Data */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <HiDatabase className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Data & Backup</h2>
                        </div>

                        <div className="text-sm text-slate-600 mb-4">
                            Last backup: <span className="font-mono font-medium">Never</span>
                        </div>
                        <button
                            onClick={handleBackup}
                            className="w-full py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
                        >
                            <HiDatabase className="w-4 h-4" />
                            Download Database Backup (.json)
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                <HiShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Security Zone</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-slate-800">Force Password Reset</label>
                                <p className="text-xs text-slate-500">Require all users to reset password on next login.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="forcePasswordReset"
                                    checked={settings.forcePasswordReset}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
