import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { transactions } from '../data/mockDb';

const router = Router();

// Get all transactions (Admin only)
router.get('/', authenticateToken, requireRole('admin'), (req, res) => {
    // Filter transactions by companyId (assuming transactions have companyId, which we need to ensure)
    // We need to update the sync route to add companyId to transactions first.
    const companyTransactions = transactions.filter(t => t.companyId === req.user?.companyId);
    res.json(companyTransactions);
});

export default router;
