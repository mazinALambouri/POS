import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { ProfileMenu } from '../common/ProfileMenu';

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const isOnline = useOnlineStatus();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        NexusPOS
                    </h1>
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/"
                            className={`flex items - center gap - 2 px - 4 py - 2 rounded - lg transition - colors ${location.pathname === '/'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                } `}
                        >
                            <ShoppingCart size={20} />
                            <span className="font-medium">POS Terminal</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`flex items - center gap - 2 px - 4 py - 2 rounded - lg transition - colors ${location.pathname === '/dashboard'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                } `}
                        >
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`flex items - center gap - 2 px - 3 py - 1.5 rounded - full text - sm font - medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        } `}>
                        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                        {isOnline ? 'Online' : 'Offline Mode'}
                    </div>

                    <ProfileMenu />
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};
