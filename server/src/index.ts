import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EngineKernel } from './core/EngineKernel';
import authRoutes from './routes/auth';

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

/**
 * Request Logging Middleware
 */
app.use((req: Request, res: Response, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

/**
 * Routes
 */
app.use('/api/auth', authRoutes);

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
