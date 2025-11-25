import { Request, Response, NextFunction } from 'express';
import { SecurityKernel } from '../core/SecurityKernel';

/**
 * Extended Request type with user context
 */
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

/**
 * Authentication Middleware
 * Validates JWT token and attaches user context to request
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = SecurityKernel.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const payload = SecurityKernel.validateSession(token);
        if (!payload) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Attach user to request context
        req.user = {
            id: payload.id,
            email: payload.email
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
};
