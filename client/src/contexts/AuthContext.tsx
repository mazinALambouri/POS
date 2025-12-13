import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    role: 'developer' | 'admin' | 'cashier';
    name: string;
    companyId?: string;
}

interface Company {
    id: string;
    name: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        logoUrl?: string;
    };
}

interface AuthContextType {
    user: User | null;
    company: Company | null;
    token: string | null;
    login: (token: string, user: User, company: Company | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedCompany = localStorage.getItem('company');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedCompany) {
            const parsedCompany = JSON.parse(storedCompany);
            setCompany(parsedCompany);
            // Apply theme
            document.documentElement.style.setProperty('--color-primary', parsedCompany.theme.primaryColor);
            document.documentElement.style.setProperty('--color-secondary', parsedCompany.theme.secondaryColor);
        }

        if (token) {
            try {
                // Ensure axios headers are set
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (e) {
                logout();
            }
        }
    }, [token]);

    const login = (newToken: string, newUser: User, newCompany: Company | null) => {
        setToken(newToken);
        setUser(newUser);
        setCompany(newCompany);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        if (newCompany) {
            localStorage.setItem('company', JSON.stringify(newCompany));
            // Apply theme
            document.documentElement.style.setProperty('--color-primary', newCompany.theme.primaryColor);
            document.documentElement.style.setProperty('--color-secondary', newCompany.theme.secondaryColor);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setCompany(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        // Reset theme
        document.documentElement.style.removeProperty('--color-primary');
        document.documentElement.style.removeProperty('--color-secondary');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, company, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
