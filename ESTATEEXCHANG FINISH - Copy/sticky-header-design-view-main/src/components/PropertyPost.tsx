import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share, Send, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

interface PropertyPostProps {
  id: string;
  agent: {
    id: string;
    name: string;
    avatar: string;
  };
  timePosted: string;
  property: {
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    image: string;
  };
}

const PropertyPost: React.FC<PropertyPostProps> = ({ 
  id, 
  agent, 
  timePosted, 
  property 
}) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: user.name || 'Anonymous',
        avatar: user.avatar || '',
      },
      text: newComment,
      timestamp: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleShare = (platform: string) => {
    // In a real app, implement actual sharing functionality
    setShares(shares + 1);
    setShowShareDialog(false);
    
    toast({
      title: "Shared successfully",
      description: `Property has been shared on ${platform}`,
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/agent/${agent.id}`} className="font-medium hover:underline">
              {agent.name}
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="bg-[hsl(142,64%,38%)] h-2 w-2 rounded-full"></span>
              <span>Listed {timePosted}</span>
            </div>
          </div>
        </div>
        
        <Link to={`/property/${id}`}>
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-64 object-cover rounded-lg mb-3"
          />
          <h3 className="text-xl font-bold mb-1">{property.title}</h3>
          <p className="text-gray-600 mb-1">{property.address}</p>
          <p className="font-bold mb-1">
            ${property.price.toLocaleString()} - {property.bedrooms} Bedrooms, {property.bathrooms} Bathrooms
          </p>
        </Link>
      </div>
      
      <div className="border-t border-gray-100 px-4 py-2">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 ${isLiked ? 'text-[hsl(142,64%,38%)]' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-[hsl(142,64%,38%)]' : ''}`} />
            <span>Like {likes > 0 ? likes : ''}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Comment {comments.length > 0 ? comments.length : ''}</span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                <Share className="h-5 w-5" />
                <span>Share {shares > 0 ? shares : ''}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleShare('Facebook')}>
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('Twitter')}>
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('LinkedIn')}>
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('WhatsApp')}>
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('Email')}>
                Share via Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showComments && (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-4 mb-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="font-medium text-sm">{comment.user.name}</p>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-grow px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[hsl(142,64%,38%)]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button 
                  size="icon"
                  variant="ghost"
                  onClick={handleAddComment}
                  className="hover:bg-[hsl(142,64%,38%)] hover:text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPost;
