import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EngineKernel } from './core/EngineKernel';
import authRoutes from './routes/auth';
import { ReviewController } from './controllers/ReviewController';
import { ScorecardController } from './controllers/ScorecardController';
import { InterviewController } from './controllers/InterviewController';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

/**
 * Initialize EngineKernel
 */
const initializeServer = async () => {
    const kernel = EngineKernel.getInstance();
    await kernel.initialize();
    await seedDefaultUser();
};

/**
 * Middleware Configuration
 */
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

/**
 * Request Logging Middleware
 */
app.use((req: Request, res: Response, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    const logPath = 'c:/Users/valen/Downloads/edluar-ats/server/access.log';
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${req.method} ${req.path}\n`);
    next();
});

/**
 * Routes
 */
app.use('/api/auth', authRoutes);

import { UserController } from './controllers/UserController';

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.get('/api/users', UserController.getAll);
app.put('/api/users/me', upload.single('avatar'), UserController.updateProfile);

// Todo Routes
import { TodoController } from './controllers/TodoController';
app.post('/api/todos', TodoController.create);
app.get('/api/todos', TodoController.getAll);
app.patch('/api/todos/:id', TodoController.update);
app.patch('/api/todos/:id/complete', TodoController.markComplete);
app.delete('/api/todos/:id', TodoController.delete);

import { ContentController } from './controllers/ContentController';
import { JobController } from './controllers/JobController';
import { CompanyPageController } from './controllers/CompanyPageController';
import { ApplicationController } from './controllers/ApplicationController';

app.get('/api/posts', ContentController.getAllPosts);
app.get('/api/posts/:id', ContentController.getPostById);

// Job Routes
app.post('/api/jobs', JobController.create);
app.get('/api/jobs', JobController.getAll);
app.get('/api/jobs/:id', JobController.getById);
app.put('/api/jobs/:id', JobController.update);
app.delete('/api/jobs/:id', JobController.delete);

// Company Page Routes
app.get('/api/pages/:slug', CompanyPageController.get);
app.post('/api/pages', CompanyPageController.save);

// Application Routes (Core ATS functionality)
app.get('/api/applications', ApplicationController.getAll);

// Notification Routes
import { NotificationController } from './controllers/NotificationController';
app.get('/api/notifications', NotificationController.getMine);
app.patch('/api/notifications/:id/read', NotificationController.markRead);
app.post('/api/applications', ApplicationController.create);
app.get('/api/applications/job/:jobId', ApplicationController.getByJob);

// Review Routes (must be before :id routes to avoid conflicts)
console.log('📝 Registering review routes...');
app.post('/api/applications/:id/reviews', ReviewController.create);
app.get('/api/applications/:id/reviews/average', ReviewController.getAverage);
app.get('/api/applications/:id/reviews', ReviewController.getByApplication);
app.patch('/api/reviews/:id', ReviewController.update);
app.delete('/api/reviews/:id', ReviewController.delete);
console.log('✅ Review routes registered');

// Scorecard Routes (Interview Evaluations)
app.post('/api/applications/:id/scorecards', ScorecardController.create);
app.get('/api/applications/:id/scorecards/average', ScorecardController.getAverage);
app.get('/api/applications/:id/scorecards', ScorecardController.getByApplication);
app.patch('/api/scorecards/:id', ScorecardController.update);
app.delete('/api/scorecards/:id', ScorecardController.delete);

// Interview Routes (Scheduling)
app.post('/api/interviews', InterviewController.create); // Generic create (e.g. Team Sync)
app.post('/api/applications/:id/interviews', InterviewController.create);
app.get('/api/interviews/confirm/:token', InterviewController.confirm);
app.get('/api/interviews/upcoming', InterviewController.getUpcoming);

// Activity Routes (must be before :id/stage to avoid conflicts)
app.get('/api/applications/:id/activities', ApplicationController.getActivities);
app.post('/api/applications/:id/activities', ApplicationController.createActivity);
app.get('/api/activities/scheduled', ApplicationController.getScheduledActivities);

// Application stage update (after more specific routes)
app.patch('/api/applications/:id/stage', ApplicationController.updateStage);

// Seeding Logic
import { UserRepository } from './repositories/UserRepository';
import bcrypt from 'bcryptjs';

const seedDefaultUser = async () => {
    try {
        const existingUser = await UserRepository.findByEmail('demo@edluar.com');
        if (!existingUser) {
            console.log('🌱 Seeding default user...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await UserRepository.create({
                email: 'demo@edluar.com',
                password: hashedPassword,
                name: 'Demo User',
                provider: 'local'
            });
            console.log('✅ Default user created: demo@edluar.com');
        }
    } catch (error) {
        console.error('Failed to seed user:', error);
    }
};



// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Edluar ATS Server - EngineKernel Active',
        version: '1.0.0'
    });
});

/**
 * Error Handling Middleware
 */
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    const logPath = 'c:/Users/valen/Downloads/edluar-ats/server/error.log';
    fs.appendFileSync(logPath, `${new Date().toISOString()} - Server error: ${err}\n${err.stack}\n`);
    res.status(500).json({ error: 'Internal server error' });
});

/**
 * Start Server
 */
const startServer = async () => {
    try {
        await initializeServer();

        app.listen(PORT, () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀  Edluar ATS Server - EngineKernel');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡  Server running on port ${PORT}`);
            console.log(`🌐  http://localhost:${PORT}`);
            console.log(`🔒  Security Layer: Argon2id + JWT`);
            console.log(`💾  Database: SQLite with WAL mode`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    const kernel = EngineKernel.getInstance();
    await kernel.shutdown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    const kernel = EngineKernel.getInstance();
    await kernel.shutdown();
    process.exit(0);
});

// Start the server
startServer();
