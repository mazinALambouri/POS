import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { bankAccounts } from '../data/mockDb';

const router = Router();

// Get all bank accounts
router.get('/', authenticateToken, requireRole('admin'), (req, res) => {
    const companyAccounts = bankAccounts.filter(b => b.companyId === req.user?.companyId);
    res.json(companyAccounts);
});

export default router;
