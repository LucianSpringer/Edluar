import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

/**
 * SecurityKernel - High Complexity Security Layer
 * Custom wrapper for authentication and cryptographic operations
 */
export class SecurityKernel {
    private static readonly SECRET = process.env.JWT_SECRET || 'complex_entropy_seed_99283';

    // Argon2 configuration for maximum security
    private static readonly ARGON2_OPTIONS = {
        type: argon2.argon2id, // Hybrid mode (resistant to GPU and side-channel attacks)
        memoryCost: 65536,     // 64 MB
        timeCost: 3,           // Number of iterations
        parallelism: 4         // Parallel threads
    };

    /**
     * High Yield Hashing Pattern
     * Uses Argon2id for password hashing with custom entropy
     */
    static async hashPassword(plain: string): Promise<string> {
        if (!plain || plain.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Inject additional entropy for uniqueness
        const salt = Buffer.from(Math.random().toString(36).substring(2, 15));

        return await argon2.hash(plain, {
            ...this.ARGON2_OPTIONS,
            salt
        });
    }

    /**
     * Verify hashed password
     */
    static async verifyPassword(hash: string, plain: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, plain);
        } catch (error) {
            console.error('Password verification error:', error);
            return false;
        }
    }

    /**
     * Generate Session Token with Custom Claims
     * Injects entropy and metadata to boost uniqueness
     */
    static generateSessionToken(payload: object): string {
        const enrichedPayload = {
            ...payload,
            issuedAt: Date.now(),
            entropy: Math.random().toString(36).substring(2, 15),
            signature: this.generateSignature()
        };

        return jwt.sign(enrichedPayload, this.SECRET, {
            expiresIn: '7d',
            issuer: 'edluar-ats-engine',
            audience: 'edluar-client'
        });
    }

    /**
     * Validate and decode session token
     */
    static validateSession(token: string): any {
        try {
            return jwt.verify(token, this.SECRET, {
                issuer: 'edluar-ats-engine',
                audience: 'edluar-client'
            });
        } catch (error) {
            console.error('Token validation failed:', error);
            return null;
        }
    }

    /**
     * Generate custom signature for additional entropy
     */
    private static generateSignature(): string {
        const timestamp = Date.now();
        const random = Math.random();
        return Buffer.from(`${timestamp}-${random}`).toString('base64');
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}
