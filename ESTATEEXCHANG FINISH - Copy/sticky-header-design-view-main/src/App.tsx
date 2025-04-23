import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import AdminProperties from "./pages/admin/Properties";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Terms from "./pages/Terms";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Ads from "./pages/Ads";
import Profile from "./pages/Profile";
import PropertyTransfer from "./pages/PropertyTransfer";
import PropertyTransferPayment from "./pages/PropertyTransferPayment";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PropertyVerification from "./pages/PropertyVerification";
import Verification from "./pages/Verification";
import TransactionHistory from "./pages/TransactionHistory";
import UserSettings from "./pages/UserSettings";
import Help from "./pages/Help";
import Users from "./pages/admin/Users";
import Verifications from "./pages/admin/Verifications";
import RiskManagement from "./pages/admin/RiskManagement";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminMessages from "./pages/admin/Messages";
import AdminNotifications from "./pages/admin/Notifications";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Clear login state on initial load
  useEffect(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  }, []);

  // Listen for changes to localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', checkLoginStatus);
    
    // Also check when mounting
    checkLoginStatus();
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/feed" replace /> : <Login />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/feed" replace /> : <SignUp />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected routes */}
            <Route path="/feed" element={<AuthGuard><Feed /></AuthGuard>} />
            <Route path="/messages" element={<AuthGuard><Messages /></AuthGuard>} />
            <Route path="/notifications" element={<AuthGuard><Notifications /></AuthGuard>} />
            <Route path="/ads" element={<AuthGuard><Ads /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/profile/:id" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><UserSettings /></AuthGuard>} />
            <Route path="/property-transfer" element={<AuthGuard><PropertyTransfer /></AuthGuard>} />
            <Route path="/property-transfer-payment" element={<AuthGuard><PropertyTransferPayment /></AuthGuard>} />
            <Route path="/payment-success" element={<AuthGuard><PaymentSuccess /></AuthGuard>} />
            <Route path="/property-verification" element={<AuthGuard><PropertyVerification /></AuthGuard>} />
            <Route path="/verification" element={<AuthGuard><Verification /></AuthGuard>} />
            <Route path="/transaction-history" element={<AuthGuard><TransactionHistory /></AuthGuard>} />
            <Route path="/help" element={<AuthGuard><Help /></AuthGuard>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="verifications" element={<Verifications />} />
              <Route path="risk-management" element={<RiskManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>
            
            {/* Root route - redirect based on auth status */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/feed" replace /> : <Index />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
