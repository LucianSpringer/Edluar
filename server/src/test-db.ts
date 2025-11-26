import { DatabaseManager } from './database/Database';
import { UserRepository } from './repositories/UserRepository';

async function test() {
    console.log('Testing Database Connection...');
    const db = DatabaseManager.getInstance();

    try {
        console.log('1. Checking users table...');
        const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
        if (result) {
            console.log('✅ Users table exists.');
        } else {
            console.error('❌ Users table does NOT exist.');
        }

        console.log('2. Testing UserRepository.findByEmail...');
        const email = 'test@example.com';
        const user = await UserRepository.findByEmail(email);
        console.log('User found:', user);

        if (!user) {
            console.log('User not found (expected if DB is empty).');
        }

        console.log('3. Testing UserRepository.findByEmail(undefined)...');
        try {
            await UserRepository.findByEmail(undefined as any);
            console.log('✅ findByEmail(undefined) handled gracefully.');
        } catch (e) {
            console.log('❌ findByEmail(undefined) THREW error:', e);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // db.close(); // Keep it open if running in a persistent process, but for test script we can close
    }
}

test();
