import { User, Product, Expense, BankAccount, StoreSettings, StockMovement, Company } from '../models/types';
import bcrypt from 'bcryptjs';

// Mock Data Store

export const companies: Company[] = [
    {
        id: '1',
        name: 'NexusPOS Coffee & Co.',
        slug: 'nexus-coffee',
        theme: {
            primaryColor: '#2563eb', // blue-600
            secondaryColor: '#1e40af' // blue-800
        },
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Green Grocer',
        slug: 'green-grocer',
        theme: {
            primaryColor: '#16a34a', // green-600
            secondaryColor: '#15803d' // green-700
        },
        createdAt: new Date().toISOString()
    }
];

export const users: User[] = [
    {
        id: 'admin-1',
        username: 'storeowner',
        email: 'admin@mystore.com',
        passwordHash: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        name: 'Store Owner',
        companyId: '1'
    }
];

export const products: Product[] = [
    { id: '1', companyId: '1', name: 'Premium Coffee Beans', sku: 'CB001', price: 18.50, stock: 50, category: 'Beverage', taxRate: 0.1, updatedAt: new Date().toISOString() },
    { id: '2', companyId: '1', name: 'Organic Green Tea', sku: 'GT002', price: 12.00, stock: 30, category: 'Beverage', taxRate: 0.1, updatedAt: new Date().toISOString() },
    { id: '3', companyId: '1', name: 'Ceramic Mug', sku: 'CM003', price: 8.99, stock: 100, category: 'Merch', taxRate: 0.1, updatedAt: new Date().toISOString() },
    { id: '4', companyId: '1', name: 'Oat Milk', sku: 'OM004', price: 4.50, stock: 20, category: 'Dairy', taxRate: 0.05, updatedAt: new Date().toISOString() },
    // Company 2 Products
    { id: '5', companyId: '2', name: 'Fresh Apples', sku: 'AP001', price: 2.50, stock: 100, category: 'Produce', taxRate: 0.0, updatedAt: new Date().toISOString() },
];

export const transactions: any[] = [];

export const expenses: Expense[] = [
    { id: '1', companyId: '1', description: 'Monthly Rent', amount: 1500, category: 'Rent', date: new Date().toISOString(), paymentMethod: 'Bank Transfer' },
    { id: '2', companyId: '1', description: 'Electricity Bill', amount: 250, category: 'Utilities', date: new Date().toISOString(), paymentMethod: 'Card' },
];

export const bankAccounts: BankAccount[] = [
    { id: '1', companyId: '1', name: 'Main Business Account', type: 'Checking', balance: 25000.00, accountNumber: '****1234' },
    { id: '2', companyId: '1', name: 'Savings Reserve', type: 'Savings', balance: 10000.00, accountNumber: '****5678' },
];

export let settings: StoreSettings[] = [
    {
        companyId: '1',
        storeName: 'NexusPOS Coffee & Co.',
        address: '123 Tech Boulevard, Innovation City',
        phone: '(555) 012-3456',
        currency: 'USD',
        taxRate: 0.10
    },
    {
        companyId: '2',
        storeName: 'Green Grocer Inc.',
        address: '456 Farm Lane, Countryside',
        phone: '(555) 987-6543',
        currency: 'USD',
        taxRate: 0.05
    }
];

export const stockMovements: StockMovement[] = [
    { id: '1', companyId: '1', productId: '1', productName: 'Premium Coffee Beans', type: 'in', quantity: 50, reason: 'Initial Stock', date: new Date().toISOString() }
];
