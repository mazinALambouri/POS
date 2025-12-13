import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingBag, BarChart3, Landmark, Receipt, Settings } from 'lucide-react';
import { ProfileMenu } from '../common/ProfileMenu';

export const AdminLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        NexusPOS
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/inventory"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/inventory'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Package size={20} />
                        <span className="font-medium">Inventory</span>
                    </Link>
                    <Link
                        to="/admin/purchases"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/purchases'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingBag size={20} />
                        <span className="font-medium">Purchases</span>
                    </Link>
                    <Link
                        to="/admin/reports"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/reports' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart3 size={20} />
                        <span className="font-medium">Reports</span>
                    </Link>
                    <Link
                        to="/admin/bank"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/bank' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Landmark size={20} />
                        <span className="font-medium">Bank</span>
                    </Link>
                    <Link
                        to="/admin/expenses"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/expenses' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Receipt size={20} />
                        <span className="font-medium">Expenses</span>
                    </Link>
                    <Link
                        to="/admin/stock"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/stock' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Package size={20} />
                        <span className="font-medium">Stock</span>
                    </Link>
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/users'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users size={20} />
                        <span className="font-medium">Users</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {location.pathname === '/admin' ? 'Dashboard' :
                            location.pathname.split('/').pop()?.charAt(0).toUpperCase()! + location.pathname.split('/').pop()?.slice(1)!}
                    </h2>
                    <ProfileMenu />
                </header>
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
