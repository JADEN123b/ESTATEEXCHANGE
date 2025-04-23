import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';
import { toast } from "sonner";
import adminService, { AdminMessage } from '@/lib/api/admin.service';

const AdminMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchMessages = async () => {
    try {
      const { messages: fetchedMessages, total } = await adminService.getAdminMessages({
        search: searchQuery,
        page,
        limit: 10
      });
      setMessages(fetchedMessages);
      setTotalMessages(total);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [searchQuery, page]);

  const handleReply = async (messageId: string) => {
    // In a real implementation, you would open a modal or form for the reply
    try {
      await adminService.replyToMessage(messageId, "Thank you for your message. We will look into this.");
      toast.success("Reply sent successfully");
      fetchMessages(); // Refresh the messages
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleArchive = async (messageId: string) => {
    try {
      await adminService.updateMessageStatus(messageId, 'archived');
      toast.success("Message archived");
      fetchMessages(); // Refresh the messages
    } catch (error) {
      toast.error("Failed to archive message");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Manage and respond to user inquiries and support requests
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>
            View and respond to messages from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg ${
                    message.status === 'unread' ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{message.from}</h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {message.subject}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => handleReply(message.id)}>Reply</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleArchive(message.id)}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No messages found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages; 