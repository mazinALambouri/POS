export interface Company {
    id: string;
    name: string;
    slug: string; // unique identifier for URL or login
    theme: {
        primaryColor: string;
        secondaryColor: string;
        logoUrl?: string;
    };
    createdAt: string;
}

export interface User {
    id: string;
    username: string;
    passwordHash: string;
    role: 'developer' | 'admin' | 'cashier';
    name: string;
    companyId?: string; // developer might not have a companyId or could be null
}

export interface Product {
    id: string;
    companyId: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    taxRate: number;
    updatedAt: string;
}

export interface Expense {
    id: string;
    companyId: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: string;
}

export interface BankAccount {
    id: string;
    companyId: string;
    name: string;
    type: string;
    balance: number;
    accountNumber: string;
}

export interface StoreSettings {
    companyId: string;
    storeName: string;
    address: string;
    phone: string;
    currency: string;
    taxRate: number;
}

export interface StockMovement {
    id: string;
    companyId: string;
    productId: string;
    productName: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    date: string;
}
