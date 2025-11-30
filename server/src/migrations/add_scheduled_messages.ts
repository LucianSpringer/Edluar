import { DatabaseManager } from '../database/Database';

async function migrate() {
    const db = DatabaseManager.getInstance();
    try {
        console.log('Adding scheduling columns to activities...');
        // Add scheduled_at column (null means send immediately)
        try {
            await db.run("ALTER TABLE activities ADD COLUMN scheduled_at DATETIME");
            console.log('✅ Added scheduled_at column');
        } catch (e: any) {
            console.log('ℹ️ scheduled_at likely exists');
        }

        // Add status column (sent, pending, failed)
        try {
            await db.run("ALTER TABLE activities ADD COLUMN status TEXT DEFAULT 'sent'");
            console.log('✅ Added status column');
        } catch (e: any) {
            console.log('ℹ️ status likely exists');
        }

        console.log('✅ Migration check complete');
    } catch (e: any) {
        console.error('Migration failed:', e);
    }
}
migrate();
