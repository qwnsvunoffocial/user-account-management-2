import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

/**
 * Protects routes that require authentication.
 * Optionally restricts access to a specific role.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect non-admin users away from admin-only pages
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
