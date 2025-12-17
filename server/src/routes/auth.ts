import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/types';
import { JWT_SECRET, authenticateToken, requireRole } from '../middleware/auth';
import { users } from '../data/mockDb';

const router = Router();

import { companies } from '../data/mockDb';

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, companyId: user.companyId },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    const company = user.companyId ? companies.find(c => c.id === user.companyId) : null;

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            name: user.name,
            companyId: user.companyId
        },
        company
    });
});

router.post('/register', (req, res) => {
    const { email, password, role, name, companyId } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        username: email.split('@')[0], // Use email prefix as username
        email,
        passwordHash: bcrypt.hashSync(password, 10),
        role: role || 'cashier',
        name: name || email.split('@')[0],
        companyId: companyId || undefined
    };

    users.push(newUser);

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role, companyId: newUser.companyId },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    const company = newUser.companyId ? companies.find(c => c.id === newUser.companyId) : null;

    res.json({
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name,
            companyId: newUser.companyId
        },
        company
    });
});

router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
    const companyUsers = users
        .filter(u => u.companyId === req.user?.companyId)
        .map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role,
            name: u.name
        }));
    res.json(companyUsers);
});

// Admin creates a cashier for their company
router.post('/users/cashier', authenticateToken, requireRole('admin'), (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newCashier: User = {
        id: crypto.randomUUID(),
        username: email.split('@')[0],
        email,
        passwordHash: bcrypt.hashSync(password, 10),
        role: 'cashier',
        name: name || email.split('@')[0],
        companyId: req.user?.companyId
    };

    users.push(newCashier);

    res.status(201).json({
        id: newCashier.id,
        username: newCashier.username,
        email: newCashier.email,
        role: newCashier.role,
        name: newCashier.name,
        companyId: newCashier.companyId
    });
});

export default router;
