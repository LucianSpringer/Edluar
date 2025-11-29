import { DatabaseManager } from './database/Database';

const migrate = async () => {
    try {
        console.log('🔄 Running migration...');
        const db = DatabaseManager.getInstance();
        await db.waitForInit();

        // Add tags column to candidates table
        try {
            await db.run('ALTER TABLE candidates ADD COLUMN tags TEXT');
            console.log('✅ Added tags column to candidates table');
        } catch (error: any) {
            if (error.message.includes('duplicate column')) {
                console.log('ℹ️  tags column already exists');
            } else {
                throw error;
            }
        }

        // Add application_form_config to job_openings table
        try {
            await db.run('ALTER TABLE job_openings ADD COLUMN application_form_config TEXT');
            console.log('✅ Added application_form_config column to job_openings table');
        } catch (error: any) {
            if (error.message.includes('duplicate column')) {
                console.log('ℹ️  application_form_config column already exists');
            } else {
                throw error;
            }
        }

        // Add theme_config to job_openings table
        try {
            await db.run('ALTER TABLE job_openings ADD COLUMN theme_config TEXT');
            console.log('✅ Added theme_config column to job_openings table');
        } catch (error: any) {
            if (error.message.includes('duplicate column')) {
                console.log('ℹ️  theme_config column already exists');
            } else {
                throw error;
            }
        }

        console.log('✅ Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
};

migrate();
