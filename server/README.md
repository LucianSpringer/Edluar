# Edluar Backend Authentication System

## Overview
Complete backend authentication system with:
- Node.js/Express server with TypeScript
- SQLite database with Repository pattern
- argon2id password hashing
- JWT token authentication
- Persistent login with localStorage
- Protected routes on frontend

## Quick Setup

### 1. Backend Setup
```powershell
cd server
npm install
cp .env.example .env  # Windows: copy .env.example .env
npm run dev
```

The server will start on **http://localhost:5000**

### 2. Frontend (Already Running)
Your frontend is already running on **http://localhost:3000** with Vite proxy configured.

## Architecture

### Backend (/server/src)
- **core/EngineKernel.ts** - Singleton server manager
- **core/SecurityKernel.ts** - argon2 hashing + JWT tokens
- **database/Database.ts** - SQLite connection manager
- **repositories/** - Data access layer (User, Candidate, JobOpening)
- **controllers/AuthController.ts** - Authentication logic
- **routes/auth.ts** - API endpoints
- **index.ts** - Express server

### Frontend
- **context/AuthContext.tsx** - Global auth state with localStorage persistence
- **components/ProtectedRoute.tsx** - Route guard for dashboard
- **components/LoginPage.tsx** - Login/signup with backend integration
- **App.tsx** - Dashboard wrapped in ProtectedRoute

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Session validation (for persistence) |
| POST | `/api/auth/social` | OAuth social login |

## Features

✅ **Signup/Login** - Full authentication flow  
✅ **Password Hashing** - argon2id (most secure)  
✅ **JWT Tokens** - 7-day expiration with custom entropy  
✅ **Session Persistence** - Auto-rehydrate on page refresh  
✅ **Protected Routes** - Dashboard requires authentication  
✅ **Repository Pattern** - Clean data access layer  
✅ **SQLite Database** - Local development ready  

## Testing the System

1. **Start Backend**: `cd server && npm run dev`
2. **Open Frontend**: http://localhost:3000
3. **Create Account**: Click "Sign up" and create a test user
4. **Test Login**: Login with your credentials
5. **Test Persistence**: Refresh the page - you should stay logged in
6. **Test Protection**: Try accessing dashboard without login

## Database

SQLite database created at `server/data/edluar.db` with tables:
- `users` - User accounts (email, password, name, provider)
- `candidates` - Candidate records
- `job_openings` - Job postings

## Environment Variables

Create `server/.env`:
```
JWT_SECRET=your_secret_key_here
DATABASE_PATH=./data/edluar.db  
PORT=5000
NODE_ENV=development
```

## Security

- **argon2id** hashing algorithm (OWASP recommended)
- **JWT** tokens with custom entropy injection
- **CORS** configured for localhost:3000
- **Password validation** on both client and server
- **Token expiration** (7 days)
