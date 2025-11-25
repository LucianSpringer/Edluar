import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../../components/LoginPage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute - High Yield Gatekeeper Pattern
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <LoginPage onNavigate={() => { }} initialMode="login" />;
    }

    return <>{children}</>;
};
