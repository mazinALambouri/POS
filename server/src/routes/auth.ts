import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/types';
import { JWT_SECRET, authenticateToken, requireRole } from '../middleware/auth';
import { users } from '../data/mockDb';

const router = Router();

import { companies } from '../data/mockDb';

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

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
            role: user.role,
            name: user.name,
            companyId: user.companyId
        },
        company
    });
});

router.post('/register', (req, res) => {
    const { username, password, role, name } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        username,
        passwordHash: bcrypt.hashSync(password, 10),
        role: role || 'cashier',
        name: name || username
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name } });
});

router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
    const companyUsers = users
        .filter(u => u.companyId === req.user?.companyId)
        .map(u => ({
            id: u.id,
            username: u.username,
            role: u.role,
            name: u.name
        }));
    res.json(companyUsers);
});

export default router;
