import { DatabaseManager } from './database/Database';
import { UserRepository } from './repositories/UserRepository';
import bcrypt from 'bcryptjs';

const checkDB = async () => {
    try {
        console.log('Checking DB...');
        const db = DatabaseManager.getInstance();
        await db.waitForInit();

        const users = await db.all('SELECT * FROM users');
        console.log('Users found:', users.length);
        console.log(users);

        if (users.length === 0) {
            console.log('Seeding user...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await UserRepository.create({
                email: 'demo@edluar.com',
                password: hashedPassword,
                name: 'Demo User',
                provider: 'local'
            });
            console.log('User seeded.');
        } else {
            console.log('User already exists.');
        }

        const jobs = await db.all('SELECT * FROM job_openings');
        console.log('Jobs found:', jobs.length);
        console.log(jobs);

    } catch (error) {
        console.error('Error:', error);
    }
};

checkDB();
