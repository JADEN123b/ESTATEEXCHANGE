import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Home,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  LogOut,
  BadgeCheck,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Properties', href: '/admin/properties', icon: Home },
    { name: 'Verifications', href: '/admin/verifications', icon: BadgeCheck },
    { name: 'Risk Management', href: '/admin/risk-management', icon: Shield },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const NavigationContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <span className={cn(
          "text-xl font-semibold text-green-600",
          isCollapsed && !isMobile && "hidden"
        )}>
          EstateExchange
        </span>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}
      </div>

      <nav className="p-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {(!isCollapsed || isMobile) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className={cn(
          "flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm font-medium w-full mt-auto",
          "text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        )}
      >
        <LogOut className="w-5 h-5" />
        {(!isCollapsed || isMobile) && <span>Logout</span>}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      {isMobile ? (
        <>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="flex flex-col h-full">
                <NavigationContent />
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div 
          className={cn(
            "fixed inset-y-0 left-0 bg-white shadow-sm z-50 transition-all duration-300 flex flex-col",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <NavigationContent />
        </div>
      )}

      {/* Main Content */}
      <div 
        className={cn(
          "transition-all duration-300",
          isMobile ? "ml-0" : (isCollapsed ? "ml-16" : "ml-64")
        )}
      >
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">A</span>
              </div>
              <span className="text-sm font-medium hidden md:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;