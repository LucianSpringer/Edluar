import { DatabaseManager } from './database/Database';

async function addUserProfileColumns() {
    const db = DatabaseManager.getInstance();

    console.log("Adding profile columns to users table...");

    try {
        // Check if columns exist, if not add them
        await db.run(`ALTER TABLE users ADD COLUMN phone TEXT`);
        console.log("✅ Added 'phone' column");
    } catch (error: any) {
        if (error.message.includes('duplicate column')) {
            console.log("⏭️  'phone' column already exists");
        } else {
            throw error;
        }
    }

    try {
        await db.run(`ALTER TABLE users ADD COLUMN job_title TEXT`);
        console.log("✅ Added 'job_title' column");
    } catch (error: any) {
        if (error.message.includes('duplicate column')) {
            console.log("⏭️  'job_title' column already exists");
        } else {
            throw error;
        }
    }

    try {
        await db.run(`ALTER TABLE users ADD COLUMN signature TEXT`);
        console.log("✅ Added 'signature' column");
    } catch (error: any) {
        if (error.message.includes('duplicate column')) {
            console.log("⏭️  'signature' column already exists");
        } else {
            throw error;
        }
    }

    try {
        await db.run(`ALTER TABLE users ADD COLUMN avatar TEXT`);
        console.log("✅ Added 'avatar' column");
    } catch (error: any) {
        if (error.message.includes('duplicate column')) {
            console.log("⏭️  'avatar' column already exists");
        } else {
            throw error;
        }
    }

    console.log("\n✅ Migration complete!");
}

addUserProfileColumns().catch(console.error);
