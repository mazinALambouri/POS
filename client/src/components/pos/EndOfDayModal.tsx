import React, { useEffect, useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
import { db } from '../../db/db';

interface EndOfDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    cashierId: string;
}

export const EndOfDayModal: React.FC<EndOfDayModalProps> = ({ isOpen, onClose, cashierId }) => {
    const [summary, setSummary] = useState({
        totalSales: 0,
        cashSales: 0,
        cardSales: 0,
        transactionCount: 0
    });

    useEffect(() => {
        if (isOpen) {
            calculateEndOfDay();
        }
    }, [isOpen]);

    const calculateEndOfDay = async () => {
        // Get start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const transactions = await db.transactions
            .where('timestamp')
            .above(startOfDay.toISOString())
            .toArray();

        // Filter by cashier
        const cashierTransactions = transactions.filter(t => t.cashierId === cashierId);

        const stats = cashierTransactions.reduce((acc, t) => {
            acc.totalSales += t.total;
            acc.transactionCount += 1;
            if (t.paymentMethod === 'cash') acc.cashSales += t.total;
            if (t.paymentMethod === 'card') acc.cardSales += t.total;
            return acc;
        }, { totalSales: 0, cashSales: 0, cardSales: 0, transactionCount: 0 });

        setSummary(stats);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">End of Day Reconciliation</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium mb-1">Total Sales</p>
                        <p className="text-3xl font-bold text-blue-900">${summary.totalSales.toFixed(2)}</p>
                        <p className="text-xs text-blue-500 mt-1">{summary.transactionCount} transactions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                                <Banknote size={18} />
                                <span className="text-sm font-medium">Cash</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">${summary.cashSales.toFixed(2)}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                                <CreditCard size={18} />
                                <span className="text-sm font-medium">Card</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">${summary.cardSales.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <button
                            onClick={() => {
                                alert('Register closed successfully. Report generated.');
                                onClose();
                            }}
                            className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Close Register & Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
