import { forwardRef } from 'react';
import { type Transaction } from '../../db/db';

interface ReceiptProps {
    transaction: Transaction;
    storeInfo?: {
        name: string;
        address: string;
        phone: string;
    };
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ transaction, storeInfo }, ref) => {
    return (
        <div ref={ref} className="p-4 bg-white text-black font-mono text-sm w-[300px] mx-auto hidden print:block">
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold">{storeInfo?.name || 'NexusPOS Store'}</h1>
                <p>{storeInfo?.address || '123 Commerce St, Tech City'}</p>
                <p>{storeInfo?.phone || '(555) 123-4567'}</p>
            </div>

            <div className="border-b border-black mb-2 pb-2">
                <p>Date: {new Date(transaction.timestamp).toLocaleString()}</p>
                <p>Trans ID: {transaction.id?.slice(0, 8)}</p>
                <p>Cashier: {transaction.cashierId}</p>
            </div>

            <div className="mb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="pb-1">Item</th>
                            <th className="pb-1 text-right">Qty</th>
                            <th className="pb-1 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-1">{item.name}</td>
                                <td className="py-1 text-right">{item.quantity}</td>
                                <td className="py-1 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-black pt-2 space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${transaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${transaction.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span>${transaction.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-4 text-center border-t border-black pt-2">
                <p>Payment Method: {transaction.paymentMethod.toUpperCase()}</p>
                <p className="mt-2">Thank you for shopping with us!</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';
