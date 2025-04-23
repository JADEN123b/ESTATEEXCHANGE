import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  // Get user from localStorage or your auth state
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Check if user is admin
  if (!user.isAdmin) {
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard; 