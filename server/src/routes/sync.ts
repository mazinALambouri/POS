import { Router } from 'express';
import { products, transactions } from '../data/mockDb';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/transactions', (req, res) => {
    const newTransactions = req.body.transactions;
    console.log('Received transactions:', newTransactions.length);

    newTransactions.forEach((t: any) => {
        transactions.push(t);
        // Update stock
        t.items.forEach((item: any) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                product.stock -= item.quantity;
                product.updatedAt = new Date().toISOString();
            }
        });
    });

    res.json({ success: true, message: 'Transactions synced' });
});

router.get('/products', (req, res) => {
    const lastSync = req.query.lastSync as string;

    let updates = products;
    if (lastSync) {
        updates = products.filter(p => new Date(p.updatedAt) > new Date(lastSync));
    }

    res.json({
        products: updates,
        timestamp: new Date().toISOString()
    });
});

export default router;
