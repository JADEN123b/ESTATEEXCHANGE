import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Paperclip,
  ArrowLeft,
  Lock,
  Bell,
  Shield,
  Trash2,
  Ban,
  Archive,
  MessageSquare,
  Video,
  Phone,
  Smile,
  Mic,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatSettings {
  notifications: boolean;
  darkMode: boolean;
  fontSize: string;
  language: string;
  mediaDownload: boolean;
  encryption: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
  media?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
  isArchived?: boolean;
  isBlocked?: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  online: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith',
    lastMessage: 'Interested in the property',
    timestamp: '10:30 AM',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        text: 'Hi, I saw your property listing',
        sender: 'John Smith',
        timestamp: '10:25 AM',
        isRead: true
      },
      {
        id: '2',
        text: 'Interested in the property',
        sender: 'John Smith',
        timestamp: '10:30 AM',
        isRead: false
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
    lastMessage: 'When can I view the apartment?',
    timestamp: '9:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: '1',
        text: 'Hello, I\'m interested in the apartment',
        sender: 'Sarah Johnson',
        timestamp: '9:40 AM',
        isRead: true
      },
      {
        id: '2',
        text: 'When can I view the apartment?',
        sender: 'Sarah Johnson',
        timestamp: '9:45 AM',
        isRead: false
      }
    ]
  },
  {
    id: '3',
    name: 'Michael Brown',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown',
    lastMessage: 'Thanks for the information',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Could you send me more details about the house?',
        sender: 'Michael Brown',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: '2',
        text: 'Here are all the details and photos',
        sender: 'me',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: '3',
        text: 'Thanks for the information',
        sender: 'Michael Brown',
        timestamp: 'Yesterday',
        isRead: true
      }
    ]
  }
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    notifications: true,
    darkMode: false,
    fontSize: 'medium',
    language: 'English',
    mediaDownload: true,
    encryption: true
  });
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    action: () => void;
  } | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Apply font size to messages
  useEffect(() => {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.classList.remove('text-sm', 'text-base', 'text-lg');
      switch (chatSettings.fontSize) {
        case 'small':
          messageContainer.classList.add('text-sm');
          break;
        case 'medium':
          messageContainer.classList.add('text-base');
          break;
        case 'large':
          messageContainer.classList.add('text-lg');
          break;
      }
    }
  }, [chatSettings.fontSize]);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', chatSettings.darkMode);
  }, [chatSettings.darkMode]);

  const handleClearChatHistory = () => {
    setConfirmAction({
      title: "Clear Chat History",
      message: "Are you sure you want to clear all messages? This cannot be undone.",
      action: () => {
        if (selectedChat) {
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === selectedChat.id
                ? { ...chat, messages: [], lastMessage: '' }
                : chat
            )
          );
          setSelectedChat(prev => prev ? { ...prev, messages: [] } : null);
        }
        setShowConfirmDialog(false);
        setShowChatSettings(false);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleBlockUser = () => {
    setConfirmAction({
      title: "Block User",
      message: "Are you sure you want to block this user? They won't be able to send you messages.",
      action: () => {
        if (selectedChat) {
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === selectedChat.id
                ? { ...chat, isBlocked: true }
                : chat
            )
          );
          setSelectedChat(prev => prev ? { ...prev, isBlocked: true } : null);
        }
        setShowConfirmDialog(false);
        setShowChatSettings(false);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleArchiveChat = () => {
    if (selectedChat) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id
            ? { ...chat, isArchived: true }
            : chat
        )
      );
      setSelectedChat(null);
      setShowChatSettings(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = event.target.files?.[0];
    if (file && selectedChat) {
      // Simulate file upload
      const newMessage: Message = {
        id: Date.now().toString(),
        text: type === 'image' ? 'Sent an image' : `Sent a file: ${file.name}`,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isRead: false,
        media: {
          type,
          url: URL.createObjectURL(file),
          name: file.name
        }
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: newMessage.text
              }
            : chat
        )
      );

      setSelectedChat(prev =>
        prev ? {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: newMessage.text
        } : null
      );
    }
  };

  const filteredChats = chats.filter(chat =>
    !chat.isArchived &&
    (chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isRead: false
    };

    // Update the selected chat with the new message
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: newMessage,
      timestamp: newMsg.timestamp
    };

    // Update the chats list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      )
    );

    setSelectedChat(updatedChat);
    setNewMessage('');
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read
    const updatedChat = {
      ...chat,
      unreadCount: 0,
      messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
    };
    setChats(prevChats =>
      prevChats.map(c => c.id === chat.id ? updatedChat : c)
    );
  };

  const handleBack = () => {
    if (selectedChat && window.innerWidth < 768) {
      setSelectedChat(null);
    } else {
      navigate(-1);
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString(),
        isRead: false
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsInCall(true);
    // TODO: Implement actual call functionality
  };

  const endCall = () => {
    setIsInCall(false);
    setCallType(null);
  };

  return (
    <AuthGuard>
      <div className={`flex flex-col h-screen ${chatSettings.darkMode ? 'dark' : ''}`}>
        <SocialHeader currentPage="messages" />
        <div className="flex-1 flex">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-20 left-4 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-full bg-gray-100">
            <div className="max-w-6xl mx-auto p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)]">
                  {/* Chat List */}
                  <div className={`w-full md:w-1/3 border-r ${selectedChat ? 'hidden md:block' : 'block'}`}>
                    <div className="p-3 md:p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search messages"
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-16rem)]">
                      {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`flex items-center gap-3 p-3 md:p-4 hover:bg-gray-50 cursor-pointer border-b ${
                              selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleChatSelect(chat)}
                          >
                            <Avatar className="h-10 w-10 md:h-12 md:w-12">
                              <AvatarImage src={chat.avatar} />
                              <AvatarFallback>{chat.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium truncate text-sm md:text-base">{chat.name}</h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.timestamp}</span>
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unreadCount > 0 && (
                              <Badge variant="default" className="bg-green-500">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No chats found
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Chat Area */}
                  {selectedChat ? (
                    <div className="w-full md:w-2/3 flex flex-col">
                      <div className="p-3 md:p-4 border-b flex items-center justify-between bg-white sticky top-0">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage src={selectedChat.avatar} />
                            <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm md:text-base">{selectedChat.name}</h3>
                            <p className="text-xs text-gray-500">Online</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={handleBack}
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <Dialog open={showChatSettings} onOpenChange={setShowChatSettings}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>
                                    Chat Settings
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive Chat
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Block User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Chat
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Chat Settings</DialogTitle>
                                <DialogDescription>
                                  Customize your chat experience and preferences
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6 py-4">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label>Notifications</Label>
                                      <p className="text-sm text-gray-500">Receive message alerts</p>
                                    </div>
                                    <Switch
                                      checked={chatSettings.notifications}
                                      onCheckedChange={(checked) =>
                                        setChatSettings((prev) => ({ ...prev, notifications: checked }))
                                      }
                                    />
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label>Dark Mode</Label>
                                      <p className="text-sm text-gray-500">Toggle dark theme</p>
                                    </div>
                                    <Switch
                                      checked={chatSettings.darkMode}
                                      onCheckedChange={(checked) =>
                                        setChatSettings((prev) => ({ ...prev, darkMode: checked }))
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Font Size</Label>
                                    <Select
                                      value={chatSettings.fontSize}
                                      onValueChange={(value) =>
                                        setChatSettings((prev) => ({ ...prev, fontSize: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select font size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select
                                      value={chatSettings.language}
                                      onValueChange={(value) =>
                                        setChatSettings((prev) => ({ ...prev, language: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label>Media Auto-Download</Label>
                                      <p className="text-sm text-gray-500">Download media automatically</p>
                                    </div>
                                    <Switch
                                      checked={chatSettings.mediaDownload}
                                      onCheckedChange={(checked) =>
                                        setChatSettings((prev) => ({ ...prev, mediaDownload: checked }))
                                      }
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label>End-to-End Encryption</Label>
                                      <p className="text-sm text-gray-500">Secure message encryption</p>
                                    </div>
                                    <Switch
                                      checked={chatSettings.encryption}
                                      disabled
                                    />
                                  </div>
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={handleClearChatHistory}
                                  >
                                    Clear Chat History
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={handleBlockUser}
                                  >
                                    Block User
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 message-container">
                        <div className="space-y-3 md:space-y-4">
                          {selectedChat.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender === 'me' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2 md:p-3 ${
                                  message.sender === 'me'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white dark:bg-gray-700'
                                }`}
                              >
                                {message.media ? (
                                  message.media.type === 'image' ? (
                                    <img
                                      src={message.media.url}
                                      alt="Sent image"
                                      className="max-w-full rounded"
                                    />
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <Paperclip className="h-4 w-4" />
                                      <span className="text-sm md:text-base truncate">{message.media.name}</span>
                                    </div>
                                  )
                                ) : (
                                  <p className="text-sm md:text-base">{message.text}</p>
                                )}
                                <div className="text-[10px] md:text-xs mt-1 opacity-70">{message.timestamp}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="p-2 md:p-4 border-t bg-white dark:bg-gray-900">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                          }}
                          className="flex items-center gap-2"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hidden md:inline-flex"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={selectedChat.isBlocked}
                          >
                            <ImageIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hidden md:inline-flex"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={selectedChat.isBlocked}
                          >
                            <Paperclip className="h-5 w-5" />
                          </Button>
                          <Input
                            placeholder={selectedChat.isBlocked ? "You can't send messages to this user" : "Type a message"}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 text-sm md:text-base"
                            disabled={selectedChat.isBlocked}
                          />
                          <Button 
                            type="submit" 
                            disabled={!newMessage.trim() || selectedChat.isBlocked}
                            className="px-3 md:px-4"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-50 p-4">
                      <div className="text-center max-w-md">
                        <div className="mb-4">
                          <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto" />
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-600">Welcome to Messages</h3>
                        <p className="text-sm md:text-base text-gray-500 mt-2">
                          Select a conversation to start messaging or use the search bar to find specific chats
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{confirmAction?.title}</DialogTitle>
              <DialogDescription>{confirmAction?.message}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => confirmAction?.action()}>
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* File Upload Inputs */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={(e) => handleFileUpload(e, 'image')}
        />
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={(e) => handleFileUpload(e, 'file')}
        />

        {/* Call dialog */}
        <Dialog open={isInCall} onOpenChange={setIsInCall}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {callType === 'video' ? 'Video Call' : 'Voice Call'} with {selectedContact?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-8">
              <Avatar className="h-24 w-24">
                <img src={selectedContact?.avatar} alt={selectedContact?.name} />
              </Avatar>
              <p className="text-lg font-medium">{selectedContact?.name}</p>
              {callType === 'video' ? (
                <Video className="h-8 w-8 text-gray-400 animate-pulse" />
              ) : (
                <Phone className="h-8 w-8 text-gray-400 animate-pulse" />
              )}
              <p className="text-sm text-gray-500">Calling...</p>
            </div>
            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={endCall}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default Messages;
