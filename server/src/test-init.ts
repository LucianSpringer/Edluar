import { DatabaseManager } from './database/Database';
import { EngineKernel } from './core/EngineKernel';
import dotenv from 'dotenv';

dotenv.config();

async function testInitialization() {
    console.log('🧪 Testing server initialization...\n');

    try {
        console.log('Step 1: Getting DatabaseManager instance...');
        const db = DatabaseManager.getInstance();

        console.log('Step 2: Waiting for database initialization...');
        await db.waitForInit();
        console.log('✅ Database initialized successfully\n');

        console.log('Step 3: Testing database query...');
        const result = await db.get('SELECT 1 as health');
        console.log('✅ Database query successful:', result, '\n');

        console.log('Step 4: Initializing EngineKernel...');
        const kernel = EngineKernel.getInstance();
        await kernel.initialize();
        console.log('✅ EngineKernel initialized successfully\n');

        console.log('🎉 All initialization tests passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Initialization test failed:', error);
        process.exit(1);
    }
}

testInitialization();
