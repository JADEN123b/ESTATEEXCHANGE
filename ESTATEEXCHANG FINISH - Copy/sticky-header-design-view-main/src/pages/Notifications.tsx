import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Bell, MessageCircle, Heart, User, Home } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import BackButton from '../components/BackButton';

interface Notification {
  id: string;
  type: 'message' | 'like' | 'follow' | 'property';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  sourceUrl: string;
  user: {
    name: string;
    avatar: string;
  };
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'John Doe sent you a message about your property listing',
      timestamp: '2 minutes ago',
      isRead: false,
      sourceUrl: '/messages',
      user: {
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      }
    },
    {
      id: '2',
      type: 'like',
      title: 'Property Liked',
      description: 'Sarah Smith liked your property listing',
      timestamp: '1 hour ago',
      isRead: false,
      sourceUrl: '/feed',
      user: {
        name: 'Sarah Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      }
    },
    {
      id: '3',
      type: 'follow',
      title: 'New Follower',
      description: 'Mike Johnson started following you',
      timestamp: '2 hours ago',
      isRead: true,
      sourceUrl: '/user/mike',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
      }
    },
    {
      id: '4',
      type: 'property',
      title: 'Property Update',
      description: 'Your property listing has been approved',
      timestamp: '1 day ago',
      isRead: true,
      sourceUrl: '/feed',
      user: {
        name: 'System',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System'
      }
    }
  ]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate to source
    navigate(notification.sourceUrl);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'follow':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'property':
        return <Home className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="notifications" />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden relative">
              <BackButton />
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Notifications</h2>
              </div>
              
              <div className="divide-y">
                <div className="p-4 border-b flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Notifications</h1>
                  <Button variant="outline" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                </div>
                
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <img src={notification.user.avatar} alt={notification.user.name} />
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <p className="font-medium">{notification.title}</p>
                            {!notification.isRead && (
                              <span className="h-2 w-2 bg-[hsl(142,64%,38%)] rounded-full" />
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{notification.description}</p>
                          <p className="text-sm text-gray-400 mt-1">{notification.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Notifications;
