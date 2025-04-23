import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials, SignUpData, AuthResponse } from '@/lib/api/auth.service';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome back to EstateExchange!",
      });
      
      // Check for return path
      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate('/feed');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const signup = useCallback(async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      setUser(response.user);
      setIsAuthenticated(true);
      toast({
        title: "Registration successful",
        description: "Welcome to EstateExchange!",
      });
      navigate('/feed');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not log out properly",
        variant: "destructive"
      });
    }
  }, [navigate, toast]);

  const updateUser = useCallback((userData: Partial<AuthResponse['user']>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser
  };
};

export default useAuth; 