import { DatabaseManager } from '../database/Database';

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    read_time: string;
    image_url: string; // Mapped from image in DB
    author_name: string;
    author_role: string;
    author_image: string;
    author_bio: string;
    is_featured: boolean;
}

export class PostRepository {
    private static db = DatabaseManager.getInstance();

    static async findById(id: number): Promise<BlogPost | undefined> {
        return this.db.getDatabase().prepare('SELECT * FROM posts WHERE id = ?').get(id) as BlogPost | undefined;
    }

    static async findAll(): Promise<BlogPost[]> {
        return this.db.getDatabase().prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as BlogPost[];
    }

    // SEEDING LOGIC (High Yield)
    static async seed(posts: Partial<BlogPost>[]): Promise<void> {
        console.log('[Content Engine] Seeding Knowledge Graph...');

        const checkStmt = this.db.getDatabase().prepare('SELECT id FROM posts WHERE title = ?');
        const insertStmt = this.db.getDatabase().prepare(`INSERT INTO posts (title, excerpt, content, category, date, read_time, image_url, author_name, author_role, author_image, author_bio, is_featured) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const transaction = this.db.getDatabase().transaction((postsToInsert: Partial<BlogPost>[]) => {
            let addedCount = 0;
            for (const p of postsToInsert) {
                const existing = checkStmt.get(p.title);
                if (!existing) {
                    insertStmt.run(
                        p.title, p.excerpt, p.content, p.category, p.date, p.read_time,
                        p.image_url, p.author_name, p.author_role, p.author_image, p.author_bio, p.is_featured ? 1 : 0
                    );
                    addedCount++;
                }
            }
            console.log(`✅ Added ${addedCount} new posts.`);
        });

        transaction(posts);
    }
}
