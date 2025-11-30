import { DatabaseManager } from '../database/Database';

async function checkUserSchema() {
    const db = DatabaseManager.getInstance();
    try {
        console.log('Checking users table schema...');
        const columns = await db.all("PRAGMA table_info(users)");
        console.log('Columns:');
        columns.forEach((c: any) => console.log(`- ${c.name} (${c.type})`));
    } catch (e: any) {
        console.error('Error checking schema:', e.message);
    }
}
checkUserSchema();
