import Dexie, { type Table } from 'dexie';

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    taxRate: number;
    updatedAt: string;
}

export interface TransactionItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    tax: number;
    discount: number;
}

export interface Transaction {
    id?: string; // UUID
    items: TransactionItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: 'cash' | 'card';
    timestamp: string;
    cashierId: string;
    synced: number; // 0 for false, 1 for true (Dexie indexes booleans as 0/1 better sometimes, or just use boolean)
}

export interface SyncQueueItem {
    id?: number;
    type: 'TRANSACTION' | 'PRODUCT_UPDATE';
    payload: any;
    timestamp: string;
}

export class POSDatabase extends Dexie {
    products!: Table<Product>;
    transactions!: Table<Transaction>;
    syncQueue!: Table<SyncQueueItem>;

    constructor() {
        super('POSDatabase');
        this.version(1).stores({
            products: 'id, sku, category, name',
            transactions: 'id, timestamp, synced, cashierId',
            syncQueue: '++id, type, timestamp'
        });
    }
}

export const db = new POSDatabase();
