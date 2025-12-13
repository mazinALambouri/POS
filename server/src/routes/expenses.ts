import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { expenses } from '../data/mockDb';

const router = Router();

// Get all expenses
router.get('/', authenticateToken, requireRole('admin'), (req, res) => {
    const companyExpenses = expenses.filter(e => e.companyId === req.user?.companyId);
    res.json(companyExpenses);
});

// Create expense
router.post('/', authenticateToken, requireRole('admin'), (req, res) => {
    const expense = {
        id: crypto.randomUUID(),
        companyId: req.user?.companyId!,
        ...req.body,
        date: new Date().toISOString()
    };
    expenses.push(expense);
    res.status(201).json(expense);
});

// Delete expense
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res) => {
    const index = expenses.findIndex(e => e.id === req.params.id && e.companyId === req.user?.companyId);
    if (index !== -1) {
        expenses.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

export default router;
