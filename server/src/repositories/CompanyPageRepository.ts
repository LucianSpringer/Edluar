import { DatabaseManager } from '../database/Database';

export interface CompanyPage {
    id: number;
    slug: string;
    title: string;
    content_blocks: string; // JSON string
    updated_at: string;
}

export class CompanyPageRepository {
    private static getDB() {
        return DatabaseManager.getInstance();
    }

    static async findBySlug(slug: string): Promise<CompanyPage | undefined> {
        return this.getDB().get('SELECT * FROM company_pages WHERE slug = ?', [slug]);
    }

    static async create(slug: string, title: string, content_blocks: string): Promise<CompanyPage> {
        const result = await this.getDB().run(
            'INSERT INTO company_pages (slug, title, content_blocks) VALUES (?, ?, ?)',
            [slug, title, content_blocks]
        );

        const page = await this.findBySlug(slug);
        if (!page) throw new Error('Failed to create page');
        return page;
    }

    static async update(slug: string, title: string, content_blocks: string): Promise<CompanyPage> {
        await this.getDB().run(
            'UPDATE company_pages SET title = ?, content_blocks = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?',
            [title, content_blocks, slug]
        );

        const page = await this.findBySlug(slug);
        if (!page) throw new Error('Page not found');
        return page;
    }

    static async save(slug: string, title: string, content_blocks: string): Promise<CompanyPage> {
        const existing = await this.findBySlug(slug);
        if (existing) {
            return this.update(slug, title, content_blocks);
        } else {
            return this.create(slug, title, content_blocks);
        }
    }
}
