import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Plus, Building, Users } from 'lucide-react';

interface Company {
    id: string;
    name: string;
    slug: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
    };
    createdAt: string;
}

export const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    const [newCompany, setNewCompany] = useState({
        name: '',
        slug: '',
        theme: {
            primaryColor: '#2563eb',
            secondaryColor: '#1e40af'
        }
    });

    const [newAdmin, setNewAdmin] = useState({
        username: '',
        password: '',
        name: ''
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const res = await api.getCompanies();
            setCompanies(res.data);
        } catch (error) {
            console.error('Failed to load companies', error);
        }
    };

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCompany(newCompany);
            setIsModalOpen(false);
            setNewCompany({
                name: '',
                slug: '',
                theme: { primaryColor: '#2563eb', secondaryColor: '#1e40af' }
            });
            loadCompanies();
        } catch (error) {
            console.error('Failed to create company', error);
            alert('Failed to create company. Slug might be taken.');
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyId) return;
        try {
            await api.createCompanyAdmin(selectedCompanyId, newAdmin);
            setIsAdminModalOpen(false);
            setNewAdmin({ username: '', password: '', name: '' });
            alert('Admin created successfully');
        } catch (error) {
            console.error('Failed to create admin', error);
            alert('Failed to create admin. Username might be taken.');
        }
    };

    const openAdminModal = (companyId: string) => {
        setSelectedCompanyId(companyId);
        setIsAdminModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus size={20} />
                    Add Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => (
                    <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-2" style={{ background: `linear-gradient(to right, ${company.theme.primaryColor}, ${company.theme.secondaryColor})` }} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Building size={24} className="text-gray-600" />
                                </div>
                                <span className="text-xs font-mono text-gray-400">ID: {company.slug}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
                            <p className="text-sm text-gray-500 mb-6">Created {new Date(company.createdAt).toLocaleDateString()}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openAdminModal(company.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
                                >
                                    <Users size={16} />
                                    Add Admin
                                </button>
                                {/* Future: Edit Theme Button */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Company Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Company</h2>
                        <form onSubmit={handleCreateCompany} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newCompany.name}
                                    onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL identifier)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newCompany.slug}
                                    onChange={e => setNewCompany({ ...newCompany, slug: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            className="h-9 w-9 rounded cursor-pointer border-0"
                                            value={newCompany.theme.primaryColor}
                                            onChange={e => setNewCompany({ ...newCompany, theme: { ...newCompany.theme, primaryColor: e.target.value } })}
                                        />
                                        <span className="text-xs text-gray-500">{newCompany.theme.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            className="h-9 w-9 rounded cursor-pointer border-0"
                                            value={newCompany.theme.secondaryColor}
                                            onChange={e => setNewCompany({ ...newCompany, theme: { ...newCompany.theme, secondaryColor: e.target.value } })}
                                        />
                                        <span className="text-xs text-gray-500">{newCompany.theme.secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create Company
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            {isAdminModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create Company Admin</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newAdmin.name}
                                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newAdmin.username}
                                    onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newAdmin.password}
                                    onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAdminModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
