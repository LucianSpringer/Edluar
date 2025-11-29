import { Request, Response } from 'express';
import { CompanyPageRepository } from '../repositories/CompanyPageRepository';

export class CompanyPageController {
    static async get(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const page = await CompanyPageRepository.findBySlug(slug);

            if (!page) {
                return res.status(404).json({ error: 'Page not found' });
            }

            res.json(page);
        } catch (error) {
            console.error('Error fetching page:', error);
            res.status(500).json({ error: 'Failed to fetch page' });
        }
    }

    static async save(req: Request, res: Response) {
        try {
            const { slug, title, content_blocks } = req.body;

            if (!slug || !title) {
                return res.status(400).json({ error: 'Slug and title are required' });
            }

            const page = await CompanyPageRepository.save(
                slug,
                title,
                typeof content_blocks === 'string' ? content_blocks : JSON.stringify(content_blocks)
            );

            res.json(page);
        } catch (error) {
            console.error('Error saving page:', error);
            res.status(500).json({ error: 'Failed to save page' });
        }
    }
}
