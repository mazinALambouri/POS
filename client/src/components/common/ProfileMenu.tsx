import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/login');
    };

    // Update menu position when opened
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, [isOpen]);

    // Handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const dropdownMenu = isOpen ? createPortal(
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/10"
                style={{ zIndex: 9998 }}
                onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <div
                ref={menuRef}
                className="fixed w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 overflow-hidden"
                style={{
                    zIndex: 9999,
                    top: `${menuPosition.top}px`,
                    right: `${menuPosition.right}px`
                }}
            >
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <p className="text-base font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-600 truncate capitalize mt-1">
                        <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                            {user?.role}
                        </span>
                    </p>
                    {user?.companyId && (
                        <p className="text-xs text-gray-500 mt-2 font-mono">
                            Company: {user.companyId}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all hover:translate-x-1"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </>,
        document.body
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold hover:bg-indigo-700 hover:ring-4 hover:ring-indigo-200 transition-all shadow-md"
                title="Account Menu"
            >
                {user?.name?.charAt(0).toUpperCase() || <UserIcon size={20} />}
            </button>
            {dropdownMenu}
        </>
    );
};
