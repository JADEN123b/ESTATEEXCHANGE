import React, { useState, useEffect } from 'react';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import PropertySearch from '../components/PropertySearch';
import CreatePostBox from '../components/CreatePostBox';
import PropertyPost from '../components/PropertyPost';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Property {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  description?: string;
  type?: string;
  size?: number;
  amenities?: string[];
  status?: 'available' | 'sold' | 'pending';
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  rating?: number;
  reviews?: number;
}

interface Post {
  id: string;
  agent: Agent;
  timePosted: string;
  property: Property;
  likes?: number;
  comments?: Array<{
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    text: string;
    timestamp: string;
  }>;
  shares?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

const mockedPropertyPosts = [
  {
    id: '1',
    agent: {
      id: '101',
      name: 'Agent Name',
      avatar: '/lovable-uploads/e1be45c4-6346-426e-9d7c-7cca54f70342.png'
    },
    timePosted: '2 hours ago',
    property: {
      title: 'Modern Apartment',
      address: '123 Main St, City',
      price: 450000,
      bedrooms: 2,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    id: '2',
    agent: {
      id: '102',
      name: 'Another Agent',
      avatar: '/lovable-uploads/e1be45c4-6346-426e-9d7c-7cca54f70342.png'
    },
    timePosted: '1 day ago',
    property: {
      title: 'Luxury Villa',
      address: '456 Oak Ave, Town',
      price: 800000,
      bedrooms: 4,
      bathrooms: 3,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    id: '3',
    agent: {
      id: '103',
      name: 'Real Estate Pro',
      avatar: '/lovable-uploads/e1be45c4-6346-426e-9d7c-7cca54f70342.png'
    },
    timePosted: '3 days ago',
    property: {
      title: 'Cozy Cottage',
      address: '789 Pine Rd, Village',
      price: 320000,
      bedrooms: 3,
      bathrooms: 1,
      image: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  }
];

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockedPropertyPosts);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved posts from localStorage
    const saved = localStorage.getItem('savedPosts');
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: (post.likes || 0) + (post.isLiked ? -1 : 1),
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  const handleComment = (postId: string, comment: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...(post.comments || []),
                {
                  id: Date.now().toString(),
                  user: {
                    name: user.name || 'Anonymous',
                    avatar: user.avatar || '/default-avatar.png'
                  },
                  text: comment,
                  timestamp: new Date().toLocaleString()
                }
              ]
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    // Simulate share functionality
    toast({
      title: "Sharing post",
      description: "This post has been shared to your network"
    });
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, shares: (post.shares || 0) + 1 }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    const newSavedPosts = savedPosts.includes(postId)
      ? savedPosts.filter(id => id !== postId)
      : [...savedPosts, postId];
    
    setSavedPosts(newSavedPosts);
    localStorage.setItem('savedPosts', JSON.stringify(newSavedPosts));
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );

    toast({
      title: savedPosts.includes(postId) ? "Post removed from saved" : "Post saved",
      description: savedPosts.includes(postId)
        ? "The post has been removed from your saved items"
        : "The post has been added to your saved items"
    });
  };

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timePosted'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      timePosted: 'Just now',
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isSaved: false
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    
    toast({
      title: "Post created",
      description: "Your property has been posted successfully"
    });
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'saved') return savedPosts.includes(post.id);
    return post.property.type === filter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timePosted).getTime() - new Date(a.timePosted).getTime();
    }
    if (sortBy === 'price-high') {
      return b.property.price - a.property.price;
    }
    if (sortBy === 'price-low') {
      return a.property.price - b.property.price;
    }
    return 0;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="home" />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto relative">
            <PropertySearch />
            
            <div className="mb-6 flex gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="house">Houses</SelectItem>
                  <SelectItem value="apartment">Apartments</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="saved">Saved Posts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CreatePostBox onCreatePost={handleCreatePost} />
            
            {sortedPosts.map(post => (
              <PropertyPost 
                key={post.id}
                {...post}
                onLike={() => handleLike(post.id)}
                onComment={(comment) => handleComment(post.id, comment)}
                onShare={() => handleShare(post.id)}
                onSave={() => handleSave(post.id)}
              />
            ))}

            {sortedPosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Feed;
