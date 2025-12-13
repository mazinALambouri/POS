import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { db } from '../db/db';
import { api } from '../services/api';

interface SyncContextType {
    isSyncing: boolean;
    lastSyncTime: string | null;
    syncError: string | null;
    triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isOnline = useOnlineStatus();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(localStorage.getItem('lastSyncTime'));
    const [syncError, setSyncError] = useState<string | null>(null);

    const syncUp = async () => {
        try {
            const pendingTransactions = await db.transactions.where('synced').equals(0).toArray();
            if (pendingTransactions.length === 0) return;

            await api.syncTransactions(pendingTransactions);

            // Mark as synced
            await db.transactions.bulkPut(pendingTransactions.map(t => ({ ...t, synced: 1 })));
        } catch (error) {
            console.error('Sync Up failed:', error);
            throw error;
        }
    };

    const syncDown = async () => {
        try {
            const response = await api.fetchProductUpdates(lastSyncTime);
            const { products, timestamp } = response.data;

            if (products.length > 0) {
                await db.products.bulkPut(products);
            }

            setLastSyncTime(timestamp);
            localStorage.setItem('lastSyncTime', timestamp);
        } catch (error) {
            console.error('Sync Down failed:', error);
            throw error;
        }
    };

    const triggerSync = async () => {
        if (!isOnline || isSyncing) return;

        setIsSyncing(true);
        setSyncError(null);

        try {
            await syncUp();
            await syncDown();
        } catch (error) {
            setSyncError('Sync failed. Will retry later.');
        } finally {
            setIsSyncing(false);
        }
    };

    // Auto-sync when coming online
    useEffect(() => {
        if (isOnline) {
            triggerSync();
        }
    }, [isOnline]);

    // Periodic sync (every 5 minutes)
    useEffect(() => {
        if (!isOnline) return;

        const interval = setInterval(() => {
            triggerSync();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isOnline]);

    return (
        <SyncContext.Provider value={{ isSyncing, lastSyncTime, syncError, triggerSync }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
};
