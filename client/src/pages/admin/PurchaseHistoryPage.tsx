import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { type Transaction } from '../../db/db';
import { Search, Calendar, DollarSign, CreditCard, Banknote } from 'lucide-react';

export const PurchaseHistoryPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.getTransactions();
                // Sort by date desc
                const sorted = res.data.sort((a: Transaction, b: Transaction) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setTransactions(sorted);
            } catch (error) {
                console.error('Failed to fetch transactions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(t =>
        t.id?.toLowerCase().includes(search.toLowerCase()) ||
        t.cashierId.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <DollarSign className="text-green-600" size={20} />
                    <span className="text-sm text-gray-500">Total Revenue:</span>
                    <span className="font-bold text-gray-900">${totalRevenue.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Transaction ID or Cashier..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading transactions...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Cashier</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(t.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.id?.slice(0, 8)}...</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{t.cashierId}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {t.items.length} items
                                        <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                            {t.items.map(i => i.name).join(', ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${t.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {t.paymentMethod === 'cash' ? <Banknote size={12} /> : <CreditCard size={12} />}
                                            {t.paymentMethod.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                                        ${t.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
