import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();

    try {
        console.log('Adding event_type column to interviews table...');

        // Check if column exists
        const tableInfo = await db.all("PRAGMA table_info(interviews)");
        const hasEventType = tableInfo.some((col: any) => col.name === 'event_type');

        if (!hasEventType) {
            await db.run(`
                ALTER TABLE interviews 
                ADD COLUMN event_type TEXT DEFAULT 'interview' 
                CHECK (event_type IN ('interview', 'screening', 'team_sync', 'blocked'))
            `);
            console.log('✅ Added event_type column successfully');
        } else {
            console.log('ℹ️ event_type column already exists');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
