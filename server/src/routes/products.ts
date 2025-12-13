import { Router } from 'express';
import { Product } from '../models/types';
import { authenticateToken, requireRole } from '../middleware/auth';
import { products } from '../data/mockDb';

const router = Router();

// Get all products (public/protected)
router.get('/', authenticateToken, (req, res) => {
    const companyProducts = products.filter(p => p.companyId === req.user?.companyId);
    res.json(companyProducts);
});

// Create product (Admin only)
router.post('/', authenticateToken, requireRole('admin'), (req, res) => {
    const product = {
        id: crypto.randomUUID(),
        companyId: req.user?.companyId!,
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    products.push(product);
    res.status(201).json(product);
});

// Update product
router.put('/:id', authenticateToken, requireRole('admin'), (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id && p.companyId === req.user?.companyId);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Delete product
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id && p.companyId === req.user?.companyId);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

export default router;
