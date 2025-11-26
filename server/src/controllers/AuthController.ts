import { Request, Response } from 'express';
import { SecurityKernel } from '../core/SecurityKernel';
import { UserRepository } from '../repositories/UserRepository';

export class AuthController {
    // ASYNC SIGNUP
    static async signup(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

            // Await the async DB call
            const existing = await UserRepository.findByEmail(email);
            if (existing) return res.status(409).json({ error: 'User already exists.' });

            const hashedPassword = await SecurityKernel.hashPassword(password);
            const newUser = await UserRepository.create({ email, password: hashedPassword, name });
            const token = SecurityKernel.generateSessionToken({ id: newUser.id, email: newUser.email });

            res.status(201).json({ token, user: newUser });
        } catch (error) {
            console.error('Signup Fail:', error);
            res.status(500).json({ error: 'Internal Error' });
        }
    }

    // ASYNC LOGIN
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserRepository.findByEmail(email);

            if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

            const valid = await SecurityKernel.verifyPassword(user.password, password);
            if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = SecurityKernel.generateSessionToken({ id: user.id, email: user.email });
            res.json({ token, user });
        } catch (error) {
            console.error('Login Fail:', error);
            res.status(500).json({ error: 'Internal Error' });
        }
    }

    /**
     * SOCIAL LOGIN - "Shadow Profile" Logic
     * If user exists: Login.
     * If user missing: Auto-Signup (Shadow) -> Login.
     */
    static async socialLogin(req: Request, res: Response) {
        try {
            const { email, name, provider, socialId } = req.body;

            if (!email) return res.status(400).json({ error: 'Email is required' });

            // 1. ATOMIC LOOKUP
            let user = await UserRepository.findByEmail(email);

            // 2. SHADOW CREATION (If user doesn't exist, create them instantly)
            if (!user) {
                console.log(`[Auth] Creating Shadow Profile for ${email}`);
                user = await UserRepository.create({
                    email,
                    name: name || email.split('@')[0],
                    password: null, // Social users have no password
                    provider: provider || 'social',
                    socialId: socialId
                });
            }

            // 3. ISSUE TOKEN (Login Success)
            const token = SecurityKernel.generateSessionToken({
                id: user.id,
                email: user.email
            });

            // 4. Update Telemetry
            await UserRepository.updateLoginTimestamp(user.id);

            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Social Login Critical Failure:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // ME CHECK
    static async me(req: Request, res: Response) {
        try {
            const token = SecurityKernel.extractTokenFromHeader(req.headers.authorization);
            if (!token) return res.status(401).json({ error: 'No token' });

            const payload = SecurityKernel.validateSession(token);
            if (!payload) return res.status(403).json({ error: 'Invalid token' });

            const user = await UserRepository.findById(payload.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json({ user });
        } catch (e) { res.status(500).json({ error: 'Session Error' }); }
    }
}
