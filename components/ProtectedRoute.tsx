import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from './LoginPage';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute - High Yield Gatekeeper Pattern
 * Prevents "Flash of Login" by handling the loading state.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();

    // 1. WAIT FOR THE CHECK (The Fix)
    // If we are still verifying the token, show a spinner instead of booting the user.
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-edluar-cream dark:bg-edluar-deep">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-edluar-moss animate-spin" />
                    <p className="text-edluar-dark/50 dark:text-edluar-cream/50 text-sm font-medium">Restoring Session...</p>
                </div>
            </div>
        );
    }

    // 2. THE GATE
    // Only redirect IF loading is finished AND there is no user.
    if (!user) {
        // We pass a dummy onNavigate because the LoginPage renders in-place here
        return <LoginPage onNavigate={() => window.location.reload()} initialMode="login" />;
    }

    // 3. ACCESS GRANTED
    return <>{children}</>;

};