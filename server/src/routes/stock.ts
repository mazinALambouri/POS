import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { stockMovements, products } from '../data/mockDb';

const router = Router();

// Get stock movements
router.get('/', authenticateToken, requireRole('admin'), (req, res) => {
    const companyMovements = stockMovements.filter(m => m.companyId === req.user?.companyId);
    res.json(companyMovements);
});

// Create stock movement (adjustment)
router.post('/', authenticateToken, requireRole('admin'), (req, res) => {
    const { productId, type, quantity, reason } = req.body;

    // Ensure product belongs to company
    const product = products.find(p => p.id === productId && p.companyId === req.user?.companyId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const movement = {
        id: crypto.randomUUID(),
        companyId: req.user?.companyId!,
        productId,
        productName: product.name,
        type,
        quantity,
        reason,
        date: new Date().toISOString()
    };

    // Update product stock
    if (type === 'in') {
        product.stock += quantity;
    } else if (type === 'out') {
        product.stock -= quantity;
    }

    stockMovements.push(movement);
    res.status(201).json(movement);
});

export default router;
