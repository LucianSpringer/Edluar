import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class SecurityKernel {
    private static readonly SECRET = process.env.JWT_SECRET || 'complex_entropy_seed_99283';

    static async hashPassword(plain: string): Promise<string> {
        return await bcrypt.hash(plain, 10);
    }

    static async verifyPassword(hash: string, plain: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash);
    }

    static generateSessionToken(payload: object): string {
        return jwt.sign({ ...payload, issuedAt: Date.now() }, this.SECRET, { expiresIn: '7d' });
    }

    static validateSession(token: string): any {
        try {
            return jwt.verify(token, this.SECRET);
        } catch (error) {
            return null;
        }
    }

    static extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        return authHeader.substring(7);
    }
}
