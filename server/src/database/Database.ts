import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export class DatabaseManager {
    private static instance: DatabaseManager;
    private db: sqlite3.Database;
    private initPromise: Promise<void>;

    private constructor() {
        const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/edluar.db');
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        this.db = new sqlite3.Database(dbPath);
        this.initPromise = this.initializeSchema();
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) DatabaseManager.instance = new DatabaseManager();
        return DatabaseManager.instance;
    }

    public async waitForInit(): Promise<void> {
        await this.initPromise;
    }

    private async initializeSchema(): Promise<void> {
        return new Promise((resolve, reject) => {
            const schemaPath = path.join(__dirname, 'schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schema = fs.readFileSync(schemaPath, 'utf-8');
                this.db.exec(schema, (err) => {
                    if (err) {
                        console.error('❌ Schema Error:', err);
                        reject(err);
                    } else {
                        console.log('✅ Knowledge Graph (SQLite) Initialized');
                        resolve();
                    }
                });
            } else {
                console.log('⚠️  No schema.sql found, skipping initialization');
                resolve();
            }
        });
    }

    // Async Wrappers for High Yield Logic
    public get(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    public run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    public all(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });
    }

    public close(): void {
        this.db.close((err) => {
            if (err) console.error('❌ Error closing database:', err);
            else console.log('✅ Database connection closed.');
        });
    }
}
