import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, DollarSign, Calendar } from 'lucide-react';

interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: string;
}

export const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'Rent',
        paymentMethod: 'Cash'
    });

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const res = await api.getExpenses();
            setExpenses(res.data);
        } catch (error) {
            console.error('Failed to load expenses', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createExpense({
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            });
            setIsModalOpen(false);
            setNewExpense({ description: '', amount: '', category: 'Rent', paymentMethod: 'Cash' });
            loadExpenses();
        } catch (error) {
            console.error('Failed to create expense', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                await api.deleteExpense(id);
                loadExpenses();
            } catch (error) {
                console.error('Failed to delete expense', error);
            }
        }
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-500 mr-2">Total:</span>
                        <span className="font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add Expense
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {expenses.map(e => (
                            <tr key={e.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        {new Date(e.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{e.description}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                        {e.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{e.paymentMethod}</td>
                                <td className="px-6 py-4 text-right font-bold text-red-600">
                                    -${e.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(e.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newExpense.description}
                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                    >
                                        <option>Rent</option>
                                        <option>Utilities</option>
                                        <option>Salaries</option>
                                        <option>Inventory</option>
                                        <option>Maintenance</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newExpense.paymentMethod}
                                        onChange={e => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                                    >
                                        <option>Cash</option>
                                        <option>Card</option>
                                        <option>Bank Transfer</option>
                                    </select>
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
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
