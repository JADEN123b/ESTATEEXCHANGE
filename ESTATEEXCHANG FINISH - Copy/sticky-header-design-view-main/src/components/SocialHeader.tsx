import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Home, MessageCircle, Menu, Search, User, Settings, HelpCircle, LogOut, FileText, BadgeCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SocialHeaderProps {
  currentPage: 'home' | 'messages' | 'notifications' | 'ads' | 'profile';
}

const SocialHeader: React.FC<SocialHeaderProps> = ({ currentPage }) => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [showSearch, setShowSearch] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for new messages/notifications
  React.useEffect(() => {
    const checkUpdates = () => {
      setHasNewMessages(Math.random() > 0.5);
      setHasNewNotifications(Math.random() > 0.5);
    };
    
    checkUpdates();
    const interval = setInterval(checkUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="flex">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {/* User Profile Section */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{user.name}</p>
                        {user.isVerified && (
                          <BadgeCheck className="h-5 w-5 shrink-0 text-[hsl(142,64%,38%)]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Property Management */}
                    <div className="px-2">
                      <h3 className="mb-2 px-2 text-sm font-medium text-gray-500">Property Management</h3>
                      <nav className="flex flex-col space-y-1">
                        <Link to="/property-transfer" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span>Property Transfer</span>
                        </Link>
                        <Link to="/transaction-history" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span>Transaction History</span>
                        </Link>
                      </nav>
                    </div>

                    {/* Account & Settings */}
                    <div className="px-2">
                      <h3 className="mb-2 px-2 text-sm font-medium text-gray-500">Account & Settings</h3>
                      <nav className="flex flex-col space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <User className="h-5 w-5 text-gray-500" />
                          <span>User Profile</span>
                        </Link>
                        <Link to="/verification" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <BadgeCheck className={`h-5 w-5 ${user.isVerified ? "text-[hsl(142,64%,38%)]" : "text-gray-500"}`} />
                          <div className="flex-grow">
                            <span>{user.isVerified ? 'Verified Account' : 'Get Verified'}</span>
                            {!user.isVerified && (
                              <span className="block text-xs text-gray-500">Build trust with verification</span>
                            )}
                          </div>
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Settings className="h-5 w-5 text-gray-500" />
                          <span>Settings & Privacy</span>
                        </Link>
                      </nav>
                    </div>

                    {/* Help & Support */}
                    <div className="px-2">
                      <h3 className="mb-2 px-2 text-sm font-medium text-gray-500">Support</h3>
                      <nav className="flex flex-col space-y-1">
                        <Link to="/help" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <HelpCircle className="h-5 w-5 text-gray-500" />
                          <span>Help & Support</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/feed" className="text-[hsl(142,64%,38%)] font-bold text-lg md:text-2xl uppercase tracking-wide truncate">
              ESTATEEXCHANGE
            </Link>
          </div>

          {/* Search bar with mobile dialog */}
          <div className="hidden md:block relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-100 w-full focus:ring-2 focus:ring-green-500"
            />
          </div>

          <Dialog open={showSearch} onOpenChange={setShowSearch}>
            <DialogContent className="top-4 translate-y-0 rounded-b-lg">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 bg-gray-100 w-full focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/feed"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'home' ? 'text-black dark:text-white' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/messages"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                currentPage === 'messages' ? 'text-black dark:text-white' : 'text-muted-foreground'
              }`}
            >
              Messages
              {hasNewMessages && (
                <span className="absolute -top-1 -right-2 h-2 w-2 bg-[hsl(142,64%,38%)] rounded-full" />
              )}
            </Link>
            <Link
              to="/notifications"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                currentPage === 'notifications' ? 'text-black dark:text-white' : 'text-muted-foreground'
              }`}
            >
              Notifications
              {hasNewNotifications && (
                <span className="absolute -top-1 -right-2 h-2 w-2 bg-[hsl(142,64%,38%)] rounded-full" />
              )}
            </Link>
            <Link
              to="/ads"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'ads' ? 'text-black dark:text-white' : 'text-muted-foreground'
              }`}
            >
              Ads
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Link
              to="/feed"
              className={`p-2 rounded-full ${
                currentPage === 'home' ? 'bg-gray-100' : ''
              }`}
            >
              <Home className={`h-5 w-5 ${
                currentPage === 'home' ? 'text-[hsl(142,64%,38%)]' : 'text-gray-600'
              }`} />
            </Link>
            <Link
              to="/messages"
              className={`p-2 rounded-full relative ${
                currentPage === 'messages' ? 'bg-gray-100' : ''
              }`}
            >
              <MessageCircle className={`h-5 w-5 ${
                currentPage === 'messages' ? 'text-[hsl(142,64%,38%)]' : 'text-gray-600'
              }`} />
              {hasNewMessages && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-[hsl(142,64%,38%)] rounded-full" />
              )}
            </Link>
            <Link
              to="/notifications"
              className={`p-2 rounded-full relative ${
                currentPage === 'notifications' ? 'bg-gray-100' : ''
              }`}
            >
              <Bell className={`h-5 w-5 ${
                currentPage === 'notifications' ? 'text-[hsl(142,64%,38%)]' : 'text-gray-600'
              }`} />
              {hasNewNotifications && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-[hsl(142,64%,38%)] rounded-full" />
              )}
            </Link>
            <Link
              to="/ads"
              className={`p-2 rounded-full ${
                currentPage === 'ads' ? 'bg-gray-100' : ''
              }`}
            >
              <FileText className={`h-5 w-5 ${
                currentPage === 'ads' ? 'text-[hsl(142,64%,38%)]' : 'text-gray-600'
              }`} />
            </Link>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  {user.isVerified && (
                    <BadgeCheck className="h-3 w-3 md:h-4 md:w-4 text-[hsl(142,64%,38%)] absolute -bottom-1 -right-1 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium hidden lg:inline truncate max-w-[100px]">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User size={18} />
                  <span>View Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings size={18} />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 flex items-center gap-2">
                <LogOut size={18} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;