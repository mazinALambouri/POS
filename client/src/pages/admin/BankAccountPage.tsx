import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Landmark, CreditCard } from 'lucide-react';

interface BankAccount {
    id: string;
    name: string;
    type: string;
    balance: number;
    accountNumber: string;
}

export const BankAccountPage: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.getBankAccounts();
                setAccounts(res.data);
            } catch (error) {
                console.error('Failed to fetch bank accounts', error);
            }
        };
        fetchAccounts();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Bank Accounts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(account => (
                    <div key={account.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <Landmark size={24} />
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
                                {account.type}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{account.name}</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-4">${account.balance.toLocaleString()}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} />
                                <span>{account.accountNumber}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future transaction history */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
                <div className="text-center py-8 text-gray-400">
                    <p>Transaction history integration coming soon.</p>
                </div>
            </div>
        </div>
    );
};
