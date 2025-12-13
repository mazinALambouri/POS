import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ArrowUpRight, ArrowDownLeft, Package } from 'lucide-react';

interface StockMovement {
    id: string;
    productName: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    date: string;
}

export const StockPage: React.FC = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await api.getStockMovements();
                setMovements(res.data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (error) {
                console.error('Failed to fetch stock movements', error);
            }
        };
        fetchStock();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Stock Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Movements</p>
                            <h3 className="text-2xl font-bold">{movements.length}</h3>
                        </div>
                    </div>
                </div>
                {/* Add more stats like "Low Stock Items" if we fetch products here too */}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Stock History</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {movements.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {new Date(m.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{m.productName}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${m.type === 'in' ? 'bg-green-100 text-green-700' :
                                        m.type === 'out' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {m.type === 'in' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                        {m.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">{m.quantity}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{m.reason}</td>
                            </tr>
                        ))}
                        {movements.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No stock movements recorded.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
