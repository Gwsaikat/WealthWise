import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-yellow-400 animate-spin mb-4"></div>
          <div className="text-yellow-400 font-medium">
            Loading WealthWise...
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 