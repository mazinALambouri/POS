import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { companies, users } from '../data/mockDb';
import bcrypt from 'bcryptjs';

const router = Router();

// Middleware to ensure only developers can access these routes
router.use(authenticateToken, requireRole('developer'));

// Get all companies
router.get('/companies', (req, res) => {
    res.json(companies);
});

// Create a new company
router.post('/companies', (req, res) => {
    const { name, slug, theme } = req.body;

    if (companies.find(c => c.slug === slug)) {
        return res.status(400).json({ message: 'Company slug already exists' });
    }

    const newCompany = {
        id: crypto.randomUUID(),
        name,
        slug,
        theme: theme || {
            primaryColor: '#2563eb',
            secondaryColor: '#1e40af'
        },
        createdAt: new Date().toISOString()
    };

    companies.push(newCompany);
    res.status(201).json(newCompany);
});

// Create an admin for a company
router.post('/companies/:id/admin', (req, res) => {
    const { id } = req.params;
    const { username, password, name } = req.body;

    const company = companies.find(c => c.id === id);
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = {
        id: crypto.randomUUID(),
        username,
        passwordHash: bcrypt.hashSync(password, 10),
        role: 'admin' as const,
        name,
        companyId: id
    };

    users.push(newUser);
    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        companyId: newUser.companyId
    });
});

// Update company theme
router.put('/companies/:id/theme', (req, res) => {
    const { id } = req.params;
    const { primaryColor, secondaryColor, logoUrl } = req.body;

    const company = companies.find(c => c.id === id);
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    company.theme = {
        primaryColor,
        secondaryColor,
        logoUrl
    };

    res.json(company);
});

export default router;
