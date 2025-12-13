import { Link, Outlet, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { ProfileMenu } from '../common/ProfileMenu';

export const DeveloperLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">NexusPOS Dev</h1>
                    <p className="text-sm text-gray-500 mt-1">System Administration</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/developer"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/developer' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Building2 size={20} />
                        <span className="font-medium">Companies</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {location.pathname === '/developer' ? 'Companies' : 'Developer Portal'}
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
