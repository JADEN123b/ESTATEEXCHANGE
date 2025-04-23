import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import zxcvbn from 'zxcvbn';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordResult = zxcvbn(formData.password);
      if (passwordResult.score < 3) {
        newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      const result = zxcvbn(value);
      setPasswordStrength(result.score);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    try {
      // Store user credentials in localStorage
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: '/lovable-uploads/896da314-b7a4-40fe-83c2-2424715de7ae.png',
        coverPhoto: '/cover-placeholder.jpg',
        location: 'New York, NY',
        bio: 'Real estate professional with a passion for helping people find their dream homes.',
        listings: 0,
        followers: 0,
        following: 0,
        posts: [],
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        isVerified: true,
        status: 'active',
        stats: {
          listings: 0,
          followers: 0,
          following: 0
        },
        createdAt: new Date().toISOString()
      };

      // Check if email already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some((user: any) => user.email === formData.email)) {
        toast({
          title: "Error",
          description: "Email already registered. Please use a different email or login.",
          variant: "destructive"
        });
        return;
      }

      // Store registered users in localStorage
      registeredUsers.push(userData);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Auto-login after signup
      const { password: _, ...safeUserData } = userData;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(safeUserData));
      localStorage.setItem('token', 'user-token-' + Date.now());

      toast({
        title: "Welcome to EstateExchange!",
        description: "Your account has been created successfully.",
      });

      // Redirect to feed page
      navigate('/feed');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[hsl(142,64%,38%)] hover:text-[hsl(142,64%,30%)]">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div 
                  className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)]">
            Sign up
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>By signing up, you agree to our{' '}
            <Link to="/terms" className="text-[hsl(142,64%,38%)] hover:text-[hsl(142,64%,30%)]">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[hsl(142,64%,38%)] hover:text-[hsl(142,64%,30%)]">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
