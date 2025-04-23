import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      
      // Save the current path to redirect back after login
      const returnPath = location.pathname;
      sessionStorage.setItem('returnPath', returnPath);
      
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
    
    const handleStorageChange = () => {
      const updatedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
      if (!updatedLoginStatus && isAuthenticated) {
        navigate('/login');
      }
      setIsAuthenticated(updatedLoginStatus);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, toast, isAuthenticated, location.pathname]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
