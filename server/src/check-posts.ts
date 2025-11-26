import { DatabaseManager } from './database/Database';

async function checkPosts() {
    const db = DatabaseManager.getInstance();
    await db.waitForInit();

    console.log('Checking posts in database...');
    const posts = await db.all('SELECT id, title FROM posts ORDER BY id');

    console.log('Found posts:', posts);
}

checkPosts();
