import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the User Shape
interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    phone?: string;
    job_title?: string;
    signature?: string;
}

// AuthContext Type Definition
interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

/**
 * AuthProvider - Session Orchestrator
 * Implements persistent authentication with localStorage and auto-rehydration
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(true);

    /**
     * THE PERSISTENCE ENGINE
     * On app mount/refresh: Check if token exists, then validate with backend
     */
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                        console.log('✅ Session restored for:', data.user.email);
                    } else {
                        // Token expired or invalid
                        console.log('⚠️  Token invalid, clearing session');
                        logout();
                    }
                } catch (e) {
                    console.error('Session validation failed:', e);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    /**
     * LOGIN - Save token and user to state and localStorage
     */
    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('auth_token', newToken); // Persist to disk
        setToken(newToken);
        setUser(newUser);
        console.log('✅ User logged in:', newUser.email);
    };

    /**
     * LOGOUT - Clear session from state and localStorage
     */
    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        console.log('🚪 User logged out');
    };

    /**
     * UPDATE USER - Update user data in state
     */
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        console.log('✅ User data updated:', updatedUser.name);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth Hook - Access auth context from any component
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
