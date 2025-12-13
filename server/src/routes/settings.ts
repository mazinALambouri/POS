import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { settings } from '../data/mockDb';

const router = Router();

// Get settings
router.get('/', authenticateToken, (req, res) => {
    const companySettings = settings.find(s => s.companyId === req.user?.companyId);
    res.json(companySettings || {});
});

// Update settings
router.put('/', authenticateToken, requireRole('admin'), (req, res) => {
    const index = settings.findIndex(s => s.companyId === req.user?.companyId);
    if (index !== -1) {
        settings[index] = { ...settings[index], ...req.body };
        res.json(settings[index]);
    } else {
        // Create if not exists
        const newSettings = {
            companyId: req.user?.companyId!,
            ...req.body
        };
        settings.push(newSettings);
        res.json(newSettings);
    }
});

export default router;
