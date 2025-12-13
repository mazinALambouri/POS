import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    role: 'developer' | 'admin' | 'cashier';
    companyId?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user as UserPayload;
        next();
    });
};

export const requireRole = (role: 'developer' | 'admin' | 'cashier') => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Developer has access to everything
        if (req.user?.role === 'developer') {
            return next();
        }

        if (!req.user || (req.user.role !== role && req.user.role !== 'admin')) {
            return res.sendStatus(403);
        }
        next();
    };
};
