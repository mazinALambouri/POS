import axios from 'axios';
import { type Transaction, type Product } from '../db/db';

const API_URL = 'http://localhost:3000/api';

export const api = {
    async syncTransactions(transactions: Transaction[]) {
        return axios.post(`${API_URL}/sync/transactions`, { transactions });
    },

    async fetchProductUpdates(lastSyncTimestamp: string | null) {
        return axios.get<{ products: Product[], timestamp: string }>(`${API_URL}/sync/products`, {
            params: { lastSync: lastSyncTimestamp }
        });
    },

    // Admin API
    async getProducts() {
        return axios.get<Product[]>(`${API_URL}/products`);
    },

    async createProduct(product: Omit<Product, 'id' | 'updatedAt'>) {
        return axios.post<Product>(`${API_URL}/products`, product);
    },

    async updateProduct(id: string, product: Partial<Product>) {
        return axios.put<Product>(`${API_URL}/products/${id}`, product);
    },

    async deleteProduct(id: string) {
        return axios.delete(`${API_URL}/products/${id}`);
    },

    async getUsers() {
        return axios.get<any[]>(`${API_URL}/auth/users`);
    },

    async createCashier(cashier: { email: string; password: string; name: string }) {
        return axios.post(`${API_URL}/auth/users/cashier`, cashier);
    },

    async getTransactions() {
        return axios.get<any[]>(`${API_URL}/transactions`);
    },

    // Expenses
    async getExpenses() {
        return axios.get<any[]>(`${API_URL}/expenses`);
    },
    async createExpense(expense: any) {
        return axios.post(`${API_URL}/expenses`, expense);
    },
    async deleteExpense(id: string) {
        return axios.delete(`${API_URL}/expenses/${id}`);
    },

    // Bank
    async getBankAccounts() {
        return axios.get<any[]>(`${API_URL}/bank`);
    },

    // Settings
    async getSettings() {
        return axios.get<any>(`${API_URL}/settings`);
    },
    async updateSettings(settings: any) {
        return axios.put(`${API_URL}/settings`, settings);
    },

    // Stock
    async getStockMovements() {
        return axios.get<any[]>(`${API_URL}/stock`);
    },
    async createStockMovement(movement: any) {
        return axios.post(`${API_URL}/stock`, movement);
    },

    // Developer
    async getCompanies() {
        return axios.get<any[]>(`${API_URL}/developer/companies`);
    },
    async createCompany(company: any) {
        return axios.post(`${API_URL}/developer/companies`, company);
    },
    async createCompanyAdmin(companyId: string, admin: any) {
        return axios.post(`${API_URL}/developer/companies/${companyId}/admin`, admin);
    }
};
