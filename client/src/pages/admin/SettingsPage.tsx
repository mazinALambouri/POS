import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        address: '',
        phone: '',
        currency: 'USD',
        taxRate: 0.1
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.getSettings();
                setSettings(res.data);
            } catch (error) {
                console.error('Failed to fetch settings', error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateSettings(settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings', error);
            setMessage('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Store Settings</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={settings.storeName}
                        onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={settings.address}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={settings.phone}
                        onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={settings.currency}
                            onChange={e => setSettings({ ...settings, currency: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (decimal)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={settings.taxRate}
                            onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </span>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
