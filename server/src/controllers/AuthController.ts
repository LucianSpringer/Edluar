import { Request, Response } from 'express';
import { SecurityKernel } from '../core/SecurityKernel';
import { UserRepository } from '../repositories/UserRepository';

/**
 * AuthController - High Logic Authentication Flow
 * Implements signup, login, session persistence, and OAuth integration
 */
export class AuthController {

    /**
     * SIGNUP - Force user registration first
     */
    static async signup(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Email, password, and name are required' });
            }

            // 1. Check if user exists (Prevent Duplicates)
            const existing = UserRepository.findByEmail(email);
            if (existing) {
                return res.status(409).json({ error: 'User already exists. Please login.' });
            }

            // 2. Hash Password (High Complexity Pattern)
            const hashedPassword = await SecurityKernel.hashPassword(password);

            // 3. Persist to SQLite via Repository
            const newUser = UserRepository.create({
                email,
                password: hashedPassword,
                name,
                provider: 'local'
            });

            // 4. Issue Session Token
            const token = SecurityKernel.generateSessionToken({
                id: newUser.id,
                email: newUser.email
            });

            return res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        } catch (error: any) {
            console.error('Signup error:', error);
            return res.status(500).json({ error: 'Internal server error during signup' });
        }
    }

    /**
     * LOGIN - Standard authentication
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // 1. Find user
            const user = UserRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 2. Verify password
            if (!user.password) {
                return res.status(401).json({ error: 'Please use social login for this account' });
            }

            const isValid = await SecurityKernel.verifyPassword(user.password, password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 3. Generate token
            const token = SecurityKernel.generateSessionToken({
                id: user.id,
                email: user.email
            });

            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error during login' });
        }
    }

    /**
     * ME - Persistence Check (Refresh Logic)
     * This enables "remember me" functionality
     */
    static async me(req: Request, res: Response) {
        try {
            const token = SecurityKernel.extractTokenFromHeader(req.headers.authorization);

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const payload = SecurityKernel.validateSession(token);
            if (!payload) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            const user = UserRepository.findById(payload.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Session validation error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * SOCIAL LOGIN - OAuth Strategy (Google/LinkedIn)
     * Implements "Upsert" logic: create if not exists, otherwise login
     */
    static async socialLogin(req: Request, res: Response) {
        try {
            const { provider, email, name, socialId } = req.body;

            if (!provider || !email || !name) {
                return res.status(400).json({ error: 'Provider, email, and name are required' });
            }

            // Find or create user
            let user = UserRepository.findByEmail(email);

            if (!user) {
                // Auto-signup for social users
                user = UserRepository.create({
                    email,
                    name,
                    password: null, // Social users have no password
                    provider,
                    socialId
                });
            }

            const token = SecurityKernel.generateSessionToken({
                id: user.id,
                email: user.email
            });

            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Social login error:', error);
            return res.status(500).json({ error: 'Internal server error during social login' });
        }
    }
}
