import { Request, Response } from 'express';
import { PostRepository } from '../repositories/PostRepository';

export class ContentController {
    static async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await PostRepository.findAll();
            // Map DB columns to Frontend Interface if snake_case differs (SQLite is lax, but be careful)
            const formatted = posts.map(p => ({
                ...p,
                image: p.image_url, // Frontend expects 'image', DB has 'image_url'
                readTime: p.read_time,
                author: {
                    name: p.author_name,
                    role: p.author_role,
                    image: p.author_image,
                    bio: p.author_bio
                }
            }));
            res.json(formatted);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getPostById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const p = await PostRepository.findById(id);
            if (!p) return res.status(404).json({ error: 'Post not found' });

            const formatted = {
                ...p,
                image: p.image_url,
                readTime: p.read_time,
                author: {
                    name: p.author_name,
                    role: p.author_role,
                    image: p.author_image,
                    bio: p.author_bio
                }
            };
            res.json(formatted);
        } catch (error) {
            console.error('Error fetching post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
