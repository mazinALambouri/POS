import React, { useState, useRef } from 'react';
import { Search, Scan, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, FileText, Printer, CheckCircle } from 'lucide-react';
import { db, type Product, type TransactionItem, type Transaction } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSync } from '../contexts/SyncContext';
import { useAuth } from '../contexts/AuthContext';
import { EndOfDayModal } from '../components/pos/EndOfDayModal';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '../components/pos/Receipt';

export const POSPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<TransactionItem[]>([]);
    const { triggerSync } = useSync();
    const { user } = useAuth();
    const [isEODOpen, setIsEODOpen] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    // Fetch products from local DB
    const products = useLiveQuery(
        () => db.products
            .where('name').startsWithIgnoreCase(searchQuery)
            .or('sku').startsWith(searchQuery)
            .limit(20)
            .toArray(),
        [searchQuery]
    );

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                tax: product.price * product.taxRate,
                discount: 0
            }];
        });
    };

    // Barcode Scanner Integration
    useBarcodeScanner(async (barcode) => {
        // Find product by SKU (exact match)
        const product = await db.products.where('sku').equals(barcode).first();
        if (product) {
            addToCart(product);
            // Optional: Play beep sound
        } else {
            // Maybe show a toast "Product not found"
            console.log('Product not found for barcode:', barcode);
        }
    });

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = cart.reduce((sum, item) => sum + (item.tax * item.quantity), 0);
    const total = subtotal + tax;

    const handlePayment = async (method: 'cash' | 'card') => {
        if (cart.length === 0) return;

        const transaction: Transaction = {
            id: crypto.randomUUID(),
            items: cart,
            subtotal,
            tax,
            total,
            paymentMethod: method,
            timestamp: new Date().toISOString(),
            cashierId: user?.id || 'anonymous',
            synced: 0
        };

        try {
            // 1. Save transaction locally
            await db.transactions.add(transaction);

            // 2. Update local stock immediately for better UX
            for (const item of cart) {
                const product = await db.products.get(item.productId);
                if (product) {
                    await db.products.update(item.productId, { stock: product.stock - item.quantity });
                }
            }

            // 3. Clear cart and show success
            setCart([]);
            setLastTransaction(transaction);
            setShowSuccessModal(true);

            // 4. Trigger sync (fire and forget)
            triggerSync();

        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Failed to process transaction. Please try again.');
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Left Side: Product Catalog */}
            <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200">
                <div className="p-4 bg-white border-b border-gray-200 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                            <Scan size={20} />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsEODOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                    >
                        <FileText size={20} />
                        End of Day
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products?.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="flex flex-col p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                            >
                                <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                                    {/* Placeholder for image */}
                                    <div className="text-4xl font-bold text-gray-200">
                                        {product.name.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            </button>
                        ))}
                        {(!products || products.length === 0) && (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>No products found</p>
                                <button
                                    onClick={async () => {
                                        // Seed some data for demo
                                        await db.products.bulkPut([
                                            { id: '1', name: 'Premium Coffee Beans', sku: 'CB001', price: 18.50, stock: 50, category: 'Beverage', taxRate: 0.1, updatedAt: new Date().toISOString() },
                                            { id: '2', name: 'Organic Green Tea', sku: 'GT002', price: 12.00, stock: 30, category: 'Beverage', taxRate: 0.1, updatedAt: new Date().toISOString() },
                                            { id: '3', name: 'Ceramic Mug', sku: 'CM003', price: 8.99, stock: 100, category: 'Merch', taxRate: 0.1, updatedAt: new Date().toISOString() },
                                            { id: '4', name: 'Oat Milk', sku: 'OM004', price: 4.50, stock: 20, category: 'Dairy', taxRate: 0.05, updatedAt: new Date().toISOString() },
                                        ]);
                                        window.location.reload();
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                >
                                    Seed Demo Data
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Cart & Checkout */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">Current Order</h2>
                    <p className="text-sm text-gray-500">Order #12345</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.map(item => (
                        <div key={item.productId} className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <p className="text-sm text-blue-600 font-medium">${item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.productId, -1)}
                                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, 1)}
                                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ShoppingCart size={48} className="mb-4 opacity-20" />
                            <p>Cart is empty</p>
                            <p className="text-sm mt-2">Scan barcode or select items</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                            onClick={() => handlePayment('cash')}
                            disabled={cart.length === 0}
                            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Banknote className="mb-1 text-gray-500 group-hover:text-blue-600" size={24} />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Cash</span>
                        </button>
                        <button
                            onClick={() => handlePayment('card')}
                            disabled={cart.length === 0}
                            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="mb-1 text-gray-500 group-hover:text-blue-600" size={24} />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Card</span>
                        </button>
                    </div>

                    <button
                        onClick={() => handlePayment('card')}
                        disabled={cart.length === 0}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Process Payment
                    </button>
                </div>
            </div>

            <EndOfDayModal
                isOpen={isEODOpen}
                onClose={() => setIsEODOpen(false)}
                cashierId={user?.id || ''}
            />

            {/* Success Modal */}
            {showSuccessModal && lastTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-6">Transaction ID: {lastTransaction.id?.slice(0, 8)}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                            >
                                New Sale
                            </button>
                            <button
                                onClick={() => handlePrint()}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <Printer size={20} />
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Receipt for Printing */}
            <div className="hidden">
                {lastTransaction && <Receipt ref={receiptRef} transaction={lastTransaction} />}
            </div>
        </div>
    );
};
