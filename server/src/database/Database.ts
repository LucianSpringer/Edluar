import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseManager {
    private static instance: DatabaseManager;
    private db: Database.Database;

    private constructor() {
        const dbPath = process.env.DATABASE_PATH || './data/edluar.db';

        // Ensure data directory exists
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL'); // Write-Ahead Logging for performance
        this.initializeSchema();
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    private initializeSchema(): void {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        this.db.exec(schema);
        console.log('✅ Database schema initialized');
    }

    public getDatabase(): Database.Database {
        return this.db;
    }

    public close(): void {
        this.db.close();
    }
}
